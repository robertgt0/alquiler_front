"use client";

import { useState, useEffect } from "react";
import { CalendarDays, AlertTriangle } from "lucide-react";

const PROVEEDOR_ID = "690c29d00c736bec44e473e4";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Cita {
  fecha: string;
  id: string;
}

export default function GestionCitas() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"programadas" | "cancelar">("programadas");

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const res = await fetch(`${API_URL}/api/devcode/citas/proveedor/${PROVEEDOR_ID}`);
        const data = await res.json();

        if (!data.success) throw new Error(data.error || "Error al cargar citas");

        setCitas(
          data.data.map((cita: any) => ({
            fecha: cita.fecha,
            id: cita._id,
          }))
        );
      } catch (err) {
        console.error("Error cargando citas:", err);
      }
    };

    fetchCitas();
  }, []);

  const toggleCita = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleCancelar = () => {
    if (selectedIds.length === 0) {
      alert("Selecciona al menos una cita para cancelar.");
      return;
    }
    setShowModal(true);
  };

  const confirmarCancelacion = async () => {
    try {
      const citasAEliminar = citas.filter((c) => selectedIds.includes(c.id));

      for (const cita of citasAEliminar) {
        const res = await fetch(`${API_URL}/api/devcode/citas/${cita.id}/proveedor`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ proveedorId: PROVEEDOR_ID }),
        });

        const result = await res.json();
        if (!result.success) throw new Error(result.error || "Error al eliminar cita");
      }

      alert("Citas canceladas correctamente");

      setCitas((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
      setSelectedIds([]);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Error al cancelar las citas");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <header className="flex justify-between items-center px-6 py-4 border-b shadow-sm bg-white">
        <h1 className="text-2xl font-bold text-blue-700">Servineo</h1>
        <nav className="flex gap-6 text-blue-700 font-medium">
          <a href="#" className="hover:underline">Mis Citas</a>
          <a href="worker/registrarHorarios" className="hover:underline">Horarios Laborales</a>
        </nav>
      </header>

      <main className="flex flex-col items-center py-8 px-4 flex-1">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Gestiona tus citas programadas
          </h2>
          <p className="text-gray-600 mb-6">
            Administra tus citas recibidas en función de tu horario laboral establecido.
          </p>

          {/* BOTONES DE PESTAÑAS */}
          <div className="flex w-full mb-8 justify-center gap-4">
            <button
              onClick={() => setActiveTab("programadas")}
              className={`flex-1 py-3 font-semibold rounded-lg border transition-all ${
                activeTab === "programadas"
                  ? "bg-blue-900 text-white border-blue-900"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              Citas Programadas
            </button>
            <button
              onClick={() => setActiveTab("cancelar")}
              className={`flex-1 py-3 font-semibold rounded-lg border transition-all ${
                activeTab === "cancelar"
                  ? "bg-blue-900 text-white border-blue-900"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              Cancelar Varias Citas
            </button>
          </div>

          {/* VISTA: CITAS PROGRAMADAS */}
          {activeTab === "programadas" && (
            <div className="flex flex-col gap-4">
              {citas.length === 0 ? (
                <p className="text-gray-500 text-center">No hay citas programadas.</p>
              ) : (
                citas.map((cita) => (
                  <div
                    key={cita.id}
                    className="flex flex-col sm:flex-row justify-between items-center border rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <CalendarDays className="text-blue-600 w-5 h-5" />
                      <div>
                        <h3 className="font-semibold text-gray-900">{cita.fecha}</h3>
                        <p className="text-gray-600 text-sm">1 cita programada</p>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-3 sm:mt-0">
                      <button className="text-sm font-medium text-blue-600 hover:underline">
                        Reprogramar
                      </button>
                      <button className="text-sm font-medium text-red-600 hover:underline">
                        Cancelar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* VISTA: CANCELAR VARIAS CITAS */}
          {activeTab === "cancelar" && (
            <>
              <div className="flex items-center gap-2 mb-4 text-yellow-600 bg-yellow-50 border border-yellow-100 rounded-md p-3">
                <AlertTriangle className="w-5 h-5" />
                <span>
                  Puedes seleccionar varias citas para cancelar individualmente.
                </span>
              </div>

              <div className="flex flex-col gap-4">
                {citas.length === 0 ? (
                  <p className="text-gray-500 text-center">No hay citas registradas.</p>
                ) : (
                  citas.map((cita) => (
                    <div
                      key={cita.id}
                      className="flex flex-col sm:flex-row justify-between items-center border rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <CalendarDays className="text-blue-600 w-5 h-5" />
                        <div>
                          <h3 className="font-semibold text-gray-900">{cita.fecha}</h3>
                          <p className="text-gray-600 text-sm">1 cita programada</p>
                        </div>
                      </div>

                      <input
                        type="checkbox"
                        checked={selectedIds.includes(cita.id)}
                        onChange={() => toggleCita(cita.id)}
                        className="w-5 h-5 accent-blue-600 mt-3 sm:mt-0 cursor-pointer"
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

      {/* MODAL DE CONFIRMACIÓN */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 text-center">
            <div className="text-yellow-500 text-6xl mb-3">⚠️</div>
            <h2 className="text-2xl font-bold mb-2">¿Estás seguro?</h2>
            <p className="text-gray-700 text-sm mb-4">
              <strong>Consecuencias irreversibles:</strong>
            </p>
            <ul className="text-gray-600 text-sm text-left mb-4 list-disc list-inside space-y-1">
              <li>Se cancelarán todas las citas seleccionadas</li>
              <li>Se enviarán notificaciones automáticas a los clientes</li>
              <li>Las citas canceladas no podrán ser editadas posteriormente</li>
              <li>Los clientes recibirán el aviso de cancelación inmediatamente</li>
            </ul>

            <p className="text-gray-800 text-sm mb-2">
              <strong>Citas seleccionadas:</strong> {selectedIds.length}
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                No, cancelar
              </button>
              <button
                onClick={confirmarCancelacion}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Sí, continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}