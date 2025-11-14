"use client";
//url para acceder a esta pagina 
//http://localhost:3000/epic_VisualizadorDeTrabajosAgendadosVistaProveedor_CancelarTrabajo

import React, { useState, useEffect } from "react";
import { Trabajo } from "./interfaces/Trabajo.interface";
import { obtenerTrabajo } from "./services/trabajoService";
import { useCancelarTrabajo } from "./hooks/useCancelarTrabajo";
import DetallesTrabajo from "./components/DetalleTrabajo";
import ModalCancelar from "./components/ModalCancelar";
import BotonesAccion from "./components/BotonesAccion";
import { useSearchParams,useRouter  } from "next/navigation";

const CancelarTrabajoPage: React.FC = () => {
    const sp = useSearchParams();
    const router = useRouter(); 
  const [trabajo, setTrabajo] = useState<Trabajo | null>(null);
  
  const {
    modalAbierto,
    justificacion,
    error,
    procesando,
    mensajeExito,
    setJustificacion,
    abrirModal,
    cerrarModal,
    cancelarTrabajo,
  } = useCancelarTrabajo();

useEffect(() => {
    const id = sp.get("id");
    const clientName = sp.get("cliente") || "Cliente no especificado";
    const startISO = sp.get("date") || "2025-11-25";
    const inicio = sp.get("inicio") || "10:00";
    const fin = sp.get("fin") || "11:00";
    const service = sp.get("servicio") || "Servicio no especificado";
    const estadoParam = sp.get("estado") || "Pendiente";
    const costo = Number(sp.get("costo") || 0);
    const description = sp.get("descripcion") || "Descripción no disponible";
    const from = sp.get("from") || "";

    if (id) {
      // Si hay id en la URL, construimos el objeto directamente
        let estadoFinal: "Confirmado" | "Cancelado";
      if (estadoParam.toLowerCase() === "confirmed") {
        estadoFinal = "Confirmado";
      } else if (estadoParam.toLowerCase() === "cancelled") {
        estadoFinal = "Cancelado";
      } else {
        estadoFinal = "Confirmado"; // fallback seguro
      }
      setTrabajo({
        id,
        cliente: clientName,
        fecha: (() => {
          const [año, mes, día] = startISO.split("-").map(Number);
          const fechaObj = new Date(año, mes - 1, día);
          const fechaFormateada = new Intl.DateTimeFormat("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
          }).format(fechaObj).replace(",", "");
          return fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
        })(),
        horario: `${inicio} - ${fin}`,
        descripcion: description,
        costo: costo,
        estado:estadoFinal,
      });
    } else {
      // Si no hay id, llamamos al backend con ID estático
      obtenerTrabajo({}).then(setTrabajo);
    }
  }, [sp]);

  const handleCancelar = () => {
    if (trabajo) {
      cancelarTrabajo(trabajo, setTrabajo);
    }
  };

  const handleVolverAtras = () => {
      router.push("/epic_VisualizadorDeTrabajosAgendadosVistaProveedor");
    };

  const handleTrabajoTerminado = () => {
    console.log("Marcando trabajo como terminado...");
  };

  if (!trabajo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-8">
          Trabajo
        </h1>

        <DetallesTrabajo trabajo={trabajo} />

        {mensajeExito && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {mensajeExito}
          </div>
        )}

        <BotonesAccion
          estadoTrabajo={trabajo.estado}
          onAtras={handleVolverAtras}
          onCancelar={abrirModal}
          onTerminado={handleTrabajoTerminado}
        />
      </div>

      <ModalCancelar
        abierto={modalAbierto}
        justificacion={justificacion}
        error={error}
        procesando={procesando}
        onJustificacionChange={setJustificacion}
        onCancelar={handleCancelar}
        onCerrar={cerrarModal}
      />
    </div>
  );
};

export default CancelarTrabajoPage;