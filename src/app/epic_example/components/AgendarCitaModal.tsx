"use client";
import { useState } from "react";
import UbicacionManual from "./UbicacionManual";
export default function AgendarCitaModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [ubicacionError, setUbicacionError] = useState<string>("");// Estado para error de ubicación
  const [data, setData] = useState({
    fecha: "",
    hora: "",
    direccion: "",
    notas: "",
  });
// handleChange actualizado para limpiar error de ubicación
/* const handleChange = (field: string, value: string) => {
    setData({ ...data, [field]: value });
  };
*/
// Nueva función handleChange que limpia el error de ubicación si se ingresa una dirección válida
const handleChange = (field: string, value: string) => {
  setData({ ...data, [field]: value });
  if (field === "direccion" && value.trim()) setUbicacionError("");
};

  const canContinue = data.fecha && data.hora;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-3xl min-h-[70vh] max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6 border-b pb-3">
          <h2 className="text-2xl font-semibold text-gray-800">
            Agendar Cita
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl font-bold leading-none"
          >
            ×
          </button>
        </div>

        {/* PASO 1 — Calendario y hora */}
        <section>
          <p className="text-gray-600 mb-6">
            Elige la fecha y hora para tu consultoría (duración: 30 minutos)
          </p>
          <div className="border border-dashed border-gray-400 rounded-lg p-10 text-center text-gray-500">
            🗓️ <br />
            Calendario en construcción...
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Fecha
              </label>
              <input
                type="date"
                value={data.fecha}
                onChange={(e) => handleChange("fecha", e.target.value)}
                className="border border-gray-300 rounded-lg p-3 w-full focus:border-[#4289CC] focus:ring-[#4289CC]"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Hora
              </label>
              <input
                type="time"
                value={data.hora}
                onChange={(e) => handleChange("hora", e.target.value)}
                className="border border-gray-300 rounded-lg p-3 w-full focus:border-[#4289CC] focus:ring-[#4289CC]"
              />
            </div>
          </div>
        </section>

        {/* PASO 2 — Formulario de ubicación (se muestra debajo cuando se elige fecha/hora) */}
        {canContinue && step === 1 && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2 bg-[#4289CC] text-white rounded-lg hover:bg-blue-700 transition transition transform hover:scale-105 duration-300 font-medium"
            >
              Continuar
            </button>
          </div>
        )}

        {step === 2 && (
          <section className="mt-8 border-t border-gray-200 pt-6">
            <div className="border border-gray-300 rounded-lg p-5 shadow-lg flex flex-col justify-between h-full">
                <h2 className="text-2x1 font-semibold mb-2">
                    Detalles de la ubicación
                </h2>
                <p className="text-gray-600 mb-6">
                    Especifica dónde se realizará el servicio (campo obligatorio)
                </p>
                <div className="space-y-4">
                
                <div className="border border-gray-300 rounded-lg p-6 shadow-sm">
                 <UbicacionManual
                  direccion={data.direccion}
                   notas={data.notas}
                   onChange={handleChange}
                    errorMessage={ubicacionError}

                        />
                 </div>
                {/*Añadir la implementacion del mapa aquí*/}
                <div className="border border-dashed border-gray-400 rounded-lg p-6 text-center text-gray-500">
                        🗺️ <br /> ¿Prefieres seleccionar en el mapa? <br />
                        <button
                          type="button"
                          className="text-blue-600 underline"
                          onClick={() =>
                            alert("Abrir mapa (por implementar)")
                          }
                        >
                          Abrir Selector de Mapa
                        </button>
                      </div>
                </div>

                {/* BOTONES */}
                <div className="mt-6 flex justify-between border-t border-gray-200 pt-4">
                <button
                    onClick={() => setStep(1)}
                    className="text-gray-600 hover:text-blue-600 transition transform hover:scale-105 duration-300 font-medium"
                >
                    Volver
                </button>
                <button
                  onClick={() => {
                      // Validación: solo al pulsar Continuar
                   if (!data.direccion || !data.direccion.trim()) {
                    setUbicacionError("La dirección del servicio es obligatoria.");
                      // enfocar el campo
                       const el = document.getElementById("direccion") as HTMLInputElement | null;
                     if (el) el.focus();
                         return; // no avanzamos
                        }
                       // todo ok: limpiamos error y avanzamos
                      setUbicacionError("");
                   setStep(3);
                 }}
               className="px-6 py-2 bg-[#fffff] text-white rounded-lg hover:bg-blue-700 transition transform hover:scale-105 duration-300 font-medium"
                >
             Continuar
              </button>

                </div>
            </div>
            
          </section>
        )}

        {/* PASO 3 — Resumen de la cita (debajo del calendario, ocultando el paso 2) */}
        {step === 3 && (
          <section className="mt-8 border-t border-gray-200 pt-6">
            <div className="border border-gray-300 rounded-lg p-5 shadow-md flex flex-col justify-between h-full bg-white">
                <h2 className="text-2x1 font-semibold mb-2 text-gray-800">
                    Resumen de la cita
                </h2>

                <div className="space-y-4 text-gray-800">
                <div className="flex justify-between">
                    <span className="font-medium">📅 Fecha:</span>
                    <span>{data.fecha}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">⏰ Hora:</span>
                    <span>{data.hora}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">📍 Dirección:</span>
                    <span className="text-right max-w-[70%] truncate">
                    {data.direccion}
                    </span>
                </div>
                {data.notas && (
                    <div className="flex justify-between">
                    <span className="font-medium">📝 Notas:</span>
                    <span className="text-right max-w-[70%]">
                        {data.notas}
                    </span>
                    </div>
                )}
                </div>

                {/* BOTONES */}
                <div className="mt-6 flex justify-between border-t border-gray-200 pt-4">
                <button
                    onClick={() => setStep(2)}
                    className="text-gray-600 hover:text-blue-600 transition transform hover:scale-105 duration-300 font-medium"
                >
                    Volver
                </button>
                <button
                    onClick={() => alert("✅ Cita confirmada (guardar en BD)")}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition transition transform hover:scale-105 duration-300 font-medium"
                >
                    Confirmar Cita
                </button>
                </div>
            </div>

            
          </section>
        )}
      </div>
    </div>
  );
}
