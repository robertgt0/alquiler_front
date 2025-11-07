"use client";
import { useState } from "react";
import { Dialog } from "@/app/agenda/components/ui/dialog";
import { Calendar } from "@/app/agenda/components/ui/calendar";

interface EditAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  cita: {
    _id: string;
    fecha: string;
    horario: {
      inicio: string;
      fin: string;
    };
  };
  // onUpdate recibe los datos actualizados para que el padre los use en la UI
  onUpdate: (updated?: { _id?: string; fecha: string; horario: { inicio: string; fin: string }; estado?: string }) => void;
  proveedorId?: string;
  isDemo?: boolean;
}

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", "13:00", 
  "14:00", "15:00", "16:00", "17:00", "18:00"
];

export default function EditAppointmentModal({
  isOpen,
  onClose,
  cita,
  onUpdate,
  proveedorId,
  isDemo
}: EditAppointmentModalProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    // Crear la fecha a mediodía para evitar problemas con zonas horarias
    const fecha = new Date(cita.fecha + 'T12:00:00');
    return fecha;
  });
  const [selectedTime, setSelectedTime] = useState(cita.horario.inicio);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setError("");
    setSaving(true);
    try {
      // Crear una nueva fecha a mediodía para evitar problemas de zona horaria
      const fecha = new Date(selectedDate);
      fecha.setUTCHours(12, 0, 0, 0);
      
      // Formatear la fecha usando UTC para asegurar que no cambie
      const formattedDate = fecha.toISOString().split('T')[0];
      const endTime = calcularHoraFin(selectedTime);

      // Si estamos en modo demo/offline, no intentamos llamar al backend; aplicamos los cambios localmente
      if (isDemo) {
        onUpdate({ _id: cita._id, fecha: formattedDate, horario: { inicio: selectedTime, fin: endTime }, estado: 'agendado' });
        onClose();
        return;
      }

      // request con timeout para evitar quedarse colgado
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 10000);
      const response = await fetch(`${API_URL}/api/devcode/citas/${cita._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          fecha: formattedDate,
          horario: {
            inicio: selectedTime,
            fin: endTime
          },
          proveedorId: proveedorId
        }),
      });
      clearTimeout(timer);

      let result: any = null;
      try {
        result = await response.json();
      } catch (e) {
        // ignore json parse errors
      }

      if (!response.ok) {
        // intentar mostrar mensaje del servidor
        const serverMsg = result?.error || result?.message || (await response.text().catch(() => null));
        throw new Error(serverMsg || 'Error al actualizar la cita');
      }

      // Llamar onUpdate pasando los datos actualizados para que la UI los refleje
      onUpdate({ _id: cita._id, fecha: formattedDate, horario: { inicio: selectedTime, fin: endTime }, estado: 'agendado' });
      // reset saving antes de cerrar para que el botón muestre el estado actualizado si el modal permanece abierto momentáneamente
      setSaving(false);
      onClose();
    } catch (err) {
      const msg = (err as any)?.message || 'Error al actualizar la cita. Por favor, intenta nuevamente.';
      setError(msg);
    } finally {
      // asegurar que saving quede en false en cualquier caso
      setSaving(false);
    }
  };

  const calcularHoraFin = (horaInicio: string): string => {
    const [hours, minutes] = horaInicio.split(':').map(Number);
    const fecha = new Date();
    fecha.setHours(hours, minutes, 0, 0);
    fecha.setHours(fecha.getHours() + 1);
    return `${fecha.getHours().toString().padStart(2, '0')}:${fecha.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 z-50 bg-black/50" />
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Editar Cita</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha
              </label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded border"
                disabled={(date) => date < new Date()}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora
              </label>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-2 text-sm rounded ${
                      selectedTime === time
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm mt-2">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className={`px-4 py-2 text-sm font-medium rounded-md ${saving ? 'bg-blue-300 text-white cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
