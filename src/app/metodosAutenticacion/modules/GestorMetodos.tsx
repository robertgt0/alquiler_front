// modules/GestorMetodos.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { GestorMetodosProps, ModosInterfaz, MetodoAutenticacion } from '../interfaces/types';
import MetodoActivoPanel from '../components/MetodoActivoPanel';
import MetodosDisponiblesList from '../components/MetodosDisponiblesList';
import ModalContrasena from '../components/ModalContrasena';
import { apiService } from '../services/api';
import { GoogleAuthService } from '../services/googleAuthService';


// Función de diagnóstico para ver qué hay en sessionStorage
const diagnosticarSessionStorage = () => {
  console.log('🔍 DIAGNÓSTICO SESSIONSTORAGE:');
  
  if (typeof window === 'undefined') {
    console.log('  - No estamos en el cliente');
    return;
  }
  // Ver todas las keys en sessionStorage
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    const value = sessionStorage.getItem(key || '');
    console.log(`  - Key: "${key}"`, value ? `Value: ${value.substring(0, 100)}...` : 'Value: null');
  }
  
  // Ver específicamente userData
  const userDataString = sessionStorage.getItem('userData');
  console.log('  - userData encontrado:', userDataString ? 'SÍ' : 'NO');
  
  if (userDataString) {
    try {
      const userData = JSON.parse(userDataString);
      console.log('  - userData parseado:', userData);
      console.log('  - email en userData:', userData.email);
    } catch (error) {
      console.log('  - Error parseando userData:', error);
    }
  }
  
  console.log('🔍 FIN DIAGNÓSTICO');
};

// Función para obtener solo el email desde sessionStorage
const obtenerEmailDesdeSessionStorage = (): string | null => {
  try {
    if (typeof window === 'undefined') {
      return null;
    }

    const userDataString = sessionStorage.getItem('userData');
    
    if (!userDataString) {
      console.warn('No se encontró userData en sessionStorage');
      return null;
    }

    const userData = JSON.parse(userDataString);
    const userEmail = userData.correo;
    
    if (!userEmail || typeof userEmail !== 'string') {
      console.error('Email no encontrado o inválido en userData');
      return null;
    }

    console.log('📧 Email obtenido:', userEmail);
    return userEmail;
    
  } catch (error) {
    console.error('Error al obtener email desde sessionStorage:', error);
    return null;
  }
};

// Función para autenticar con Google y obtener el email
const autenticarConGoogleYComparar = async (emailDeSessionStorage: string): Promise<boolean> => {
  try {
    console.log('🔐 Iniciando autenticación con Google...');
    
    // 1. Autenticar con Google
    const googleUser = await GoogleAuthService.signInWithGoogle();
    const googleEmail = googleUser.email;
    
    console.log('🔍 Comparando emails:');
    console.log('  - SessionStorage:', emailDeSessionStorage);
    console.log('  - Google:', googleEmail);

    // 2. Comparar emails
    const emailsCoinciden = emailDeSessionStorage.toLowerCase() === googleEmail.toLowerCase();
    
    if (!emailsCoinciden) {
      console.error('❌ Los emails no coinciden');
      console.log('  - Email sessionStorage:', emailDeSessionStorage);
      console.log('  - Email Google:', googleEmail);
      return false;
    }

    console.log('✅ Los emails coinciden');
    
    // 3. Guardar el email de Google en sessionStorage para uso futuro
    sessionStorage.setItem('googleEmail', googleEmail);
    sessionStorage.setItem('googleUser', JSON.stringify(googleUser));
    
    return true;
    
  } catch (error) {
    console.error('Error en autenticación con Google:', error);
    throw error;
  }
};

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
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Obtener el email al cargar el componente
  useEffect(() => {
    const email = obtenerEmailDesdeSessionStorage();
    setUserEmail(email);
  }, []);

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

      const metodo = metodos.find(m => m.id === metodoId);
      if (metodo?.activo) {
        setError("Este método ya está activo");
        return;
      }
      
      if (metodoId === 'correo') {
        const googleEstaActivo = metodosActivos.some(m => m.id === 'google');
        
        if (!googleEstaActivo) {
          setError("Primero debe activar Google para tener el correo electrónico");
          return;
        }
        
        setMetodoSeleccionadoParaContrasena(metodoId);
        setModalContrasenaAbierto(true);
      } 
      else if (metodoId === 'google') {
        await activarMetodoGoogle();
      } 
      else {
        await activarMetodo(metodoId);
        desactivarModos();
      }
    } catch (err) {
      setError(`Error al activar método: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    }
  };

  const activarMetodoGoogle = async () => {
    try {
      setCargandoGoogle(true);
      limpiarError();
      
      // Obtener email desde sessionStorage
      const userEmail = obtenerEmailDesdeSessionStorage();
      
      if (!userEmail) {
        throw new Error("No se pudo obtener el correo del usuario desde sessionStorage");
      }
      
      console.log('📧 Activando Google con email:', userEmail);
      
      // AUTENTICAR CON GOOGLE Y COMPARAR
      const autenticacionExitosa = await autenticarConGoogleYComparar(userEmail);
      
      if (!autenticacionExitosa) {
        throw new Error("El email de sessionStorage no coincide con la cuenta de Google");
      }
      
      // Si la autenticación fue exitosa, configurar Google Auth en el backend
      await apiService.setupGoogleAuth(userEmail);
      await activarMetodo('google');
      
      setCargandoGoogle(false);
      desactivarModos();
      
      // Recargar métodos si existe la función
      if (recargarMetodos) {
        recargarMetodos();
      }
      
    } catch (err) {
      console.error('Error en activarMetodoGoogle:', err);
      setError(`Error al configurar Google: ${err instanceof Error ? err.message : 'Error desconocido'}`);
      setCargandoGoogle(false);
    }
  };

  const manejarConfirmacionContrasena = async (contrasena: string) => {
    try {
      limpiarError();
      
      // Obtener email desde sessionStorage
      const userEmail = obtenerEmailDesdeSessionStorage();
      
      if (!userEmail) {
        throw new Error("No se pudo obtener el correo del usuario desde sessionStorage");
      }
      
      console.log('🔐 Configurando Correo/Contraseña para:', userEmail);
      
      await apiService.setupEmailPassword(userEmail, contrasena);
      
      if (metodoSeleccionadoParaContrasena) {
        await activarMetodo(metodoSeleccionadoParaContrasena);
      }
      
      setModalContrasenaAbierto(false);
      setMetodoSeleccionadoParaContrasena(null);
      desactivarModos();
      
      // Recargar métodos si existe la función
      if (recargarMetodos) {
        recargarMetodos();
      }
      
    } catch (err) {
      console.error('Error en manejarConfirmacionContrasena:', err);
      setError(`Error al configurar contraseña: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    }
  };

  const eliminarMetodosSeleccionados = async () => {
    try {
      limpiarError();
      
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
      
      // Recargar métodos si existe la función
      if (recargarMetodos) {
        recargarMetodos();
      }
      
    } catch (err) {
      setError(`Error al eliminar métodos: ${err instanceof Error ? err.message : 'Error desconocido'}`);
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