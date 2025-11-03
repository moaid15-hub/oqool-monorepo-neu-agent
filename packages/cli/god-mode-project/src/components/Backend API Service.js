const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');

class BackendAPIService {
  constructor() {
    this.app = express();
    this.dbPool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 5432,
    });
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  setupMiddleware() {
    // Security middleware
    this.app.use(helmet());
    this.app.use(cors({
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
      credentials: true
    }));
    
    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    });
    this.app.use(limiter);
    
    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));
  }

  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    // Auth routes
    this.app.post('/api/auth/register', this.register.bind(this));
    this.app.post('/api/auth/login', this.login.bind(this));
    
    // Protected routes
    this.app.use('/api/calculations', this.authenticateToken.bind(this));
    this.app.post('/api/calculations', this.createCalculation.bind(this));
    this.app.get('/api/calculations', this.getCalculations.bind(this));
    this.app.get('/api/calculations/:id', this.getCalculation.bind(this));
  }

  setupErrorHandling() {
    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({ error: 'Route not found' });
    });

    // Global error handler
    this.app.use((error, req, res, next) => {
      console.error('Unhandled error:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
  }

  // Authentication middleware
  async authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
  }

  // User registration
  async register(req, res) {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({ error: 'Email, password, and name are required' });
      }

      // Check if user already exists
      const existingUser = await this.dbPool.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        return res.status(409).json({ error: 'User already exists' });
      }

      // Hash password and create user
      const hashedPassword = await bcrypt.hash(password, 12);
      const result = await this.dbPool.query(
        'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name',
        [email, hashedPassword, name]
      );

      const user = result.rows[0];
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        user: { id: user.id, email: user.email, name: user.name },
        token
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Failed to register user' });
    }
  }

  // User login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // Find user
      const result = await this.dbPool.query(
        'SELECT id, email, password, name FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = result.rows[0];

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        user: { id: user.id, email: user.email, name: user.name },
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Failed to login' });
    }
  }

  // Calculation Engine
  performCalculation(input) {
    try {
      // Example calculation - replace with actual business logic
      const { operation, values } = input;
      
      switch (operation) {
        case 'add':
          return values.reduce((sum, val) => sum + val, 0);
        case 'multiply':
          return values.reduce((product, val) => product * val, 1);
        case 'average':
          return values.reduce((sum, val) => sum + val, 0) / values.length;
        default:
          throw new Error(`Unsupported operation: ${operation}`);
      }
    } catch (error) {
      throw new Error(`Calculation failed: ${error.message}`);
    }
  }

  // Create calculation
  async createCalculation(req, res) {
    try {
      const { input } = req.body;
      const userId = req.user.userId;

      if (!input) {
        return res.status(400).json({ error: 'Calculation input is required' });
      }

      // Perform calculation
      const result = this.performCalculation(input);
      
      // Save to database
      const dbResult = await this.dbPool.query(
        `INSERT INTO calculations (user_id, input_data, result) 
         VALUES ($1, $2, $3) RETURNING id, created_at`,
        [userId, JSON.stringify(input), result]
      );

      res.status(201).json({
        id: dbResult.rows[0].id,
        input,
        result,
        createdAt: dbResult.rows[0].created_at
      });
    } catch (error) {
      console.error('Calculation creation error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  // Get user's calculations
  async getCalculations(req, res) {
    try {
      const userId = req.user.userId;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const result = await this.dbPool.query(
        `SELECT id, input_data, result, created_at 
         FROM calculations 
         WHERE user_id = $1 
         ORDER BY created_at DESC 
         LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
      );

      const countResult = await this.dbPool.query(
        'SELECT COUNT(*) FROM calculations WHERE user_id = $1',
        [userId]
      );

      res.json({
        calculations: result.rows.map(row => ({
          id: row.id,
          input: row.input_data,
          result: row.result,
          createdAt: row.created_at
        })),
        pagination: {
          page,
          limit,
          total: parseInt(countResult.rows[0].count),
          totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
        }
      });
    } catch (error) {
      console.error('Get calculations error:', error);
      res.status(500).json({ error: 'Failed to retrieve calculations' });
    }
  }

  // Get specific calculation
  async getCalculation(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      const result = await this.dbPool.query(
        `SELECT id, input_data, result, created_at 
         FROM calculations 
         WHERE id = $1 AND user_id = $2`,
        [id, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Calculation not found' });
      }

      const calculation = result.rows[0];
      res.json({
        id: calculation.id,
        input: calculation.input_data,
        result: calculation.result,
        createdAt: calculation.created_at
      });
    } catch (error) {
      console.error('Get calculation error:', error);
      res.status(500).json({ error: 'Failed to retrieve calculation' });
    }
  }

  // Start server
  start(port = process.env.PORT || 3001) {
    return this.app.listen(port, () => {
      console.log(`Backend API Service running on port ${port}`);
    });
  }

  // Graceful shutdown
  async shutdown() {
    console.log('Shutting down Backend API Service...');
    await this.dbPool.end();
    process.exit(0);
  }
}

// Database initialization (run once on startup)
async function initializeDatabase(dbPool) {
  try {
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS calculations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        input_data JSONB NOT NULL,
        result NUMERIC NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_calculations_user_id ON calculations(user_id);
      CREATE INDEX IF NOT EXISTS idx_calculations_created_at ON calculations(created_at);
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

// Application startup
if (require.main === module) {
  const apiService = new BackendAPIService();
  
  // Initialize database and start server
  initializeDatabase(apiService.dbPool)
    .then(() => {
      const server = apiService.start();
      
      // Graceful shutdown handling
      process.on('SIGTERM', () => apiService.shutdown());
      process.on('SIGINT', () => apiService.shutdown());
    })
    .catch(error => {
      console.error('Failed to start Backend API Service:', error);
      process.exit(1);
    });
}

module.exports = BackendAPIService;