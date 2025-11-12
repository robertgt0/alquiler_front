'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock, User, Wrench, AlertCircle, ChevronDown, MoreHorizontal } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';
import AppointmentActions from './components/AppointmentActions';

type Appointment = {
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
  estado: 'agendado' | 'pendiente' | 'cancelado' | 'concluido' | 'reprogramar';
  solicitud?: string;
  ubicacion?: string;
  solicitudId?: string;
  solicitudFecha?: string;
  reprogramCount?: number; 
};

export default function CitasPage() {
  const [activeSubTab, setActiveSubTab] = useState<'programadas' | 'cancelar'>('programadas');
  const [citas, setCitas] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterValue, setFilterValue] = useState('Todos');
  const { notify } = useNotifications();
  const [userRole, setUserRole] = useState<'requester' | 'fixer'>('requester'); // 'requester' por defecto

  useEffect(() => {
    // Datos de ejemplo con la estructura ampliada
    setTimeout(() => {
      setCitas([
        {
          id: '1',
          fecha: '2025-11-05',
          horario: { inicio: '14:00', fin: '15:00' },
          servicio: { nombre: 'Servicio plomería' },
          proveedor: { nombre: 'Jose Gutierrez' },
          estado: 'reprogramar',
          solicitud: 'Solicitud del servicio de plomería para solucionar mi problema urgente.',
          ubicacion: 'Calle siempre viva',
          solicitudId: '28/10/2025',
          solicitudFecha: '9:38:39',
          reprogramCount: 0 // Inicializar el contador
        },
        {
          id: '2',
          fecha: '2025-11-09',
          horario: { inicio: '14:00', fin: '15:00' },
          servicio: { nombre: 'Servicio plomería' },
          proveedor: { nombre: 'Jose Gutierrez' },
          estado: 'cancelado',
          solicitud: 'Solicitud del servicio de plomería para solucionar mi problema urgente.',
          ubicacion: 'Calle siempre viva',
          solicitudId: '28/10/2025',
          solicitudFecha: '9:38:39',
          reprogramCount: 0
        },
        {
          id: '3',
          fecha: '2025-11-05',
          horario: { inicio: '14:00', fin: '15:00' },
          servicio: { nombre: 'Servicio plomería' },
          proveedor: { nombre: 'Jose Gutierrez' },
          estado: 'pendiente',
          solicitud: 'Solicitud del servicio de plomería para solucionar mi problema urgente.',
          ubicacion: 'Calle siempre viva',
          solicitudId: '28/10/2025',
          solicitudFecha: '9:38:39',
          reprogramCount: 0
        },
        {
          id: '4',
          fecha: '2025-11-05',
          horario: { inicio: '14:00', fin: '15:00' },
          servicio: { nombre: 'Servicio plomería' },
          proveedor: { nombre: 'Jose Gutierrez' },
          estado: 'concluido',
          solicitud: 'Solicitud del servicio de plomería para solucionar mi problema urgente.',
          ubicacion: 'Calle siempre viva',
          solicitudId: '28/10/2025',
          solicitudFecha: '9:38:39',
          reprogramCount: 0
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleCancel = async (id: string, reason: string) => {
    try {
      // Aquí iría la llamada al endpoint: PUT /api/citas/{id}/cancelar
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCitas(citas.map(cita => 
        cita.id === id 
          ? { ...cita, estado: 'cancelado' } 
          : cita
      ));
      
      notify('Cita cancelada exitosamente', 'success');
    } catch (error) {
      notify('Error al cancelar cita', 'error');
    }
  };

  const handleReprogram = async (id: string, newDate: string, newTime: string) => {
    try {
      // Obtener la cita actual
      const cita = citas.find((c) => c.id === id);
      if (!cita) throw new Error('Cita no encontrada');

      // Soporte no intrusivo y retrocompatible: usamos una propiedad auxiliar reprogramCount
      const reprogramCount = typeof (cita as any).reprogramCount === 'number' ? (cita as any).reprogramCount : 0;

      // Regla 1: No permitir más de 3 reprogramaciones
      if (reprogramCount >= 3) {
        notify('No puedes reprogramar esta cita más de 3 veces. Contacta soporte.', 'error');
        return;
      }

      // Regla 2: No permitir reprogramar con menos de 3 horas de anticipación
      const now = new Date();
      const citaDate = new Date(newDate);
      const [hours, minutes] = newTime.split(':').map(Number);
      citaDate.setHours(hours, minutes, 0, 0);
      if ((citaDate.getTime() - now.getTime()) < 3 * 60 * 60 * 1000) {
        notify('No puedes reprogramar con menos de 3 horas de anticipación.', 'error');
        return;
      }

      // Simula la llamada a API y en la respuesta incrementa el contador
      await new Promise(resolve => setTimeout(resolve, 1000));

      setCitas(citas.map(citaObj =>
        citaObj.id === id
          ? {
              ...citaObj,
              fecha: newDate,
              horario: { inicio: newTime, fin: citaObj.horario.fin },
              estado: 'reprogramar',
              reprogramCount: reprogramCount + 1,
            }
          : citaObj
      ));

      notify('Cita reprogramada exitosamente', 'success');
    } catch (error) {
      notify('Error al reprogramar cita', 'error');
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const getEstadoConfig = (estado: string) => {
    switch (estado) {
      case 'agendado':
        return { color: 'bg-green-500', text: 'Agendado', textColor: 'text-green-600' };
      case 'cancelado':
        return { color: 'bg-red-500', text: 'Cancelado', textColor: 'text-red-600' };
      case 'pendiente':
        return { color: 'bg-yellow-500', text: 'Pendiente', textColor: 'text-yellow-600' };
      case 'concluido':
        return { color: 'bg-green-600', text: 'Concluido', textColor: 'text-green-700' };
      case 'reprogramar':
        return { color: 'bg-orange-500', text: 'Reprogramar Cita', textColor: 'text-orange-600' };
      default:
        return { color: 'bg-gray-500', text: estado, textColor: 'text-gray-600' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <main className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Gestiona tus citas programadas</h2>
          
          {/* Pestañas */}
          <div className="flex gap-4 mb-6">
            <button 
              onClick={() => setActiveSubTab('programadas')}
              className={`flex-1 px-6 py-3 text-base font-semibold rounded-lg transition-all ${activeSubTab === 'programadas' ? 'bg-blue-900 text-white' : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50'}`}
            >
              Citas programadas
            </button>
            <button 
              onClick={() => setActiveSubTab('cancelar')}
              className={`flex-1 px-6 py-3 text-base font-semibold rounded-lg transition-all ${activeSubTab === 'cancelar' ? 'bg-blue-900 text-white' : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50'}`}
            >
              Cancelar varias citas
            </button>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <span className="text-sm font-medium">Vista:</span>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setUserRole(userRole === 'requester' ? 'fixer' : 'requester')}
              className="px-3 py-1 text-sm"
            >
              {userRole === 'requester' ? 'Solicitante' : 'Reparador'}
            </Button>
          </div>

          {activeSubTab === 'programadas' && (
            <div>
              <p className="text-sm text-gray-600 mb-4"><span className="font-semibold">Gestión de Citas:</span> Administra tus citas recibidas en función de tu horario laboral establecido.</p>
              
              {/* Filtro */}
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Filtrar por:</span>
                  <div className="relative">
                    <select 
                      value={filterValue}
                      onChange={(e) => setFilterValue(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option>Todos</option>
                      <option>Agendado</option>
                      <option>Cancelado</option>
                      <option>Pendiente</option>
                      <option>Concluido</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-900 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : citas.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No tienes citas programadas</p>
                  </div>
                ) : (
                  citas.map((cita) => {
                    const estadoConfig = getEstadoConfig(cita.estado);
                    return (
                      <div key={cita.id} className="border border-gray-200 rounded-lg overflow-hidden mb-4">
                        {/* Header azul */}
                        <div className="bg-blue-900 text-white px-6 py-3">
                          <h3 className="font-semibold text-base">{cita.servicio.nombre}</h3>
                          <p className="text-xs text-blue-200">Solicitado: {cita.solicitudId}, {cita.solicitudFecha}</p>
                        </div>
                        
                        {/* Contenido */}
                        <div className="bg-white px-6 py-4">
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            {/* Columna 1 */}
                            <div className="space-y-2">
                              <div className="flex items-start gap-2">
                                <CalendarDays className="w-4 h-4 text-gray-600 mt-0.5" />
                                <span className="text-sm text-gray-700">
                                  {new Date(cita.fecha).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                              </div>
                              <div className="flex items-start gap-2">
                                <Clock className="w-4 h-4 text-gray-600 mt-0.5" />
                                <span className="text-sm text-gray-700">{cita.horario.inicio} - {cita.horario.fin}</span>
                              </div>
                            </div>
                            
                            {/* Columna 2 */}
                            <div className="space-y-2">
                              <div className="flex items-start gap-2">
                                <User className="w-4 h-4 text-gray-600 mt-0.5" />
                                <span className="text-sm text-gray-700">{cita.proveedor.nombre}</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <Wrench className="w-4 h-4 text-gray-600 mt-0.5" />
                                <span className="text-sm text-gray-700">{cita.ubicacion}</span>
                              </div>
                            </div>
                            
                            {/* Columna 3 */}
                            <div>
                              <div className="flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-gray-600 mt-0.5" />
                                <span className="text-sm text-gray-700">{cita.solicitud}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Estado y botones */}
                          <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${estadoConfig.color}`}></div>
                              <span className={`text-sm font-medium ${estadoConfig.textColor}`}>{estadoConfig.text}</span>
                            </div>
                            
							<AppointmentActions 
							appointment={{
								id: cita.id,
								fecha: cita.fecha,
								horario: { inicio: cita.horario.inicio, fin: cita.horario.fin },
								servicio: cita.servicio,
								proveedor: cita.proveedor,
								estado: cita.estado,
								reprogramCount: cita.reprogramCount
							}}
							onCancel={handleCancel}
							onReprogram={handleReprogram}
							isFixer={userRole === 'fixer'}
							/>


                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
          
          {activeSubTab === 'cancelar' && (
            <div>
              <p className="text-center py-12 text-gray-500">Selecciona citas para cancelar</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}