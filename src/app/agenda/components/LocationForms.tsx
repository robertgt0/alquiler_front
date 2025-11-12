"use client"

import { useEffect, useState, useCallback } from "react"
import { Map, Marker } from "react-map-gl/maplibre"
import { Input } from "./ui/input"
import { Button } from "./ui/button"

interface InitialData {
  direccion?: string
  notas?: string
  lng?: number
  lat?: number
}

interface LocationFormProps {
  onSubmit: (location: { direccion: string; notas: string; lng: number; lat: number }) => void
  initialData?: InitialData
}

const defaultCenter = { lat: -17.3895, lng: -66.1568 } // Cochabamba

export default function LocationForm({ onSubmit, initialData }: LocationFormProps) {
  const [direccion, setDireccion] = useState(initialData?.direccion ?? "")
  const [notas, setNotas] = useState(initialData?.notas ?? "")
  const [marker, setMarker] = useState<{ lat: number; lng: number }>({
    lat: initialData?.lat ?? defaultCenter.lat,
    lng: initialData?.lng ?? defaultCenter.lng,
  })

  const [viewState, setViewState] = useState({
    longitude: marker.lng,
    latitude: marker.lat,
    zoom: 13,
  })

  // Buscar coordenadas al escribir dirección
  const handleSearch = useCallback(async () => {
    if (!direccion) return
    try {
      const resp = await fetch(
        `https://us1.locationiq.com/v1/search?key=${process.env.NEXT_PUBLIC_LOCATIONIQ_KEY}&q=${encodeURIComponent(
          direccion
        )}&format=json`
      )
      const data = await resp.json()
      if (data && data[0]) {
        const lat = parseFloat(data[0].lat)
        const lng = parseFloat(data[0].lon)
        setMarker({ lat, lng })
        setViewState({ longitude: lng, latitude: lat, zoom: 15 })
      } else {
        alert("No se encontró la dirección. Intenta con más detalles.")
      }
    } catch (err) {
      console.error("Error al buscar dirección:", err)
    }
  }, [direccion])

  // Obtener dirección inversa al hacer clic en el mapa
  const handleMapClick = useCallback(async (e: any) => {
    const lat = e.lngLat.lat
    const lng = e.lngLat.lng
    setMarker({ lat, lng })

    try {
      const resp = await fetch(
        `https://us1.locationiq.com/v1/reverse?key=${process.env.NEXT_PUBLIC_LOCATIONIQ_KEY}&lat=${lat}&lon=${lng}&format=json`
      )
      const data = await resp.json()
      if (data && data.display_name) setDireccion(data.display_name)
    } catch (err) {
      console.error("Error al obtener dirección inversa:", err)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!direccion || !marker) return
    onSubmit({ direccion, notas, lng: marker.lng, lat: marker.lat })
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 border-t pt-6 space-y-4 w-full">
      <h4 className="text-lg font-semibold text-gray-800">Detalles de la Ubicación</h4>

      {/* Campo de búsqueda */}
      <div>
        <label className="block text-sm font-medium mb-1">Buscar dirección</label>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Ej: Av. Blanco Galindo 123, Cochabamba"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            className="bg-white flex-1"
          />
          <Button type="button" onClick={handleSearch}>
            Buscar
          </Button>
        </div>
      </div>

      {/* Mapa */}
      <div className="border rounded-lg overflow-hidden" style={{ height: "400px" }}>
        <Map
          mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`}
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          onClick={handleMapClick}
          style={{ width: "100%", height: "100%" }}
        >
          <Marker latitude={marker.lat} longitude={marker.lng} color="red" />
        </Map>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Haz clic en el mapa o busca la dirección para colocar el marcador.
      </p>

      {/* Notas */}
      <div>
        <label className="block text-sm font-medium mb-1">Notas (opcional)</label>
        <Input
          type="text"
          placeholder="Ej: Edificio azul, piso 2, oficina 3B"
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
        />
      </div>

      {/* Botón */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={!direccion}
          className={`px-4 py-2 rounded-lg text-white ${
            !direccion ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Continuar
        </Button>
      </div>
    </form>
  )
}
