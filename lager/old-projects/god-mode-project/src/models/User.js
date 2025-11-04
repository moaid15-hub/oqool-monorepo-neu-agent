const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

// Define the User model with attributes and validations
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true, // Ensure the username is not empty
      len: [3, 50], // Limit the length of the username
      isAlphanumeric: true // Ensure the username contains only alphanumeric characters
    }
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true, // Ensure the password hash is not empty
      len: [60, 255] // Validate the length to accommodate bcrypt hash
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true, // Ensure the email is not empty
      isEmail: true, // Validate the email format
      len: [5, 100] // Limit the length of the email
    }
  }
}, {
  tableName: 'users',
  timestamps: true,
  hooks: {
    // Hash the password before creating/updating the user
    beforeCreate: async (user) => {
      if (user.changed('password_hash')) {
        user.password_hash = await bcrypt.hash(user.password_hash, 12); // Consider using a dynamic salt round based on current security recommendations
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password_hash')) {
        user.password_hash = await bcrypt.hash(user.password_hash, 12);
      }
    }
  }
});

// Instance methods
User.prototype.verifyPassword = async function(password) {
  // Compare the provided password with the stored hash
  return await bcrypt.compare(password, this.password_hash);
};

User.prototype.toJSON = function() {
  // Prepare the user object for transmission by removing sensitive data
  const values = { ...this.get() };
  delete values.password_hash; // Remove the password hash
  return values;
};

// Static methods (CRUD operations)
User.createUser = async function(userData) {
  // Validate and sanitize userData before creating a new user
  try {
    const user = await this.create(userData);
    return user;
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};

User.findById = async function(id) {
  // Fetch a user by their ID
  try {
    const user = await this.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw new Error(`Error finding user: ${error.message}`);
  }
};

User.findByUsername = async function(username) {
  // Fetch a user by their username
  try {
    const user = await this.findOne({ where: { username } });
    return user;
  } catch (error) {
    throw new Error(`Error finding user by username: ${error.message}`);
  }
};

User.findByEmail = async function(email) {
  // Fetch a user by their email
  try {
    const user = await this.findOne({ where: { email } });
    return user;
  } catch (error) {
    throw new Error(`Error finding user by email: ${error.message}`);
  }
};

User.updateUser = async function(id, updateData) {
  // Update user details while ensuring sensitive fields are not modified directly
  try {
    const user = await this.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }
    
    if (updateData.id) {
      delete updateData.id; // Prevent updating the ID
    }
    
    await user.update(updateData);
    return user;
  } catch (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }
};

User.deleteUser = async function(id) {
  // Delete a user by their ID
  try {
    const user = await this.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }
    
    await user.destroy();
    return { message: 'User deleted successfully' };
  } catch (error) {
    throw new Error(`Error deleting user: ${error.message}`);
  }
};

User.getAllUsers = async function(limit = 10, offset = 0) {
  // Fetch all users with optional pagination
  try {
    // Ensure limit and offset are treated as integers without unnecessary type coercion if already validated by the API
    const users = await this.findAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });
    return users;
  } catch (error) {
    throw new Error(`Error fetching users: ${error.message}`);
  }
};

module.exports = User;