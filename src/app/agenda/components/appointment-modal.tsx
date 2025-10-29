"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { cn } from "@/lib/utils";
import LocationForm from "./LocationForms";
import ModalConfirmacion from "./ModalConfirmacion";

type UISlot = { label: string; startISO: string; endISO: string };

interface LocationFormProps {
  onSubmit: (location: { direccion: string; notas: string }) => void;
  initialData?: any;
}

interface AppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientName: string;
  providerId: string;
  servicioId: string;
  clienteId: string;
  initialAppointment?: any;
  isEditing?: boolean;
  appointmentId?: string;
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
  servicioId,
  clienteId,
  initialAppointment,
  isEditing = false,
  appointmentId,
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

  // Ubicación
  const [locationData, setLocationData] = useState<any>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const locationFormRef = useRef<HTMLDivElement | null>(null);

  // Confirmación
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const isEdit = false;

  // Días feriados
  const holidays = ["2025-11-01", "2025-11-02", "2025-12-24"];

  // Días ya ocupados
  const [bookedDays, setBookedDays] = useState<string[]>([]);

  // Cargar días con citas del proveedor desde el backend
  async function loadBookedDays() {
    try {
      if (!providerId) return;
      const res = await fetch(`${API_URL}/api/devcode/citas/proveedor/${providerId}`);
      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
      const data: any[] = await res.json();

      // Si estamos editando, excluimos la cita actual de los días ocupados
      let fechasOcupadas: string[];
      if (isEditing && appointmentId) {
        fechasOcupadas = data
          .filter((cita: any) => cita._id !== appointmentId)
          .map((cita: any) => cita.fecha);
      } else {
        fechasOcupadas = data.map((cita: any) => cita.fecha);
      }

      const fechasUnicas: string[] = [...new Set(fechasOcupadas)];
      console.log("Fechas con citas para proveedor:", fechasUnicas);
      setBookedDays(fechasUnicas);
    } catch (error) {
      console.error("Error cargando citas del proveedor:", error);
    }
  }

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
    if (date) setDateInput(date.toLocaleDateString("es-ES"));
  };

  const handleToday = () => handleDateSelect(new Date());

  const handleTimeSelect = (slot: UISlot) => {
    setSelectedTime(slot.label);
    setSelectedSlot(slot);
    // Scroll suave hacia el formulario
    setTimeout(() => {
      locationFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleFormSubmit = (location: any) => {
    setLocationData(location);
    setFormSubmitted(true);
  };

  // ---- Carga de disponibilidad desde backend ----
  async function loadAvailable(date: Date) {
    if (!date || !providerId) return;

    // Mock: Simular horarios disponibles sin fetch
    const dateStr = toYYYYMMDD(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;
    const isEditingSameDay = isEditing && initialAppointment && dateStr === initialAppointment.fecha;

    if (!isEditingSameDay && (date < today || isWeekend(date))) {
      setAvailableSlots([]);
      setSlotsError(isWeekend(date) ? "No se atiende fines de semana." : "El día seleccionado ya pasó.");
      return;
    }

    setLoadingSlots(true);
    setSlotsError(null);
    setAvailableSlots([]);

    try {
      const fechaStr = toYYYYMMDD(date);
      const res = await fetch(
        `${API_URL}/api/devcode/proveedores/${providerId}/disponibilidad?fechaInicio=${fechaStr}&fechaFin=${fechaStr}`
      );

      let slots: UISlot[] = [];

      if (res.ok) {
        const data = await res.json();
        const hours: string[] = data[fechaStr] || [];

        slots = hours.map(hora => {
          const [hh, mm] = hora.split(":").map(Number);
          const start = new Date(date);
          start.setHours(hh, mm, 0, 0);
          const end = new Date(start.getTime() + 60 * 60000);
          return {
            startISO: start.toISOString(),
            endISO: end.toISOString(),
            label: `${hora} - ${end.getHours().toString().padStart(2, "0")}:${end.getMinutes().toString().padStart(2, "0")}`,
          };
        });
      }

      // añadir el slot actual si estamos editando
      if (isEditing && initialAppointment && initialAppointment.fecha === fechaStr) {
        const currentTimeSlot = {
          startISO: new Date(`${initialAppointment.fecha}T${initialAppointment.horario.inicio}`).toISOString(),
          endISO: new Date(`${initialAppointment.fecha}T${initialAppointment.horario.fin}`).toISOString(),
          label: `${initialAppointment.horario.inicio} - ${initialAppointment.horario.fin}`,
        };

        const slotExists = slots.some(slot =>
          slot.startISO === currentTimeSlot.startISO && slot.endISO === currentTimeSlot.endISO
        );

        if (!slotExists) {
          slots.unshift(currentTimeSlot);
        }

        if (!selectedTime) {
          setSelectedTime(currentTimeSlot.label);
          setSelectedSlot(currentTimeSlot);
        }
      }

      setAvailableSlots(slots);
    } catch (err: any) {
      setSlotsError(err?.message || "Error cargando disponibilidad");
    } finally {
      setLoadingSlots(false);
    }
  }

  // Init cuando se abre el modal
  useEffect(() => {
    if (open) {
      console.log(" Inicializando modal en modo:", isEditing ? "EDICIÓN" : "CREACIÓN");
      console.log(" Cita inicial:", initialAppointment);

      if (isEditing && initialAppointment) {
        // MODO EDICIÓN
        const initialDate = new Date(initialAppointment.fecha);
        setSelectedDate(initialDate);
        setDateInput(initialDate.toLocaleDateString("es-ES"));

        if (initialAppointment.ubicacion) {
          setLocationData(initialAppointment.ubicacion);
          setFormSubmitted(true);
        }

        console.log(" Datos precargados para edición:", {
          fecha: initialAppointment.fecha,
          horario: initialAppointment.horario,
          ubicacion: initialAppointment.ubicacion
        });
      } else {
        // MODO CREACIÓN
        const today = new Date();
        setSelectedDate(today);
        setDateInput(today.toLocaleDateString("es-ES"));
        setSelectedTime(null);
        setSelectedSlot(null);
        setFormSubmitted(false);
        setLocationData(null);
      }

      loadBookedDays();
    }
  }, [open, isEditing, initialAppointment]);

  // Recargar disponibilidad cuando cambia fecha/props
  useEffect(() => {
    if (open && selectedDate && providerId) {
      loadAvailable(selectedDate);
    }
  }, [selectedDate, providerId, open]);

  // ---- POST /api/appointments ----
  const isDayDisabled = (day: Date) => {
    const dateStr = toYYYYMMDD(day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;

    // Días pasados
    if (day < today) return true;

    // Fines de semana
    if (isWeekend(day)) return true;

    // Feriados
    if (holidays.includes(dateStr)) return true;

    // Permitir la fecha actual de la cita cuando editamos
    if (isEditing && initialAppointment && dateStr === initialAppointment.fecha) {
      return false;
    }

    // Días ocupados
    return bookedDays.includes(dateStr);
  };

  // ---- POST/PUT para crear/actualizar cita ----
  const handleConfirm = async () => {
    if (!API_URL) return alert("Falta NEXT_PUBLIC_API_URL en .env.local");
    if (!selectedDate || !selectedSlot) return alert("Selecciona fecha y horario");
    if (!locationData) return alert("Completa los datos de ubicación");

    try {
      setSaving(true);
      const formatHour = (iso: string) => {
        const date = new Date(iso);
        return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
      };

      const payload = {
        proveedorId: providerId,
        servicioId,
        clienteId,
        fecha: toYYYYMMDD(selectedDate),
        horario: {
          inicio: formatHour(selectedSlot.startISO),
          fin: formatHour(selectedSlot.endISO),
        },
        ubicacion: locationData,
        estado: "pendiente",
      };

      console.log("Enviando payload:", payload);

      let url = `${API_URL}/api/devcode/citas`;
      let method = "POST";

      if (isEditing && appointmentId) {
        url = `${API_URL}/api/devcode/citas/${appointmentId}`;
        method = "PUT";
        console.log(" Actualizando cita existente:", appointmentId);
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await res.json().catch(() => ({}));
      
      if (!res.ok) {
        if (res.status === 409) return alert(body?.message || "Horario no disponible.");
        return alert(body?.message || `Error HTTP ${res.status}`);
      }

      // Mostramos modal de confirmación y cerramos el modal principal
      setShowConfirmationModal(true);
      onOpenChange(false);
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
            {isEditing ? "Editar Cita" : "Agendar Cita"} - {patientName}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 mt-1">
            {isEditing ? "Modifica la fecha, horario o ubicación de tu cita." : "Selecciona fecha, horario y ubicación para agendar tu cita."}
          </DialogDescription>
        </div>

        <div className="p-6">
          {/* Barra superior */}
          <div className="flex items-center justify-between mb-6">
            <Input 
              type="text" 
              placeholder="dd/mm/aaaa" 
              value={dateInput} 
              onChange={e => setDateInput(e.target.value)} 
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-32" 
            />
            <div className="flex gap-2">
              <Button onClick={() => selectedDate && loadAvailable(selectedDate)} className="bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded-lg text-sm font-medium text-blue-600">
                Buscar
              </Button>
              <Button onClick={handleToday} className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-800">
                Hoy
              </Button>
            </div>
          </div>

          {/* Calendario y horarios */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="w-full"
                captionLayout="dropdown-months"
                disabled={isDayDisabled}
                modifiers={{
                  booked: (day: Date) => bookedDays.includes(toYYYYMMDD(day)),
                  holiday: (day: Date) => holidays.includes(toYYYYMMDD(day)),
                  weekend: (day: Date) => [0,6].includes(day.getDay()),
                  ...(isEditing && initialAppointment ? {
                    currentAppointment: (day: Date) => toYYYYMMDD(day) === initialAppointment.fecha
                  } : {})
                }}
                modifiersStyles={{
                  booked: { backgroundColor: "#93C5FD", color: "#1E3A8A", borderRadius: "8px" },
                  holiday: { backgroundColor: "#FCA5A5", color: "#7F1D1D", borderRadius: "8px" },
                  weekend: { backgroundColor: "#E5E7EB", color: "#6B7280", borderRadius: "8px" },
                  ...(isEditing && initialAppointment ? {
                    currentAppointment: { backgroundColor: "#10B981", color: "#064E3B", borderRadius: "8px", fontWeight: "bold" }
                  } : {})
                }}
              />
              <div className="mt-4 text-xs space-y-2">
                {Object.entries(APPOINTMENT_STATES).map(([key, state]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <div className={cn("w-4 h-4 rounded", state.color)} />
                    <span>{state.label}</span>
                  </div>
                ))}
                {/* Leyenda extra: fin de semana */}
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded bg-gray-200" />
                  <span>Fin de semana</span>
                </div>
                {isEditing && (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded bg-green-400" />
                    <span>Fecha actual de la cita</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-semibold text-gray-800">
                  Horarios disponibles
                  {selectedDate && (
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      - {formatDateForSummary(selectedDate)}
                    </span>
                  )}
                </h4>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => selectedDate && loadAvailable(selectedDate)} disabled={loadingSlots || !selectedDate}>
                    {loadingSlots ? "Cargando..." : "Recargar"}
                  </Button>
                </div>
              </div>

              {slotsError && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {slotsError}
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
                
                {availableSlots.map(slot => {
                  const isCurrentAppointmentSlot = isEditing && 
                    initialAppointment && 
                    initialAppointment.horario && 
                    `${initialAppointment.horario.inicio} - ${initialAppointment.horario.fin}` === slot.label;
                  
                  return (
                    <button 
                      key={slot.startISO} 
                      onClick={() => handleTimeSelect(slot)} 
                      className={cn(
                        "w-full p-3 text-left rounded-lg border transition-colors font-medium relative",
                        selectedTime === slot.label 
                          ? "bg-blue-600 text-white border-blue-700 shadow-md" 
                          : "bg-white hover:bg-blue-50 text-gray-700 border-gray-300 hover:border-blue-300",
                        isCurrentAppointmentSlot && "ring-2 ring-green-500"
                      )}
                    >
                      {slot.label}
                      {isCurrentAppointmentSlot && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Actual
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Formulario ubicación */}
          {!formSubmitted && selectedDate && selectedTime && (
            <div ref={locationFormRef} className="mt-6">
              <LocationForm 
                onSubmit={handleFormSubmit} 
                initialData={locationData}
              />
            </div>
          )}

          {/* Resumen cita */}
          {formSubmitted && (
            <div className="mt-6 p-4 rounded-lg border bg-slate-50">
              <h4 className="font-semibold mb-2 text-blue-700">Resumen de la cita</h4>
              <div className="text-sm space-y-1 text-blue-800">
                <p><strong>Proveedor:</strong> {patientName}</p>
                <p><strong>Fecha:</strong> {selectedDate ? formatDateForSummary(selectedDate) : ""}</p>
                <p><strong>Hora:</strong> {selectedTime}</p>
                <p><strong>Ubicación:</strong> {locationData?.direccion?.trim() || "No especificada"}</p>
                <p><strong>Nota adicional:</strong> {locationData?.notas?.trim() || "No especificada"}</p>
              </div>

              <div className="mt-4 flex gap-3">
                <Button 
                  className="flex-1 text-white bg-blue-600 hover:bg-blue-700" 
                  onClick={handleConfirm} 
                  disabled={saving}
                >
                  {saving ? "Guardando..." : isEditing ? "Guardar cambios" : "Confirmar Cita"}
                </Button>

                {/* Editar ubicación: vuelve a mostrar LocationForm para cambiar mapa/dirección */}
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    // permitir editar la ubicación (mostrar el formulario otra vez)
                    setFormSubmitted(false);
                    // opcional: forzar scroll hasta el formulario si existe
                    setTimeout(() => {
                      locationFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 50);
                  }}
                >
                  Editar ubicación
                </Button>

                {/* Cancelar (resetea selección de hora solo) */}
                <Button
                  variant="ghost"
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

      <ModalConfirmacion 
        isOpen={showConfirmationModal} 
        onClose={() => setShowConfirmationModal(false)} 
      />
    </Dialog>
  );
}

export default AppointmentModal;
