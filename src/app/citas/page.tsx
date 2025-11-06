'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Wrench, AlertCircle } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';
import AppointmentActions from './components/AppointmentActions';

interface Appointment {
  id: string;
  fecha: string;
  horario: {
    inicio: string;
    fin: string;
  };
  servicio: {
    nombre: string;
  };
  proveedor: {
    nombre: string;
  };
}

export default function CitasPage() {
  const [citas, setCitas] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { notify } = useNotifications();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        // Simulación de llamada a API
        setTimeout(() => {
          setCitas([
            {
              id: '1',
              fecha: '2025-11-10',
              horario: { inicio: '14:00', fin: '15:00' },
              servicio: { nombre: 'Reparación de tuberías' },
              proveedor: { nombre: 'Juan Pérez' }
            },
            {
              id: '2',
              fecha: '2025-11-12',
              horario: { inicio: '10:00', fin: '11:30' },
              servicio: { nombre: 'Instalación eléctrica' },
              proveedor: { nombre: 'María López' }
            }
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error al cargar citas:', error);
        notify('No se pudieron cargar las citas', 'error');
        setIsLoading(false);
      }
    };

    fetchCitas();
  }, [notify]);

  const handleCancel = async (id: string, reason: string) => {
    try {
      setCitas(citas.filter(cita => cita.id !== id));
      notify('Cita cancelada correctamente', 'success');
    } catch (error) {
      console.error('Error al cancelar cita:', error);
      notify('No se pudo cancelar la cita', 'error');
    }
  };

  const handleReprogram = async (id: string, newDate: string, newTime: string) => {
    try {
      setCitas(citas.map(cita => 
        cita.id === id 
          ? { 
              ...cita, 
              fecha: newDate,
              horario: { inicio: newTime, fin: '' }
            } 
          : cita
      ));
      notify('Cita reprogramada correctamente', 'success');
    } catch (error) {
      console.error('Error al reprogramar cita:', error);
      notify('No se pudo reprogramar la cita', 'error');
    }
  };

  const formatTimeRange = (inicio: string, fin: string) => {
    return `${inicio} - ${fin}`;
  };

  const isWithin3Hours = (fecha: string, inicio: string) => {
    const now = new Date();
    const [hours, minutes] = inicio.split(':').map(Number);
    const appointmentDate = new Date(fecha);
    appointmentDate.setHours(hours, minutes, 0, 0);
    
    return (appointmentDate.getTime() - now.getTime()) < (3 * 60 * 60 * 1000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Gestión de Citas</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : citas.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No tienes citas programadas</p>
        </div>
      ) : (
        <div className="space-y-4">
          {citas.map((cita) => (
            <div key={cita.id} className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-blue-500" />
                    {cita.servicio.nombre}
                  </h3>
                  
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="w-4 h-4" />
                      <span>{cita.proveedor.nombre}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(cita.fecha).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{formatTimeRange(cita.horario.inicio, cita.horario.fin)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  {isWithin3Hours(cita.fecha, cita.horario.inicio) && (
                    <div className="flex items-center gap-1 text-red-500 text-sm mb-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>Menos de 3h</span>
                    </div>
                  )}
                  <AppointmentActions 
                    appointment={{
                      id: cita.id,
                      fecha: cita.fecha,
                      horario: `${cita.horario.inicio} - ${cita.horario.fin}`,
                      servicio: cita.servicio.nombre,
                      proveedor: cita.proveedor.nombre
                    }}
                    onCancel={handleCancel}
                    onReprogram={handleReprogram}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
