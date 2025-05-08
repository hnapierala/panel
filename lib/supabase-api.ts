import { getSupabaseClient } from "./supabase-client"
import type { SolarPanel, Inverter, Construction, Accessory, Labor, Rate, Price } from "./api-types"

// Funkcje pomocnicze do formatowania daty
export const formatDate = () => {
  return new Date().toISOString()
}

// Funkcja do obsługi błędów
const handleApiError = (error: any, message: string) => {
  console.error(`${message}:`, error)
  throw new Error(message)
}

// Klient API dla Supabase
export const supabaseApi = {
  // Pobieranie danych
  async getData<T>(table: string): Promise<T[]> {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.from(table).select("*").order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      return data as T[]
    } catch (error) {
      handleApiError(error, `Błąd podczas pobierania danych z ${table}`)
      return []
    }
  },

  // Pobieranie pojedynczego elementu
  async getItem<T>(table: string, id: string): Promise<T | null> {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.from(table).select("*").eq("id", id).single()

      if (error) {
        if (error.code === "PGRST116") {
          return null // Nie znaleziono elementu
        }
        throw error
      }

      return data as T
    } catch (error) {
      handleApiError(error, `Błąd podczas pobierania elementu z ${table}`)
      return null
    }
  },

  // Dodawanie nowego elementu
  async addItem<T>(table: string, item: any): Promise<T | null> {
    try {
      const supabase = getSupabaseClient()
      const now = formatDate()

      const { data, error } = await supabase
        .from(table)
        .insert([{ ...item, created_at: now, updated_at: now }])
        .select()

      if (error) {
        throw error
      }

      return data?.[0] as T
    } catch (error) {
      handleApiError(error, `Błąd podczas dodawania elementu do ${table}`)
      return null
    }
  },

  // Aktualizacja elementu
  async updateItem<T>(table: string, id: string, item: any): Promise<boolean> {
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase
        .from(table)
        .update({ ...item, updated_at: formatDate() })
        .eq("id", id)

      if (error) {
        throw error
      }

      return true
    } catch (error) {
      handleApiError(error, `Błąd podczas aktualizacji elementu w ${table}`)
      return false
    }
  },

  // Usuwanie elementu
  async deleteItem(table: string, id: string): Promise<boolean> {
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from(table).delete().eq("id", id)

      if (error) {
        throw error
      }

      return true
    } catch (error) {
      handleApiError(error, `Błąd podczas usuwania elementu z ${table}`)
      return false
    }
  },

  // Inicjalizacja danych
  async initializeData(defaultData: any): Promise<boolean> {
    try {
      const supabase = getSupabaseClient()
      const now = formatDate()

      // Inicjalizacja wszystkich tabel
      for (const [table, items] of Object.entries(defaultData)) {
        // Dodaj daty do każdego elementu
        const itemsWithDates = (items as any[]).map((item) => ({
          ...item,
          created_at: now,
          updated_at: now,
        }))

        // Wstaw dane do tabeli
        const { error } = await supabase.from(table).insert(itemsWithDates)

        if (error) {
          console.error(`Błąd podczas inicjalizacji tabeli ${table}:`, error)
          // Kontynuuj z następną tabelą, nawet jeśli wystąpił błąd
        }
      }

      return true
    } catch (error) {
      handleApiError(error, "Błąd podczas inicjalizacji danych")
      return false
    }
  },
}

// Specjalizowane funkcje dla konkretnych typów danych
export const panelsApi = {
  getAll: () => supabaseApi.getData<SolarPanel>("panels"),
  getById: (id: string) => supabaseApi.getItem<SolarPanel>("panels", id),
  add: (panel: Omit<SolarPanel, "id" | "created_at" | "updated_at">) =>
    supabaseApi.addItem<SolarPanel>("panels", panel),
  update: (id: string, panel: Partial<SolarPanel>) => supabaseApi.updateItem<SolarPanel>("panels", id, panel),
  delete: (id: string) => supabaseApi.deleteItem("panels", id),
}

export const invertersApi = {
  getAll: () => supabaseApi.getData<Inverter>("inverters"),
  getById: (id: string) => supabaseApi.getItem<Inverter>("inverters", id),
  add: (inverter: Omit<Inverter, "id" | "created_at" | "updated_at">) =>
    supabaseApi.addItem<Inverter>("inverters", inverter),
  update: (id: string, inverter: Partial<Inverter>) => supabaseApi.updateItem<Inverter>("inverters", id, inverter),
  delete: (id: string) => supabaseApi.deleteItem("inverters", id),
}

export const constructionsApi = {
  getAll: () => supabaseApi.getData<Construction>("constructions"),
  getById: (id: string) => supabaseApi.getItem<Construction>("constructions", id),
  add: (construction: Omit<Construction, "id" | "created_at" | "updated_at">) =>
    supabaseApi.addItem<Construction>("constructions", construction),
  update: (id: string, construction: Partial<Construction>) =>
    supabaseApi.updateItem<Construction>("constructions", id, construction),
  delete: (id: string) => supabaseApi.deleteItem("constructions", id),
}

export const accessoriesApi = {
  getAll: () => supabaseApi.getData<Accessory>("accessories"),
  getById: (id: string) => supabaseApi.getItem<Accessory>("accessories", id),
  add: (accessory: Omit<Accessory, "id" | "created_at" | "updated_at">) =>
    supabaseApi.addItem<Accessory>("accessories", accessory),
  update: (id: string, accessory: Partial<Accessory>) =>
    supabaseApi.updateItem<Accessory>("accessories", id, accessory),
  delete: (id: string) => supabaseApi.deleteItem("accessories", id),
}

export const laborApi = {
  getAll: () => supabaseApi.getData<Labor>("labor"),
  getById: (id: string) => supabaseApi.getItem<Labor>("labor", id),
  add: (labor: Omit<Labor, "id" | "created_at" | "updated_at">) => supabaseApi.addItem<Labor>("labor", labor),
  update: (id: string, labor: Partial<Labor>) => supabaseApi.updateItem<Labor>("labor", id, labor),
  delete: (id: string) => supabaseApi.deleteItem("labor", id),
}

export const ratesApi = {
  getAll: () => supabaseApi.getData<Rate>("rates"),
  getById: (id: string) => supabaseApi.getItem<Rate>("rates", id),
  add: (rate: Omit<Rate, "id" | "created_at" | "updated_at">) => supabaseApi.addItem<Rate>("rates", rate),
  update: (id: string, rate: Partial<Rate>) => supabaseApi.updateItem<Rate>("rates", id, rate),
  delete: (id: string) => supabaseApi.deleteItem("rates", id),
}

export const pricesApi = {
  getAll: () => supabaseApi.getData<Price>("prices"),
  getById: (id: string) => supabaseApi.getItem<Price>("prices", id),
  add: (price: Omit<Price, "id" | "created_at" | "updated_at">) => supabaseApi.addItem<Price>("prices", price),
  update: (id: string, price: Partial<Price>) => supabaseApi.updateItem<Price>("prices", id, price),
  delete: (id: string) => supabaseApi.deleteItem("prices", id),
}
