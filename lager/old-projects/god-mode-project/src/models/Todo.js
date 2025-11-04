const { DataTypes, Op } = require('sequelize');
const sequelize = require('../config/database');

const DESCRIPTION_MAX_LENGTH = 500;
const MIN_DESCRIPTION_LENGTH = 1;

const Todo = sequelize.define('Todo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  description: {
    type: DataTypes.STRING(DESCRIPTION_MAX_LENGTH),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Description cannot be empty'
      },
      len: {
        args: [MIN_DESCRIPTION_LENGTH, DESCRIPTION_MAX_LENGTH],
        msg: 'Description must be between 1 and 500 characters'
      }
    }
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'due_date',
    validate: {
      isDate: {
        msg: 'Due date must be a valid date'
      },
      isFutureDate(value) {
        if (value && new Date(value) < new Date()) {
          throw new Error('Due date cannot be in the past');
        }
      }
    }
  }
}, {
  tableName: 'todos',
  timestamps: true,
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['completed']
    },
    {
      fields: ['due_date']
    }
  ]
});

// Relationships
Todo.associate = function(models) {
  Todo.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user'
  });
};

// CRUD Methods
class TodoModel {
  static async createTodo(todoData) {
    try {
      return await Todo.create(todoData);
    } catch (error) {
      throw new Error(`Error creating todo: ${error.message}`);
    }
  }

  static async getTodoById(id, includeUser = false) {
    try {
      const options = {
        where: { id },
        attributes: { exclude: ['userId'] }
      };
      
      if (includeUser) {
        options.include = [{
          association: 'user',
          attributes: ['id', 'name']
        }];
      }
      
      return await Todo.findOne(options);
    } catch (error) {
      throw new Error(`Error fetching todo: ${error.message}`);
    }
  }

  static async getTodosByUser(userId, filters = {}, page = 1, limit = 10) {
    try {
      const whereClause = { userId: userId };
      const offset = (page - 1) * limit;
      
      // Apply filters
      if (filters.completed !== undefined) {
        whereClause.completed = filters.completed;
      }
      
      if (filters.dueDate) {
        whereClause.dueDate = filters.dueDate;
      }
      
      const options = {
        where: whereClause,
        limit: limit,
        offset: offset,
        order: [['dueDate', 'ASC'], ['createdAt', 'DESC']]
      };
      
      return await Todo.findAll(options);
    } catch (error) {
      throw new Error(`Error fetching user todos: ${error.message}`);
    }
  }

  static async updateTodo(id, updateData) {
    try {
      const todo = await Todo.findByPk(id);
      if (!todo) {
        throw new Error('Todo not found');
      }
      
      // Validate updateData fields
      const validFields = ['description', 'completed', 'dueDate'];
      Object.keys(updateData).forEach(field => {
        if (!validFields.includes(field)) {
          throw new Error(`Invalid field: ${field}`);
        }
      });

      return await todo.update(updateData);
    } catch (error) {
      throw new Error(`Error updating todo: ${error.message}`);
    }
  }

  static async deleteTodo(id) {
    try {
      const todo = await Todo.findByPk(id);
      if (!todo) {
        throw new Error('Todo not found');
      }
      
      return await todo.destroy();
    } catch (error) {
      throw new Error(`Error deleting todo: ${error.message}`);
    }
  }

  static async toggleTodo(id) {
    try {
      const todo = await Todo.findByPk(id);
      if (!todo) {
        throw new Error('Todo not found');
      }
      
      return await todo.update({ completed: !todo.completed }, { where: { id: id } });
    } catch (error) {
      throw new Error(`Error toggling todo: ${error.message}`);
    }
  }

  static async getOverdueTodos() {
    try {
      return await Todo.findAll({
        where: {
          completed: false,
          dueDate: {
            [Op.lt]: new Date()
          }
        },
        order: [['dueDate', 'ASC']]
      });
    } catch (error) {
      throw new Error(`Error fetching overdue todos: ${error.message}`);
    }
  }
}

module.exports = { Todo, TodoModel };