const jwt = require('jsonwebtoken');
const db = require('../../config/database');
const { validateId } = require('../../middleware/validation');
const rateLimit = require('express-rate-limit');
const SECRET_KEY = process.env.JWT_SECRET;

// Apply rate limiting to mitigate brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

/**
 * DELETE /todos/{id}
 * Deletes a todo item
 * Authentication: Bearer Token required
 * 
 * Request: Authorization header with Bearer Token
 * Response: JSON { message: 'Todo deleted successfully', deletedId: <id> }
 */
async function deleteTodo(req, res) {
    try {
        // Extract todo ID from route parameters
        const { id } = req.params;
        const todoId = parseInt(id, 10);

        // Validate ID parameter
        const validationResult = validateId(todoId.toString());
        if (!validationResult.isValid) {
            return res.status(400).json({
                error: 'Invalid ID',
                details: validationResult.errors
            });
        }

        // Verify JWT token
        const token = req.headers.authorization.split(' ')[1]; // Assuming format "Bearer <token>"
        const decoded = jwt.verify(token, SECRET_KEY);

        // Fetch user ID from verified token
        const userId = decoded.id;

        if (!req.user || req.user.id !== userId) {
            return res.status(401).json({ error: 'Unauthorized access' });
        }

        // Attempt to delete the todo
        const result = await db.query(
            'DELETE FROM todos WHERE id = ? AND user_id = ?',
            [todoId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: 'Todo not found or already deleted'
            });
        }

        // Return success response
        return res.status(200).json({
            message: 'Todo deleted successfully',
            deletedId: todoId
        });

    } catch (error) {
        console.error('Error deleting todo:', error);

        // Handle specific database errors
        if (error.code === 'ER_DBACCESS_DENIED_ERROR') {
            return res.status(500).json({
                error: 'Database access error'
            });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                error: 'Invalid token'
            });
        }

        // Generic error response
        return res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to delete todo'
        });
    }
}

// Apply limiter as middleware
deleteTodo.use(limiter);

module.exports = deleteTodo;