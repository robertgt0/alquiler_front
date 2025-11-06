// modules/GestorMetodos.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { GestorMetodosProps, ModosInterfaz, MetodoAutenticacion } from '../interfaces/types';
import MetodoActivoPanel from '../components/MetodoActivoPanel';
import MetodosDisponiblesList from '../components/MetodosDisponiblesList';
import ModalContrasena from '../components/ModalContrasena';
import { apiService } from '../services/api';
import { GoogleAuthService } from '../services/googleAuthService';

// =============================================
// 🔍 FUNCIONES AUXILIARES - DIAGNÓSTICO Y DATOS
// =============================================

/**
 * 🎯 Función de diagnóstico para verificar sessionStorage
 * Ayuda a debuggear qué datos están disponibles
 */
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
      console.log('  - authProvider en userData:', userData.authProvider);
    } catch (error) {
      console.log('  - Error parseando userData:', error);
    }
  }
  
  console.log('🔍 FIN DIAGNÓSTICO');
};

/**
 * 🎯 Obtiene todos los datos del usuario desde sessionStorage
 * Incluye email, authProvider, y cualquier otra información
 */
const obtenerUserDataDesdeSessionStorage = () => {
  try {
    if (typeof window === 'undefined') {
      return null;
    }

    const userDataString = sessionStorage.getItem('userData');
    
    if (!userDataString) {
      console.warn('⚠️ No se encontró userData en sessionStorage');
      return null;
    }

    const userData = JSON.parse(userDataString);
    console.log('📧 UserData obtenido:', userData);
    
    return userData;
    
  } catch (error) {
    console.error('❌ Error al obtener userData desde sessionStorage:', error);
    return null;
  }
};

// =============================================
// 🎯 COMPONENTE PRINCIPAL - GESTOR MÉTODOS
// =============================================

export default function GestorMetodos({
  metodos,
  metodosActivos,
  cargando,
  activarMetodo,
  eliminarMetodo,
  recargarMetodos
}: GestorMetodosProps & { recargarMetodos?: () => void }) {
  
  // =============================================
  // 🎯 ESTADOS DEL COMPONENTE
  // =============================================
  
  const [modos, setModos] = useState<ModosInterfaz>({
    modoSeleccion: false,      // Modo para seleccionar métodos a activar
    modoEliminar: false,       // Modo para seleccionar métodos a eliminar
    metodosSeleccionados: [],  // IDs de métodos seleccionados para activar
    metodosAEliminar: []       // IDs de métodos seleccionados para eliminar
  });

  const [modalContrasenaAbierto, setModalContrasenaAbierto] = useState(false);
  const [metodoSeleccionadoParaContrasena, setMetodoSeleccionadoParaContrasena] = useState<string | null>(null);
  const [cargandoGoogle, setCargandoGoogle] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);

  // =============================================
  // 🔄 EFFECTS - INICIALIZACIÓN
  // =============================================

  /**
   * 🎯 Obtener datos del usuario al cargar el componente
   * Esto nos da el authProvider para determinar el método de registro
   */
  useEffect(() => {
    const data = obtenerUserDataDesdeSessionStorage();
    setUserData(data);
    
    // Diagnóstico del authProvider para debuggear
    if (data) {
      console.log('🔐 AuthProvider del usuario:', data.authProvider);
      console.log('📧 Email del usuario:', data.correo);
    }
  }, []);

  /**
   * 🎯 Verifica si hay un resultado de activación de Google pendiente
   * Se ejecuta cuando el usuario regresa del callback de Google
   */
  useEffect(() => {
    const verificarResultadoGoogle = () => {
      const resultado = GoogleAuthService.getActivationResult();
      
      if (resultado) {
        console.log('📬 Resultado de activación Google:', resultado);
        
        if (resultado.success) {
          // Activación exitosa - actualizar estado local
          console.log('✅ Google activado exitosamente');
          
          // Aquí puedes actualizar el estado de métodos activos
          // Por ejemplo, llamar a recargarMetodos si existe
          if (recargarMetodos) {
            recargarMetodos();
          }
          
          // Mostrar mensaje de éxito
          setError(null);
          
        } else {
          // Mostrar error
          setError(resultado.message || 'Error al activar Google');
        }
        
        // Limpiar el estado de carga de Google
        setCargandoGoogle(false);
        
        // Limpiar el resultado
        GoogleAuthService.clearPendingActivation();
      }
    };

    // Verificar cuando el componente se monta
    verificarResultadoGoogle();
    
    // También verificar cuando la página gana foco (por si acaso)
    const handleFocus = () => {
      verificarResultadoGoogle();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [recargarMetodos]);

  // =============================================
  // 🎯 FUNCIONES DE GESTIÓN DE ESTADOS
  // =============================================

  const limpiarError = () => setError(null);

  /**
   * 🎯 Activa el modo selección para agregar nuevos métodos
   */
  const activarModoSeleccion = () => {
    limpiarError();
    setModos({
      modoSeleccion: true,
      modoEliminar: false,
      metodosSeleccionados: [],
      metodosAEliminar: []
    });
  };

  /**
   * 🎯 Activa el modo eliminación para quitar métodos
   */
  const activarModoEliminar = () => {
    limpiarError();
    setModos({
      modoEliminar: true,
      modoSeleccion: false,
      metodosAEliminar: [],
      metodosSeleccionados: []
    });
  };

  /**
   * 🎯 Desactiva todos los modos especiales
   */
  const desactivarModos = () => {
    limpiarError();
    setModos({
      modoSeleccion: false,
      modoEliminar: false,
      metodosSeleccionados: [],
      metodosAEliminar: []
    });
  };

  // =============================================
  // 🎯 FUNCIONES DE SELECCIÓN DE MÉTODOS
  // =============================================

  /**
   * 🎯 Maneja la selección/deselección de métodos para activar
   */
  const toggleSeleccionMetodo = (metodoId: string) => {
    limpiarError();
    
    if (!modos.modoSeleccion) return;
    
    const metodo = metodos.find(m => m.id === metodoId);
    if (metodo?.activo) {
      setError("Este método ya está activo");
      return;
    }
    
    // Solo permite seleccionar UN método a la vez
    if (modos.metodosSeleccionados.includes(metodoId)) {
      setModos(prev => ({ ...prev, metodosSeleccionados: [] }));
    } else {
      setModos(prev => ({ ...prev, metodosSeleccionados: [metodoId] }));
    }
  };

  /**
   * 🎯 Maneja la selección/deselección de métodos para eliminar
   */
  const toggleSeleccionEliminar = (metodoId: string) => {
    limpiarError();
    
    const metodo = metodos.find(m => m.id === metodoId);
    
    // Validación: No se puede eliminar método de registro
    if (metodo?.esMetodoRegistro) {
      setError("No se puede eliminar el método de autenticación con el que te registraste");
      return;
    }
    
    // Validación: No se puede eliminar el único método activo
    const esUnicoMetodoActivo = metodosActivos.length === 1;
    if (esUnicoMetodoActivo) {
      setError("No se puede eliminar el único método activo");
      return;
    }

    // Toggle de selección (puede seleccionar múltiples)
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

  // =============================================
  // 🎯 FUNCIONES DE ACTIVACIÓN DE MÉTODOS
  // =============================================

  /**
   * 🎯 Activa los métodos seleccionados
   * Maneja lógica específica por tipo de método
   */
  const activarMetodosSeleccionados = async () => {
    if (modos.metodosSeleccionados.length === 0) {
      setError("Por favor selecciona un método para activar");
      return;
    }

    const metodoId = modos.metodosSeleccionados[0]; // Solo un método
    
    try {
      limpiarError();

      const metodo = metodos.find(m => m.id === metodoId);
      if (metodo?.activo) {
        setError("Este método ya está activo");
        return;
      }
      
      // 📧 Lógica específica para Correo/Contraseña
      if (metodoId === 'local') {
        const googleEstaActivo = metodosActivos.some(m => m.id === 'google');
        
        // Validación: Requiere Google activo primero
        if (!googleEstaActivo) {
          setError("Este metodo ya esta activo ");
          return;
        }
        
        // Abre modal para configurar contraseña
        setMetodoSeleccionadoParaContrasena(metodoId);
        setModalContrasenaAbierto(true);
      } 
      // 🔐 Lógica específica para Google
      else if (metodoId === 'google') {
        await activarMetodoGoogle();
      } 
      // ⚡ Métodos normales
      else {
        await activarMetodo(metodoId);
        desactivarModos();
      }
    } catch (err) {
      setError(`Error al activar método: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    }
  };

  /**
   * 🎯 Lógica específica para activar Google Auth
   * Redirige a Google y la comparación se hace después del callback
   */
  const activarMetodoGoogle = async (): Promise<void> => {
    try {
      setCargandoGoogle(true);
      limpiarError();
      
      // Limpiar cualquier resultado previo
      GoogleAuthService.clearPendingActivation();
      
      // Obtener email desde sessionStorage
      const userEmail = userData?.correo;
      
      if (!userEmail) {
        throw new Error("No se pudo obtener el correo del usuario");
      }
      
      console.log('📧 Activando Google con email:', userEmail);
      
      // Guardar el email actual para comparar después en el callback
      sessionStorage.setItem('emailParaValidarGoogle', userEmail);
      sessionStorage.setItem('accionGoogle', 'activar-metodo');
      
      // Redirigir a Google - flujo normal de autenticación
      GoogleAuthService.signInWithGoogle('login');
      
    } catch (err) {
      console.error('❌ Error en activarMetodoGoogle:', err);
      setError(`Error al configurar Google: ${err instanceof Error ? err.message : 'Error desconocido'}`);
      setCargandoGoogle(false);
    }
  };

  /**
   * 🎯 Maneja la confirmación de contraseña para método local
   */
  const manejarConfirmacionContrasena = async (contrasena: string) => {
    try {
      limpiarError();
      
      const userEmail = userData?.correo;
      
      if (!userEmail) {
        throw new Error("No se pudo obtener el correo del usuario");
      }
      
      console.log('🔐 Configurando Correo/Contraseña para:', userEmail);
      
      // Configurar email/contraseña en el backend
      await apiService.setupEmailPassword(userEmail, contrasena);
      
      if (metodoSeleccionadoParaContrasena) {
        await activarMetodo(metodoSeleccionadoParaContrasena);
      }
      
      setModalContrasenaAbierto(false);
      setMetodoSeleccionadoParaContrasena(null);
      desactivarModos();
      
      // Recargar métodos
      if (recargarMetodos) {
        recargarMetodos();
      }
      
    } catch (err) {
      console.error('❌ Error en manejarConfirmacionContrasena:', err);
      setError(`Error al configurar contraseña: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    }
  };

  // =============================================
  // 🎯 FUNCIONES DE ELIMINACIÓN DE MÉTODOS
  // =============================================

  const eliminarMetodosSeleccionados = async () => {
    try {
      limpiarError();
      
      const metodosAEliminarConInfo = modos.metodosAEliminar.map(id => 
        metodos.find(m => m.id === id)
      ).filter(Boolean) as MetodoAutenticacion[];
      
      // Validación: No eliminar método de registro
      const contieneMetodoRegistro = metodosAEliminarConInfo.some(m => m.esMetodoRegistro);
      if (contieneMetodoRegistro) {
        setError("No se puede eliminar el método de autenticación con el que te registraste");
        return;
      }

      // Validación: Debe quedar al menos un método activo
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
      
      // Recargar métodos
      if (recargarMetodos) {
        recargarMetodos();
      }
      
    } catch (err) {
      setError(`Error al eliminar métodos: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    }
  };

  // =============================================
  // 🎯 LÓGICA DE MÉTODOS DISPONIBLES Y ACTIVOS
  // =============================================

  /**
   * 🎯 Define los métodos de autenticación disponibles
   * Incluye Correo/Contraseña (local) y Google
   */
  const metodosDisponibles: MetodoAutenticacion[] = [
    {
      id: 'local',
      nombre: 'Correo/Contraseña',
      tipo:"local",
      tipoProvider: 'local',
      icono: '📧',
      color: 'blue',
      activo: metodos.some(m => m.id === 'local' && m.activo),
      esMetodoRegistro: metodos.find(m => m.id === 'local')?.esMetodoRegistro || false
    },
    {
      id: 'google',
      nombre: 'Google',
      tipo:"google",
      tipoProvider: 'google',
      icono: '🔐',
      color: 'red',
      activo: metodos.some(m => m.id === 'google' && m.activo),
      esMetodoRegistro: metodos.find(m => m.id === 'google')?.esMetodoRegistro || false
    },
  ];

  /**
   * 🎯 Determina el estado activo basado en el authProvider del usuario
   * Esta es la CLAVE para mostrar correctamente los métodos activos
   */
  const determinarMetodoActivoPorAuthProvider = () => {
    if (!userData) return metodosDisponibles;

    const authProvider = userData.authProvider;
    console.log(`🎯 Determinando método activo basado en authProvider: ${authProvider}`);

    return metodosDisponibles.map(metodo => ({
      ...metodo,
      // 📌 REGLA PRINCIPAL: 
      // - Si el authProvider del usuario coincide con el tipoProvider, está ACTIVO
      // - Y es el MÉTODO DE REGISTRO
      activo: metodo.tipoProvider === authProvider || metodo.activo,
      esMetodoRegistro: metodo.tipoProvider === authProvider
    }));
  };

  // 🎯 Aplicar la lógica de determinación de métodos activos
  const metodosConEstadoActualizado = determinarMetodoActivoPorAuthProvider();
  
  // 🎯 Filtrar métodos disponibles (mostrar local solo si no está activo)
  const metodosDisponiblesFiltrados = metodosConEstadoActualizado.filter(m => 
    m.id === 'local' || !m.activo 
  );

  // 🎯 Obtener lista de métodos activos actualizada
  const metodosActivosActualizados = metodosConEstadoActualizado.filter(m => m.activo);

  // =============================================
  // 🎯 RENDERIZADO DEL COMPONENTE
  // =============================================

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
      {/* 🚨 Mostrar errores */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      )}

      {/* 🔍 Panel de diagnóstico (solo desarrollo) */}
      {/* {userData && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
          <p><strong>👤 Usuario:</strong> {userData.correo}</p>
          <p><strong>🔐 AuthProvider:</strong> {userData.authProvider}</p>
          <p><strong>✅ Métodos activos:</strong> {metodosActivosActualizados.map(m => m.nombre).join(', ')}</p>
        </div>
      )} */}

      {/* 🎯 Layout principal con dos paneles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 📌 Panel de Métodos Activos */}
        <MetodoActivoPanel
          metodosActivos={metodosActivosActualizados}
          modos={modos}
          metodos={metodosConEstadoActualizado}
          onToggleEliminar={toggleSeleccionEliminar}
          onActivarModoSeleccion={activarModoSeleccion}
          onActivarModoEliminar={activarModoEliminar}
          onDesactivarModos={desactivarModos}
          onEliminarMetodos={eliminarMetodosSeleccionados}
        />

        {/* 📌 Panel de Métodos Disponibles */}
        <MetodosDisponiblesList
          metodosDisponibles={metodosDisponiblesFiltrados}
          metodosActivos={metodosActivosActualizados}
          modos={modos}
          cargandoGoogle={cargandoGoogle}
          onToggleSeleccion={toggleSeleccionMetodo}
          onDesactivarModos={desactivarModos}
          onActivarMetodos={activarMetodosSeleccionados}
        />
      </div>

      {/* 🔐 Modal para configurar contraseña */}
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