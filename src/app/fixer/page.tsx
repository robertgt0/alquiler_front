'use client';

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock, User, MapPin, FileText } from "lucide-react";
import Sidebar from "../agenda/components/Sidebar";
import EditAppointmentModal from "../worker/citas/components/CancelReprogramModal";
import ModalConfirmacion from "../agenda/components/ModalConfirmacion";

interface Cita {
  _id: string;
  fecha: string;
  horario: { inicio: string; fin: string };
  estado: string;
  servicioId?: { _id: string; nombre?: string; descripcion?: string; duracion?: number } | null;
  proveedorId?: { _id: string; nombre?: string } | null;
  clienteId?: { nombre?: string; apellido?: string; email?: string };
  ubicacion?: { direccion?: string };
}

interface Appointment {
  id: string;
  fecha: string;
  horario: { inicio: string; fin: string };
  servicio: { nombre: string };
  proveedor: { nombre: string };
  estado: 'agendado' | 'pendiente' | 'cancelado' | 'concluido' | 'reprogramar';
  ubicacion?: string;
}

// Función de mapeo de Cita -> Appointment
const mapCitaToAppointment = (c: Cita): Appointment => ({
  id: c._id,
  fecha: c.fecha,
  horario: c.horario,
  servicio: { nombre: c.servicioId?.nombre || 'Sin servicio' },
  proveedor: { nombre: c.proveedorId?.nombre || 'Sin proveedor' },
  estado: (c.estado as Appointment['estado']) || 'agendado',
  ubicacion: c.ubicacion?.direccion
});

export default function FixerScreen() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"programadas" | "cancelar">("programadas");
  const [filterServicio, setFilterServicio] = useState<string>("todos");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [citaToEdit, setCitaToEdit] = useState<Cita | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [citaToDelete, setCitaToDelete] = useState<Cita | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [isBatchConfirmOpen, setIsBatchConfirmOpen] = useState(false);

  // FETCH CITAS
  useEffect(() => {
    const sample: Cita[] = [
      { 
        _id: 'd1', 
        fecha: new Date().toISOString().split('T')[0], 
        horario: { inicio: '09:00', fin: '10:00' }, 
        estado: 'agendado', 
        servicioId: { _id: 's1', nombre: 'Servicio plomería', descripcion: 'Sesión de plomería' }, 
        clienteId: { nombre: 'Jose Gutierrez' },
        proveedorId: { _id: 'p1', nombre: 'Juan' },
        ubicacion: { direccion: 'Calle siempre viva 742' }
      },
      { 
        _id: 'd2', 
        fecha: new Date().toISOString().split('T')[0], 
        horario: { inicio: '14:00', fin: '15:00' }, 
        estado: 'cancelado', 
        servicioId: { _id: 's1', nombre: 'Servicio plomería', descripcion: 'Sesión de plomería' }, 
        clienteId: { nombre: 'Ana Perez' },
        proveedorId: { _id: 'p2', nombre: 'Luis' },
        ubicacion: { direccion: 'Av. Libertador 123' }
      },
    ];

    const load = async () => {
      setLoading(true);
      setError(null);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      try {
        const res = await fetch(`${API_URL}/api/devcode/citas/proveedor/690c29d00c736bec44e473e4`, { signal: controller.signal });
        const data = await res.json();
        if (data?.success) {
          setCitas(data.data);
        } else {
          throw new Error(data?.error || 'No data');
        }
      } catch (e: any) {
        console.error('Error loading fixer citas:', e);
        setCitas(sample);
        setError(e?.name === 'AbortError' ? 'La solicitud tardó demasiado. Mostrando datos de ejemplo.' : 'Error al cargar citas. Mostrando datos de ejemplo.');
      } finally {
        clearTimeout(timeout);
        setLoading(false);
      }
    };

    load();
  }, []);

  const servicios = useMemo(() => {
    const map = new Map<string,string>();
    citas.forEach(c => { if (c.servicioId) map.set(c.servicioId._id, c.servicioId.nombre!); });
    return Array.from(map.entries());
  }, [citas]);

  const filtered = citas.filter(c => filterServicio === 'todos' ? true : c.servicioId?._id === filterServicio);

  const formatLongDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr.includes('T') ? dateStr : `${dateStr}T12:00:00Z`);
      return new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(d)
        .replace(/^./, str => str.toUpperCase());
    } catch {
      return dateStr;
    }
  };

  const getAddress = (c: Cita) => c.ubicacion?.direccion || 'Dirección no disponible';
  const getDescription = (c: Cita) => c.servicioId?.descripcion || 'Sin descripción';

  const toggleSelect = (id: string) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);

  const handleBatchCancel = async () => {
    const prev = [...citas];
    setCitas(prev => prev.map(c => selectedIds.includes(c._id) ? { ...c, estado: 'cancelado' } : c));
    setSelectedIds([]);
    setIsBatchConfirmOpen(false);
    for (const id of selectedIds) {
      try {
        await fetch(`${API_URL}/api/devcode/citas/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ estado: 'cancelado' }) });
      } catch (e) {
        console.error(e);
        setCitas(prev => prev.map(c => c._id === id ? { ...c, estado: prev.find(p=>p._id===id)?.estado ?? 'agendado' } : c));
      }
    }
  };

  const handleSingleCancel = (cita: Cita) => { setCitaToDelete(cita); setIsConfirmOpen(true); };
  const confirmSingleCancel = async () => {
    if (!citaToDelete) return;
    setIsConfirmOpen(false);
    setCitas(prev => prev.map(c => c._id === citaToDelete._id ? { ...c, estado: 'cancelado' } : c));
    try {
      await fetch(`${API_URL}/api/devcode/citas/${citaToDelete._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ estado: 'cancelado' }) });
    } catch (e) { console.error(e); } finally { setCitaToDelete(null); }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;

  return (
    <>
      <Sidebar />
      <div className="ml-0 md:ml-64 min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto border rounded-lg overflow-hidden">

          {/* Tabs */}
          <div className="p-4">
            <div className="flex gap-4">
              <button onClick={() => setTab('programadas')} className={`flex-1 py-3 rounded-lg ${tab==='programadas' ? 'bg-[#1C3FAA] text-white' : 'bg-white text-gray-700 border'}`}>Citas programadas</button>
              <button onClick={() => setTab('cancelar')} className={`flex-1 py-3 rounded-lg ${tab==='cancelar' ? 'bg-[#1C3FAA] text-white' : 'bg-white text-gray-700 border'}`}>Cancelar varias citas</button>
            </div>
            <p className="mt-3 text-sm text-gray-700">
              <span className="font-semibold">Gestión de Citas:</span> Administra tus citas recibidas en función de tu horario laboral
            </p>
          </div>

          {/* Filtros y listado de citas */}
          <div className="p-4 border-t">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium">Filtrar por:</label>
                <select value={filterServicio} onChange={e=>setFilterServicio(e.target.value)} className="border rounded px-3 py-1">
                  <option value="todos">Todos</option>
                  {servicios.map(([id,nombre]) => (<option key={id} value={id}>{nombre}</option>))}
                </select>
              </div>
              {tab==='cancelar' && (
                <div>
                  <button disabled={selectedIds.length===0} onClick={()=>setIsBatchConfirmOpen(true)} className={`px-4 py-2 rounded ${selectedIds.length===0 ? 'bg-gray-200 text-gray-500' : 'bg-red-600 text-white'}`}>Cancelar seleccionadas</button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {filtered.map(cita => {
                const estado = (cita.estado||'').toLowerCase();
                return (
                  <div key={cita._id} className="bg-white rounded-lg shadow-sm border border-[#1C3FAA] overflow-hidden">
                    <div className="flex items-center gap-4 bg-[#1C3FAA] text-white p-4">
                      {tab==='cancelar' && <input type="checkbox" checked={selectedIds.includes(cita._id)} onChange={()=>toggleSelect(cita._id)} className="w-5 h-5" />}
                      <div className="flex-1 font-semibold">{cita.servicioId?.nombre}</div>
                    </div>

                    <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                      <div className="md:col-span-4">
                        <div className="flex items-center gap-3 text-gray-700 mb-2"><CalendarDays className="w-7 h-7 text-[#1C3FAA]" /> <div className="text-sm">{formatLongDate(cita.fecha)}</div></div>
                        <div className="flex items-center gap-3 text-gray-700 mb-2"><Clock className="w-7 h-7 text-[#1C3FAA]" /> <div className="text-sm">{cita.horario.inicio} - {cita.horario.fin}</div></div>
                      </div>

                      <div className="md:col-span-5">
                        <div className="flex items-center gap-3 text-gray-700 mb-2"><User className="w-7 h-7 text-[#1C3FAA]" /> <div className="text-sm font-medium">{cita.clienteId?.nombre ?? 'Sin nombre'}</div></div>
                        <div className="flex items-center gap-3 text-gray-700"><MapPin className="w-7 h-7 text-[#1C3FAA]" /> <div className="text-sm">{getAddress(cita)}</div></div>
                      </div>

                      <div className="md:col-span-3">
                        <div className="flex items-center gap-3 text-gray-700"><FileText className="w-7 h-7 text-[#1C3FAA]" /><div className="text-sm">{getDescription(cita)}</div></div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-3 px-4">
                      <span className={`${estado==='cancelado' ? 'bg-red-500' : 'bg-green-500'} inline-block w-3 h-3 rounded-full`} />
                      <span className="text-sm font-medium text-gray-700">{estado==='cancelado' ? 'Cancelado' : 'Agendado'}</span>
                    </div>

                    <div className="p-4 flex justify-end gap-3 bg-white">
                      <button onClick={()=>handleSingleCancel(cita)} className="px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 text-gray-700">Cancelar</button>
                      <button onClick={()=>{ setCitaToEdit(cita); setIsEditOpen(true); }} className="px-3 py-1.5 text-sm font-medium rounded-md bg-[#1C3FAA] text-white">Reprogramar</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Reprogramar */}
      {citaToEdit && (
        <EditAppointmentModal
          isOpen={isEditOpen}
          onClose={() => { setIsEditOpen(false); setCitaToEdit(null); } }
          appointment={mapCitaToAppointment(citaToEdit)}
          onUpdate={(updated) => {
            if (!updated) return;
            setCitas(prev => prev.map(c => c._id === updated.id ? { ...c, fecha: updated.fecha, horario: updated.horario, estado: updated.estado } : c));
          } } onCancel={function (id: string, reason: string): Promise<void> {
            throw new Error("Function not implemented.");
          } } onReprogram={function (id: string, newDate: string, newTime: string): Promise<void> {
            throw new Error("Function not implemented.");
          } } actionType={"cancel"} citaId={""}        />

      )}

      {/* Modal Cancelar individual */}
      {citaToDelete && isConfirmOpen && (
        <ModalConfirmacion
          isOpen={isConfirmOpen}
          onClose={() => { setIsConfirmOpen(false); setCitaToDelete(null); }}
          onConfirm={confirmSingleCancel}
          title="Cancelar Cita"
          message="¿Estás seguro de que deseas cancelar esta cita? Esta acción no se puede deshacer."
        />
      )}

      {/* Modal Cancelar batch */}
      {isBatchConfirmOpen && selectedIds.length > 0 && (
        <ModalConfirmacion
          isOpen={true}
          onClose={() => setIsBatchConfirmOpen(false)}
          onConfirm={handleBatchCancel}
          title="Cancelar varias citas"
          message={`¿Deseas cancelar ${selectedIds.length} citas seleccionadas?`}
        />
      )}

    </>
  );
}
