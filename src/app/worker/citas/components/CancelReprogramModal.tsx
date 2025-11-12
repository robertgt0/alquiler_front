'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, AlertCircle, Mail } from 'lucide-react';

type Appointment = {
  id: string;
  fecha: string;
  horario: { inicio: string; fin: string };
  servicio: { nombre: string };
  proveedor: { nombre: string };
  estado: 'agendado' | 'pendiente' | 'cancelado' | 'concluido' | 'reprogramar';
  ubicacion?: string;
};

interface CancelReprogramModalProps {
  appointment: Appointment;
  isOpen: boolean;
  onClose: () => void;
  onCancel: (id: string, reason: string) => Promise<void>;
  onReprogram: (id: string, newDate: string, newTime: string) => Promise<void>;
  actionType: 'cancel' | 'reprogram';
  isFixer?: boolean;
  citaId: string;
  onUpdate?: (updated: Appointment) => void; // <-- agrega esto

}

export default function CancelReprogramModal({
  appointment,
  isOpen,
  onClose,
  onCancel,
  onReprogram,
  actionType,
  isFixer = false
}: CancelReprogramModalProps) {
  const [reason, setReason] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWithinLimit, setIsWithinLimit] = useState(false);

  // 🔹 Verifica si falta menos de 3 horas para la cita
  const isWithin3Hours = () => {
    if (!appointment.horario) return false;
    const now = new Date();
    const [hours, minutes] = appointment.horario.inicio.split(':').map(Number);
    const appointmentDate = new Date(appointment.fecha);
    appointmentDate.setHours(hours, minutes, 0, 0);
    return appointmentDate.getTime() - now.getTime() < 3 * 60 * 60 * 1000;
  };

  const handleCancel = async () => {
    if (!reason.trim()) return;
    setIsSubmitting(true);
    await onCancel(appointment.id, reason);
    setIsSubmitting(false);
  };

  const handleReprogram = async () => {
    if (!newDate || !newTime) return;
    setIsSubmitting(true);
    await onReprogram(appointment.id, newDate, newTime);
    setIsSubmitting(false);
  };

  useEffect(() => {
    setIsWithinLimit(isWithin3Hours());
  }, [appointment]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white rounded-2xl p-8 shadow-2xl border-0">
        <DialogTitle className="text-2xl font-bold flex items-center gap-2 mb-6 text-gray-800">
          {isFixer ? (
            <>
              <AlertCircle className="text-red-500 w-6 h-6" />
              <span>Cancelar Cita como Reparador</span>
            </>
          ) : actionType === 'cancel' ? (
            <>
              <AlertCircle className="text-red-500 w-6 h-6" />
              <span>Cancelar Cita</span>
            </>
          ) : (
            <>
              <Calendar className="text-blue-500 w-6 h-6" />
              <span>Reprogramar Cita</span>
            </>
          )}
        </DialogTitle>

        {/* Información de la cita */}
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-800">{appointment.servicio.nombre}</h4>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(appointment.fecha).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{appointment.horario.inicio} - {appointment.horario.fin}</span>
            </div>
          </div>

          {isWithin3Hours() && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span>No puedes cancelar ni reprogramar con menos de 3 horas de anticipación.</span>
            </div>
          )}

          {/* Campos según acción */}
          {isFixer ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Motivo de cancelación *</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 text-sm min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Explique el motivo de cancelación..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <div className="mt-4 bg-blue-50 p-3 rounded-lg text-sm flex items-start gap-2">
                <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Se enviará notificación al usuario con este motivo</span>
              </div>
            </div>
          ) : actionType === 'cancel' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Motivo de cancelación</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 text-sm min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Explique el motivo de cancelación..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={isWithin3Hours()}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nueva fecha</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min={new Date().toISOString().split('T')[0]}
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  disabled={isWithin3Hours()}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nuevo horario</label>
                <input
                  type="time"
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  disabled={isWithin3Hours()}
                />
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              variant="outline"
              onClick={onClose}
              className="px-5 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all font-medium"
              disabled={isSubmitting}
            >
              Volver
            </Button>
            <Button 
              onClick={isFixer ? handleCancel : actionType === 'cancel' ? handleCancel : handleReprogram}
              className={`px-5 py-2 rounded-lg transition-all font-medium shadow-md ${
                isFixer || actionType === 'cancel' 
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-blue-900 text-white hover:bg-blue-800'
              }`}
              disabled={isSubmitting || ((isFixer || actionType === 'cancel') && !reason.trim()) || (actionType === 'reprogram' && (!newDate || !newTime))}
            >
              {isSubmitting ? 'Procesando...' : isFixer || actionType === 'cancel' ? 'Confirmar Cancelación' : 'Confirmar Reprogramación'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
