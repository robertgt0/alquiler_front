import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <main className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">
          Register a Job
        </h1>

        <div className="flex flex-col gap-4">
          <Link
            href="/register_a_job"
            className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 transition-colors text-center"
          >
            Agregar Disponibilidad
          </Link>

          {/* 🔹 Agrego tu epic HU-2 */}
          <Link
            href="/agenda_proveedor"
            className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-cyan-600 transition-colors text-center"
          >
            Agendar tu servicio
          </Link>

          <Link
            href="/epic_VisualizadorDeTrabajosAgendadosVistaProveedor"
            className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors text-center"
          >
            Trabajos Agendados (Vista-Proveedor)
          </Link>

          <Link
            href="/epic_VisualizadorDeTrabajosAgendadosVistaCliente"
            className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors text-center"
          >
           Mis Trabajos (Vista-Cliente)
          </Link>

        </div>
      </main>
    </div>
  );
}