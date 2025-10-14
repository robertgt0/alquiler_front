"use client"

import { useState, useEffect } from "react"
import { Calendar } from "../components/ui/calendar"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog"
import { cn } from "@/lib/utils"
import { Search, MapPin } from 'lucide-react'
import Map, { Marker, NavigationControl, GeolocateControl } from 'react-map-gl/maplibre'

interface SearchResult {
  place_name: string;
  center: [number, number];
}

interface AppointmentModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    patientName?: string
}

const TIME_SLOTS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]

// Estados de las citas
const APPOINTMENT_STATES = {
    unavailable: { label: "No disponible", color: "bg-gray-300" },
    holiday: { label: "Festivo", color: "bg-red-300" },
    scheduled: { label: "Programada", color: "bg-blue-300" },
    inProgress: { label: "En proceso", color: "bg-blue-500" },
    completed: { label: "Concluido", color: "bg-blue-600" },
}

export function AppointmentModal({ open, onOpenChange, patientName = "Juan Pérez" }: AppointmentModalProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [dateInput, setDateInput] = useState("")
    const [step, setStep] = useState(1) // 1: calendario, 2: ubicación
    
    // Estados para ubicación
    const [locationData, setLocationData] = useState({
        direccion: "",
        latitude: 18.4861,
        longitude: -69.9312,
        details: "",
        notas: "",
    })
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState<SearchResult[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const [viewport, setViewport] = useState({
        latitude: 18.4861,
        longitude: -69.9312,
        zoom: 12,
    })
    const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null)
    
    const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY || 'LhV4wKx4qmmZcU9D61C9'

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date)
        if (date) {
            const formatted = date.toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            })
            setDateInput(formatted)
        }
    }

    const handleSearch = () => {
        console.log("Buscando disponibilidad para:", dateInput)
    }

    const handleToday = () => {
        const today = new Date()
        setSelectedDate(today)
        handleDateSelect(today)
    }

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time)
    }

    const handleContinueToLocation = () => {
        if (selectedDate && selectedTime) {
            setStep(2)
        }
    }
    
    const handleConfirm = () => {
        alert(`Cita confirmada:\nFecha: ${selectedDate?.toLocaleDateString("es-ES")}\nHora: ${selectedTime}\nDirección: ${locationData.direccion}\nDetalles: ${locationData.details}`)
        onOpenChange(false)
        // Reset
        setStep(1)
        setSelectedTime(null)
        setLocationData({ direccion: "", latitude: 18.4861, longitude: -69.9312, details: "", notas: "" })
        setSearchQuery("")
    }

    const handleCancel = () => {
        setSelectedTime(null)
    }

    const formatDateForSummary = (date: Date) => {
        return date.toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        })
    }
    
    // Búsqueda de direcciones con debounce
    useEffect(() => {
        const searchAddress = async (query: string) => {
            if (!query || query.length < 3) {
                setSearchResults([])
                return
            }

            setIsSearching(true)
            try {
                const response = await fetch(
                    `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=${apiKey}&country=DO&limit=5`
                )
                const data = await response.json()
                setSearchResults(data.features || [])
                setShowResults(true)
            } catch (error) {
                console.error('Error buscando dirección:', error)
                setSearchResults([])
            } finally {
                setIsSearching(false)
            }
        }

        const timer = setTimeout(() => {
            searchAddress(searchQuery)
        }, 500)

        return () => clearTimeout(timer)
    }, [searchQuery, apiKey])
    
    // Actualizar marcador cuando cambian las coordenadas
    useEffect(() => {
        if (locationData.latitude && locationData.longitude) {
            setMarkerPosition({ lat: locationData.latitude, lng: locationData.longitude })
            setViewport(prev => ({
                ...prev,
                latitude: locationData.latitude,
                longitude: locationData.longitude,
            }))
        }
    }, [locationData.latitude, locationData.longitude])
    
    // Seleccionar dirección de los resultados
    const selectAddress = (result: SearchResult) => {
        const [lng, lat] = result.center
        
        setLocationData({ ...locationData, direccion: result.place_name, latitude: lat, longitude: lng })
        setSearchQuery(result.place_name)
        setShowResults(false)
        setMarkerPosition({ lat, lng })
        setViewport({
            latitude: lat,
            longitude: lng,
            zoom: 15,
        })
    }
    
    // Manejar clic en el mapa
    const handleMapClick = async (event: any) => {
        const { lng, lat } = event.lngLat
        
        setLocationData({ ...locationData, latitude: lat, longitude: lng })
        setMarkerPosition({ lat, lng })

        // Geocodificación inversa
        try {
            const response = await fetch(
                `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${apiKey}`
            )
            const data = await response.json()
            if (data.features && data.features.length > 0) {
                const address = data.features[0].place_name
                setLocationData(prev => ({ ...prev, direccion: address }))
                setSearchQuery(address)
            }
        } catch (error) {
            console.error('Error en geocodificación inversa:', error)
        }
    }

    return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="!w-[80vw] !max-w-none !sm:max-w-none bg-white rounded-xl shadow-2xl overflow-x-auto max-h-[90vh] overflow-y-auto p-0">
            {/* Header */}
            <DialogHeader className="p-6 border-b">
                <DialogTitle className="text-2xl font-bold text-gray-800">
                    Agendar Cita - {patientName}
                </DialogTitle>
            </DialogHeader>

            {/* Content */}
            <div className="p-6">
                {step === 1 && (
                <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Calendario */}
                    <div>
                        <Calendar
                        
                           mode="single"
                            selected={selectedDate}
                            onSelect={handleDateSelect}
                            className="w-full"
                            captionLayout="dropdown-months"
       
                        />



                        {/* Leyenda */}
                        <div className="mt-4 text-xs space-y-2">
                            {Object.entries(APPOINTMENT_STATES).map(([key, state]) => (
                                <div key={key} className="flex items-center space-x-2">
                                    <div className={cn("w-4 h-4 rounded", state.color)} />
                                    <span>{state.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Horarios */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">
                            Horarios disponibles
                            {selectedDate && (
                                <span className="text-sm font-normal text-gray-500 ml-2">
                                    - {formatDateForSummary(selectedDate)}
                                </span>
                            )}
                        </h4>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {TIME_SLOTS.map((time) => (
                                <button
                                    key={time}
                                    onClick={() => handleTimeSelect(time)}
                                    className={cn(
                                        "w-full p-3 text-left rounded-lg border transition-colors",
                                        selectedTime === time
                                            ? "bg-blue-500 text-white border-blue-600"
                                            : "bg-white hover:bg-green-50 text-gray-700 border-gray-300"
                                    )}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Información de la cita seleccionada */}
                {selectedDate && selectedTime && (
                    <div className="mt-6 p-4 rounded-lg border" style={{ backgroundColor: "#f0f4f8", borderColor: "#94B1CC" }}>
                        <h4 className="font-semibold mb-2" style={{ color: "#226CCC" }}>Resumen de la cita</h4>
                        <div className="text-sm space-y-1" style={{ color: "#4289CC" }}>
                            <p><strong>Servicio:</strong> Reparación de Plomería</p>
                            <p><strong>Proveedor:</strong> {patientName}</p>
                            <p><strong>Fecha:</strong> {formatDateForSummary(selectedDate)}</p>
                            <p><strong>Hora:</strong> {selectedTime}</p>
                            <p><strong>Costo:</strong> $50/hora + materiales</p>
                        </div>
                        <div className="mt-4 flex space-x-3">
                            <Button
                                onClick={handleContinueToLocation}
                                className="text-white px-6 py-2 rounded-lg font-medium flex-1"
                                style={{ backgroundColor: "#226CCC" }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#4289CC"}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#226CCC"}
                            >
                                Continuar →
                            </Button>
                            <Button
                                onClick={handleCancel}
                                className="px-6 py-2 rounded-lg font-medium flex-1"
                                style={{ backgroundColor: "#94B1CC", color: "#374151" }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = "#4289CC"
                                    e.currentTarget.style.color = "white"
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = "#94B1CC"
                                    e.currentTarget.style.color = "#374151"
                                }}
                            >
                                Cancelar
                            </Button>
                        </div>
                    </div>
                )}
                </>
                )}
                
                {/* PASO 2: Formulario de Ubicación */}
                {step === 2 && (
                    <div className="space-y-6">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-800">
                                <strong>Cita seleccionada:</strong> {formatDateForSummary(selectedDate!)} a las {selectedTime}
                            </p>
                        </div>
                        
                        {/* Búsqueda de Dirección */}
                        <div className="relative">
                            <label htmlFor="address-search" className="block text-sm font-semibold text-gray-800 mb-2.5">
                                📍 Dirección del Servicio
                            </label>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                                <input
                                    id="address-search"
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => searchResults.length > 0 && setShowResults(true)}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-900 placeholder-gray-400 transition-all hover:border-gray-300"
                                    placeholder="Busca tu dirección aquí..."
                                />
                                {isSearching && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                                    </div>
                                )}
                            </div>

                            {/* Resultados de búsqueda */}
                            {showResults && searchResults.length > 0 && (
                                <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-64 overflow-y-auto">
                                    {searchResults.map((result, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => selectAddress(result)}
                                            className="w-full px-5 py-3.5 text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-all"
                                        >
                                            <div className="flex items-start">
                                                <MapPin className="w-5 h-5 mr-3 mt-0.5 text-blue-500 flex-shrink-0" />
                                                <span className="text-sm text-gray-800">{result.place_name}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {/* Mapa */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2.5">
                                🗺️ Selecciona la ubicación en el mapa
                            </label>
                            <div className="h-96 w-full rounded-xl overflow-hidden border-2 border-gray-200 shadow-md">
                                <Map
                                    {...viewport}
                                    onMove={(evt: any) => setViewport(evt.viewState)}
                                    onClick={handleMapClick}
                                    mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`}
                                    style={{ width: '100%', height: '100%' }}
                                >
                                    <NavigationControl position="top-right" />
                                    <GeolocateControl position="top-right" />
                                    
                                    {markerPosition && (
                                        <Marker
                                            latitude={markerPosition.lat}
                                            longitude={markerPosition.lng}
                                            anchor="bottom"
                                        >
                                            <div className="relative">
                                                <MapPin className="w-8 h-8 text-blue-500 fill-blue-500 drop-shadow-lg" />
                                            </div>
                                        </Marker>
                                    )}
                                </Map>
                            </div>
                            <div className="mt-3 bg-blue-50 border border-blue-100 rounded-lg p-3">
                                <p className="text-sm text-gray-700">
                                    💡 <span className="font-medium">Tip:</span> Haz clic en el mapa para ajustar la ubicación exacta
                                </p>
                            </div>
                        </div>
                        
                        {/* Detalles de Ubicación */}
                        <div>
                            <label htmlFor="details" className="block text-sm font-semibold text-gray-800 mb-2.5">
                                🏠 Detalles de Ubicación
                            </label>
                            <textarea
                                id="details"
                                value={locationData.details}
                                onChange={(e) => setLocationData({ ...locationData, details: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none text-gray-900 placeholder-gray-400 transition-all hover:border-gray-300"
                                placeholder="Ej: Edificio Torre Azul, Apartamento 5B, 3er piso"
                            />
                        </div>
                        
                        {/* Notas Adicionales */}
                        <div>
                            <label htmlFor="notas" className="block text-sm font-semibold text-gray-800 mb-2.5">
                                📝 Notas Adicionales <span className="text-xs text-gray-500 font-normal">(Opcional)</span>
                            </label>
                            <textarea
                                id="notas"
                                value={locationData.notas}
                                onChange={(e) => setLocationData({ ...locationData, notas: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none text-gray-900 placeholder-gray-400 transition-all hover:border-gray-300"
                                placeholder="¿Algo más que debamos saber? Referencias, instrucciones especiales, etc."
                            />
                        </div>
                        
                        {/* Botones */}
                        <div className="flex space-x-3 pt-4 border-t">
                            <Button
                                onClick={() => setStep(1)}
                                className="px-6 py-2 rounded-lg font-medium flex-1"
                                style={{ backgroundColor: "#94B1CC", color: "#374151" }}
                            >
                                ← Volver
                            </Button>
                            <Button
                                onClick={handleConfirm}
                                className="text-white px-6 py-2 rounded-lg font-medium flex-1"
                                style={{ backgroundColor: "#226CCC" }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#4289CC"}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#226CCC"}
                            >
                                Confirmar Cita
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </DialogContent>
    </Dialog>
)
}