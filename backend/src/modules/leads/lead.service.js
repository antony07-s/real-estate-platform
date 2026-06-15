const pool = require('../../config/db')

// ─── Create Lead ────────────────────────────────────
const createLead = async (senderId, data) => {
  const { property_id, message } = data

  // 1. Check if property exists
  const property = await pool.query(
    'SELECT * FROM properties WHERE id = $1',
    [property_id]
  )

  if (property.rows.length === 0) {
    const error = new Error('Property not found')
    error.statusCode = 404
    throw error
  }

  const propertyData = property.rows[0]

  // 2. Prevent owner from contacting themselves
  if (propertyData.user_id === senderId) {
    const error = new Error('You cannot send inquiry to your own property')
    error.statusCode = 400
    throw error
  }

  // 3. Check duplicate inquiry
  // UNIQUE(property_id, sender_id) in DB also prevents this
  // but we check here for a better error message
  const existing = await pool.query(
    'SELECT id FROM leads WHERE property_id = $1 AND sender_id = $2',
    [property_id, senderId]
  )

  if (existing.rows.length > 0) {
    const error = new Error('You have already sent an inquiry for this property')
    error.statusCode = 409
    throw error
  }

  // 4. Rate limiting — max 5 inquiries per hour per user
  const recentLeads = await pool.query(
    `SELECT COUNT(*) FROM leads 
     WHERE sender_id = $1 
     AND created_at > NOW() - INTERVAL '1 hour'`,
    [senderId]
  )

  if (parseInt(recentLeads.rows[0].count) >= 5) {
    const error = new Error('Too many inquiries. Please wait before sending more.')
    error.statusCode = 429
    throw error
  }

  // 5. Create lead
  const result = await pool.query(
    `INSERT INTO leads (property_id, sender_id, owner_id, message)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [property_id, senderId, propertyData.user_id, message]
  )

  return result.rows[0]
}

// ─── Get Leads for Property Owner ───────────────────
const getMyLeads = async (userId) => {
  const result = await pool.query(
    `SELECT 
      l.*,
      p.title as property_title,
      p.city as property_city,
      p.price as property_price,
      u.name as sender_name,
      u.email as sender_email,
      u.phone as sender_phone
     FROM leads l
     JOIN properties p ON l.property_id = p.id
     JOIN users u ON l.sender_id = u.id
     WHERE l.owner_id = $1
     ORDER BY l.created_at DESC`,
    [userId]
  )

  return result.rows
}

// ─── Get Leads Sent by User ─────────────────────────
const getMySentLeads = async (userId) => {
  const result = await pool.query(
    `SELECT 
      l.*,
      p.title as property_title,
      p.city as property_city,
      p.price as property_price,
      p.property_type
     FROM leads l
     JOIN properties p ON l.property_id = p.id
     WHERE l.sender_id = $1
     ORDER BY l.created_at DESC`,
    [userId]
  )

  return result.rows
}

// ─── Update Lead Status ─────────────────────────────
const updateLeadStatus = async (leadId, ownerId, status) => {
  const existing = await pool.query(
    'SELECT * FROM leads WHERE id = $1',
    [leadId]
  )

  if (existing.rows.length === 0) {
    const error = new Error('Lead not found')
    error.statusCode = 404
    throw error
  }

  if (existing.rows[0].owner_id !== ownerId) {
    const error = new Error('Unauthorized')
    error.statusCode = 403
    throw error
  }

  const result = await pool.query(
    `UPDATE leads SET status = $1 WHERE id = $2 RETURNING *`,
    [status, leadId]
  )

  return result.rows[0]
}

module.exports = {
  createLead,
  getMyLeads,
  getMySentLeads,
  updateLeadStatus
}