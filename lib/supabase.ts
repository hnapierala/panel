import { createClient } from "@supabase/supabase-js"

// Zmienne środowiskowe dla Supabase
// W produkcji te wartości powinny być ustawione w zmiennych środowiskowych
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://example.supabase.co"
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "example-key"

// Tworzenie klienta Supabase
export const supabase = createClient(supabaseUrl, supabaseKey)

// Typy dla danych
export interface SolarPanel {
  id: string
  name: string
  power: number
  price: number
  efficiency: number
  warranty: number
  dimensions: string
  weight: number
  manufacturer: string
  type: string
  created_at?: string
  updated_at?: string
}

// Funkcje do zarządzania panelami
export const panelsService = {
  // Pobieranie wszystkich paneli
  async getPanels(): Promise<SolarPanel[]> {
    try {
      const { data, error } = await supabase.from("panels").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Błąd podczas pobierania paneli:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Nieoczekiwany błąd podczas pobierania paneli:", error)
      return []
    }
  },

  // Dodawanie nowego panelu
  async addPanel(panel: Omit<SolarPanel, "id" | "created_at" | "updated_at">): Promise<SolarPanel | null> {
    try {
      const { data, error } = await supabase
        .from("panels")
        .insert([{ ...panel, updated_at: new Date().toISOString() }])
        .select()

      if (error) {
        console.error("Błąd podczas dodawania panelu:", error)
        return null
      }

      return data?.[0] || null
    } catch (error) {
      console.error("Nieoczekiwany błąd podczas dodawania panelu:", error)
      return null
    }
  },

  // Aktualizacja panelu
  async updatePanel(id: string, panel: Partial<SolarPanel>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("panels")
        .update({ ...panel, updated_at: new Date().toISOString() })
        .eq("id", id)

      if (error) {
        console.error("Błąd podczas aktualizacji panelu:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Nieoczekiwany błąd podczas aktualizacji panelu:", error)
      return false
    }
  },

  // Usuwanie panelu
  async deletePanel(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("panels").delete().eq("id", id)

      if (error) {
        console.error("Błąd podczas usuwania panelu:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Nieoczekiwany błąd podczas usuwania panelu:", error)
      return false
    }
  },
}

// Podobne funkcje można zaimplementować dla innych typów danych (falowniki, konstrukcje, itp.)
