'use client';

import Link from "next/link";

export default function GestionCitasPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {/* HEADER */}
      <header className="flex justify-between items-center px-6 py-4 border-b shadow-sm bg-white">
        <h1 className="text-2xl font-bold text-blue-700">Servineo</h1>
        <nav className="flex gap-6 text-blue-700 font-medium">
          <Link href="/agenda/citas-agendadas" className="hover:underline">
            Mis Citas
          </Link>
          <Link href="/worker/cancelacion" className="hover:underline">
            Cancelar Varias Citas
          </Link>
          <Link href="/worker/registrarHorarios" className="hover:underline">
            Horarios Laborales
          </Link>
        </nav>
      </header>

      <main className="flex flex-col items-center justify-center py-24">
        <h2 className="text-3xl font-bold text-blue-800 mb-4">Gestión de Citas</h2>
        <p className="text-gray-600 mb-6">Selecciona una acción:</p>

        <div className="flex gap-6">
          <Link
            href="/worker/citas"
            className="bg-blue-700 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-800"
          >
            Ver citas programadas
          </Link>

          <Link
            href="/worker/cancelacion"
            className="bg-red-600 text-white px-6 py-3 rounded-xl shadow hover:bg-red-700"
          >
            Cancelar citas
          </Link>

          <Link
            href="/worker/registrarHorarios"
            className="bg-green-600 text-white px-6 py-3 rounded-xl shadow hover:bg-green-700"
          >
            Configurar horarios
          </Link>
        </div>
      </main>
    </div>
  );
}
