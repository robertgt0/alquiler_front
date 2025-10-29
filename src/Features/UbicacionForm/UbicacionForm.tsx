'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { MapPin, Search } from 'lucide-react';
import Map, { Marker, NavigationControl, GeolocateControl } from 'react-map-gl/maplibre';

// Interfaz para datos de ubicación
interface LocationFormData {
  address: string;
  latitude: number | null;
  longitude: number | null;
  details: string;
  notes: string;
}

// Interfaz para resultados de búsqueda
interface SearchResult {
  place_name: string;
  center: [number, number];
}

export default function UbicacionForm() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LocationFormData>({
    defaultValues: {
      address: '',
      latitude: null,
      longitude: null,
      details: '',
      notes: '',
    },
  });

  // Estados para el mapa
  const [viewport, setViewport] = useState({
    latitude: 18.4861,
    longitude: -69.9312,
    zoom: 12,
  });
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);
  
  // Estados para búsqueda de direcciones
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Observar cambios
  const latitude = watch('latitude');
  const longitude = watch('longitude');

  const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY || 'LhV4wKx4qmmZcU9D61C9';

  // Actualizar marcador cuando cambian las coordenadas
  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      setMarkerPosition({ lat: latitude, lng: longitude });
      setViewport(prev => ({
        ...prev,
        latitude,
        longitude,
      }));
    }
  }, [latitude, longitude]);

  // Debounce para la búsqueda
  useEffect(() => {
    // Buscar direcciones usando Maptiler Geocoding API
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

  // Seleccionar una dirección de los resultados
  const selectAddress = (result: SearchResult) => {
    const [lng, lat] = result.center;
    
    setValue('address', result.place_name);
    setValue('latitude', lat);
    setValue('longitude', lng);
    
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
    
    setValue('latitude', lat);
    setValue('longitude', lng);
    setMarkerPosition({ lat, lng });

    // Geocodificación inversa para obtener la dirección
    try {
      const response = await fetch(
        `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${apiKey}`
      );
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const address = data.features[0].place_name;
        setValue('address', address);
        setSearchQuery(address);
      }
    } catch (error) {
      console.error('Error en geocodificación inversa:', error);
    }
  };

  const onSubmit = async (data: LocationFormData) => {
    try {
      const citaPayload = {
        proveedorId: "671a8c97a59ab8b9c12f0012", // <-- Hardcode temporal para pruebas
        servicioId: "671a8ca9a59ab8b9c12f0013",  // <-- Igual
        fecha: "2025-10-25", // <-- Puedes hacerlo dinámico si ya tienes fecha seleccionada
        horario: {
          inicio: "10:00",
          fin: "10:30",
        },
        ubicacion: {
          lat: data.latitude,
          lng: data.longitude,
        },
        estado: "pendiente",
      };

      const response = await fetch("http://localhost:5000/api/devcode/citas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(citaPayload),
      });

      if (!response.ok) {
        throw new Error("Error al crear la cita");
      }

      const result = await response.json();
      console.log("✅ Cita creada:", result);
      alert("Cita creada correctamente");
    } catch (error) {
      console.error("❌ Error:", error);
      alert("Error al crear la cita");
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-gray-50 to-blue-50">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-7">
          <h1 className="text-3xl font-bold text-white">Ubicación del Servicio</h1>
          <p className="text-blue-50 mt-2">Especifica dónde se realizará el servicio</p>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-7">
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

          {/* Campo oculto para dirección */}
          <input type="hidden" {...register('address', { required: 'La dirección es obligatoria' })} />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
          )}

          {/* Campos ocultos para coordenadas */}
          <input type="hidden" {...register('latitude')} />
          <input type="hidden" {...register('longitude')} />

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
              {...register('details', { required: 'Los detalles de ubicación son obligatorios' })}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none text-gray-900 placeholder-gray-400 transition-all hover:border-gray-300"
              placeholder="Ej: Edificio Torre Azul, Apartamento 5B, 3er piso"
            />
            {errors.details && (
              <p className="mt-1 text-sm text-red-600">{errors.details.message}</p>
            )}
          </div>

          {/* Notas Adicionales */}
          <div>
            <label htmlFor="notes" className="block text-sm font-semibold text-gray-800 mb-2.5">
              📝 Notas Adicionales <span className="text-xs text-gray-500 font-normal">(Opcional)</span>
            </label>
            <textarea
              id="notes"
              {...register('notes')}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none text-gray-900 placeholder-gray-400 transition-all hover:border-gray-300"
              placeholder="¿Algo más que debamos saber? Referencias, instrucciones especiales, etc."
            />
          </div>

          {/* Botón de Envío */}
          <div className="flex justify-end gap-4 pt-6 border-t-2 border-gray-100">
            <button
              type="button"
              className="px-8 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all font-semibold shadow-lg hover:shadow-xl"
            >
              Confirmar Ubicación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
