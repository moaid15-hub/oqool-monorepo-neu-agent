const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const pool = require('../../config/database');

// Whitelist of allowed preference fields
const ALLOWED_PREFERENCE_FIELDS = ['theme', 'decimal_places', 'language'];
const SELECT_FIELDS = ['theme', 'language', 'notifications_enabled', 'email_notifications', 'created_at', 'updated_at'];

// Validation rules
const validatePreferences = [
  body('theme')
    .optional()
    .isIn(['light', 'dark', 'auto'])
    .withMessage('Theme must be light, dark, or auto'),
  body('decimal_places')
    .optional()
    .isInt({ min: 0, max: 8 })
    .withMessage('Decimal places must be between 0 and 8'),
  body('language')
    .optional()
    .isLength({ min: 2, max: 5 })
    .withMessage('Language code must be 2-5 characters')
];

// Validate user ID format (assuming UUID)
const isValidUserId = (userId) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(userId);
};

// PUT /api/preferences - Update user preferences
router.put('/', validatePreferences, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Extract JWT payload (assuming it's set by auth middleware)
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Validate user ID format
    if (!isValidUserId(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user identifier'
      });
    }

    const { theme, decimal_places, language } = req.body;

    // Check if at least one field is provided
    if (!theme && decimal_places === undefined && !language) {
      return res.status(400).json({
        success: false,
        message: 'At least one preference field must be provided'
      });
    }

    // Build dynamic update query using whitelist approach
    const updateFields = [];
    const queryParams = [];
    let paramCount = 1;

    if (theme && ALLOWED_PREFERENCE_FIELDS.includes('theme')) {
      updateFields.push(`theme = $${paramCount}`);
      queryParams.push(theme);
      paramCount++;
    }

    if (decimal_places !== undefined && ALLOWED_PREFERENCE_FIELDS.includes('decimal_places')) {
      updateFields.push(`decimal_places = $${paramCount}`);
      queryParams.push(decimal_places);
      paramCount++;
    }

    if (language && ALLOWED_PREFERENCE_FIELDS.includes('language')) {
      updateFields.push(`language = $${paramCount}`);
      queryParams.push(language);
      paramCount++;
    }

    // If no valid fields to update, return error
    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid preference fields provided'
      });
    }

    // Add updated_at timestamp and user_id
    updateFields.push(`updated_at = NOW()`);
    queryParams.push(userId);

    // Use UPSERT pattern for better efficiency
    const upsertQuery = `
      INSERT INTO user_preferences (user_id, theme, decimal_places, language, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      ON CONFLICT (user_id) 
      DO UPDATE SET ${updateFields.join(', ')}
      RETURNING ${SELECT_FIELDS.join(', ')}
    `;

    const upsertParams = [
      userId,
      theme || 'auto',
      decimal_places !== undefined ? decimal_places : 2,
      language || 'en',
      ...queryParams.slice(0, -1) // Exclude the userId from update params since it's already in position 1
    ];

    const result = await pool.query(upsertQuery, upsertParams);
    
    const isNewRecord = result.rows[0].created_at.getTime() === result.rows[0].updated_at.getTime();
    
    res.status(isNewRecord ? 201 : 200).json({
      success: true,
      message: isNewRecord ? 'Preferences created successfully' : 'Preferences updated successfully',
      data: result.rows[0]
    });

  } catch (error) {
    // Log only necessary error details in production
    const errorMessage = process.env.NODE_ENV === 'production' 
      ? 'Database operation failed' 
      : error.message;
    
    console.error('Error updating preferences:', {
      message: errorMessage,
      code: error.code,
      timestamp: new Date().toISOString()
    });
    
    if (error.code === '23503') { // Foreign key violation
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generic error message for production
    const clientMessage = process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message;

    res.status(500).json({
      success: false,
      message: clientMessage
    });
  }
});

module.exports = router;