import { createClient } from '@supabase/supabase-js'

// Reuse Supabase client instance across requests
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

// Rate limiting setup (in a real app, this would be configured at the application level)
// For this example, we'll add a simple in-memory rate limiter
const rateLimitMap = new Map()
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 100 // Max requests per window

function checkRateLimit(ip) {
  const now = Date.now()
  const windowStart = now - RATE_LIMIT_WINDOW
  
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, [])
  }
  
  const requests = rateLimitMap.get(ip).filter(timestamp => timestamp > windowStart)
  rateLimitMap.set(ip, requests)
  
  if (requests.length >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }
  
  requests.push(now)
  return true
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || '*')
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type')
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  
  // Only allow DELETE method
  if (req.method !== 'DELETE') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only DELETE requests are supported' 
    })
  }

  // Validate request body size if present
  const contentLength = req.headers['content-length']
  if (contentLength && parseInt(contentLength) > 1024) { // 1KB max
    return res.status(413).json({
      error: 'Payload too large',
      message: 'Request body too large'
    })
  }

  // Rate limiting
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  if (!checkRateLimit(clientIP)) {
    return res.status(429).json({
      error: 'Too many requests',
      message: 'Rate limit exceeded'
    })
  }

  try {
    // Extract JWT token from Authorization header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Valid JWT token required' 
      })
    }

    const token = authHeader.split(' ')[1]
    
    // Validate token format - check if token is empty after split
    if (!token) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Valid JWT token required' 
      })
    }
    
    // Verify JWT token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Invalid or expired token' 
      })
    }

    // Validate history entry ID
    const { id } = req.query
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ 
        error: 'Bad request',
        message: 'Valid history entry ID is required' 
      })
    }

    // Check if history entry exists and belongs to user - only select needed fields
    const { data: existingEntry, error: fetchError } = await supabase
      .from('calculation_history')
      .select('user_id') // Only select user_id for better performance
      .eq('id', id)
      .single()

    if (fetchError || !existingEntry) {
      return res.status(404).json({ 
        error: 'Not found',
        message: 'History entry not found' 
      })
    }

    // Verify ownership
    if (existingEntry.user_id !== user.id) {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: 'You can only delete your own history entries' 
      })
    }

    // Delete the history entry
    const { error: deleteError } = await supabase
      .from('calculation_history')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Database deletion error:', deleteError)
      return res.status(500).json({ 
        error: 'Internal server error',
        message: 'Failed to delete history entry' 
      })
    }

    // Success response
    return res.status(200).json({ 
      success: true,
      message: 'History entry deleted successfully',
      deletedId: parseInt(id)
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'An unexpected error occurred' 
    })
  }
}