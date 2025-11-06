'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Calendar, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@radix-ui/react-dropdown-menu";
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
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem 
            onClick={() => {
              setActionType('cancel');
              setIsModalOpen(true);
            }}
            className="text-red-600"
          >
            <X className="w-4 h-4 mr-2" /> Cancelar
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => {
              setActionType('reprogram');
              setIsModalOpen(true);
            }}
            className="text-blue-600"
          >
            <Calendar className="w-4 h-4 mr-2" /> Reprogramar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CancelReprogramModal
        appointment={appointment}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCancel={onCancel}
        onReprogram={onReprogram}
      />
    </>
  );
}
