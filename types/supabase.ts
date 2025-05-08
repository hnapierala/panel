export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      accessories: {
        Row: {
          category: string
          created_at: string
          id: string
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      constructions: {
        Row: {
          created_at: string
          id: string
          name: string
          price: number
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          price: number
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          price?: number
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      inverters: {
        Row: {
          created_at: string
          efficiency: number
          id: string
          manufacturer: string
          name: string
          phases: number
          power: number
          price: number
          updated_at: string
          warranty: number
        }
        Insert: {
          created_at?: string
          efficiency: number
          id?: string
          manufacturer: string
          name: string
          phases: number
          power: number
          price: number
          updated_at?: string
          warranty: number
        }
        Update: {
          created_at?: string
          efficiency?: number
          id?: string
          manufacturer?: string
          name?: string
          phases?: number
          power?: number
          price?: number
          updated_at?: string
          warranty?: number
        }
        Relationships: []
      }
      labor: {
        Row: {
          category: string
          created_at: string
          id: string
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      panels: {
        Row: {
          created_at: string
          dimensions: string | null
          efficiency: number
          id: string
          manufacturer: string
          name: string
          power: number
          price: number
          type: string
          updated_at: string
          warranty: number
          weight: number | null
        }
        Insert: {
          created_at?: string
          dimensions?: string | null
          efficiency: number
          id?: string
          manufacturer: string
          name: string
          power: number
          price: number
          type: string
          updated_at?: string
          warranty: number
          weight?: number | null
        }
        Update: {
          created_at?: string
          dimensions?: string | null
          efficiency?: number
          id?: string
          manufacturer?: string
          name?: string
          power?: number
          price?: number
          type?: string
          updated_at?: string
          warranty?: number
          weight?: number | null
        }
        Relationships: []
      }
      prices: {
        Row: {
          created_at: string
          id: string
          name: string
          unit: string
          updated_at: string
          value: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          unit: string
          updated_at?: string
          value: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          unit?: string
          updated_at?: string
          value?: number
        }
        Relationships: []
      }
      rates: {
        Row: {
          created_at: string
          id: string
          name: string
          type: string
          updated_at: string
          value: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          type: string
          updated_at?: string
          value: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          type?: string
          updated_at?: string
          value?: number
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
