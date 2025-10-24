'use client'

import React from 'react';
import { useRouter } from 'next/navigation';

const CitasAgendadas = () => {
  const router = useRouter();

  const citas = [
    { id: 1, nombreServicio: "Consultoría en Marketing Digital", especialista: "María Rodríguez", fecha: "2023-10-25", hora: "10:00 AM" },
    { id: 2, nombreServicio: "Asesoría Financiera", especialista: "Juan Pérez", fecha: "2023-10-26", hora: "2:00 PM" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900 py-8">
      <div className="w-full max-w-7xl px-4 mb-6">
        <h1 className="text-3xl font-bold mb-1 text-left">Citas Agendadas</h1>
        <h3 className="text-left text-gray-600">Aquí puedes editar tus citas agendadas</h3>

        {/* Botón anterior */}
        <button
          onClick={() => router.back()}
          className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
        >
          Anterior
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-7xl px-4">
        {citas.map((cita) => (
          <div key={cita.id} className="bg-white p-6 rounded-xl shadow-lg flex flex-col justify-between min-h-[150px]">
            <h3 className="text-lg font-semibold">{cita.nombreServicio}</h3>
            <p className="text-gray-600 text-sm">{cita.especialista}</p>
            <p className="text-gray-700 text-sm">Fecha: {cita.fecha}</p>
            <p className="text-gray-700 text-sm">Hora: {cita.hora}</p>
            <div className="mt-4 flex justify-end">
              <button className="bg-purple-500 text-white rounded px-4 py-2">Editar Cita</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CitasAgendadas;
