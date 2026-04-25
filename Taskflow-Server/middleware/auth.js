import jwt from 'jsonwebtoken'

/**
 * Verifies the Supabase JWT attached to every request.
 * The decoded payload contains `sub` (user id) and `email`.
 */
export function authenticate(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' })
  }

  const token = header.split(' ')[1]

  try {
    const payload = jwt.verify(token, process.env.SUPABASE_JWT_SECRET)
    req.user = { id: payload.sub, email: payload.email }
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}