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

  const desactivarModos = () => {
    limpiarError();
    setModos({
      modoSeleccion: false,
      modoEliminar: false,
      metodosSeleccionados: [],
      metodosAEliminar: []
    });
  };

  const toggleSeleccionMetodo = (metodoId: string) => {
    limpiarError();
    
    if (!modos.modoSeleccion) return;
    
    // Verificar si el método ya está activo
    const metodo = metodos.find(m => m.id === metodoId);
    if (metodo?.activo) {
      setError("Este método ya está activo");
      return;
    }
    
    if (modos.metodosSeleccionados.includes(metodoId)) {
      setModos(prev => ({ ...prev, metodosSeleccionados: [] }));
    } else {
      setModos(prev => ({ ...prev, metodosSeleccionados: [metodoId] }));
    }
  };

  const toggleSeleccionEliminar = (metodoId: string) => {
    limpiarError();
    
    //  VERIFICAR SI ES EL MÉTODO DE REGISTRO
    const metodo = metodos.find(m => m.id === metodoId);
    if (metodo?.esMetodoRegistro) {
      setError("No se puede eliminar el método de autenticación con el que te registraste");
      return;
    }
    
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

  const activarMetodosSeleccionados = async () => {
    if (modos.metodosSeleccionados.length === 0) {
      setError("Por favor selecciona un método para activar");
      return;
    }

    const metodoId = modos.metodosSeleccionados[0];
    
    try {
      limpiarError();

      // Verificar si el método YA ESTÁ ACTIVO
      const metodo = metodos.find(m => m.id === metodoId);
      if (metodo?.activo) {
        setError("Este método ya está activo");
        return;
      }
      
      // MÉTODO CORREO/CONTRASEÑA
      if (metodoId === 'correo') {
        //  VERIFICAR que Google esté activo para tener el email
        const googleEstaActivo = metodosActivos.some(m => m.id === 'google');
        
        if (!googleEstaActivo) {
          setError("Primero debe activar Google para tener el correo electrónico");
          return;
        }
        
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

  const activarMetodoGoogle = async () => {
    try {
      setCargandoGoogle(true);
      limpiarError();
      
      //  OBTENER EL EMAIL DEL USUARIO ACTUAL
      const userData = await apiService.getCurrentUser();
      const userEmail = userData.email;
      
      if (!userEmail) {
        throw new Error("No se pudo obtener el correo del usuario");
      }
      
      console.log('📧 Activando Google con email:', userEmail);
      
      //  ENVIAR SOLO EL EMAIL AL BACKEND
      await apiService.setupGoogleAuth(userEmail);
      await activarMetodo('google');
      
      setCargandoGoogle(false);
      desactivarModos();
      
    } catch (err) {
      console.error('Error en activarMetodoGoogle:', err);
      setError(`Error al configurar Google: ${err instanceof Error ? err.message : 'Error desconocido'}`);
      setCargandoGoogle(false);
    }
  };

  const manejarConfirmacionContrasena = async (contrasena: string) => {
    try {
      limpiarError();
      
      // OBTENER EL EMAIL DEL USUARIO ACTUAL (el mismo de Google)
      const userData = await apiService.getCurrentUser();
      const userEmail = userData.email;
      
      if (!userEmail) {
        throw new Error("No se pudo obtener el correo del usuario");
      }
      
      console.log('🔐 Configurando Correo/Contraseña para:', userEmail);
      
      //  ENVIAR EMAIL + CONTRASEÑA AL BACKEND
      await apiService.setupEmailPassword(userEmail, contrasena);
      
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

  const eliminarMetodosSeleccionados = async () => {
    try {
      limpiarError();
      
      // VERIFICAR SI SE INTENTA ELIMINAR MÉTODO DE REGISTRO
      const metodosAEliminarConInfo = modos.metodosAEliminar.map(id => 
        metodos.find(m => m.id === id)
      ).filter(Boolean) as MetodoAutenticacion[];
      
      const contieneMetodoRegistro = metodosAEliminarConInfo.some(m => m.esMetodoRegistro);
      if (contieneMetodoRegistro) {
        setError("No se puede eliminar el método de autenticación con el que te registraste");
        return;
      }

      const metodosRestantes = metodosActivos.length - modos.metodosAEliminar.length;
      if (metodosRestantes < 1) {
        setError("Debe quedar al menos un método de autenticación activo");
        return;
      }

      for (const id of modos.metodosAEliminar) {
        await eliminarMetodo(id);
      }
      
      desactivarModos();
      
    } catch (err) {
      setError(`Error al eliminar métodos: ${err}`);
    }
  };

  const metodosDisponibles: MetodoAutenticacion[] = [
    {
      id: 'correo',
      nombre: 'Correo/Contraseña',
      tipo: 'correo',
      icono: '📧',
      color: 'blue',
      activo: metodos.some(m => m.id === 'correo' && m.activo),
      esMetodoRegistro: metodos.find(m => m.id === 'correo')?.esMetodoRegistro || false
    },
    {
      id: 'google',
      nombre: 'Google',
      tipo: 'google',
      icono: '🔐',
      color: 'red',
      activo: metodos.some(m => m.id === 'google' && m.activo),
      esMetodoRegistro: metodos.find(m => m.id === 'google')?.esMetodoRegistro || false
    },
  ];

  const metodosDisponiblesFiltrados = metodosDisponibles.filter(m => 
    m.id === 'correo' || !m.activo 
  );

  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando métodos de autenticación...</p>
        </div>
      </div>
    );
  }

  return (
    <>
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
        <MetodosDisponiblesList
          metodosDisponibles={metodosDisponiblesFiltrados}
          metodosActivos={metodosActivos}
          modos={modos}
          cargandoGoogle={cargandoGoogle}
          onToggleSeleccion={toggleSeleccionMetodo}
          onDesactivarModos={desactivarModos}
          onActivarMetodos={activarMetodosSeleccionados}
        />
      </div>

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