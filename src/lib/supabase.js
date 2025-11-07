import { createClient } from '@supabase/supabase-js'

// Load the URL and key from your environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create and export the client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
