import { createClient } from '@supabase/supabase-js'

// Service-role client — full DB access, never expose to browser
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default supabase