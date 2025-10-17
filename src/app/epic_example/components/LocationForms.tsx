"use client"

import { useState } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"

interface LocationFormProps {
  onSubmit: (location: { address: string; notes: string }) => void
}

export default function LocationForm({ onSubmit }: LocationFormProps) {
  const [address, setAddress] = useState("")
  const [notes, setNotes] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ address, notes })
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 border-t pt-6 space-y-4 w-full">
      <h4 className="text-lg font-semibold text-gray-800">
        Detalles de la Ubicación
      </h4>

      <div>
        <label className="block text-sm font-medium mb-1">Dirección del Servicio *</label>
        <Input
          type="text"
          placeholder="Ej: Av. Central #123, Col. Centro"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Notas Adicionales (Opcional)</label>
        // En src/components/LocationForms.tsx (cerca de la línea 357)
<Input
  type="text"
  placeholder="Ej: Edificio azul, segundo piso, apartamento 201"
  value={notes}
  onChange={(e) => setNotes(e.target.value)}
  // Añadir el límite aquí:
  maxLength={200}
/>
      </div>

      <div className="border rounded-lg p-4 text-center text-sm text-gray-600">
        <p>¿Prefieres seleccionar en el mapa?</p>
        <button
          type="button"
          className="text-blue-600 font-medium hover:underline mt-1"
        >
          Abrir Selector de Mapa
        </button>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Continuar
        </Button>
      </div>
    </form>
  )
}
