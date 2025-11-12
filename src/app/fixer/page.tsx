"use client";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock, User, MapPin, FileText } from "lucide-react";
import Sidebar from "@/app/agenda/components/Sidebar";
import EditAppointmentModal from "@/app/worker/citas/components/EditAppointmentModal";
import ConfirmationModal from "@/app/worker/citas/components/confirmationModal";

interface Cita {
  _id: string;
  fecha: string;
  horario: { inicio: string; fin: string };
  estado: string;
  servicioId: { _id: string; nombre: string } | null;
  clienteId: { _id: string; nombre: string } | null;
}

export default function FixerScreen() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const FIXER_ID = "690c29d00c736bec44e473e4";

  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [tab, setTab] = useState<"programadas" | "cancelar">("programadas");
  const [filterServicio, setFilterServicio] = useState<string>("todos");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [citaToEdit, setCitaToEdit] = useState<Cita | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [citaToDelete, setCitaToDelete] = useState<Cita | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [isBatchConfirmOpen, setIsBatchConfirmOpen] = useState(false);

  useEffect(() => {
    // reusar fetchCitas simple pero con timeout para evitar bloqueo indefinido
    const sample = [
      { 
        _id: 'd1', 
        fecha: new Date().toISOString().split('T')[0], 
        horario: { inicio: '09:00', fin: '10:00' }, 
        estado: 'agendado', 
        servicioId: { 
          _id: 's1', 
          nombre: 'Servicio plomería',
          descripcion: 'Sesión de plomería para resolver problemas en tuberías, grifos y desagües.'
        }, 
        clienteId: { _id: 'c1', nombre: 'Jose Gutierrez' },
        ubicacion: { direccion: 'Calle siempre viva 742' }
      },
      { 
        _id: 'd2', 
        fecha: new Date().toISOString().split('T')[0], 
        horario: { inicio: '14:00', fin: '15:00' }, 
        estado: 'cancelado', 
        servicioId: { 
          _id: 's1', 
          nombre: 'Servicio plomería',
          descripcion: 'Sesión de plomería para resolver problemas en tuberías, grifos y desagües.'
        }, 
        clienteId: { _id: 'c2', nombre: 'Ana Perez' },
        ubicacion: { direccion: 'Av. Libertador 123' }
      },
    ];

    const load = async () => {
      setLoading(true);
      setError(null);
      setIsDemo(false);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      try {
        const res = await fetch(`${API_URL}/api/devcode/citas/proveedor/${FIXER_ID}`, { signal: controller.signal });
        const data = await res.json();
        if (data?.success) {
          setCitas(data.data);
        } else {
          throw new Error(data?.error || 'No data');
        }
      } catch (e: any) {
        console.error('Error loading fixer citas:', e);
        // fallback demo
        setCitas(sample);
        setIsDemo(true);
        if (e?.name === 'AbortError') setError('La solicitud tardó demasiado. Mostrando datos de ejemplo.');
        else setError((e && e.message) ? e.message + '. Mostrando datos de ejemplo.' : 'Error al cargar citas. Mostrando datos de ejemplo.');
      } finally {
        clearTimeout(timeout);
        setLoading(false);
      }
    };

    load();
  }, []);

  // Si se deseleccionan todas las citas, cerrar el modal de confirmación por lotes
  useEffect(() => {
    if (selectedIds.length === 0 && isBatchConfirmOpen) {
      setIsBatchConfirmOpen(false);
    }
  }, [selectedIds, isBatchConfirmOpen]);

  const servicios = useMemo(() => {
    const map = new Map<string,string>();
    citas.forEach(c => { if (c.servicioId) map.set(c.servicioId._id, c.servicioId.nombre); });
    return Array.from(map.entries());
  }, [citas]);

  const filtered = citas.filter(c => filterServicio === 'todos' ? true : c.servicioId?._id === filterServicio);

  const formatLongDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      // anchor midday UTC to avoid timezone off-by-one
      const d = new Date(dateStr.includes('T') ? dateStr : `${dateStr}T12:00:00Z`);
      const formatted = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(d);
      // capitalize first letter
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    } catch (e) {
      return dateStr;
    }
  };

  const getAddress = (c: any) => {
    // try multiple common fields, fallback to undefined
    return c.ubicacion?.direccion || c.direccion || c.address || c.domicilio || c.clienteId?.direccion || undefined;
  };

  const getDescription = (c: any) => {
    return c.servicioId?.descripcion || c.descripcion || c.descripcionServicio || c.notes || c.note || c.descripcionCorta || 'Sin descripción';
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);
  };

  const handleBatchCancel = async () => {
    // optimistic
    const prev = [...citas];
    setCitas(prev => prev.map(c => selectedIds.includes(c._id) ? { ...c, estado: 'cancelado' } : c));
    setSelectedIds([]);
    setIsBatchConfirmOpen(false);
    // send requests
    for (const id of selectedIds) {
      try {
        await fetch(`${API_URL}/api/devcode/citas/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ estado: 'cancelado', proveedorId: FIXER_ID }) });
      } catch (e) {
        console.error('batch cancel error', e);
        setCitas(prev => prev.map(c => c._id === id ? { ...c, estado: prev.find(p=>p._id===id)?.estado ?? 'agendado' } : c));
      }
    }
  };

  const handleSingleCancel = (cita: Cita) => {
    setCitaToDelete(cita);
    setIsConfirmOpen(true);
  };

  const confirmSingleCancel = async () => {
    if (!citaToDelete) return;
    setIsConfirmOpen(false);
    setCitas(prev => prev.map(c => c._id === citaToDelete._id ? { ...c, estado: 'cancelado' } : c));
    try {
      await fetch(`${API_URL}/api/devcode/citas/${citaToDelete._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ estado: 'cancelado', proveedorId: FIXER_ID }) });
    } catch (e) {
      console.error(e);
    } finally {
      setCitaToDelete(null);
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;

  return (
    <>
      <Sidebar />
      <div className="ml-0 md:ml-64 min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto border rounded-lg overflow-hidden">

          <div className="p-4">
            <div className="flex gap-4">
              <button onClick={() => setTab('programadas')} className={`flex-1 py-3 rounded-lg ${tab==='programadas' ? 'bg-[#1C3FAA] text-white' : 'bg-white text-gray-700 border'}`}>Citas programadas</button>
              <button onClick={() => setTab('cancelar')} className={`flex-1 py-3 rounded-lg ${tab==='cancelar' ? 'bg-[#1C3FAA] text-white' : 'bg-white text-gray-700 border'}`}>Cancelar varias citas</button>
            </div>

            <p className="mt-3 text-sm text-gray-700">
              <span className="font-semibold">Gestión de Citas:</span> Administra tus citas recibidas en función de tu horario laboral establecido
            </p>
          </div>

          <div className="p-4 border-t">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium">Filtrar por:</label>
                <select value={filterServicio} onChange={e=>setFilterServicio(e.target.value)} className="border rounded px-3 py-1">
                  <option value="todos">Todos</option>
                  {servicios.map(([id,nombre]) => (<option key={id} value={id}>{nombre}</option>))}
                </select>
              </div>
              {tab === 'cancelar' && (
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
                      {tab==='cancelar' && (
                        <input type="checkbox" checked={selectedIds.includes(cita._id)} onChange={()=>toggleSelect(cita._id)} className="w-5 h-5" />
                      )}
                      <div className="flex-1 font-semibold">{cita.servicioId?.nombre}</div>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                        <div className="md:col-span-4">
                          <div className="flex items-center gap-3 text-gray-700 mb-2"><CalendarDays className="w-7 h-7 text-[#1C3FAA]" /> <div className="text-sm">{formatLongDate(cita.fecha)}</div></div>
                          <div className="flex items-center gap-3 text-gray-700 mb-2"><Clock className="w-7 h-7 text-[#1C3FAA]" /> <div className="text-sm">{cita.horario.inicio} - {cita.horario.fin}</div></div>
                        </div>

                        <div className="md:col-span-5">
                          <div className="flex items-center gap-3 text-gray-700 mb-2"><User className="w-7 h-7 text-[#1C3FAA]" /> <div className="text-sm font-medium">{cita.clienteId?.nombre ?? 'Sin nombre'}</div></div>
                          <div className="flex items-center gap-3 text-gray-700"><MapPin className="w-7 h-7 text-[#1C3FAA]" /> <div className="text-sm">{getAddress(cita) ?? 'Dirección no disponible'}</div></div>
                        </div>

                        <div className="md:col-span-3">
                          <div className="flex items-center gap-3 text-gray-700"><FileText className="w-7 h-7 text-[#1C3FAA]" /><div className="text-sm">{getDescription(cita)}</div></div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-3">
                        <span className={`${estado==='cancelado' ? 'bg-red-500' : 'bg-green-500'} inline-block w-3 h-3 rounded-full`} />
                        <span className="text-sm font-medium text-gray-700">{estado==='cancelado' ? 'Cancelado' : 'Agendado'}</span>
                      </div>
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

      {citaToEdit && (
        <EditAppointmentModal isOpen={isEditOpen} onClose={()=>{ setIsEditOpen(false); setCitaToEdit(null); }} cita={citaToEdit} proveedorId={FIXER_ID} isDemo={isDemo} onUpdate={(updated)=>{ if(!updated) return; setCitas(prev=>prev.map(c=>c._id===updated._id?{...c, fecha: updated.fecha, horario: updated.horario, estado: updated.estado ?? 'agendado'}:c)); if(!updated) { } }} />
      )}

      {citaToDelete && isConfirmOpen && (
        <ConfirmationModal
          isOpen={isConfirmOpen}
          onClose={() => { setIsConfirmOpen(false); setCitaToDelete(null); }}
          onConfirm={confirmSingleCancel}
          title="Cancelar Cita"
          message="¿Estás seguro de que deseas cancelar esta cita? Esta acción no se puede deshacer."
        />
      )}

      {isBatchConfirmOpen && selectedIds.length > 0 && (
        <ConfirmationModal
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
