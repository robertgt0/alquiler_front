"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar } from "../components/ui/calendar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "../components/ui/dialog";
import { cn } from "@/lib/utils";
import LocationForm from "../components/LocationForms";
import ModalConfirmacion from "../components/ModalConfirmacion";

type UISlot = { label: string; startISO: string; endISO: string };

interface LocationFormProps {
  onSubmit: (location: { direccion: string; notas: string }) => void
}

interface AppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientName?: string;
  providerId: string;
  clienteId: string;
  slotMinutes?: number;
  hours?: string; // "08:00-12:00,14:00-18:00"
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
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Fecha / hora
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<UISlot | null>(null);
  const [dateInput, setDateInput] = useState("");

  // Disponibilidad
  const [availableSlots, setAvailableSlots] = useState<UISlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  // Ubicación (los datos vienen de <LocationForm />)
  const [locationData, setLocationData] = useState<any>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const locationFormRef = useRef<HTMLDivElement | null>(null);

  // Confirmación
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // ---- UI helpers ----
  const formatDateForSummary = (date: Date) =>
    date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setSelectedSlot(null);

    if (date) {
      const formatted = date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      setDateInput(formatted);
    }
  };

  const handleToday = () => {
    const today = new Date();
    handleDateSelect(today);
  };

  const handleTimeSelect = (slot: UISlot) => {
    setSelectedTime(slot.label);
    setSelectedSlot(slot);
    // Scroll suave hacia el formulario
    setTimeout(() => {
      locationFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)
  }

  const handleFormSubmit = (location: any) => {
    console.log("Datos de ubicación:", location)
    setLocationData(location)
    setFormSubmitted(true)
  }

  // ---- Carga de disponibilidad desde backend ----
  async function loadAvailable(date: Date) {
    if (!date || !providerId) return;

    // Mock: Simular horarios disponibles sin fetch
    setLoadingSlots(true);
    setSlotsError(null);
    setAvailableSlots([]);

    try {
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const slots: UISlot[] = [
        { label: "08:00 - 08:30", startISO: `${toYYYYMMDD(date)}T08:00:00`, endISO: `${toYYYYMMDD(date)}T08:30:00` },
        { label: "08:30 - 09:00", startISO: `${toYYYYMMDD(date)}T08:30:00`, endISO: `${toYYYYMMDD(date)}T09:00:00` },
        { label: "09:00 - 09:30", startISO: `${toYYYYMMDD(date)}T09:00:00`, endISO: `${toYYYYMMDD(date)}T09:30:00` },
        { label: "10:00 - 10:30", startISO: `${toYYYYMMDD(date)}T10:00:00`, endISO: `${toYYYYMMDD(date)}T10:30:00` },
        { label: "14:00 - 14:30", startISO: `${toYYYYMMDD(date)}T14:00:00`, endISO: `${toYYYYMMDD(date)}T14:30:00` },
        { label: "15:00 - 15:30", startISO: `${toYYYYMMDD(date)}T15:00:00`, endISO: `${toYYYYMMDD(date)}T15:30:00` },
      ];

      setAvailableSlots(slots);
    } catch (e: any) {
      setSlotsError(e?.message || "No se pudo cargar disponibilidad");
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }

  // Init cuando se abre el modal
  useEffect(() => {
    if (open) {
      const today = new Date();
      setSelectedDate(today);
      setSelectedTime(null);
      setSelectedSlot(null);
      setFormSubmitted(false);
      setLocationData(null);
      loadAvailable(today);
    }
  }, [open]);

  // Recargar disponibilidad cuando cambia fecha/props
  useEffect(() => {
    if (open && selectedDate && providerId) {
      loadAvailable(selectedDate);
    }
  }, [selectedDate, providerId, open, slotMinutes, hours]);

  // ---- POST /api/appointments ----
  const handleConfirm = async () => {
    if (!API_URL) return alert("Falta NEXT_PUBLIC_API_URL en .env.local del frontend");
    if (!selectedDate || !selectedSlot) return alert("Selecciona una fecha y un horario");
    if (!locationData) return alert("Completa los datos de ubicación");

    try {
      setSaving(true);

      const payload = {
        cliente: clienteId,
        proveedor: providerId,
        fecha: toYYYYMMDD(selectedDate),
        horaInicio: selectedSlot.startISO,
        horaFin: selectedSlot.endISO,
        duracionMinutos: slotMinutes,
        ubicacion: locationData?.direccion || "Sin dirección",
        notas: locationData?.notas || "",
        lng: locationData?.lng,
        lat: locationData?.lat,
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

      // Mostramos modal de confirmación y cerramos el modal principal
      setShowConfirmationModal(true);
      onOpenChange(false);

      // Reset ligero (opcional)
      setSelectedTime(null);
      setSelectedSlot(null);
    } catch (err) {
      console.error(err);
      alert("No se pudo crear la cita");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[50vw] !max-w-none !sm:max-w-none bg-white rounded-xl shadow-2xl overflow-x-auto max-h-[90vh] overflow-y-auto p-0">
        <div className="p-6 border-b">
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Agendar Cita - {patientName}
          </DialogTitle>
        </div>

        <div className="p-6">
          {/* --- BARRA SUPERIOR --- */}
          <div className="flex items-center justify-between mb-6">
            <Input
              type="text"
              placeholder="dd/mm/aaaa"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-32"
            />
            <div className="flex gap-2">
              <Button
                onClick={() => selectedDate && loadAvailable(selectedDate)}
                className="bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded-lg text-sm font-medium text-blue-600"
              >
                Buscar
              </Button>
              <Button onClick={handleToday} className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-800">
                Hoy
              </Button>
            </div>
          </div>

          {/* --- CALENDARIO Y HORARIOS --- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Calendar
                mode="single"
                selected={selectedDate ?? undefined} 
                onSelect={handleDateSelect}
                className="w-full"
                captionLayout="dropdown-months"
              />
              <div className="mt-4 text-xs space-y-2">
                {Object.entries(APPOINTMENT_STATES).map(([key, state]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <div className={cn("w-4 h-4 rounded", state.color)} />
                    <span>{state.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-semibold text-gray-800">
                  Horarios disponibles{" "}
                  {selectedDate && (
                    <span className="text-sm font-normal text-gray-500 ml-2">- {formatDateForSummary(selectedDate)}</span>
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

          {/* --- FORMULARIO UBICACIÓN --- */}
          {!formSubmitted && selectedDate && selectedTime && (
            <div ref={locationFormRef} className="mt-6">
              <LocationForm onSubmit={handleFormSubmit} />
            </div>
          )}

          {/* --- RESUMEN DE CITA --- */}
          {formSubmitted && (
            <div className="mt-6 p-4 rounded-lg border bg-slate-50">
              <h4 className="font-semibold mb-2 text-blue-700">Resumen de la cita</h4>
              <div className="text-sm space-y-1 text-blue-800">
                <p>
                  <strong>Proveedor:</strong> {patientName}
                </p>
                <p>
                  <strong>Fecha:</strong> {selectedDate ? formatDateForSummary(selectedDate) : ""}
                </p>
                <p>
                  <strong>Hora:</strong> {selectedTime}
                </p>
                <p>
                  <strong>Ubicación:</strong>{" "}
                  {((locationData?.direccion ?? "") as string).trim() || "No especificada"}
                </p>
                <p>
                  <strong>Nota adicional:</strong>{" "}
                  {((locationData?.notas ?? "") as string).trim() || "No especificada"}
                </p>
              </div>
              <div className="mt-4 flex gap-3">
                <Button className="flex-1 text-white bg-blue-600 hover:bg-blue-700" onClick={handleConfirm} disabled={saving}>
                  {saving ? "Guardando..." : "Confirmar Cita"}
                </Button>
                {/* Cancelar */}
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setSelectedTime(null);
                    setFormSubmitted(false);
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>

      {/* Modal de confirmación (visual) */}
      <ModalConfirmacion isOpen={showConfirmationModal} onClose={() => setShowConfirmationModal(false)} />
    </Dialog>
  );
}

export default AppointmentModal;
