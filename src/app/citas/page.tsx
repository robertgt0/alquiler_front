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
  estado: 'programado' | 'pendiente' | 'cancelado';
  solicitud?: string;
  ubicacion?: string;
};

export default function CitasPage() {
  const [activeTab, setActiveTab] = useState<'citas' | 'horarios'>('citas');
  const [activeSubTab, setActiveSubTab] = useState<'programadas' | 'cancelar'>('programadas');
  const [citas, setCitas] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { notify } = useNotifications();

  useEffect(() => {
    // Datos de ejemplo con la estructura ampliada
    setTimeout(() => {
      setCitas([
        {
          id: '1',
          fecha: '2025-11-10',
          horario: { inicio: '14:00', fin: '15:00' },
          servicio: { nombre: 'Reparación de tuberías' },
          proveedor: { nombre: 'Juan Pérez' },
          estado: 'programado',
          solicitud: 'Solicitud del servicio de plomería para solucionar mi problema urgente',
          ubicacion: 'Calle siempre viva 123'
        },
        {
          id: '2',
          fecha: '2025-11-12',
          horario: { inicio: '10:00', fin: '11:30' },
          servicio: { nombre: 'Instalación eléctrica' },
          proveedor: { nombre: 'María López' },
          estado: 'pendiente',
          solicitud: 'Necesito revisar la instalación eléctrica de mi cocina',
          ubicacion: 'Avenida Central 456'
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleCancel = async (id: string, reason: string) => {
    // ... (lógica de cancelación existente)
  };

  const handleReprogram = async (id: string, newDate: string, newTime: string) => {
    // ... (lógica de reprogramación existente)
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

  return (
    <div className="min-h-full bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navbar */}
      <nav className="bg-white shadow-lg border-b-4 border-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-900">Mi Consultorio</h1>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <button 
                  onClick={() => setActiveTab('citas')}
                  className={`px-3 py-2 text-sm font-medium ${activeTab === 'citas' ? 'text-blue-900 border-b-2 border-blue-900' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-transparent'} transition-all duration-200`}
                >
                  Mis Citas
                </button>
                <button 
                  onClick={() => setActiveTab('horarios')}
                  className={`px-3 py-2 text-sm font-medium ${activeTab === 'horarios' ? 'text-blue-900 border-b-2 border-blue-900' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-transparent'} transition-all duration-200`}
                >
                  Horarios Laborales
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'citas' && (
          <section className="bg-white rounded-2xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold mb-2 text-gray-800">Gestiona tus citas programadas</h2>
            <p className="text-gray-600 mb-6 text-sm">Gestión de Citas: Administra tus citas recibidas</p>
            
            {/* Pestañas */}
            <div className="mb-6">
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
                <button 
                  onClick={() => setActiveSubTab('programadas')}
                  className={`flex-1 px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${activeSubTab === 'programadas' ? 'bg-blue-900 text-white shadow-sm' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'}`}
                >
                  Citas Programadas
                </button>
                <button 
                  onClick={() => setActiveSubTab('cancelar')}
                  className={`flex-1 px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${activeSubTab === 'cancelar' ? 'bg-blue-900 text-white shadow-sm' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'}`}
                >
                  Cancelar Varias Citas
                </button>
              </div>
            </div>

            {activeSubTab === 'programadas' && (
              <div className="bg-gray-50 rounded-xl p-6 border-4 border-gray-200 shadow-inner">
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
                      <div key={cita.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-indigo-200">
                        <h3 className="text-xl font-bold text-gray-800 mb-5 border-b border-gray-100 pb-3">{cita.servicio.nombre}</h3>
                        
                        <div className="mb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Columna Izquierda */}
                          <div className="space-y-3">
                            <div className="flex items-center text-gray-700">
                              <User className="w-5 h-5 mr-3 text-indigo-500" />
                              <span className="font-medium">{cita.proveedor.nombre}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                              <Wrench className="w-5 h-5 mr-3 text-indigo-500" />
                              <span>{cita.ubicacion}</span>
                            </div>
                          </div>
                          
                          {/* Columna Derecha */}
                          <div className="space-y-3">
                            <div className="flex items-center text-gray-700">
                              <CalendarDays className="w-5 h-5 mr-3 text-indigo-500" />
                              <span>{formatDate(cita.fecha)}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                              <Clock className="w-5 h-5 mr-3 text-indigo-500" />
                              <span className="font-medium">{cita.horario.inicio} - {cita.horario.fin}</span>
                            </div>
                          </div>
                        </div>
                        
                        {cita.solicitud && (
                          <div className="mb-5 bg-gray-50 rounded-lg p-4">
                            <div className="flex items-start">
                              <AlertCircle className="w-5 h-5 mr-3 text-indigo-500 mt-0.5 flex-shrink-0" />
                              <p className="text-gray-600 text-sm italic leading-relaxed">"{cita.solicitud}"</p>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                          <div className="flex gap-2">
                            <span className={`px-4 py-2 text-sm rounded-full font-medium ${
                              cita.estado === 'programado' ? 'bg-green-100 text-green-800' :
                              cita.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {cita.estado === 'programado' ? 'Programado' :
                               cita.estado === 'pendiente' ? 'Pendiente' : 'Cancelado'}
                            </span>
                          </div>
                          
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
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {activeSubTab === 'cancelar' && (
              <div className="bg-gray-50 rounded-xl p-6 border-4 border-gray-200 shadow-inner">
                {/* Implementar lógica de cancelación múltiple */}
                <p className="text-center py-12 text-gray-500">Selecciona citas para cancelar</p>
              </div>
            )}
          </section>
        )}
        
        {activeTab === 'horarios' && (
          <section className="bg-white rounded-2xl p-8 shadow-2xl border-4 border-dashed border-gray-300">
            <div className="text-center">
              <CalendarDays className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-600 mb-2">Horarios Laborales</h2>
              <p className="text-gray-500">Configura tu disponibilidad de horarios</p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
