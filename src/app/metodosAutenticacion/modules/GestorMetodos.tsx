// modules/GestorMetodos.tsx
'use client';

import React, { useState } from 'react';
import { GestorMetodosProps, ModosInterfaz, MetodoAutenticacion } from '../interfaces/types';
import MetodoActivoPanel from '../components/MetodoActivoPanel';
import MetodosDisponiblesList from '../components/MetodosDisponiblesList';
import ModalContrasena from '../components/ModalContrasena';
import { apiService } from '../services/api';

export default function GestorMetodos({
  metodos,
  metodosActivos,
  cargando,
  activarMetodo,
  eliminarMetodo,
  recargarMetodos
}: GestorMetodosProps & { recargarMetodos?: () => void }) {
  const [modos, setModos] = useState<ModosInterfaz>({
    modoSeleccion: false,
    modoEliminar: false,
    metodosSeleccionados: [],
    metodosAEliminar: []
  });

  const [modalContrasenaAbierto, setModalContrasenaAbierto] = useState(false);
  const [metodoSeleccionadoParaContrasena, setMetodoSeleccionadoParaContrasena] = useState<string | null>(null);
  const [cargandoGoogle, setCargandoGoogle] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ FUNCIÓN desactivarModos - FALTANTE
  const desactivarModos = () => {
    limpiarError();
    setModos({
      modoSeleccion: false,
      modoEliminar: false,
      metodosSeleccionados: [],
      metodosAEliminar: []
    });
  };

  const limpiarError = () => setError(null);

  const activarModoSeleccion = () => {
    limpiarError();
    setModos({
      modoSeleccion: true,
      modoEliminar: false,
      metodosSeleccionados: [],
      metodosAEliminar: []
    });
  };

  const activarModoEliminar = () => {
    limpiarError();
    setModos({
      modoEliminar: true,
      modoSeleccion: false,
      metodosAEliminar: [],
      metodosSeleccionados: []
    });
  };

  const toggleSeleccionMetodo = (metodoId: string) => {
    limpiarError();
    
    if (modos.metodosSeleccionados.includes(metodoId)) {
      setModos(prev => ({ ...prev, metodosSeleccionados: [] }));
    } else {
      setModos(prev => ({ ...prev, metodosSeleccionados: [metodoId] }));
    }
  };

  const toggleSeleccionEliminar = (metodoId: string) => {
    limpiarError();
    
    const esUnicoMetodoActivo = metodosActivos.length === 1;
    
    if (esUnicoMetodoActivo) {
      setError("No se puede eliminar el único método activo");
      return;
    }

    if (modos.metodosAEliminar.includes(metodoId)) {
      setModos(prev => ({ 
        ...prev, 
        metodosAEliminar: prev.metodosAEliminar.filter(id => id !== metodoId) 
      }));
    } else {
      setModos(prev => ({ 
        ...prev, 
        metodosAEliminar: [...prev.metodosAEliminar, metodoId] 
      }));
    }
  };

  // ✅ ACTIVAR MÉTODOS
  const activarMetodosSeleccionados = async () => {
    if (modos.metodosSeleccionados.length === 0) return;

    const metodoId = modos.metodosSeleccionados[0];
    
    try {
      limpiarError();

      // Verificar si el método YA ESTÁ ACTIVO
      const metodo = metodos.find(m => m.id === metodoId);
      if (metodo?.activo) {
        desactivarModos();
        return;
      }
      
      // MÉTODO CORREO/CONTRASEÑA
      if (metodoId === 'correo') {
        setMetodoSeleccionadoParaContrasena(metodoId);
        setModalContrasenaAbierto(true);
      } 
      // MÉTODO GOOGLE
      else if (metodoId === 'google') {
        await activarMetodoGoogle();
      } 
      // OTROS MÉTODOS
      else {
        await activarMetodo(metodoId);
        desactivarModos();
      }
    } catch (err) {
      setError(`Error al activar método: ${err}`);
    }
  };

  // ✅ ACTIVAR GOOGLE AUTH
  const activarMetodoGoogle = async () => {
    try {
      setCargandoGoogle(true);
      limpiarError();
      
      const { authUrl } = await apiService.initiateGoogleSetup();
      
      // Redirigir a Google OAuth
      window.location.href = authUrl;
      
    } catch (err) {
      console.error('Error en activarMetodoGoogle:', err);
      setError(`Error al configurar Google: ${err instanceof Error ? err.message : 'Error desconocido'}`);
      setCargandoGoogle(false);
    }
  };

  // ✅ CONFIRMAR CONTRASEÑA
  const manejarConfirmacionContrasena = async (contrasena: string) => {
    try {
      limpiarError();
      
      await apiService.setupEmailPassword(contrasena);
      
      // Activar el método
      if (metodoSeleccionadoParaContrasena) {
        await activarMetodo(metodoSeleccionadoParaContrasena);
      }
      
      setModalContrasenaAbierto(false);
      setMetodoSeleccionadoParaContrasena(null);
      desactivarModos();
      
    } catch (err) {
      console.error('Error en manejarConfirmacionContrasena:', err);
      setError(`Error al configurar contraseña: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    }
  };

  // ✅ ELIMINAR MÉTODOS
  const eliminarMetodosSeleccionados = async () => {
    try {
      limpiarError();
      
      const metodosRestantes = metodosActivos.length - modos.metodosAEliminar.length;
      if (metodosRestantes < 1) {
        setError("Debe quedar al menos un método de autenticación activo");
        return;
      }

      // Eliminar cada método seleccionado
      for (const id of modos.metodosAEliminar) {
        await eliminarMetodo(id);
      }
      
      desactivarModos();
      
    } catch (err) {
      setError(`Error al eliminar métodos: ${err}`);
    }
  };

  // ✅ Métodos disponibles
  const metodosDisponibles: MetodoAutenticacion[] = [
    {
      id: 'correo',
      nombre: 'Correo/Contraseña',
      tipo: 'correo',
      icono: '📧',
      color: 'blue',
      activo: metodos.some(m => m.id === 'correo' && m.activo)
    },
    {
      id: 'google',
      nombre: 'Google',
      tipo: 'google',
      icono: '🔐',
      color: 'red',
      activo: metodos.some(m => m.id === 'google' && m.activo)
    },
  ];

  const metodosDisponiblesFiltrados = metodosDisponibles.filter(m => !m.activo);

  return (
    <>
      {/* Mostrar errores globales */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">{error}</p>
          <button 
            onClick={limpiarError}
            className="mt-2 text-red-600 hover:text-red-800 text-sm"
          >
            Cerrar
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Panel Izquierdo - Métodos Activos */}
        <MetodoActivoPanel
          metodosActivos={metodosActivos}
          modos={modos}
          metodos={metodos}
          onToggleEliminar={toggleSeleccionEliminar}
          onActivarModoSeleccion={activarModoSeleccion}
          onActivarModoEliminar={activarModoEliminar}
          onDesactivarModos={desactivarModos}
          onEliminarMetodos={eliminarMetodosSeleccionados}
        />

        {/* Panel Derecho - Métodos Disponibles (solo en modo selección) */}
        {modos.modoSeleccion && (
          <MetodosDisponiblesList
            metodosDisponibles={metodosDisponiblesFiltrados}
            metodosActivos={metodosActivos}
            modos={modos}
            cargandoGoogle={cargandoGoogle}
            onToggleSeleccion={toggleSeleccionMetodo}
            onDesactivarModos={desactivarModos}
            onActivarMetodos={activarMetodosSeleccionados}
          />
        )}
      </div>

      {/* Modal para contraseña */}
      <ModalContrasena
        isOpen={modalContrasenaAbierto}
        onClose={() => {
          setModalContrasenaAbierto(false);
          setMetodoSeleccionadoParaContrasena(null);
          desactivarModos();
        }}
        onConfirm={manejarConfirmacionContrasena}
      />
    </>
  );
}