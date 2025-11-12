'use client';

import { useState, useEffect, Fragment } from "react";
import { CalendarDays, AlertTriangle } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link"; // 🔹 Asegúrate de importar Link

const PROVEEDOR_ID = "690c29d00c736bec44e473e4";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Cita {
  _id: string;
  fecha: string;
  horario: { inicio: string; fin: string };
  clienteId?: { nombre?: string; apellido?: string; email?: string };
  servicioId?: { nombre?: string; descripcion?: string };
  ubicacion?: { direccion?: string };
  estado?: string;
}

export default function GestionCitas() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"programadas" | "cancelar">("programadas");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [groupedCitas, setGroupedCitas] = useState<Record<string, Cita[]>>({});
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedDayCitas, setSelectedDayCitas] = useState<Cita[] | null>(null);

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  // 🔹 Cargar citas
  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const res = await fetch(`${API_URL}/api/devcode/citas/proveedor/${PROVEEDOR_ID}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.error || "Error al cargar citas");
        setCitas(data.data);
      } catch (err) {
        console.error("Error cargando citas:", err);
      }
    };
    fetchCitas();
  }, []);

  // 🔹 Agrupar citas por fecha
  useEffect(() => {
    const agrupadas: Record<string, Cita[]> = {};
    citas.forEach((cita) => {
      const fecha = cita.fecha.split("T")[0];
      if (!agrupadas[fecha]) agrupadas[fecha] = [];
      agrupadas[fecha].push(cita);
    });
    setGroupedCitas(agrupadas);
  }, [citas]);

  // 🔹 Filtro de fechas
  const citasFiltradas = Object.entries(groupedCitas).filter(([fecha]) => {
    if (!selectedDate) return true;
    return fecha === selectedDate;
  });

  const handleResetFilter = () => setSelectedDate("");

  const toggleCita = (fecha: string) => {
    setSelectedIds((prev) =>
      prev.includes(fecha) ? prev.filter((i) => i !== fecha) : [...prev, fecha]
    );
  };

  const openModal = (citasDia: Cita[]) => {
    setSelectedDayCitas(citasDia);
    setShowDetailsModal(true);
  };

  const formatearFecha = (fechaStr: string) => {
    const [year, month, day] = fechaStr.split("-").map(Number);
    const fecha = new Date(year, month - 1, day);
    return fecha.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const handleCancelar = () => {
    if (selectedIds.length === 0) {
      alert("Selecciona al menos una cita para cancelar.");
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmarCancelacion = async () => {
    try {
      const citasAEliminar = citas.filter((c) =>
        selectedIds.includes(c.fecha.split("T")[0])
      );

      for (const cita of citasAEliminar) {
        const res = await fetch(`${API_URL}/api/devcode/citas/${cita._id}/proveedor`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ proveedorId: PROVEEDOR_ID }),
        });
        const result = await res.json();
        if (!result.success) throw new Error(result.error || "Error al eliminar cita");
      }

      setCitas((prev) => prev.filter((c) => !selectedIds.includes(c.fecha.split("T")[0])));
      setSelectedIds([]);
      setShowConfirmModal(false);
      setShowSuccessModal(true);
    } catch (err) {
      console.error(err);
      alert("Error al cancelar las citas");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {/* HEADER */}
      <header className="flex justify-between items-center px-6 py-4 border-b shadow-sm bg-white">
        <h1 className="text-2xl font-bold text-blue-700">Servineo</h1>
        <nav className="flex gap-6 text-blue-700 font-medium">
          <a href="/gestioncitas" className="hover:underline">Mis Citas</a>
          <a href="/worker/registrarHorarios" className="hover:underline">Horarios Laborales</a>
        </nav>
      </header>

    {/* MAIN */}
    <main className="flex flex-col items-center py-8 px-4 flex-1">
    <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md p-6">
					  {/* 🔹 Botón Volver */}
					<Link
						href="/worker"
						className="inline-block mb-6 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow transition-all"
					>
						← Volver
					</Link>

        <h2 className="text-2xl font-bold text-gray-900 mb-1">
        Gestiona tus citas programadas
        </h2>
        <p className="text-gray-600 mb-6">
        Administra tus citas recibidas o cancela días completos de atención.
        </p>

          {/* Pestañas */}
          <div className="flex w-full mb-8 justify-center gap-4">
            {["programadas", "cancelar"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-3 font-semibold rounded-lg border transition-all ${
                  activeTab === tab
                    ? "bg-blue-900 text-white border-blue-900"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {tab === "programadas" ? "Citas Programadas" : "Cancelar Varias Citas"}
              </button>
            ))}
          </div>

          {/* VISTA: Citas Programadas */}
          {activeTab === "programadas" && (
            <div className="flex flex-col gap-4">
              {citas.length === 0 ? (
                <p className="text-gray-500 text-center">No hay citas programadas.</p>
              ) : (
                Object.entries(groupedCitas).map(([fecha, citasDia]) => (
                  <div
                    key={fecha}
                    className="flex justify-between items-center border rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <CalendarDays className="text-blue-600 w-5 h-5" />
                      <div>
                        <h3 className="font-semibold text-gray-900 capitalize">
                          {formatearFecha(fecha)}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {citasDia.length} cita{citasDia.length > 1 ? "s" : ""} programada
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => openModal(citasDia)}
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      Ver detalles
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* VISTA: Cancelar Varias Citas */}
          {activeTab === "cancelar" && (
            <>
              <div className="flex items-center gap-2 mb-4 text-yellow-600 bg-yellow-50 border border-yellow-100 rounded-md p-3">
                <AlertTriangle className="w-5 h-5" />
                <span>Puedes seleccionar varios días para cancelar todas las citas programadas.</span>
              </div>

              {/* Filtro */}
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <label className="font-medium text-gray-700">Filtrar por fecha:</label>
                <input
                  type="date"
                  min={minDateStr}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {selectedDate && (
                  <button
                    onClick={handleResetFilter}
                    className="text-sm text-blue-700 underline hover:text-blue-900"
                  >
                    Restablecer filtro
                  </button>
                )}
              </div>

              {/* Tarjetas */}
              <div className="flex flex-col gap-4">
                {citasFiltradas.length === 0 ? (
                  <p className="text-gray-500 text-center">No hay citas registradas.</p>
                ) : (
                  citasFiltradas.map(([fecha, citasDia]) => (
                    <div
                      key={fecha}
                      className="flex justify-between items-start border border-gray-200 rounded-lg bg-white p-4 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex flex-col gap-1">
                        <h3 className="font-semibold text-gray-900 text-base capitalize">
                          {formatearFecha(fecha)}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CalendarDays className="w-4 h-4 text-blue-600" />
                          <span>{citasDia.length} cita{citasDia.length > 1 ? "s" : ""}</span>
                        </div>
                        <button
                          onClick={() => openModal(citasDia)}
                          className="mt-2 text-sm text-blue-700 hover:text-blue-900 font-medium"
                        >
                          Ver citas agendadas
                        </button>
                      </div>

                      <input
                        type="checkbox"
                        checked={selectedIds.includes(fecha)}
                        onChange={() => toggleCita(fecha)}
                        className="w-5 h-5 accent-blue-600 cursor-pointer mt-1"
                      />
                    </div>
                  ))
                )}
              </div>

              <div className="flex justify-center mt-8">
                <button
                  onClick={handleCancelar}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-8 rounded-lg shadow-md transition-all w-full sm:w-auto"
                >
                  Cancelar citas
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      {/* --- MODALES --- */}
      {/* Detalles */}
      <Transition appear show={showDetailsModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowDetailsModal(false)}>
          <div className="fixed inset-0 bg-black/40" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-md">
              <Dialog.Title className="text-lg font-bold mb-3">Citas agendadas</Dialog.Title>
              {selectedDayCitas?.length ? (
                <ul className="divide-y divide-gray-200">
                  {selectedDayCitas.map((cita) => (
                    <li key={cita._id} className="py-2">
                      <p className="font-semibold text-blue-700">{cita.servicioId?.nombre}</p>
                      <p className="text-sm text-gray-600">HORA: {cita.horario?.inicio} - {cita.horario?.fin}</p>
                      <p className="text-sm text-gray-600">
                        CLIENTE: {cita.clienteId?.nombre} {cita.clienteId?.apellido}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay detalles disponibles.</p>
              )}
              <div className="mt-4 flex justify-end">
                <button onClick={() => setShowDetailsModal(false)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                  Cerrar
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>

      {/* Confirmación */}
      <Transition appear show={showConfirmModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowConfirmModal(false)}>
          <div className="fixed inset-0 bg-black/50" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 text-center">
              <div className="text-yellow-500 text-6xl mb-3">⚠️</div>
              <h2 className="text-2xl font-bold mb-2">¿Estás seguro?</h2>
              <p className="text-gray-700 text-sm mb-4">
                Se cancelarán {selectedIds.length} cita(s) y los clientes serán notificados.
              </p>
              <div className="flex justify-center gap-4">
                <button onClick={() => setShowConfirmModal(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md">
                  No, cancelar
                </button>
                <button onClick={confirmarCancelacion} className="bg-red-600 text-white px-4 py-2 rounded-md">
                  Sí, continuar
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>

      {/* Éxito */}
      <Transition appear show={showSuccessModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowSuccessModal(false)}>
          <div className="fixed inset-0 bg-black/50" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 text-center">
              <div className="text-green-600 text-6xl mb-3">✅</div>
              <h2 className="text-2xl font-bold mb-2">Citas Canceladas</h2>
              <p className="text-gray-700 text-sm mb-4">
                Las citas seleccionadas fueron canceladas correctamente y se notificó a los clientes.
              </p>
              <button onClick={() => setShowSuccessModal(false)} className="bg-green-600 text-white px-4 py-2 rounded-md">
                Aceptar
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
