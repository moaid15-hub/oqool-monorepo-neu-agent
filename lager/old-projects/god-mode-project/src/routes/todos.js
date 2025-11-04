const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const auth = require('../middleware/auth');
const rateLimit = require('express-rate-limit'); // Assuming express-rate-limit is installed
const sanitize = require('sanitize'); // Assuming a generic sanitization library is installed

// Constants for SQL error codes
const SQL_ERROR_CODES = {
  NO_REFERENCED_ROW: 'ER_NO_REFERENCED_ROW',
  DATA_TOO_LONG: 'ER_DATA_TOO_LONG'
};

// Rate limiting middleware for /todos route to mitigate brute-force attacks
const todosRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Sanitize input middleware
const sanitizeInput = (req, res, next) => {
  req.body.user_id = sanitize(req.body.user_id);
  req.body.title = sanitize(req.body.title);
  req.body.description = sanitize(req.body.description);
  next();
};

// Validation rules
const todoValidationRules = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title is required and must be between 1-255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be a boolean value'),
  body('due_date')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid ISO 8601 date')
];

// Use rate limiting middleware on all /todos routes
router.use(todosRateLimiter);

// POST /todos - Create a new todo item
router.post('/', auth, sanitizeInput, todoValidationRules, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, description, completed = false, due_date = null } = req.body;
    const user_id = req.user.id; // From auth middleware, assuming it's sanitized

    // Insert todo into database
    const [result] = await db.execute(
      `INSERT INTO todos (user_id, title, description, completed, due_date, created_at) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [user_id, title, description, completed, due_date]
    );

    // Return the created todo item directly instead of performing another query
    const insertedTodo = {
      id: result.insertId,
      user_id,
      title,
      description,
      completed,
      due_date,
      created_at: new Date() // Approximation of the current time, slight deviation possible
    };

    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: insertedTodo
    });

  } catch (error) {
    console.error('Error creating todo:', error);

    // Handle specific database errors with more context
    if (error.code === SQL_ERROR_CODES.NO_REFERENCED_ROW) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }

    if (error.code === SQL_ERROR_CODES.DATA_TOO_LONG) {
      return res.status(400).json({
        success: false,
        message: 'Data too long for one or more fields'
      });
    }

    // Generic error response for unforeseen errors
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred'
    });
  }
});

module.exports = router;