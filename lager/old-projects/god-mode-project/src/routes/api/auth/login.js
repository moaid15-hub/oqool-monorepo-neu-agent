const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../../../config/database');
const { validateLogin } = require('../../../middleware/validation');

const router = express.Router();

// Validate JWT_SECRET on startup
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

router.post('/', validateLogin, async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Find user by username - select only required columns
    const userQuery = `
      SELECT id, username, password_hash, is_active 
      FROM users 
      WHERE username = $1
    `;
    
    const userResult = await pool.query(userQuery, [username]);
    
    // Use consistent error message and timing for both user not found and invalid password
    const genericErrorResponse = {
      success: false,
      message: 'Invalid credentials'
    };
    
    // Always perform password comparison to prevent timing attacks
    let isPasswordValid = false;
    let user = null;
    
    if (userResult.rows.length > 0) {
      user = userResult.rows[0];
      
      // Check if user is active
      if (!user.is_active) {
        return res.status(403).json({
          success: false,
          message: 'Account is deactivated'
        });
      }
      
      // Verify password
      isPasswordValid = await bcrypt.compare(password, user.password_hash);
    }
    
    // Use consistent error for both cases
    if (!user || !isPasswordValid) {
      return res.status(401).json(genericErrorResponse);
    }
    
    // Generate JWT token with minimal payload (only userId)
    const token = jwt.sign(
      { 
        userId: user.id
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
    
    // Return success response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username
        }
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;