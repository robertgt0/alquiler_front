"use client";
// URL para acceder a esta página:
//http://localhost:3000/epic_VisualizadorDeTrabajosAgendadosVistaCliente_CancelarTrabajo
import React, { useState, useEffect } from "react";
import { Trabajo } from "./interfaces/Trabajo.interface";
import { obtenerTrabajo } from "./services/trabajoService";
import { useCancelarTrabajo } from "./hooks/useCancelarTrabajo";
import DetallesTrabajo from "./components/DetallesTrabajo";
import ModalCancelar from "./components/ModalCancelar";
import BotonesAccion from "./components/BotonesAccion";

const CancelarTrabajoPage: React.FC = () => {
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
    obtenerTrabajo("6907d2bc6d942a4964cb5b9e").then(setTrabajo);
  }, []);

  const handleCancelar = () => {
    if (trabajo) {
      cancelarTrabajo(trabajo, setTrabajo);
    }
  };

  const handleVolverAtras = () => {
    console.log("Volviendo atrás...");
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