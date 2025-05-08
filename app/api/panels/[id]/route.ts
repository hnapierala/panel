import { NextResponse } from "next/server"
import { panelsService } from "@/lib/supabase"

// GET /api/panels/[id] - pobieranie pojedynczego panelu
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const panels = await panelsService.getPanels()
    const panel = panels.find((p) => p.id === params.id)

    if (!panel) {
      return NextResponse.json({ error: "Panel nie został znaleziony" }, { status: 404 })
    }

    return NextResponse.json(panel)
  } catch (error) {
    console.error("Błąd podczas pobierania panelu:", error)
    return NextResponse.json({ error: "Wystąpił błąd podczas pobierania panelu" }, { status: 500 })
  }
}

// PUT /api/panels/[id] - aktualizacja panelu
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const panel = await request.json()
    const success = await panelsService.updatePanel(params.id, panel)

    if (!success) {
      return NextResponse.json({ error: "Nie udało się zaktualizować panelu" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Błąd podczas aktualizacji panelu:", error)
    return NextResponse.json({ error: "Wystąpił błąd podczas aktualizacji panelu" }, { status: 500 })
  }
}

// DELETE /api/panels/[id] - usuwanie panelu
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const success = await panelsService.deletePanel(params.id)

    if (!success) {
      return NextResponse.json({ error: "Nie udało się usunąć panelu" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Błąd podczas usuwania panelu:", error)
    return NextResponse.json({ error: "Wystąpił błąd podczas usuwania panelu" }, { status: 500 })
  }
}
