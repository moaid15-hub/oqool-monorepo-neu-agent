const { DataTypes, Op } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

// Custom error classes for consistent error handling
class CalculationHistoryError extends Error {
  constructor(message, code = 'CALCULATION_ERROR') {
    super(message);
    this.name = 'CalculationHistoryError';
    this.code = code;
  }
}

class ValidationError extends CalculationHistoryError {
  constructor(message) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

class DatabaseConstraintError extends CalculationHistoryError {
  constructor(message) {
    super(message, 'DATABASE_CONSTRAINT_ERROR');
    this.name = 'DatabaseConstraintError';
  }
}

// Input validation and sanitization utilities
class InputValidator {
  static validateId(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new ValidationError('ID must be a positive integer');
    }
    return parseInt(id);
  }

  static validateUserId(userId) {
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new ValidationError('User ID must be a positive integer');
    }
    return parseInt(userId);
  }

  static validateLimit(limit, maxLimit = 100) {
    const parsedLimit = parseInt(limit);
    if (!Number.isInteger(parsedLimit) || parsedLimit <= 0) {
      throw new ValidationError('Limit must be a positive integer');
    }
    if (parsedLimit > maxLimit) {
      throw new ValidationError(`Limit cannot exceed ${maxLimit}`);
    }
    return parsedLimit;
  }

  static validateOffset(offset) {
    const parsedOffset = parseInt(offset);
    if (!Number.isInteger(parsedOffset) || parsedOffset < 0) {
      throw new ValidationError('Offset must be a non-negative integer');
    }
    return parsedOffset;
  }

  static sanitizeExpression(expression) {
    if (typeof expression !== 'string') {
      throw new ValidationError('Expression must be a string');
    }
    // Remove potential SQL injection characters and trim
    return expression.trim().replace(/[;'"\\]/g, '');
  }

  static validateOperationType(operationType) {
    const validTypes = ['addition', 'subtraction', 'multiplication', 'division', 'custom'];
    if (!validTypes.includes(operationType)) {
      throw new ValidationError(`Operation type must be one of: ${validTypes.join(', ')}`);
    }
    return operationType;
  }

  static validateResult(result) {
    const num = parseFloat(result);
    if (isNaN(num)) {
      throw new ValidationError('Result must be a valid number');
    }
    return num;
  }
}

const CalculationHistory = sequelize.define('CalculationHistory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  expression: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Expression cannot be empty'
      },
      len: {
        args: [1, 1000],
        msg: 'Expression must be between 1 and 1000 characters'
      }
    }
  },
  result: {
    type: DataTypes.DECIMAL(15, 6),
    allowNull: false,
    validate: {
      isDecimal: {
        msg: 'Result must be a valid decimal number'
      }
    }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    validate: {
      isDate: {
        msg: 'Created at must be a valid date'
      }
    }
  },
  operation_type: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Operation type cannot be empty'
      },
      isIn: {
        args: [['addition', 'subtraction', 'multiplication', 'division', 'custom']],
        msg: 'Operation type must be one of: addition, subtraction, multiplication, division, custom'
      }
    }
  }
}, {
  tableName: 'calculation_history',
  timestamps: false,
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['created_at']
    },
    {
      fields: ['operation_type']
    },
    {
      fields: ['user_id', 'created_at'],
      name: 'idx_user_created_at'
    },
    {
      fields: ['user_id', 'operation_type'],
      name: 'idx_user_operation_type'
    },
    {
      fields: ['user_id', 'operation_type', 'created_at'],
      name: 'idx_user_operation_created'
    }
  ]
});

// Model lifecycle hooks for business logic validation
CalculationHistory.beforeSave(async (calculation, options) => {
  // Validate that user exists
  const user = await User.findByPk(calculation.user_id);
  if (!user) {
    throw new DatabaseConstraintError('User does not exist');
  }

  // Additional business logic validation could be added here
  // For example: validate that result matches expression evaluation
});

// Relationships
CalculationHistory.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

User.hasMany(CalculationHistory, {
  foreignKey: 'user_id',
  as: 'calculationHistory'
});

// CRUD Methods
class CalculationHistoryModel {
  // Create
  static async createCalculation(calculationData) {
    const transaction = await sequelize.transaction();
    
    try {
      // Validate and sanitize input
      const sanitizedData = {
        user_id: InputValidator.validateUserId(calculationData.user_id),
        expression: InputValidator.sanitizeExpression(calculationData.expression),
        result: InputValidator.validateResult(calculationData.result),
        operation_type: InputValidator.validateOperationType(calculationData.operation_type),
        created_at: calculationData.created_at || new Date()
      };

      const calculation = await CalculationHistory.create(sanitizedData, { transaction });
      await transaction.commit();
      return calculation;
    } catch (error) {
      await transaction.rollback();
      
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        throw new DatabaseConstraintError('User does not exist');
      } else if (error.name === 'SequelizeUniqueConstraintError') {
        throw new DatabaseConstraintError('Calculation already exists');
      } else if (error instanceof ValidationError || error instanceof DatabaseConstraintError) {
        throw error;
      } else {
        throw new CalculationHistoryError('Failed to create calculation');
      }
    }
  }

  // Read
  static async getById(id) {
    try {
      const validatedId = InputValidator.validateId(id);
      
      const calculation = await CalculationHistory.findByPk(validatedId, {
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email']
        }]
      });
      
      if (!calculation) {
        throw new CalculationHistoryError('Calculation not found');
      }
      
      return calculation;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof CalculationHistoryError) {
        throw error;
      } else {
        throw new CalculationHistoryError('Failed to get calculation');
      }
    }
  }

  static async getByUserId(userId, options = {}) {
    try {
      const validatedUserId = InputValidator.validateUserId(userId);
      const validatedLimit = InputValidator.validateLimit(options.limit || 50, 100);
      const validatedOffset = InputValidator.validateOffset(options.offset || 0);
      
      const whereClause = { user_id: validatedUserId };
      if (options.operationType) {
        whereClause.operation_type = InputValidator.validateOperationType(options.operationType);
      }

      const calculations = await CalculationHistory.findAll({
        where: whereClause,
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'username']
        }],
        order: [['created_at', 'DESC']],
        limit: validatedLimit,
        offset: validatedOffset
      });
      
      return calculations;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      } else {
        throw new CalculationHistoryError('Failed to get calculations');
      }
    }
  }

  static async getRecentCalculations(limit = 20) {
    try {
      const validatedLimit = InputValidator.validateLimit(limit, 50);
      
      const calculations = await CalculationHistory.findAll({
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'username']
        }],
        order: [['created_at', 'DESC']],
        limit: validatedLimit
      });
      
      return calculations;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      } else {
        throw new CalculationHistoryError('Failed to get recent calculations');
      }
    }
  }

  // Update
  static async updateCalculation(id, updateData) {
    const transaction = await sequelize.transaction();
    
    try {
      const validatedId = InputValidator.validateId(id);
      
      const calculation = await CalculationHistory.findByPk(validatedId, { transaction });
      if (!calculation) {
        throw new CalculationHistoryError('Calculation not found');
      }

      // Validate and sanitize update data
      const sanitizedData = {};
      if (updateData.expression !== undefined) {
        sanitizedData.expression = InputValidator.sanitizeExpression(updateData.expression);
      }
      if (updateData.result !== undefined) {
        sanitizedData.result = InputValidator.validateResult(updateData.result);
      }
      if (updateData.operation_type !== undefined) {
        sanitizedData.operation_type = InputValidator.validateOperationType(updateData.operation_type);
      }

      await calculation.update(sanitizedData, { transaction });
      await transaction.commit();
      
      return calculation;
    } catch (error) {
      await transaction.rollback();
      
      if (error instanceof ValidationError || error instanceof CalculationHistoryError) {
        throw error;
      } else if (error.name === 'SequelizeForeignKeyConstraintError') {
        throw new DatabaseConstraintError('User does not exist');
      } else {
        throw new CalculationHistoryError('Failed to update calculation');
      }
    }
  }

  // Delete
  static async deleteCalculation(id) {
    const transaction = await sequelize.transaction();
    
    try {
      const validatedId = InputValidator.validateId(id);
      
      const calculation = await CalculationHistory.findByPk(validatedId, { transaction });
      if (!calculation) {
        throw new CalculationHistoryError('Calculation not found');
      }

      await calculation.destroy({ transaction });
      await transaction.commit();
      
      return { message: 'Calculation deleted successfully' };
    } catch (error) {
      await transaction.rollback();
      
      if (error instanceof ValidationError || error instanceof CalculationHistoryError) {
        throw error;
      } else {
        throw new CalculationHistoryError('Failed to delete calculation');
      }
    }
  }

  static async deleteByUserId(userId) {
    const transaction = await sequelize.transaction();
    
    try {
      const validatedUserId = InputValidator.validateUserId(userId);
      
      const result = await CalculationHistory.destroy({
        where: { user_id: validatedUserId },
        transaction
      });
      
      await transaction.commit();
      return { deletedCount: result };
    } catch (error) {
      await transaction.rollback();
      
      if (error instanceof ValidationError) {
        throw error;
      } else {
        throw new CalculationHistoryError('Failed to delete calculations');
      }
    }
  }

  // Utility methods
  static async getUserCalculationStats(userId) {
    try {
      const validatedUserId = InputValidator.validateUserId(userId);
      
      const stats = await CalculationHistory.findAll({
        where: { user_id: validatedUserId },
        attributes: [
          'operation_type',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          [sequelize.fn('MAX', sequelize.col('created_at')), 'last_used']
        ],
        group: ['operation_type']
      });
      
      return stats;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      } else {
        throw new CalculationHistoryError('Failed to get calculation statistics');
      }
    }
  }
}

module.exports = { 
  CalculationHistory, 
  CalculationHistoryModel,
  CalculationHistoryError,
  ValidationError,
  DatabaseConstraintError
};