'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { LocationData, defaultLocationData } from '@/types/location';
import { MapPin, Wind, Calendar, ParkingCircle, Waves, Utensils, Search } from 'lucide-react';
import Map, { Marker, NavigationControl, GeolocateControl } from 'react-map-gl/maplibre';

// Direcciones del viento disponibles
const WIND_DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;

// Interfaz para resultados de búsqueda
interface SearchResult {
  place_name: string;
  center: [number, number];
}

export default function LocationForm() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LocationData>({
    defaultValues: defaultLocationData,
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
  
  // Estado para mostrar/ocultar el mapa
  const [showMap, setShowMap] = useState(false);

  // Observar cambios
  const latitude = watch('latitude');
  const longitude = watch('longitude');
  const bestWindDirections = watch('bestWindDirections');

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

  // Manejar toggle de direcciones de viento
  const toggleWindDirection = (direction: typeof WIND_DIRECTIONS[number]) => {
    const currentDirections = bestWindDirections || [];
    const newDirections = currentDirections.includes(direction)
      ? currentDirections.filter(d => d !== direction)
      : [...currentDirections, direction];
    
    setValue('bestWindDirections', newDirections);
  };

  // Manejar envío del formulario
  const onSubmit = (data: LocationData) => {
    console.log('Datos del formulario:', data);
    alert('Formulario enviado! Revisa la consola para ver los datos.');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto space-y-6 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Seleccionar Ubicación</h2>

      {/* Dirección del Servicio - OBLIGATORIO */}
      <div className="relative">
        <label htmlFor="address-search" className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="inline w-4 h-4 mr-1" />
          Dirección del Servicio *
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="address-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchResults.length > 0 && setShowResults(true)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Busca una dirección en República Dominicana..."
            required
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>

        {/* Resultados de búsqueda */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map((result, index) => (
              <button
                key={index}
                type="button"
                onClick={() => selectAddress(result)}
                className="w-full px-4 py-3 text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
              >
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 mr-2 mt-1 text-blue-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{result.place_name}</span>
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

      {/* Notas Adicionales - OPCIONAL */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
          Notas Adicionales (Opcional)
        </label>
        <textarea
          id="notes"
          {...register('notes')}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Información adicional sobre la ubicación, referencias, etc."
        />
      </div>

      {/* Pregunta para mostrar el mapa */}
      <div className="border-t pt-4">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={showMap}
            onChange={(e) => setShowMap(e.target.checked)}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">
            ¿Prefieres seleccionar en el mapa?
          </span>
        </label>
      </div>

      {/* Mapa - Solo se muestra si el checkbox está marcado */}
      {showMap && (
        <div className="space-y-2">
          <div className="h-96 w-full rounded-lg overflow-hidden border border-gray-300">
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
          <p className="text-xs text-gray-500">
            💡 Haz clic en el mapa para seleccionar una ubicación precisa
          </p>
        </div>
      )}

      <div className="flex justify-end space-x-4 pt-6 border-t">
        <button
          type="button"
          onClick={() => {
            setSearchQuery('');
            setValue('address', '');
            setValue('latitude', null);
            setValue('longitude', null);
            setMarkerPosition(null);
            setShowMap(false);
          }}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Confirmar Ubicación
        </button>
      </div>
    </form>
  );
}
