'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react';

type Appointment = {
  id: string;
  fecha: string;
  horario: string;
  servicio: string;
  proveedor: string;
};

interface CancelReprogramModalProps {
  appointment: Appointment;
  isOpen: boolean;
  onClose: () => void;
  onCancel: (id: string, reason: string) => Promise<void>;
  onReprogram: (id: string, newDate: string, newTime: string) => Promise<void>;
}

export default function CancelReprogramModal({
  appointment,
  isOpen,
  onClose,
  onCancel,
  onReprogram
}: CancelReprogramModalProps) {
  const [activeTab, setActiveTab] = useState<'cancel' | 'reprogram'>('cancel');
  const [reason, setReason] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isWithin3Hours = () => {
    const now = new Date();
    const [startTime] = appointment.horario.split(' - ');
    const [hours, minutes] = startTime.split(':').map(Number);
    const appointmentDate = new Date(appointment.fecha);
    appointmentDate.setHours(hours, minutes, 0, 0);
    
    return (appointmentDate.getTime() - now.getTime()) < (3 * 60 * 60 * 1000);
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogTitle className="text-xl font-bold flex items-center gap-2">
          {activeTab === 'cancel' ? (
            <>
              <AlertCircle className="text-red-500" /> Cancelar Cita
            </>
          ) : (
            <>
              <Calendar className="text-blue-500" /> Reprogramar Cita
            </>
          )}
        </DialogTitle>
        
        {/* Pestañas */}
        <div className="flex border-b">
          <button
            className={`flex-1 py-2 font-medium ${activeTab === 'cancel' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('cancel')}
          >
            Cancelar
          </button>
          <button
            className={`flex-1 py-2 font-medium ${activeTab === 'reprogram' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('reprogram')}
          >
            Reprogramar
          </button>
        </div>
        
        {/* Información de la cita */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h4 className="font-semibold mb-2">{appointment.servicio}</h4>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(appointment.fecha).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{appointment.horario}</span>
          </div>
        </div>
        
        {isWithin3Hours() && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <span>No puedes cancelar ni reprogramar con menos de 3 horas de anticipación.</span>
          </div>
        )}
        
        {/* Contenido según pestaña */}
        {activeTab === 'cancel' ? (
          <div>
            <label className="block text-sm font-medium mb-2">Motivo de cancelación</label>
            <textarea
              className="w-full border rounded-lg p-3 text-sm min-h-[100px]"
              placeholder="Explique el motivo de cancelación..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isWithin3Hours()}
            />
            
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                Volver
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleCancel}
                disabled={isWithin3Hours() || !reason.trim() || isSubmitting}
              >
                {isSubmitting ? 'Cancelando...' : 'Confirmar Cancelación'}
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nueva fecha</label>
                <input
                  type="date"
                  className="w-full border rounded-lg p-2 text-sm"
                  min={new Date().toISOString().split('T')[0]}
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  disabled={isWithin3Hours()}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Nuevo horario</label>
                <input
                  type="time"
                  className="w-full border rounded-lg p-2 text-sm"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  disabled={isWithin3Hours()}
                />
              </div>
            </div>
            
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                Volver
              </Button>
              <Button 
                onClick={handleReprogram}
                disabled={isWithin3Hours() || !newDate || !newTime || isSubmitting}
              >
                {isSubmitting ? 'Reprogramando...' : 'Confirmar Reprogramación'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
