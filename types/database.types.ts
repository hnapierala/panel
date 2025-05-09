export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      // Tutaj możesz dodać definicje tabel, jeśli są potrzebne
    }
    Views: {
      // Tutaj możesz dodać definicje widoków, jeśli są potrzebne
    }
    Functions: {
      // Tutaj możesz dodać definicje funkcji, jeśli są potrzebne
    }
  }
}
