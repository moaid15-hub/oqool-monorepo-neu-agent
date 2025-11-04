const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../../../config/database');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const emailService = require('../../../services/emailService');

const router = express.Router();

// Rate limiting for registration endpoint
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 registration attempts per windowMs
  message: {
    success: false,
    message: 'Too many registration attempts from this IP, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation rules
const validateRegistration = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .isAlphanumeric()
    .withMessage('Username must contain only letters and numbers'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6, max: 128 })
    .withMessage('Password must be between 6 and 128 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number')
];

// Generate email verification token
function generateVerificationToken() {
  return require('crypto').randomBytes(32).toString('hex');
}

// Register endpoint
router.post('/', registerLimiter, validateRegistration, async (req, res) => {
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { username, email, password } = req.body;

    // Check if user already exists with separate queries for better index usage
    const existingUsername = await client.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );

    if (existingUsername.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        success: false,
        message: 'Username or email already exists'
      });
    }

    const existingEmail = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingEmail.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        success: false,
        message: 'Username or email already exists'
      });
    }

    // Hash password with lower cost factor for better performance
    const saltRounds = process.env.NODE_ENV === 'production' ? 12 : 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user with verification token
    const result = await client.query(
      `INSERT INTO users (username, email, password_hash, email_verified, verification_token, verification_expires) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, username, email, created_at`,
      [username, email, hashedPassword, false, verificationToken, tokenExpires]
    );

    const newUser = result.rows[0];

    // Send verification email (non-blocking)
    emailService.sendVerificationEmail(email, verificationToken)
      .catch(error => {
        console.error('Failed to send verification email:', error);
      });

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email to verify your account.',
      data: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        createdAt: newUser.created_at,
        emailVerified: false
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Registration error:', error);
    
    if (error.code === '23505') { // PostgreSQL unique violation
      return res.status(409).json({
        success: false,
        message: 'Username or email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error during registration'
    });
  } finally {
    client.release();
  }
});

module.exports = router;