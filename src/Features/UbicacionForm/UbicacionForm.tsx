'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { MapPin, Search } from 'lucide-react';
import Map, { Marker, NavigationControl, GeolocateControl } from 'react-map-gl/maplibre';

interface LocationFormData {
  address: string;
  latitude: number | null;
  longitude: number | null;
  details: string;
  notes: string;
}

interface SearchResult {
  place_name: string;
  center: [number, number];
}

export default function UbicacionForm() {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<LocationFormData>({
    defaultValues: {
      address: '',
      latitude: null,
      longitude: null,
      details: '',
      notes: '',
    },
  });

  const [viewport, setViewport] = useState({
    latitude: 18.4861,
    longitude: -69.9312,
    zoom: 12,
  });

  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const latitude = watch('latitude');
  const longitude = watch('longitude');

  const apiKey = process.env.NEXT_PUBLIC_LOCATIONIQ_KEY || '';

  // Sincronizar marcador con coordenadas
  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      setMarkerPosition({ lat: latitude, lng: longitude });
      setViewport(prev => ({ ...prev, latitude, longitude }));
    }
  }, [latitude, longitude]);

  // Buscar direcciones (debounce)
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!searchQuery || searchQuery.length < 3) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const resp = await fetch(
          `https://us1.locationiq.com/v1/search?key=${apiKey}&q=${encodeURIComponent(searchQuery)}&format=json&limit=5`
        );
        const data = await resp.json();
        setSearchResults(data || []);
        setShowResults(true);
      } catch (err) {
        console.error('Error buscando dirección:', err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, apiKey]);

  const selectAddress = (result: SearchResult) => {
    const [lng, lat] = result.center;
    setValue('address', result.place_name);
    setValue('latitude', lat);
    setValue('longitude', lng);
    setSearchQuery(result.place_name);
    setShowResults(false);
    setMarkerPosition({ lat, lng });
    setViewport({ latitude: lat, longitude: lng, zoom: 15 });
  };

  const handleMapClick = async (e: any) => {
    const { lng, lat } = e.lngLat;
    setValue('latitude', lat);
    setValue('longitude', lng);
    setMarkerPosition({ lat, lng });

    try {
      const resp = await fetch(
        `https://us1.locationiq.com/v1/reverse?key=${apiKey}&lat=${lat}&lon=${lng}&format=json`
      );
      const data = await resp.json();
      if (data && data.display_name) {
        setValue('address', data.display_name);
        setSearchQuery(data.display_name);
      }
    } catch (err) {
      console.error('Error geocodificando:', err);
    }
  };

  const onSubmit = (data: LocationFormData) => {
    console.log('Datos enviados:', data);
    alert('Formulario enviado! Revisa la consola.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-7 text-white">
          <h1 className="text-3xl font-bold">Ubicación del Servicio</h1>
          <p className="mt-2 text-blue-100">Especifica dónde se realizará el servicio</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          {/* Búsqueda de dirección */}
          <div className="relative">
            <label className="block text-sm font-semibold mb-2.5">
              📍 Dirección del Servicio
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowResults(true)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                placeholder="Busca tu dirección..."
                required
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>

            {showResults && searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
                {searchResults.map((res, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => selectAddress(res)}
                    className="w-full px-5 py-3 text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                  >
                    {res.place_name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <input type="hidden" {...register('address', { required: true })} />
          <input type="hidden" {...register('latitude')} />
          <input type="hidden" {...register('longitude')} />

          {/* Mapa */}
          <div>
            <label className="block text-sm font-semibold mb-2.5">🗺️ Selecciona en el mapa</label>
            <div className="h-96 w-full rounded-xl overflow-hidden border-2 border-gray-200 shadow-md">
              <Map
                {...viewport}
                onMove={(evt: any) => setViewport(evt.viewState)}
                onClick={handleMapClick}
                mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`}
                style={{ width: '100%', height: '100%' }}
              >
                <NavigationControl position="top-right" />
                <GeolocateControl position="top-right" />
                {markerPosition && (
                  <Marker latitude={markerPosition.lat} longitude={markerPosition.lng} anchor="bottom">
                    <MapPin className="w-8 h-8 text-blue-500 fill-blue-500 drop-shadow-lg" />
                  </Marker>
                )}
              </Map>
            </div>
          </div>

          {/* Detalles */}
          <div>
            <label className="block text-sm font-semibold mb-2.5">🏠 Detalles de Ubicación</label>
            <textarea
              {...register('details', { required: true })}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none"
              placeholder="Ej: Edificio Torre Azul, Apartamento 5B"
            />
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-semibold mb-2.5">📝 Notas Adicionales</label>
            <textarea
              {...register('notes')}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none"
              placeholder="Referencias o instrucciones especiales"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4 pt-6 border-t-2 border-gray-100">
            <button
              type="reset"
              className="px-8 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 font-semibold shadow-lg"
            >
              Confirmar Ubicación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
