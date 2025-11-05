"use client";

import { useState } from "react";
import { CalendarDays, AlertTriangle } from "lucide-react";

export default function GestionCitas() {
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);

  const citas = [
    { fecha: "Sábado 4 de octubre", cantidad: 1 },
    { fecha: "Domingo 5 de octubre", cantidad: 1 },
    { fecha: "Lunes 27 de octubre", cantidad: 1 },
  ];

  const toggleDate = (fecha: string) => {
    setSelectedDates((prev) =>
      prev.includes(fecha)
        ? prev.filter((f) => f !== fecha)
        : [...prev, fecha]
    );
  };

  const handleCancelar = () => {
    if (selectedDates.length === 0) {
      alert("Selecciona al menos un día para cancelar las citas.");
      return;
    }
    setShowModal(true);
  };

  const confirmarCancelacion = () => {
    // aqui lo pones la api para cancela citas 
    alert(`Citas canceladas correctamente`);
    setShowModal(false);
    setSelectedDates([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {/* HEADER */}
      <header className="flex justify-between items-center px-6 py-4 border-b shadow-sm bg-white">
        <h1 className="text-2xl font-bold text-blue-700">Servineo</h1>
        <nav className="flex gap-6 text-blue-700 font-medium">
          <a href="#" className="hover:underline">Mis Citas</a>
          <a href="#" className="hover:underline">Horarios Laborales</a>
        </nav>
      </header>

      {/* CONTENIDO */}
      <main className="flex flex-col items-center py-8 px-4 flex-1">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Gestiona tus citas programadas
          </h2>
          <p className="text-gray-600 mb-6">
            Administra tus citas recibidas en función de tu horario laboral establecido.
          </p>

          {/* Tabs simuladas */}
          <div className="flex w-full mb-6 border-b">
            <button className="flex-1 text-center py-3 font-medium text-gray-900 border-b-2 border-blue-700">
              Citas Programadas
            </button>
            <button className="flex-1 text-center py-3 font-medium text-gray-500 hover:text-gray-700">
              Cancelar Varias Citas
            </button>
          </div>

          {/* Mensaje de advertencia */}
          <div className="flex items-center gap-2 mb-4 text-yellow-600 bg-yellow-50 border border-yellow-100 rounded-md p-3">
            <AlertTriangle className="w-5 h-5" />
            <span>
              Puedes seleccionar hasta 5 días para cancelar todas las citas programadas.
            </span>
          </div>

          {/* FILTRO */}
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <label className="text-gray-700 font-medium">Filtrar por fecha:</label>
            <select className="border rounded-md p-2 text-gray-700">
              <option>Octubre 2025</option>
              <option>Noviembre 2025</option>
            </select>
          </div>

          {/* LISTA DE CITAS */}
          <div className="flex flex-col gap-4">
            {citas.map((cita) => (
              <div
                key={cita.fecha}
                className="flex flex-col sm:flex-row justify-between items-center border rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition-all"
              >
                <div className="flex items-center gap-3">
                  <CalendarDays className="text-blue-600 w-5 h-5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{cita.fecha}</h3>
                    <p className="text-gray-600 text-sm">
                      {cita.cantidad} cita programada para este día
                    </p>
                    <a href="#" className="text-blue-600 text-sm hover:underline">
                      Ver citas agendadas
                    </a>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={selectedDates.includes(cita.fecha)}
                  onChange={() => toggleDate(cita.fecha)}
                  className="w-5 h-5 accent-blue-600 mt-3 sm:mt-0 cursor-pointer"
                />
              </div>
            ))}
          </div>

          {/* BOTÓN CANCELAR */}
          <div className="flex justify-center mt-8">
            <button
              onClick={handleCancelar}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-8 rounded-lg shadow-md transition-all w-full sm:w-auto"
            >
              Cancelar citas
            </button>
          </div>
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
              <li>Se cancelarán todas las citas de los días seleccionados</li>
              <li>Se enviarán notificaciones automáticas a los clientes</li>
              <li>Las citas canceladas no podrán ser editadas posteriormente</li>
              <li>Los clientes recibirán el aviso de cancelación inmediatamente</li>
            </ul>

            <p className="text-gray-800 text-sm mb-2">
              <strong>Días seleccionados:</strong> {selectedDates.length}
            </p>
            <p className="text-gray-800 text-sm mb-6">
              <strong>Citas a cancelar:</strong>{" "}
              {
                citas
                  .filter((c) => selectedDates.includes(c.fecha))
                  .reduce((acc, c) => acc + c.cantidad, 0)
              }
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
