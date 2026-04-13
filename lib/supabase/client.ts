import { createBrowserClient } from '@supabase/ssr'

const FALLBACK_SUPABASE_URL = 'https://ywfkomtyadqkyugiibhi.supabase.co'
const FALLBACK_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3ZmtvbXR5YWRxa3l1Z2lpYmhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNTQ0MjEsImV4cCI6MjA3ODkzMDQyMX0.w4onmVyp4tnkpfFj525EXzfTay9kW3HY7z6MN26otrM'

function getSupabaseClientConfig() {
  return {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY,
  }
}

export function getClientConfigError() {
  const { supabaseUrl, supabaseKey } = getSupabaseClientConfig()

  if (!supabaseUrl || !supabaseKey) {
    return 'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.'
  }

  return null
}

export function createClient() {
  const { supabaseUrl, supabaseKey } = getSupabaseClientConfig()

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.'
    )
  }

  return createBrowserClient(supabaseUrl, supabaseKey)
}
