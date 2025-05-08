import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Sprawdź, czy zmienne środowiskowe są dostępne
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Brak wymaganych zmiennych środowiskowych Supabase")
}

// Opcje klienta Supabase
const supabaseOptions = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Wyłączamy automatyczne wykrywanie sesji w URL
    flowType: "implicit",
  },
}

// Singleton dla klienta po stronie klienta
let supabaseClient: ReturnType<typeof createClient> | null = null

// Funkcja do tworzenia klienta Supabase po stronie klienta
export const getSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Brak wymaganych zmiennych środowiskowych Supabase")
  }

  if (!supabaseClient) {
    supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, supabaseOptions)
  }

  return supabaseClient
}

// Funkcja do tworzenia klienta Supabase po stronie serwera
export const getSupabaseServerClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Brak wymaganych zmiennych środowiskowych Supabase")
  }

  // Zawsze tworzymy nowego klienta po stronie serwera
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    ...supabaseOptions,
    auth: {
      ...supabaseOptions.auth,
      persistSession: false,
    },
  })
}

// Domyślny klient Supabase
const supabase = getSupabaseClient()
export default supabase
