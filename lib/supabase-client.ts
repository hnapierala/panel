import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Sprawdź, czy zmienne środowiskowe są dostępne
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Brak zmiennych środowiskowych NEXT_PUBLIC_SUPABASE_URL lub NEXT_PUBLIC_SUPABASE_ANON_KEY")
}

// Singleton dla klienta po stronie klienta
let clientSingleton: ReturnType<typeof createClient<Database>> | null = null

// Funkcja do tworzenia klienta po stronie klienta
export function getSupabaseClient() {
  if (clientSingleton) return clientSingleton

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Brak zmiennych środowiskowych NEXT_PUBLIC_SUPABASE_URL lub NEXT_PUBLIC_SUPABASE_ANON_KEY")
  }

  clientSingleton = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "implicit",
      debug: true,
    },
  })

  return clientSingleton
}

// Funkcja do tworzenia klienta po stronie serwera
export function createSupabaseServerClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Brak zmiennych środowiskowych NEXT_PUBLIC_SUPABASE_URL lub NEXT_PUBLIC_SUPABASE_ANON_KEY")
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
