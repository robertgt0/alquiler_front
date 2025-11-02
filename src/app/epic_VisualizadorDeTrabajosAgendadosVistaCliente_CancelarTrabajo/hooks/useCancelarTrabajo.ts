import { useState } from "react";
import { Trabajo } from "../interfaces/Trabajo.interface";
import { cancelarTrabajoAPI } from "../services/trabajoService";
import { validarJustificacion } from "../utils/validaciones";

export const useCancelarTrabajo = () => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [justificacion, setJustificacion] = useState("");
  const [error, setError] = useState("");
  const [procesando, setProcesando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");

  const abrirModal = () => {
    setModalAbierto(true);
    setJustificacion("");
    setError("");
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setJustificacion("");
    setError("");
  };

  const cancelarTrabajo = async (
    trabajo: Trabajo,
    onCancelado: (trabajoActualizado: Trabajo) => void
  ) => {
    const validacion = validarJustificacion(justificacion);
    
    if (!validacion.valido) {
      setError(validacion.error);
      return;
    }

    setProcesando(true);
    setError("");

    try {
      await cancelarTrabajoAPI({
        trabajoId: trabajo.id || "",
        justificacion,
      });

      const trabajoActualizado = { ...trabajo, estado: "Cancelado" as const };
      onCancelado(trabajoActualizado);
      
      setModalAbierto(false);
      setMensajeExito("Tu cancelación ha sido enviada al proveedor correctamente.");
      
      setTimeout(() => {
        setMensajeExito("");
      }, 5000);
    } catch (err) {
  console.error("Error al cancelar trabajo:", err);
  setError("Hubo un error al cancelar el trabajo. Intente nuevamente.");
   }  finally {
      setProcesando(false);
    }
  };

  return {
    modalAbierto,
    justificacion,
    error,
    procesando,
    mensajeExito,
    setJustificacion,
    abrirModal,
    cerrarModal,
    cancelarTrabajo,
  };
};