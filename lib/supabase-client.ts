import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Singleton pattern dla klienta Supabase
let supabaseInstance: ReturnType<typeof createClient> | null = null

const getSupabase = () => {
  if (supabaseInstance) return supabaseInstance

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Brak wymaganych zmiennych środowiskowych Supabase")
  }

  supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  })

  return supabaseInstance
}

const supabase = getSupabase()

export default supabase
