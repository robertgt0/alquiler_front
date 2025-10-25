"use client"

import { useState, useCallback, useEffect } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import Map, { Marker } from "react-map-gl/maplibre"
import "maplibre-gl/dist/maplibre-gl.css"

interface InitialData {
  direccion?: string
  notas?: string
  lng?: number
  lat?: number
  longitude?: number
  latitude?: number
}

interface LocationFormProps {
  onSubmit: (location: { direccion: string; notas: string; lng?: number; lat?: number }) => void
  initialData?: InitialData
}

export default function LocationForm({ onSubmit, initialData }: LocationFormProps) {
  const [direccion, setDireccion] = useState(initialData?.direccion ?? "")
  const [notas, setNotas] = useState(initialData?.notas ?? "")
  const [marker, setMarker] = useState<{ lng: number; lat: number } | null>(() => {
    const lng = initialData?.lng ?? initialData?.longitude
    const lat = initialData?.lat ?? initialData?.latitude
    return lng != null && lat != null ? { lng, lat } : null
  })
  const [viewport, setViewport] = useState({
    longitude: (marker?.lng ?? -66.1568),
    latitude: (marker?.lat ?? -17.3895),
    zoom: 12,
  })

  const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY

  // Si cambia initialData después de montar, sincronizar estado
  useEffect(() => {
    if (!initialData) return
    const lng = initialData.lng ?? initialData.longitude
    const lat = initialData.lat ?? initialData.latitude

    if (initialData.direccion) setDireccion(initialData.direccion)
    if (initialData.notas) setNotas(initialData.notas)
    if (lng != null && lat != null) {
      setMarker({ lng, lat })
      setViewport(prev => ({ ...prev, longitude: lng, latitude: lat, zoom: 14 }))
    }
  }, [initialData])

  // condición para bloquear el submit si falta la ubicación
  const faltaUbicacion = !marker || !direccion

  const handleMapClick = useCallback(
    async (event: any) => {
      const { lng, lat } = event.lngLat
      setMarker({ lng, lat })
      setViewport(prev => ({ ...prev, longitude: lng, latitude: lat }))

      try {
        // Obtener dirección inversa (reverse geocoding)
        const response = await fetch(
          `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${apiKey}`
        )
        const data = await response.json()
        if (data.features && data.features.length > 0) {
          setDireccion(data.features[0].place_name)
        } else {
          setDireccion("Ubicación seleccionada (sin dirección exacta)")
        }
      } catch (error) {
        console.error("Error fetching address:", error)
      }
    },
    [apiKey]
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (faltaUbicacion) return
    onSubmit({
      direccion,
      notas,
      lng: marker?.lng,
      lat: marker?.lat,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 border-t pt-6 space-y-4 w-full">
      <h4 className="text-lg font-semibold text-gray-800">Detalles de la Ubicación</h4>

      {/* MAPA */}
      <div>
        <label className="block text-sm font-medium mb-1">Seleccionar Ubicación en el Mapa</label>
        <div className="border rounded-lg overflow-hidden" style={{ height: "400px" }}>
          <Map
            {...viewport}
            onMove={(evt) => setViewport(evt.viewState)}
            style={{ width: "100%", height: "100%" }}
            mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${apiKey}`}
            onClick={handleMapClick}
          >
            {marker && <Marker longitude={marker.lng} latitude={marker.lat} anchor="bottom" />}
          </Map>
        </div>
        <p className="text-xs text-gray-500 mt-1">Haz clic en el mapa para seleccionar la ubicación.</p>
        {faltaUbicacion && <p className="text-sm text-red-600 mt-2">Debes marcar una ubicación en el mapa para continuar.</p>}
      </div>

      {/* Dirección */}
      <div>
        <label className="block text-sm font-medium mb-1">Dirección del Servicio - (Marca en el mapa)</label>
        <Input type="text" value={direccion} placeholder="Selecciona una ubicación en el mapa" readOnly className="bg-gray-100 cursor-not-allowed" />
      </div>

      {/* Descripción breve */}
      <div>
        <label className="block text-sm font-medium mb-1">Descripción Breve (Opcional)</label>
        <Input type="text" placeholder="Ej: Edificio azul, segundo piso, apartamento 201" value={notas} onChange={(e) => setNotas(e.target.value)} />
      </div>

      {/* Botón de continuar */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={faltaUbicacion}
          aria-disabled={faltaUbicacion}
          className={`px-4 py-2 rounded-lg text-white ${faltaUbicacion ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          Continuar
        </Button>
      </div>
    </form>
  )
}