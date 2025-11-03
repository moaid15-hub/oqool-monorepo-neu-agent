const { Pool } = require('pg');
const bcrypt = require('bcrypt');

// Common password list for validation (in production, consider using a larger external list)
const COMMON_PASSWORDS = new Set([
  'password', '123456', '12345678', '123456789', 'qwerty', 'abc123',
  'password1', '12345', '1234567', '1234567890', 'admin', 'letmein',
  'welcome', 'monkey', 'login', 'passw0rd', '1234', '123123'
]);

// Singleton database connection pool
let dbPool = null;

class User {
  constructor() {
    if (!dbPool) {
      this.validateEnvironmentVariables();
      dbPool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT),
        max: 20, // Maximum number of clients in the pool
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });
    }
    this.pool = dbPool;
  }

  // Validate that all required environment variables exist
  validateEnvironmentVariables() {
    const requiredEnvVars = ['DB_USER', 'DB_HOST', 'DB_NAME', 'DB_PASSWORD', 'DB_PORT'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
  }

  // Schema definition
  static get schema() {
    return {
      tableName: 'users',
      columns: {
        id: 'SERIAL PRIMARY KEY',
        username: 'VARCHAR(50) UNIQUE NOT NULL',
        email: 'VARCHAR(100) UNIQUE NOT NULL',
        password_hash: 'VARCHAR(255) NOT NULL',
        created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
        updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
      }
    };
  }

  // Input sanitization for usernames and emails
  static sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    // Remove or escape potentially dangerous characters
    return input
      .replace(/[<>"'`;\\\/]/g, '') // Remove potentially dangerous characters
      .trim()
      .substring(0, 255); // Limit length
  }

  // Enhanced email validation regex
  static isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  }

  // Enhanced password validation with complexity requirements
  static validatePassword(password) {
    const errors = [];

    if (!password || password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    if (COMMON_PASSWORDS.has(password.toLowerCase())) {
      errors.push('Password is too common and easily guessable');
    }

    return errors;
  }

  // Validations
  static validateUser(userData) {
    const errors = [];

    const sanitizedUsername = User.sanitizeInput(userData.username);
    if (!sanitizedUsername || sanitizedUsername.length < 3 || sanitizedUsername.length > 50) {
      errors.push('Username must be between 3 and 50 characters and contain only safe characters');
    }

    const sanitizedEmail = User.sanitizeInput(userData.email);
    if (!sanitizedEmail || !User.isValidEmail(sanitizedEmail)) {
      errors.push('Valid email is required');
    }

    if (userData.password) {
      const passwordErrors = User.validatePassword(userData.password);
      errors.push(...passwordErrors);
    }

    return errors;
  }

  // Hash password with configurable salt rounds
  static async hashPassword(password) {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    return await bcrypt.hash(password, saltRounds);
  }

  // Verify password
  static async verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  // Generic find method to replace findByUsername, findByEmail, etc.
  async find(criteria) {
    const client = await this.pool.connect();
    try {
      const whereClauses = [];
      const values = [];
      let paramCount = 1;

      for (const [field, value] of Object.entries(criteria)) {
        whereClauses.push(`${field} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }

      if (whereClauses.length === 0) {
        throw new Error('No search criteria provided');
      }

      const query = `
        SELECT id, username, email, password_hash, created_at, updated_at
        FROM users 
        WHERE ${whereClauses.join(' AND ')}
      `;
      
      const result = await client.query(query, values);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // CREATE - Create new user
  async create(userData) {
    const validationErrors = User.validateUser(userData);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }

    const client = await this.pool.connect();
    try {
      const passwordHash = await User.hashPassword(userData.password);
      
      const sanitizedUsername = User.sanitizeInput(userData.username);
      const sanitizedEmail = User.sanitizeInput(userData.email);
      
      const query = `
        INSERT INTO users (username, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, username, email, created_at, updated_at
      `;
      
      const values = [sanitizedUsername, sanitizedEmail, passwordHash];
      const result = await client.query(query, values);
      
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        if (error.constraint.includes('username')) {
          throw new Error('Username already exists');
        } else if (error.constraint.includes('email')) {
          throw new Error('Email already exists');
        }
      }
      throw error;
    } finally {
      client.release();
    }
  }

  // READ - Get user by ID
  async findById(id) {
    return await this.find({ id });
  }

  // READ - Get all users (with pagination)
  async findAll(limit = 50, offset = 0) {
    const client = await this.pool.connect();
    try {
      const query = `
        SELECT id, username, email, created_at, updated_at
        FROM users 
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
      `;
      const result = await client.query(query, [limit, offset]);
      return result.rows;
    } finally {
      client.release();
    }
  }

  // UPDATE - Update user
  async update(id, updateData) {
    const client = await this.pool.connect();
    try {
      const allowedFields = ['username', 'email'];
      const updates = [];
      const values = [];
      let paramCount = 1;

      // Build dynamic update query with sanitization
      for (const [field, value] of Object.entries(updateData)) {
        if (allowedFields.includes(field)) {
          const sanitizedValue = User.sanitizeInput(value);
          updates.push(`${field} = $${paramCount}`);
          values.push(sanitizedValue);
          paramCount++;
        }
      }

      if (updates.length === 0) {
        throw new Error('No valid fields to update');
      }

      // Add updated_at timestamp
      updates.push('updated_at = CURRENT_TIMESTAMP');
      
      // Add ID as last parameter
      values.push(id);

      const query = `
        UPDATE users 
        SET ${updates.join(', ')}
        WHERE id = $${paramCount}
        RETURNING id, username, email, created_at, updated_at
      `;

      const result = await client.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        if (error.constraint.includes('username')) {
          throw new Error('Username already exists');
        } else if (error.constraint.includes('email')) {
          throw new Error('Email already exists');
        }
      }
      throw error;
    } finally {
      client.release();
    }
  }

  // UPDATE - Update password
  async updatePassword(id, newPassword) {
    const passwordErrors = User.validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      throw new Error(`Password validation failed: ${passwordErrors.join(', ')}`);
    }

    const client = await this.pool.connect();
    try {
      const passwordHash = await User.hashPassword(newPassword);
      
      const query = `
        UPDATE users 
        SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING id
      `;
      
      const result = await client.query(query, [passwordHash, id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // DELETE - Delete user
  async delete(id) {
    const client = await this.pool.connect();
    try {
      const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
      const result = await client.query(query, [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Static method to close the shared pool
  static async closePool() {
    if (dbPool) {
      await dbPool.end();
      dbPool = null;
    }
  }
}

module.exports = User;