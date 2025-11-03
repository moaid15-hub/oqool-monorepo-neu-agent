const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const { Parser } = require('expr-eval');

// Database connection with connection pooling
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// JWT verification middleware with synchronous verification
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Input sanitization and validation
const sanitizeExpression = (expression, operation) => {
  if (typeof expression !== 'string') {
    throw new Error('Expression must be a string');
  }

  // Remove extra whitespace and limit length
  const sanitized = expression.trim().replace(/\s+/g, ' ');
  if (sanitized.length > 1000) {
    throw new Error('Expression too long');
  }

  // Operation-specific validation
  switch (operation) {
    case 'add':
    case 'subtract':
    case 'multiply':
    case 'divide':
      // Validate basic arithmetic expressions
      if (!/^[-+]?[0-9]*\.?[0-9]+([-+*/][-+]?[0-9]*\.?[0-9]+)*$/.test(sanitized)) {
        throw new Error('Invalid arithmetic expression');
      }
      break;
    case 'custom':
      // More restrictive validation for custom expressions
      if (!/^[0-9+\-*/().\s]+$/.test(sanitized)) {
        throw new Error('Invalid characters in custom expression');
      }
      // Additional safety: no function calls or variables
      if (/[a-zA-Z_$]/.test(sanitized)) {
        throw new Error('Custom expressions cannot contain letters or variables');
      }
      break;
    default:
      throw new Error('Unsupported operation');
  }

  return sanitized;
};

// Result bounds checking
const validateResult = (result) => {
  if (!Number.isFinite(result)) {
    throw new Error('Calculation resulted in non-finite number');
  }

  // Check for very large or very small numbers
  const absResult = Math.abs(result);
  if (absResult > Number.MAX_SAFE_INTEGER) {
    throw new Error('Calculation result too large');
  }
  if (absResult > 0 && absResult < Number.MIN_VALUE) {
    throw new Error('Calculation result too small');
  }

  return result;
};

// Validation rules
const calculateValidation = [
  body('expression')
    .isString()
    .notEmpty()
    .isLength({ max: 1000 })
    .withMessage('Expression must be a non-empty string (max 1000 chars)'),
  body('operation')
    .isString()
    .isIn(['add', 'subtract', 'multiply', 'divide', 'custom'])
    .withMessage('Operation must be one of: add, subtract, multiply, divide, custom')
];

// Calculate function with safe expression evaluation
const performCalculation = (expression, operation) => {
  try {
    let result;
    
    switch (operation) {
      case 'add':
        const addNumbers = expression.split('+').map(num => parseFloat(num.trim()));
        if (addNumbers.some(isNaN)) throw new Error('Invalid numbers in addition');
        result = addNumbers.reduce((sum, num) => sum + num, 0);
        break;
        
      case 'subtract':
        const subNumbers = expression.split('-').map(num => parseFloat(num.trim()));
        if (subNumbers.some(isNaN)) throw new Error('Invalid numbers in subtraction');
        result = subNumbers.reduce((diff, num, index) => 
          index === 0 ? num : diff - num
        );
        break;
        
      case 'multiply':
        const mulNumbers = expression.split('*').map(num => parseFloat(num.trim()));
        if (mulNumbers.some(isNaN)) throw new Error('Invalid numbers in multiplication');
        result = mulNumbers.reduce((product, num) => product * num, 1);
        break;
        
      case 'divide':
        const divNumbers = expression.split('/').map(num => parseFloat(num.trim()));
        if (divNumbers.some(isNaN)) throw new Error('Invalid numbers in division');
        result = divNumbers.reduce((quotient, num, index) => {
          if (index === 0) return num;
          if (num === 0) throw new Error('Division by zero');
          return quotient / num;
        });
        break;
        
      case 'custom':
        // Use safe expression evaluator instead of eval
        try {
          const parser = new Parser();
          const expr = parser.parse(expression);
          result = expr.evaluate();
        } catch (evalError) {
          throw new Error(`Invalid custom expression: ${evalError.message}`);
        }
        break;
        
      default:
        throw new Error('Unsupported operation');
    }
    
    return validateResult(result);
  } catch (error) {
    throw new Error(`Calculation failed: ${error.message}`);
  }
};

// Async error logging function
const logErrorToDatabase = async (userId, expression, operation, errorMessage) => {
  try {
    const client = await pool.connect();
    try {
      await client.query(
        'INSERT INTO calculation_errors (user_id, expression, operation, error_message) VALUES ($1, $2, $3, $4)',
        [userId, expression, operation, errorMessage]
      );
    } finally {
      client.release();
    }
  } catch (dbError) {
    // Use process.nextTick to avoid blocking the main thread
    process.nextTick(() => {
      console.error('Failed to log error to database:', dbError);
    });
  }
};

// Route handler
router.post('/', authenticateToken, calculateValidation, async (req, res) => {
  let client;
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { expression: rawExpression, operation } = req.body;
    
    // Sanitize and validate input
    const expression = sanitizeExpression(rawExpression, operation);
    
    // Perform calculation
    const result = performCalculation(expression, operation);
    
    // Log calculation to database using connection pool
    client = await pool.connect();
    await client.query(
      'INSERT INTO calculation_history (user_id, expression, operation, result) VALUES ($1, $2, $3, $4)',
      [req.user.id, expression, operation, result]
    );

    res.json({
      success: true,
      expression,
      operation,
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    // Async error logging - don't await this to avoid blocking response
    logErrorToDatabase(
      req.user?.id || null, 
      req.body.expression, 
      req.body.operation, 
      error.message
    );

    res.status(400).json({
      success: false,
      error: error.message
    });
  } finally {
    // Ensure client is released if it was acquired
    if (client) {
      client.release();
    }
  }
});

module.exports = router;