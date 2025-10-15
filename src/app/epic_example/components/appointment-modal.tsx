"use client";

import { useEffect, useState } from "react";
import { Calendar } from "@/app/epic_example/components/ui/calendar";
import { Button } from "@/app/epic_example/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/epic_example/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Search, MapPin } from "lucide-react";
import Map, { Marker, NavigationControl, GeolocateControl } from "react-map-gl/maplibre";

type UISlot = { label: string; startISO: string; endISO: string };

interface SearchResult {
  place_name: string;
  center: [number, number];
}

interface AppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientName?: string;
  providerId: string;   // Proveedor existente en tu DB
  clienteId: string;    // Cliente existente en tu DB
  slotMinutes?: number; // Tamaño de bloque
  hours?: string;       // "08:00-12:00,14:00-18:00"
}

const APPOINTMENT_STATES = {
  unavailable: { label: "No disponible", color: "bg-gray-300" },
  holiday: { label: "Festivo", color: "bg-red-300" },
  scheduled: { label: "Programada", color: "bg-blue-300" },
  inProgress: { label: "En proceso", color: "bg-blue-500" },
  completed: { label: "Concluido", color: "bg-blue-600" },
};

const toYYYYMMDD = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function AppointmentModal({
  open,
  onOpenChange,
  patientName = "Juan Pérez",
  providerId,
  clienteId,
  slotMinutes = 30,
  hours = "08:00-12:00,14:00-18:00",
}: AppointmentModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<UISlot | null>(null);
  const [step, setStep] = useState<1 | 2>(1);

  // disponibilidad
  const [availableSlots, setAvailableSlots] = useState<UISlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  // ubicación
  const [locationData, setLocationData] = useState({
    direccion: "",
    latitude: 18.4861,
    longitude: -69.9312,
    details: "",
    notas: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [viewport, setViewport] = useState({ latitude: 18.4861, longitude: -69.9312, zoom: 12 });
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL; // ej: http://localhost:5000
  const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY || "LhV4wKx4qmmZcU9D61C9";
  const [saving, setSaving] = useState(false);

  const formatDateForSummary = (date: Date) =>
    date.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  // ==== Carga de disponibilidad (sin textos de debug) ====
  async function loadAvailable(date: Date) {
    if (!date || !providerId) return;
    if (!API_URL) {
      setSlotsError("Falta NEXT_PUBLIC_API_URL en .env.local del frontend.");
      return;
    }

    setLoadingSlots(true);
    setSlotsError(null);
    setAvailableSlots([]);
    try {
      const ymd = toYYYYMMDD(date);
      const url = `${API_URL}/api/providers/${providerId}/available-slots?date=${ymd}&slot=${slotMinutes}&hours=${encodeURIComponent(
        hours
      )}`;
      const res = await fetch(url);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || `HTTP ${res.status}`);
      }
      const data = await res.json();

      const slots: UISlot[] = (data.available || []).map((s: any) => {
        const start = new Date(s.start);
        const end = new Date(s.end);
        const label = `${start.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })} - ${end.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hour12: false })}`;
        return { label, startISO: s.start, endISO: s.end };
      });

      setAvailableSlots(slots);
    } catch (e: any) {
      setSlotsError(e?.message || "No se pudo cargar disponibilidad");
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }

  // init al abrir
  useEffect(() => {
    if (open) {
      const today = new Date();
      setSelectedDate(today);
      setSelectedTime(null);
      setSelectedSlot(null);
      setStep(1);
      loadAvailable(today);
    }
  }, [open]);

  // recargar al cambiar fecha / props de ventana
  useEffect(() => {
    if (open && selectedDate && providerId) {
      loadAvailable(selectedDate);
    }
  }, [selectedDate, providerId, open, slotMinutes, hours]);

  // búsqueda dirección (debounce)
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
        setSearchResults(data.features || []);
        setShowResults(true);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };
    const t = setTimeout(() => searchAddress(searchQuery), 500);
    return () => clearTimeout(t);
  }, [searchQuery, apiKey]);

  // marcador/mapa
  useEffect(() => {
    if (locationData.latitude && locationData.longitude) {
      setMarkerPosition({ lat: locationData.latitude, lng: locationData.longitude });
      setViewport((prev) => ({ ...prev, latitude: locationData.latitude, longitude: locationData.longitude }));
    }
  }, [locationData.latitude, locationData.longitude]);

  const selectAddress = (result: SearchResult) => {
    const [lng, lat] = result.center;
    setLocationData({ ...locationData, direccion: result.place_name, latitude: lat, longitude: lng });
    setSearchQuery(result.place_name);
    setShowResults(false);
    setMarkerPosition({ lat, lng });
    setViewport({ latitude: lat, longitude: lng, zoom: 15 });
  };

  const handleMapClick = async (event: any) => {
    const { lng, lat } = event.lngLat;
    setLocationData({ ...locationData, latitude: lat, longitude: lng });
    setMarkerPosition({ lat, lng });
    try {
      const response = await fetch(`https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${apiKey}`);
      const data = await response.json();
      if (data.features?.length) {
        const address = data.features[0].place_name;
        setLocationData((prev) => ({ ...prev, direccion: address }));
        setSearchQuery(address);
      }
    } catch {}
  };

  const handleToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setSelectedTime(null);
    setSelectedSlot(null);
  };

  const handleTimeSelect = (slot: UISlot) => {
    setSelectedTime(slot.label);
    setSelectedSlot(slot);
  };

  // POST /api/appointments
  const handleConfirm = async () => {
    if (!API_URL) return alert("Falta NEXT_PUBLIC_API_URL en .env.local del frontend");
    if (!selectedDate || !selectedSlot) return alert("Selecciona una fecha y un horario");

    try {
      setSaving(true);

      const payload = {
        cliente: clienteId,
        proveedor: providerId,
        fecha: toYYYYMMDD(selectedDate),     // 'YYYY-MM-DD'
        horaInicio: selectedSlot.startISO,   // ISO
        horaFin: selectedSlot.endISO,
        duracionMinutos: slotMinutes,
        ubicacion: locationData.direccion || "Sin dirección",
        notas: locationData.notas || "",
        estado: "pendiente",
      };

      const res = await fetch(`${API_URL}/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 409) return alert(body?.message || "Horario no disponible, se solapa con otra cita.");
        return alert(body?.message || `Error HTTP ${res.status}`);
      }

      alert("✅ Cita creada correctamente");
      onOpenChange(false);

      // reset
      setStep(1);
      setSelectedTime(null);
      setSelectedSlot(null);
      setLocationData({
        direccion: "",
        latitude: 18.4861,
        longitude: -69.9312,
        details: "",
        notas: "",
      });
      setSearchQuery("");
    } catch (e) {
      console.error(e);
      alert("No se pudo crear la cita");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[90vw] !max-w-none sm:!max-w-[980px] lg:!max-w-[1200px] max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 border-b">
          <DialogTitle className="text-2xl font-bold text-gray-800">Agendar Cita - {patientName}</DialogTitle>
        </DialogHeader>

        <div className="p-6">
          {step === 1 && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Calendario */}
                <div>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(d) => {
                      setSelectedDate(d);
                      setSelectedTime(null);
                      setSelectedSlot(null);
                    }}
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

                {/* Horarios disponibles */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Horarios disponibles{" "}
                      {selectedDate && (
                        <span className="text-sm font-normal text-gray-500 ml-2">
                          - {formatDateForSummary(selectedDate)}
                        </span>
                      )}
                    </h4>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleToday}>
                        Hoy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => selectedDate && loadAvailable(selectedDate)}
                        disabled={loadingSlots || !selectedDate}
                      >
                        {loadingSlots ? "Cargando..." : "Recargar"}
                      </Button>
                    </div>
                  </div>

                  {slotsError && (
                    <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="text-sm text-red-600">{slotsError}</div>
                    </div>
                  )}

                  {loadingSlots && (
                    <div className="flex items-center justify-center p-6">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-2"></div>
                      <span className="text-sm text-gray-500">Cargando horarios disponibles...</span>
                    </div>
                  )}

                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {!loadingSlots && availableSlots.length === 0 && !slotsError && selectedDate && (
                      <div className="text-center p-6 text-gray-500 border border-gray-200 rounded-lg">
                        No hay horarios disponibles para este día.
                      </div>
                    )}

                    {!selectedDate && (
                      <div className="text-center p-6 text-gray-500 border border-gray-200 rounded-lg">
                        Selecciona una fecha para ver los horarios disponibles.
                      </div>
                    )}

                    {availableSlots.map((slot) => (
                      <button
                        key={slot.startISO}
                        onClick={() => handleTimeSelect(slot)}
                        className={cn(
                          "w-full p-3 text-left rounded-lg border transition-colors font-medium",
                          selectedTime === slot.label
                            ? "bg-blue-600 text-white border-blue-700 shadow-md"
                            : "bg-white hover:bg-blue-50 text-gray-700 border-gray-300 hover:border-blue-300"
                        )}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Resumen + acciones */}
              {selectedDate && selectedTime && (
                <div className="mt-6 p-4 rounded-lg border bg-slate-50">
                  <h4 className="font-semibold mb-2 text-blue-700">Resumen de la cita</h4>
                  <div className="text-sm space-y-1 text-blue-800">
                    <p>
                      <strong>Proveedor:</strong> {patientName}
                    </p>
                    <p>
                      <strong>Fecha:</strong> {formatDateForSummary(selectedDate)}
                    </p>
                    <p>
                      <strong>Hora:</strong> {selectedTime}
                    </p>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <Button className="flex-1 text-white bg-blue-600 hover:bg-blue-700" onClick={() => setStep(2)}>
                      Continuar →
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => setSelectedTime(null)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Cita seleccionada:</strong>{" "}
                  {selectedDate ? formatDateForSummary(selectedDate) : ""} {selectedTime ? `a las ${selectedTime}` : ""}
                </p>
              </div>

              {/* Dirección */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-800 mb-2">📍 Dirección del Servicio</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchResults.length > 0 && setShowResults(true)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    placeholder="Busca tu dirección aquí..."
                  />
                </div>
                {showResults && searchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-64 overflow-y-auto">
                    {searchResults.map((res, i) => (
                      <button
                        key={i}
                        onClick={() => selectAddress(res)}
                        className="w-full px-5 py-3.5 text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-start">
                          <MapPin className="w-5 h-5 mr-3 mt-0.5 text-blue-500" />
                          <span className="text-sm text-gray-800">{res.place_name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mapa */}
              <div className="h-96 w-full rounded-xl overflow-hidden border-2 border-gray-200 shadow-md">
                <Map
                  {...viewport}
                  onMove={(evt: any) => setViewport(evt.viewState)}
                  onClick={handleMapClick}
                  mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`}
                  style={{ width: "100%", height: "100%" }}
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

              {/* Notas */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">📝 Notas (opcional)</label>
                <textarea
                  value={locationData.notas}
                  onChange={(e) => setLocationData({ ...locationData, notas: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none"
                  placeholder="Indicaciones adicionales para el proveedor"
                />
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                  ← Volver
                </Button>
                <Button
                  className="flex-1 text-white bg-blue-600 hover:bg-blue-700"
                  onClick={handleConfirm}
                  disabled={!selectedSlot || saving}
                >
                  {saving ? "Guardando..." : "Confirmar Cita"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AppointmentModal;
