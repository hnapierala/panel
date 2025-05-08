export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      accessories: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          name: string | null
          price: number | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          name?: string | null
          price?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          name?: string | null
          price?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      constructions: {
        Row: {
          created_at: string | null
          id: string
          name: string | null
          price: number | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name?: string | null
          price?: number | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string | null
          price?: number | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      inverters: {
        Row: {
          created_at: string | null
          efficiency: number | null
          id: string
          manufacturer: string | null
          name: string | null
          phases: number | null
          power: number | null
          price: number | null
          updated_at: string | null
          warranty: number | null
        }
        Insert: {
          created_at?: string | null
          efficiency?: number | null
          id?: string
          manufacturer?: string | null
          name?: string | null
          phases?: number | null
          power?: number | null
          price?: number | null
          updated_at?: string | null
          warranty?: number | null
        }
        Update: {
          created_at?: string | null
          efficiency?: number | null
          id?: string
          manufacturer?: string | null
          name?: string | null
          phases?: number | null
          power?: number | null
          price?: number | null
          updated_at?: string | null
          warranty?: number | null
        }
        Relationships: []
      }
      labor: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          name: string | null
          price: number | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          name?: string | null
          price?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          name?: string | null
          price?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      panels: {
        Row: {
          created_at: string | null
          dimensions: string | null
          efficiency: number | null
          id: string
          manufacturer: string | null
          name: string | null
          power: number | null
          price: number | null
          type: string | null
          updated_at: string | null
          warranty: number | null
          weight: number | null
        }
        Insert: {
          created_at?: string | null
          dimensions?: string | null
          efficiency?: number | null
          id?: string
          manufacturer?: string | null
          name?: string | null
          power?: number | null
          price?: number | null
          type?: string | null
          updated_at?: string | null
          warranty?: number | null
          weight?: number | null
        }
        Update: {
          created_at?: string | null
          dimensions?: string | null
          efficiency?: number | null
          id?: string
          manufacturer?: string | null
          name?: string | null
          power?: number | null
          price?: number | null
          type?: string | null
          updated_at?: string | null
          warranty?: number | null
          weight?: number | null
        }
        Relationships: []
      }
      prices: {
        Row: {
          created_at: string | null
          id: string
          name: string | null
          unit: string | null
          updated_at: string | null
          value: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name?: string | null
          unit?: string | null
          updated_at?: string | null
          value?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string | null
          unit?: string | null
          updated_at?: string | null
          value?: number | null
        }
        Relationships: []
      }
      rates: {
        Row: {
          created_at: string | null
          id: string
          name: string | null
          type: string | null
          updated_at: string | null
          value: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name?: string | null
          type?: string | null
          updated_at?: string | null
          value?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string | null
          type?: string | null
          updated_at?: string | null
          value?: number | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          company: string | null
          created_at: string | null
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_id_fkey"
            columns: ["id"]
            isOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      handle_new_user: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
    }
    Enums: {
      user_role: "user" | "admin" | "superadmin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
