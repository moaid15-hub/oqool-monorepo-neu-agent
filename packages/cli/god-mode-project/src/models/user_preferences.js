const { DataTypes, Op } = require('sequelize');

// Configuration for maintainable validation values
const SUPPORTED_THEMES = ['light', 'dark', 'auto'];
const SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko'];
const DEFAULT_DECIMAL_PLACES = 2;
const MIN_DECIMAL_PLACES = 0;
const MAX_DECIMAL_PLACES = 8;

module.exports = (sequelize) => {
  const UserPreferences = sequelize.define('UserPreferences', {
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
      },
      unique: true
    },
    theme: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'light',
      validate: {
        isIn: [SUPPORTED_THEMES]
      }
    },
    decimal_places: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: DEFAULT_DECIMAL_PLACES,
      validate: {
        min: MIN_DECIMAL_PLACES,
        max: MAX_DECIMAL_PLACES
      }
    },
    language: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'en',
      validate: {
        isIn: [SUPPORTED_LANGUAGES]
      }
    }
  }, {
    tableName: 'user_preferences',
    timestamps: true,
    underscored: true
  });

  // Relationships
  UserPreferences.associate = function(models) {
    UserPreferences.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  // CRUD Methods

  // Create or Update user preferences
  UserPreferences.upsert = async function(userId, preferences) {
    try {
      // Validate and sanitize input
      const sanitizedPreferences = this.sanitizeInput(preferences);
      
      const [userPrefs, created] = await this.upsert({
        user_id: userId,
        ...sanitizedPreferences
      }, {
        returning: true
      });

      return userPrefs;
    } catch (error) {
      // Generic error message for production
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Failed to save user preferences');
      }
      throw new Error(`Failed to upsert user preferences: ${error.message}`);
    }
  };

  // Get user preferences by user ID
  UserPreferences.getByUser = async function(userId) {
    try {
      let preferences = await this.findOne({
        where: { user_id: userId }
      });

      if (!preferences) {
        // Create default preferences in database for consistency
        preferences = await this.create({
          user_id: userId,
          theme: 'light',
          decimal_places: DEFAULT_DECIMAL_PLACES,
          language: 'en'
        });
      }

      return preferences;
    } catch (error) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Failed to retrieve user preferences');
      }
      throw new Error(`Failed to get user preferences: ${error.message}`);
    }
  };

  // Update user preferences
  UserPreferences.update = async function(userId, updates) {
    try {
      // Validate and sanitize input
      const sanitizedUpdates = this.sanitizeInput(updates);
      
      const [affectedRows] = await this.update(sanitizedUpdates, {
        where: { user_id: userId },
        returning: true
      });

      if (affectedRows === 0) {
        throw new Error('USER_PREFERENCES_NOT_FOUND');
      }

      // Return the updated record
      return await this.findOne({ where: { user_id: userId } });
    } catch (error) {
      if (error.message === 'USER_PREFERENCES_NOT_FOUND') {
        throw error; // Preserve specific error
      }
      
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Failed to update user preferences');
      }
      throw new Error(`Failed to update user preferences: ${error.message}`);
    }
  };

  // Delete user preferences
  UserPreferences.deleteByUser = async function(userId) {
    try {
      const result = await this.destroy({
        where: { user_id: userId }
      });

      if (result === 0) {
        throw new Error('USER_PREFERENCES_NOT_FOUND');
      }

      return result;
    } catch (error) {
      if (error.message === 'USER_PREFERENCES_NOT_FOUND') {
        throw error; // Preserve specific error
      }
      
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Failed to delete user preferences');
      }
      throw new Error(`Failed to delete user preferences: ${error.message}`);
    }
  };

  // Input sanitization method
  UserPreferences.sanitizeInput = function(input) {
    const sanitized = {};
    const allowedFields = ['theme', 'decimal_places', 'language'];
    
    allowedFields.forEach(field => {
      if (input[field] !== undefined) {
        sanitized[field] = input[field];
      }
    });

    return sanitized;
  };

  // Class method to get configuration (for external use)
  UserPreferences.getConfiguration = function() {
    return {
      themes: SUPPORTED_THEMES,
      languages: SUPPORTED_LANGUAGES,
      decimalPlaces: {
        min: MIN_DECIMAL_PLACES,
        max: MAX_DECIMAL_PLACES,
        default: DEFAULT_DECIMAL_PLACES
      }
    };
  };

  return UserPreferences;
};