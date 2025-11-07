'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Calendar, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@radix-ui/react-dropdown-menu';
import CancelReprogramModal from './CancelReprogramModal';

type Appointment = {
  id: string;
  fecha: string;
  horario: string;
  servicio: string;
  proveedor: string;
};

interface AppointmentActionsProps {
  appointment: Appointment;
  onCancel: (id: string, reason: string) => Promise<void>;
  onReprogram: (id: string, newDate: string, newTime: string) => Promise<void>;
}

export default function AppointmentActions({
  appointment,
  onCancel,
  onReprogram
}: AppointmentActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'cancel' | 'reprogram'>('cancel');

  return (
    <div className="flex gap-3">
      <Button 
        variant="outline" 
        onClick={() => {
          setActionType('cancel');
          setIsModalOpen(true);
        }}
        className="px-5 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all font-medium"
      >
        Cancelar
      </Button>
      
      <Button 
        onClick={() => {
          setActionType('reprogram');
          setIsModalOpen(true);
        }}
        className="px-5 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-all font-medium shadow-md"
      >
        Reprogramar
      </Button>

      <CancelReprogramModal
        appointment={appointment}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCancel={onCancel}
        onReprogram={onReprogram}
      />
    </div>
  );
}
