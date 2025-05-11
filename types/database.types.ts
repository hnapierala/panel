export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      accessories_config: {
        Row: {
          id: string
          ranges: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          ranges: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          ranges?: Json
          created_at?: string
          updated_at?: string
        }
      }
      energy_storages: {
        Row: {
          id: string
          manufacturer: string
          model: string
          capacity: number
          price: number
          compatible_inverters: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          manufacturer: string
          model: string
          capacity: number
          price: number
          compatible_inverters: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          manufacturer?: string
          model?: string
          capacity?: number
          price?: number
          compatible_inverters?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      inverters: {
        Row: {
          id: string
          manufacturer: string
          model: string
          power: number
          price: number
          type: string[]
          requires_optimizers: boolean
          compatible_storages: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          manufacturer: string
          model: string
          power: number
          price: number
          type: string[]
          requires_optimizers?: boolean
          compatible_storages?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          manufacturer?: string
          model?: string
          power?: number
          price?: number
          type?: string[]
          requires_optimizers?: boolean
          compatible_storages?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      mounting_systems: {
        Row: {
          id: string
          type: string
          name: string
          price_per_kw: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: string
          name: string
          price_per_kw: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: string
          name?: string
          price_per_kw?: number
          created_at?: string
          updated_at?: string
        }
      }
      optimizers: {
        Row: {
          id: string
          manufacturer: string
          model: string
          price: number
          compatible_inverters: string[]
          ratio: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          manufacturer: string
          model: string
          price: number
          compatible_inverters: string[]
          ratio?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          manufacturer?: string
          model?: string
          price?: number
          compatible_inverters?: string[]
          ratio?: string
          created_at?: string
          updated_at?: string
        }
      }
      panels: {
        Row: {
          id: string
          manufacturer: string
          model: string
          power: number
          price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          manufacturer: string
          model: string
          power: number
          price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          manufacturer?: string
          model?: string
          power?: number
          price?: number
          created_at?: string
          updated_at?: string
        }
      }
      quotes: {
        Row: {
          id: string
          client_data: Json
          selected_panel_id: string
          panel_count: number
          selected_inverter_id: string
          selected_optimizer_id: string | null
          selected_mounting_type: string
          selected_storage_id: string | null
          calculation: Json
          created_at: string
          expires_at: string
          status: string
          user_id: string | null
        }
        Insert: {
          id?: string
          client_data: Json
          selected_panel_id: string
          panel_count: number
          selected_inverter_id: string
          selected_optimizer_id?: string | null
          selected_mounting_type: string
          selected_storage_id?: string | null
          calculation: Json
          created_at?: string
          expires_at: string
          status?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          client_data?: Json
          selected_panel_id?: string
          panel_count?: number
          selected_inverter_id?: string
          selected_optimizer_id?: string | null
          selected_mounting_type?: string
          selected_storage_id?: string | null
          calculation?: Json
          created_at?: string
          expires_at?: string
          status?: string
          user_id?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
