"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { SolarPanel } from "@/lib/api-types"

interface PanelDetailProps {
  panel: SolarPanel
  onUpdate: (panel: SolarPanel) => void
  onSave: () => void
}

export default function PanelDetail({ panel, onUpdate, onSave }: PanelDetailProps) {
  const [editedPanel, setEditedPanel] = useState<SolarPanel>({ ...panel })

  // Aktualizuj stan, gdy zmienia się wybrany panel
  useEffect(() => {
    setEditedPanel({ ...panel })
  }, [panel])

  // Obsługa zmiany pola
  const handleChange = (field: keyof SolarPanel, value: string | number) => {
    setEditedPanel({
      ...editedPanel,
      [field]: value,
    })

    // Aktualizuj panel w komponencie nadrzędnym
    onUpdate({
      ...editedPanel,
      [field]: value,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Szczegóły panelu</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nazwa panelu</Label>
            <Input id="name" value={editedPanel.name} onChange={(e) => handleChange("name", e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="manufacturer">Producent</Label>
            <Input
              id="manufacturer"
              value={editedPanel.manufacturer}
              onChange={(e) => handleChange("manufacturer", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="power">Moc [W]</Label>
            <Input
              id="power"
              type="number"
              value={editedPanel.power}
              onChange={(e) => handleChange("power", Number.parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Cena [zł]</Label>
            <Input
              id="price"
              type="number"
              value={editedPanel.price}
              onChange={(e) => handleChange("price", Number.parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="efficiency">Wydajność [%]</Label>
            <Input
              id="efficiency"
              type="number"
              step="0.1"
              value={editedPanel.efficiency}
              onChange={(e) => handleChange("efficiency", Number.parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="warranty">Gwarancja [lata]</Label>
            <Input
              id="warranty"
              type="number"
              value={editedPanel.warranty}
              onChange={(e) => handleChange("warranty", Number.parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dimensions">Wymiary [mm]</Label>
            <Input
              id="dimensions"
              value={editedPanel.dimensions}
              onChange={(e) => handleChange("dimensions", e.target.value)}
              placeholder="np. 1700x1000x35"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Waga [kg]</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              value={editedPanel.weight}
              onChange={(e) => handleChange("weight", Number.parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Typ</Label>
            <Input
              id="type"
              value={editedPanel.type}
              onChange={(e) => handleChange("type", e.target.value)}
              placeholder="np. Monokrystaliczny"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
