import { Pool } from 'pg';
import { config } from '../config/database';

// Database connection pool
class DatabaseService {
  constructor() {
    this.pool = new Pool({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      max: config.maxConnections || 20,
      idleTimeoutMillis: config.idleTimeout || 30000,
      connectionTimeoutMillis: config.connectionTimeout || 2000,
      maxUses: config.maxUses || 7500, // Prevent connection leaks
    });

    this.setupEventListeners();
    this.setupPoolMonitoring();
  }

  setupEventListeners() {
    this.pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err);
    });

    this.pool.on('connect', () => {
      console.log('Database connection established');
    });

    this.pool.on('remove', () => {
      console.log('Database connection removed');
    });
  }

  setupPoolMonitoring() {
    // Monitor pool metrics
    setInterval(() => {
      const poolStats = {
        totalCount: this.pool.totalCount,
        idleCount: this.pool.idleCount,
        waitingCount: this.pool.waitingCount,
        maxCount: this.pool.options.max,
        connectionTimeout: this.pool.options.connectionTimeoutMillis,
        idleTimeout: this.pool.options.idleTimeoutMillis
      };

      // Log pool metrics for monitoring
      console.log('Database pool metrics:', poolStats);

      // Alert on potential issues
      if (poolStats.waitingCount > 5) {
        console.warn('High number of clients waiting for connections:', poolStats.waitingCount);
      }

      if (poolStats.totalCount >= poolStats.maxCount * 0.9) {
        console.warn('Database pool approaching maximum capacity:', poolStats.totalCount);
      }
    }, 30000); // Check every 30 seconds
  }

  /**
   * Redact sensitive data from query parameters for logging
   * @param {string} text - SQL query
   * @param {Array} params - Query parameters
   * @returns {Object} Redacted query info for logging
   */
  redactSensitiveData(text, params = []) {
    const redactedParams = params.map(param => {
      if (typeof param === 'string' && (
        text.toLowerCase().includes('password') ||
        text.toLowerCase().includes('password_hash') ||
        param.length > 50 // Assume long strings might be sensitive
      )) {
        return '[REDACTED]';
      }
      return param;
    });

    return { text, params: redactedParams };
  }

  /**
   * Execute a query with parameters
   * @param {string} text - SQL query
   * @param {Array} params - Query parameters
   * @returns {Promise<Object>} Query result
   */
  async query(text, params = []) {
    const start = Date.now();
    
    try {
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;
      
      const redactedQuery = this.redactSensitiveData(text, params);
      console.log('Executed query', { 
        text: redactedQuery.text, 
        duration, 
        rows: result.rowCount 
      });
      return result;
    } catch (error) {
      const redactedQuery = this.redactSensitiveData(text, params);
      console.error('Query error', { 
        text: redactedQuery.text, 
        params: redactedQuery.params, 
        error: error.message 
      });
      throw new Error(`Database query failed: ${error.message}`);
    }
  }

  /**
   * Validate user ID is a positive integer
   * @param {*} userId - User ID to validate
   * @throws {Error} If user ID is invalid
   */
  validateUserId(userId) {
    if (!userId || !Number.isInteger(Number(userId)) || Number(userId) <= 0) {
      throw new Error('Invalid user ID: must be a positive integer');
    }
  }

  /**
   * Get a client from the pool for transactions
   * @returns {Promise<Object>} Database client
   */
  async getClient() {
    try {
      const client = await this.pool.connect();
      
      // Set timeout using pool's built-in mechanisms instead of custom timeout
      // The pool's idleTimeoutMillis will handle long-running connections
      
      return client;
    } catch (error) {
      console.error('Error getting database client', error);
      throw new Error(`Failed to get database client: ${error.message}`);
    }
  }

  // User Accounts Operations
  async createUser(userData) {
    const { email, password_hash, username, created_at } = userData;
    const queryText = `
      INSERT INTO users (email, password_hash, username, created_at) 
      VALUES ($1, $2, $3, $4) 
      RETURNING id, email, username, created_at
    `;
    
    return this.query(queryText, [email, password_hash, username, created_at]);
  }

  async getUserById(userId) {
    this.validateUserId(userId);
    
    const queryText = `
      SELECT id, email, username, created_at, updated_at 
      FROM users 
      WHERE id = $1 AND deleted_at IS NULL
    `;
    
    return this.query(queryText, [userId]);
  }

  async getUserByEmail(email) {
    const queryText = `
      SELECT id, email, password_hash, username, created_at, updated_at 
      FROM users 
      WHERE email = $1 AND deleted_at IS NULL
    `;
    
    return this.query(queryText, [email]);
  }

  async updateUser(userId, updateData) {
    this.validateUserId(userId);
    
    const { email, username } = updateData;
    const updatedAt = new Date();
    const queryText = `
      UPDATE users 
      SET email = $1, username = $2, updated_at = $3 
      WHERE id = $4 AND deleted_at IS NULL 
      RETURNING id, email, username, updated_at
    `;
    
    return this.query(queryText, [email, username, updatedAt, userId]);
  }

  async softDeleteUser(userId) {
    this.validateUserId(userId);
    
    const deletedAt = new Date();
    const queryText = `
      UPDATE users 
      SET deleted_at = $1 
      WHERE id = $2 
      RETURNING id
    `;
    
    return this.query(queryText, [deletedAt, userId]);
  }

  // Calculation History Operations
  async createCalculation(calculationData) {
    const { user_id, calculation_type, input_data, result_data, created_at } = calculationData;
    const queryText = `
      INSERT INTO calculation_history (user_id, calculation_type, input_data, result_data, created_at) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING id, user_id, calculation_type, input_data, result_data, created_at
    `;
    
    return this.query(queryText, [user_id, calculation_type, input_data, result_data, created_at]);
  }

  async getUserCalculations(userId, limit = 50, offset = 0) {
    this.validateUserId(userId);
    
    const queryText = `
      SELECT id, calculation_type, input_data, result_data, created_at 
      FROM calculation_history 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2 OFFSET $3
    `;
    
    return this.query(queryText, [userId, limit, offset]);
  }

  async deleteCalculation(calculationId) {
    const queryText = `
      DELETE FROM calculation_history 
      WHERE id = $1 
      RETURNING id
    `;
    
    return this.query(queryText, [calculationId]);
  }

  // User Preferences Operations
  async getUserPreferences(userId) {
    this.validateUserId(userId);
    
    const queryText = `
      SELECT preferences 
      FROM user_preferences 
      WHERE user_id = $1
    `;
    
    return this.query(queryText, [userId]);
  }

  async updateUserPreferences(userId, preferences) {
    this.validateUserId(userId);
    
    const queryText = `
      INSERT INTO user_preferences (user_id, preferences, updated_at) 
      VALUES ($1, $2, $3) 
      ON CONFLICT (user_id) 
      DO UPDATE SET preferences = $2, updated_at = $3 
      RETURNING user_id, preferences, updated_at
    `;
    
    return this.query(queryText, [userId, preferences, new Date()]);
  }

  // Transaction Support
  async executeTransaction(callback) {
    const client = await this.getClient();
    
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Transaction failed:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Health Check with detailed pool metrics
  async healthCheck() {
    try {
      const result = await this.query('SELECT NOW() as current_time');
      const poolStats = {
        totalCount: this.pool.totalCount,
        idleCount: this.pool.idleCount,
        waitingCount: this.pool.waitingCount,
        maxCount: this.pool.options.max
      };
      
      return {
        status: 'healthy',
        timestamp: result.rows[0].current_time,
        database: config.database,
        pool: poolStats
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString(),
        pool: {
          totalCount: this.pool.totalCount,
          idleCount: this.pool.idleCount,
          waitingCount: this.pool.waitingCount
        }
      };
    }
  }

  // Close all connections
  async close() {
    try {
      await this.pool.end();
      console.log('Database pool has been closed');
    } catch (error) {
      console.error('Error closing database pool:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
const databaseService = new DatabaseService();

// Handle application shutdown
process.on('beforeExit', async () => {
  await databaseService.close();
});

process.on('SIGINT', async () => {
  await databaseService.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await databaseService.close();
  process.exit(0);
});

export default databaseService;