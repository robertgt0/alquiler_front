// src/app/hooks/useUsuarioNuevo.ts
import { useState, useEffect } from 'react';

export function useUsuarioNuevo() {
  const [esUsuarioNuevo, setEsUsuarioNuevo] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    // Verificar si ya se mostró la guía anteriormente
    const noMostrarGuia = localStorage.getItem('noMostrarGuia');
    const guiaVista = localStorage.getItem('guiaVista');

    if (!noMostrarGuia && !guiaVista) {
      setEsUsuarioNuevo(true);
      setModalAbierto(true);
    }
  }, []);

  const cerrarModal = () => {
    setModalAbierto(false);
    // Marcar que ya se vio la guía (sin la opción de "no mostrar")
    localStorage.setItem('guiaVista', 'true');
  };

  return {
    esUsuarioNuevo,
    modalAbierto,
    cerrarModal
  };
}