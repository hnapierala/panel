import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Tworzenie klienta Supabase dla strony klienta (frontend)
// Używamy wzorca singleton, aby uniknąć wielu instancji
let supabaseClient: ReturnType<typeof createClient<Database>> | null = null

export const getSupabaseClient = () => {
  if (supabaseClient) return supabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Brak zmiennych środowiskowych SUPABASE_URL lub SUPABASE_ANON_KEY")
  }

  supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey)
  return supabaseClient
}

// Tworzenie klienta Supabase dla strony serwera (backend)
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Brak zmiennych środowiskowych SUPABASE_URL lub SUPABASE_ANON_KEY")
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}
