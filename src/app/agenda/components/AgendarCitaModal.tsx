"use client";
import { useState, useEffect } from "react";
import { Search, MapPin } from 'lucide-react';
import Map, { Marker, NavigationControl, GeolocateControl } from 'react-map-gl/maplibre';

interface SearchResult {
  place_name: string;
  center: [number, number];
}

export default function AgendarCitaModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    fecha: "",
    hora: "",
    direccion: "",
    latitude: 18.4861,
    longitude: -69.9312,
    details: "",
    notas: "",
  });
  
  // Estados para búsqueda y mapa
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [viewport, setViewport] = useState({
    latitude: 18.4861,
    longitude: -69.9312,
    zoom: 12,
  });
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);
  
  const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY || 'LhV4wKx4qmmZcU9D61C9';

  const handleChange = (field: string, value: string | number) => {
    setData({ ...data, [field]: value });
  };

  const canContinue = data.fecha && data.hora;
  
  // Actualizar marcador cuando cambian las coordenadas
  useEffect(() => {
    if (data.latitude && data.longitude) {
      setMarkerPosition({ lat: data.latitude, lng: data.longitude });
      setViewport(prev => ({
        ...prev,
        latitude: data.latitude,
        longitude: data.longitude,
      }));
    }
  }, [data.latitude, data.longitude]);
  
  // Búsqueda de direcciones con debounce
  useEffect(() => {
    const searchAddress = async (query: string) => {
      if (!query || query.length < 3) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(
          `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=${apiKey}&country=DO&limit=5`
        );
        const data = await response.json();
        console.log('Citas recibidas:', data);

        setSearchResults(data.features || []);
        setShowResults(true);
      } catch (error) {
        console.error('Error buscando dirección:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(() => {
      searchAddress(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, apiKey]);
  
  // Seleccionar dirección de los resultados
  const selectAddress = (result: SearchResult) => {
    const [lng, lat] = result.center;
    
    setData({ ...data, direccion: result.place_name, latitude: lat, longitude: lng });
    setSearchQuery(result.place_name);
    setShowResults(false);
    setMarkerPosition({ lat, lng });
    setViewport({
      latitude: lat,
      longitude: lng,
      zoom: 15,
    });
  };
  
  // Manejar clic en el mapa
  const handleMapClick = async (event: any) => {
    const { lng, lat } = event.lngLat;
    
    setData({ ...data, latitude: lat, longitude: lng });
    setMarkerPosition({ lat, lng });

    // Geocodificación inversa
    try {
      const response = await fetch(
        `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${apiKey}`
      );
      const data = await response.json();
      console.log('Citas recibidas:', data);

      if (data.features && data.features.length > 0) {
        const address = data.features[0].place_name;
        setData(prev => ({ ...prev, direccion: address }));
        setSearchQuery(address);
      }
    } catch (error) {
      console.error('Error en geocodificación inversa:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-3xl min-h-[70vh] max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6 border-b pb-3">
          <h2 className="text-2xl font-semibold text-gray-800">
            Agendar Cita
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl font-bold leading-none"
          >
            ×
          </button>
        </div>

        {/* PASO 1 — Calendario y hora */}
        <section>
          <p className="text-gray-600 mb-6">
            Elige la fecha y hora para tu consultoría (duración: 30 minutos)
          </p>
          <div className="border border-dashed border-gray-400 rounded-lg p-10 text-center text-gray-500">
            🗓️ <br />
            Calendario en construcción...
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Fecha
              </label>
              <input
                type="date"
                value={data.fecha}
                onChange={(e) => handleChange("fecha", e.target.value)}
                className="border border-gray-300 rounded-lg p-3 w-full focus:border-[#4289CC] focus:ring-[#4289CC]"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Hora
              </label>
              <input
                type="time"
                value={data.hora}
                onChange={(e) => handleChange("hora", e.target.value)}
                className="border border-gray-300 rounded-lg p-3 w-full focus:border-[#4289CC] focus:ring-[#4289CC]"
              />
            </div>
          </div>
        </section>

        {/* PASO 2 — Formulario de ubicación (se muestra debajo cuando se elige fecha/hora) */}
        {canContinue && step === 1 && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2 bg-[#4289CC] text-white rounded-lg hover:bg-blue-700 transition transition transform hover:scale-105 duration-300 font-medium"
            >
              Continuar
            </button>
          </div>
        )}

        {step === 2 && (
          <section className="mt-8 border-t border-gray-200 pt-6">
            <div className="border border-gray-300 rounded-lg p-5 shadow-lg flex flex-col justify-between h-full">
                <h2 className="text-2x1 font-semibold mb-2">
                    Detalles de la ubicación
                </h2>
                <p className="text-gray-600 mb-6">
                    Especifica dónde se realizará el servicio (campo obligatorio)
                </p>
                <div className="space-y-7">
                
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
                
                {/* Mapa de Maptiler */}
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
                    value={data.details}
                    onChange={(e) => handleChange("details", e.target.value)}
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
                    value={data.notas}
                    onChange={(e) => handleChange("notas", e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none text-gray-900 placeholder-gray-400 transition-all hover:border-gray-300"
                    placeholder="¿Algo más que debamos saber? Referencias, instrucciones especiales, etc."
                  />
                </div>
                </div>

                {/* BOTONES */}
                <div className="mt-6 flex justify-between border-t border-gray-200 pt-4">
                <button
                    onClick={() => setStep(1)}
                    className="text-gray-600 hover:text-blue-600 transition transform hover:scale-105 duration-300 font-medium"
                >
                    Volver
                </button>
                <button
                    onClick={() => setStep(3)}
                    className="px-6 py-2 bg-[#4289CC] text-white rounded-lg hover:bg-blue-700 transition transition transform hover:scale-105 duration-300 font-medium"
                >
                    Continuar
                </button>
                </div>
            </div>
            
          </section>
        )}

        {/* PASO 3 — Resumen de la cita (debajo del calendario, ocultando el paso 2) */}
        {step === 3 && (
          <section className="mt-8 border-t border-gray-200 pt-6">
            <div className="border border-gray-300 rounded-lg p-5 shadow-md flex flex-col justify-between h-full bg-white">
                <h2 className="text-2x1 font-semibold mb-2 text-gray-800">
                    Resumen de la cita
                </h2>

                <div className="space-y-4 text-gray-800">
                <div className="flex justify-between">
                    <span className="font-medium">📅 Fecha:</span>
                    <span>{data.fecha}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">⏰ Hora:</span>
                    <span>{data.hora}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">📍 Dirección:</span>
                    <span className="text-right max-w-[70%] truncate">
                    {data.direccion || 'No especificada'}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">🏠 Detalles:</span>
                    <span className="text-right max-w-[70%]">
                    {data.details || 'No especificados'}
                    </span>
                </div>
                {data.notas && (
                    <div className="flex justify-between">
                    <span className="font-medium">📝 Notas:</span>
                    <span className="text-right max-w-[70%]">
                        {data.notas}
                    </span>
                    </div>
                )}
                </div>

                {/* BOTONES */}
                <div className="mt-6 flex justify-between border-t border-gray-200 pt-4">
                <button
                    onClick={() => setStep(2)}
                    className="text-gray-600 hover:text-blue-600 transition transform hover:scale-105 duration-300 font-medium"
                >
                    Volver
                </button>
                <button
                    onClick={() => alert("✅ Cita confirmada (guardar en BD)")}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition transition transform hover:scale-105 duration-300 font-medium"
                >
                    Confirmar Cita
                </button>
                </div>
            </div>

            
          </section>
        )}
      </div>
    </div>
  );
}
