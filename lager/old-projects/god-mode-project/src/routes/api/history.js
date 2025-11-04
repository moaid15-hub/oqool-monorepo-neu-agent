import { Router } from 'express';
import { query, validationResult } from 'express-validator';
import pool from '../../config/database.js';
import authenticateToken from '../../middleware/auth.js';
import logger from '../../config/logger.js';

const router = Router();

// Validation rules
const validateHistoryQuery = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a positive integer')
];

// Validate user ID format
const validateUserId = (userId) => {
  const id = parseInt(userId);
  return Number.isInteger(id) && id > 0;
};

// Route handler
router.get('/', authenticateToken, validateHistoryQuery, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors: errors.array()
      });
    }

    const { limit = 10, offset = 0 } = req.query;
    const userId = req.user.id;

    // Validate user ID format
    if (!validateUserId(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user identifier'
      });
    }

    const parsedLimit = parseInt(limit);
    const parsedOffset = parseInt(offset);
    const parsedUserId = parseInt(userId);

    // Single query using window function for count to ensure consistency
    const combinedQuery = `
      SELECT 
        id,
        calculation,
        result,
        created_at,
        COUNT(*) OVER() as total_count
      FROM calculations 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2 OFFSET $3
    `;

    const result = await pool.query(combinedQuery, [parsedUserId, parsedLimit, parsedOffset]);
    
    const calculations = result.rows;
    const totalCount = calculations.length > 0 ? parseInt(result.rows[0].total_count) : 0;

    res.json({
      success: true,
      data: {
        calculations: calculations.map(row => ({
          id: row.id,
          calculation: row.calculation,
          result: row.result,
          created_at: row.created_at
        })),
        pagination: {
          limit: parsedLimit,
          offset: parsedOffset,
          total: totalCount,
          hasMore: (parsedOffset + calculations.length) < totalCount
        }
      }
    });

  } catch (error) {
    logger.error('Error fetching calculation history:', { 
      error: error.message,
      userId: req.user?.id,
      endpoint: '/api/history'
    });
    
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching history'
    });
  }
});

export default router;