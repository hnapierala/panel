import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Sprawdź, czy zmienne środowiskowe są dostępne
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Brak wymaganych zmiennych środowiskowych Supabase dla administratora")
}

// Singleton dla klienta administratora
let adminClient: ReturnType<typeof createClient<Database>> | null = null

// Funkcja do tworzenia klienta administratora
export const getSupabaseAdmin = () => {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Brak wymaganych zmiennych środowiskowych Supabase dla administratora")
  }

  if (!adminClient) {
    adminClient = createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }

  return adminClient
}

// Domyślny klient administratora
const supabaseAdmin = getSupabaseAdmin()
export default supabaseAdmin
