export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      panels: {
        Row: {
          id: string
          name: string
          power: number
          price: number
          efficiency: number
          warranty: number
          dimensions: string | null
          weight: number | null
          manufacturer: string | null
          type: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          power: number
          price: number
          efficiency: number
          warranty: number
          dimensions?: string | null
          weight?: number | null
          manufacturer?: string | null
          type?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          power?: number
          price?: number
          efficiency?: number
          warranty?: number
          dimensions?: string | null
          weight?: number | null
          manufacturer?: string | null
          type?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      inverters: {
        Row: {
          id: string
          name: string
          power: number
          price: number
          efficiency: number
          warranty: number
          phases: number
          manufacturer: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          power: number
          price: number
          efficiency: number
          warranty: number
          phases: number
          manufacturer?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          power?: number
          price?: number
          efficiency?: number
          warranty?: number
          phases?: number
          manufacturer?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      constructions: {
        Row: {
          id: string
          name: string
          price: number
          type: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          price: number
          type: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          type?: string
          created_at?: string
          updated_at?: string
        }
      }
      accessories: {
        Row: {
          id: string
          name: string
          price: number
          category: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          price: number
          category: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          category?: string
          created_at?: string
          updated_at?: string
        }
      }
      labor: {
        Row: {
          id: string
          name: string
          price: number
          category: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          price: number
          category: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          category?: string
          created_at?: string
          updated_at?: string
        }
      }
      rates: {
        Row: {
          id: string
          name: string
          value: number
          type: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          value: number
          type: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          value?: number
          type?: string
          created_at?: string
          updated_at?: string
        }
      }
      prices: {
        Row: {
          id: string
          name: string
          value: number
          unit: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          value: number
          unit: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          value?: number
          unit?: string
          created_at?: string
          updated_at?: string
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
