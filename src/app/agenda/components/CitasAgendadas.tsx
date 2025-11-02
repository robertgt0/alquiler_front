"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppointmentModal from "./appointment-modal";

interface Cita {
  _id: string;
  fecha: string;
  horario: {
    inicio: string;
    fin: string;
  };
  estado: string;
  servicioId: {
    _id: string;
    nombre: string;
    duracion?: number;
  } | null;
  proveedorId: {
    _id: string;
    nombre: string;
  } | null;
  ubicacion?: any;
  clienteId?: string;
}

const CitasAgendadas = () => {
  const router = useRouter();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // cliente fijo en tu código original
  const clienteId = "68fb93e079308369b5a0f264";
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // fetchCitas disponible en todo el componente
  const fetchCitas = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/devcode/citas/cliente/${clienteId}`);
      if (!res.ok) throw new Error("Error al obtener citas");
      const data: Cita[] = await res.json();
      setCitas(data);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Estado para editar
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCita, setSelectedCita] = useState<Cita | null>(null);

  const handleEditar = (cita: Cita) => {
    setSelectedCita(cita);
    setModalOpen(true);
  };

  // Mapea la cita al formato que espera appointment-modal (InitialAppointment)
  const mapToInitial = (cita: Cita | null) => {
    if (!cita) return null;
    return {
      id: cita._id,
      fecha: cita.fecha,
      horario: {
        inicio: cita.horario?.inicio ?? "",
        fin: cita.horario?.fin ?? "",
      },
      ubicacion: cita.ubicacion ?? null,
      patientName: cita.proveedorId?.nombre ?? "",
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Cargando tus citas...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900 py-8">
      <div className="w-full max-w-7xl px-4 mb-6">
        <h1 className="text-3xl font-bold mb-1 text-left">Citas Agendadas</h1>
        <h3 className="text-left text-gray-600">
          Aquí puedes editar tus citas agendadas
        </h3>

        <button
          onClick={() => router.back()}
          className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
        >
          Anterior
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-7xl px-4">
        {citas.length === 0 ? (
          <p className="text-gray-500 text-center col-span-2">
            No tienes citas agendadas.
          </p>
        ) : (
          citas.map((cita) => (
            <div
              key={cita._id}
              className="bg-white p-6 rounded-xl shadow-lg flex flex-col justify-between min-h-[150px]"
            >
              <h3 className="text-lg font-semibold">
                {cita.servicioId?.nombre || "Servicio no especificado"}
              </h3>
              <p className="text-gray-600 text-sm">
                {cita.proveedorId?.nombre || "Proveedor no disponible"}
              </p>
              <p className="text-gray-700 text-sm">Fecha: {cita.fecha}</p>
              <p className="text-gray-700 text-sm">
                Hora: {cita.horario.inicio} - {cita.horario.fin}
              </p>
              <p className="text-gray-600 text-xs capitalize">
                Estado: {cita.estado}
              </p>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleEditar(cita)}
                  className="bg-purple-500 text-white rounded px-4 py-2"
                >
                  Editar Cita
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {modalOpen && (
        <AppointmentModal
          open={modalOpen}
          onOpenChange={(open) => {
            setModalOpen(open);
            if (!open) {
              setSelectedCita(null);
              // refrescar lista después de cerrar (posible cambio)
              fetchCitas();
            }
          }}
          patientName={selectedCita?.proveedorId?.nombre ?? "Proveedor"}
          providerId={selectedCita?.proveedorId?._id ?? ""}
          servicioId={selectedCita?.servicioId?._id ?? ""}
          clienteId={selectedCita?.clienteId ?? clienteId}
          // AÑADE ESTAS PROPS PARA EDITAR:
          initialAppointment={mapToInitial(selectedCita)}
          isEditing={true}
          appointmentId={selectedCita?._id}
        />
      )}
    </div>
  );
};

export default CitasAgendadas;