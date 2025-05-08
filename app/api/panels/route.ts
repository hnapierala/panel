import { NextResponse } from "next/server"
import { panelsService } from "@/lib/supabase"

// GET /api/panels - pobieranie wszystkich paneli
export async function GET() {
  try {
    const panels = await panelsService.getPanels()
    return NextResponse.json(panels)
  } catch (error) {
    console.error("Błąd podczas pobierania paneli:", error)
    return NextResponse.json({ error: "Wystąpił błąd podczas pobierania paneli" }, { status: 500 })
  }
}

// POST /api/panels - dodawanie nowego panelu
export async function POST(request: Request) {
  try {
    const panel = await request.json()
    const newPanel = await panelsService.addPanel(panel)

    if (!newPanel) {
      return NextResponse.json({ error: "Nie udało się dodać panelu" }, { status: 400 })
    }

    return NextResponse.json(newPanel, { status: 201 })
  } catch (error) {
    console.error("Błąd podczas dodawania panelu:", error)
    return NextResponse.json({ error: "Wystąpił błąd podczas dodawania panelu" }, { status: 500 })
  }
}
