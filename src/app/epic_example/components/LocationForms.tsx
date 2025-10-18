"use client"

import { useState, useCallback } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import Map, { Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

interface LocationFormProps {
  onSubmit: (location: { direccion: string; notas: string; lng?: number; lat?: number }) => void
}

export default function LocationForm({ onSubmit }: LocationFormProps) {
  const [direccion, setDireccion] = useState("")
  const [notas, setNotas] = useState("")
  const [marker, setMarker] = useState<{ lng: number; lat: number } | null>(null)
  const [viewport, setViewport] = useState({
    longitude: -99.1332, // Default to Mexico City or something
    latitude: 19.4326,
    zoom: 10,
  })

  const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY

  const handleMapClick = useCallback(async (event: any) => {
    const { lng, lat } = event.lngLat
    setMarker({ lng, lat })
    // Reverse geocode to get address
    try {
      const response = await fetch(`https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${apiKey}`)
      const data = await response.json()
      if (data.features && data.features.length > 0) {
        setDireccion(data.features[0].place_name)
      }
    } catch (error) {
      console.error('Error fetching address:', error)
    }
  }, [apiKey])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ 
      direccion, 
      notas, 
      lng: marker?.lng, 
      lat: marker?.lat 
    })
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
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Descripción Breve (Opcional)</label>
        <Input
          type="text"
          placeholder="Ej: Edificio azul, segundo piso, apartamento 201"
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Seleccionar Ubicación en el Mapa</label>
        <div className="border rounded-lg overflow-hidden" style={{ height: '400px' }}>
          <Map
            {...viewport}
            onMove={(evt) => setViewport(evt.viewState)}
            style={{ width: '100%', height: '100%' }}
            mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${apiKey}`}
            onClick={handleMapClick}
          >
            {marker && (
              <Marker longitude={marker.lng} latitude={marker.lat} />
            )}
          </Map>
        </div>
        <p className="text-xs text-gray-500 mt-1">Haz clic en el mapa para seleccionar la ubicación.</p>
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
