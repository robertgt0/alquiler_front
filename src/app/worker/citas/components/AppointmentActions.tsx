'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, X } from 'lucide-react';
import CancelReprogramModal from './CancelReprogramModal';

// ✅ Incluimos reprogramCount opcional para compatibilidad
type Appointment = {
  id: string;
  fecha: string;
  horario: { inicio: string; fin: string };
  servicio: { nombre: string };
  proveedor: { nombre: string };
  estado: 'agendado' | 'pendiente' | 'cancelado' | 'concluido' | 'reprogramar';
  ubicacion?: string;
  reprogramCount?: number; // agregado
};

interface AppointmentActionsProps {
  appointment: Appointment;
  onCancel: (id: string, reason: string) => Promise<void>;
  onReprogram: (id: string, newDate: string, newTime: string) => Promise<void>;
  isFixer?: boolean;
}

export default function AppointmentActions({
  appointment,
  onCancel,
  onReprogram,
  isFixer = false
}: AppointmentActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'cancel' | 'reprogram'>('cancel');

  return (
    <div className="flex gap-3">
      {/* Botón Cancelar */}
      <Button 
        variant={isFixer ? "destructive" : "outline"}
        onClick={() => {
          setActionType('cancel');
          setIsModalOpen(true);
        }}
        className={`px-5 py-2 ${isFixer ? '' : 'border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400'} transition-all font-medium`}
      >
        <X className="w-4 h-4 mr-2" />
        {isFixer ? 'Cancelar como Reparador' : 'Cancelar'}
      </Button>
      
      {/* Botón Reprogramar */}
      {!isFixer && (
        <Button 
          onClick={() => {
            setActionType('reprogram');
            setIsModalOpen(true);
          }}
          className="px-5 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-all font-medium shadow-md"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Reprogramar
        </Button>
      )}

      <CancelReprogramModal
        appointment={appointment}
        citaId={appointment.id} // id del objeto

        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCancel={onCancel}
        onReprogram={onReprogram}
        actionType={actionType}
        isFixer={isFixer}
      />
    </div>
  );
}
