const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const db = require('../../config/database');
const winston = require('../../config/winston'); // Assuming winston is configured for logging
const rateLimit = require('express-rate-limit'); // Import rate limiter

// Input validation rules
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
    .withMessage('Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, and a number'),
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long')
];

// Rate limiter for registration to prevent brute force attacks
const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // Limit each IP to 5 create account requests per windowMs
  message:
    'Too many accounts created from this IP, please try again after an hour'
});

/**
 * POST /users/register
 * Register a new user
 * Public endpoint
 */
router.post('/', createAccountLimiter, registerValidation, async (req, res) => {
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

    const { email, password, name } = req.body;
    
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Attempt to insert new user
    try {
      const result = await db.query(
        'INSERT INTO users (email, password, name, created_at) VALUES (?, ?, ?, NOW())',
        [email, hashedPassword, name]
      );

      // Get the created user (excluding password)
      const newUser = await db.query(
        'SELECT id, email, name, created_at FROM users WHERE id = ?',
        [result.insertId]
      );

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: newUser[0]
      });

    } catch (error) {
      // Handle duplicate entry error
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          success: false,
          message: 'User with this email already exists'
        });
      }
      throw error; // Rethrow the error if it's not a duplicate entry
    }

  } catch (error) {
    winston.error('Registration error:', error); // Use winston for logging

    res.status(500).json({
      success: false,
      message: 'Internal server error during registration'
    });
  }
});

module.exports = router;