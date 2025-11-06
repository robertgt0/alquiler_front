// hooks/useAuthState.ts
import { useState, useEffect } from 'react';
import { MetodoAutenticacion } from '../interfaces/types';
import { apiService } from '../services/api';
import { obtenerMetodoAutenticacion } from '@/app/teamsys/services/UserService';

export function useAuthState() {
  const [metodos, setMetodos] = useState<MetodoAutenticacion[]>([]);
  const [metodosActivos, setMetodosActivos] = useState<MetodoAutenticacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarMetodos = async () => {
    try {
      setCargando(true);
      setError(null);
      
      // Obtener métodos del backend y datos del usuario
      const [metodosBackend, userData] = await Promise.all([
        apiService.getAuthMethods(),
        apiService.getCurrentUser().catch(() => null)
      ]);
      
      // OBTENER EL ARRAY DE MÉTODOS ACTIVOS DESDE TU API
      let metodosActivosArray: string[] = [];
      let metodoRegistroOriginal: string | null = null;
      
      try {
        const userDataString = sessionStorage.getItem('userData');
        if (userDataString) {
          const userDataObj = JSON.parse(userDataString);
          const userId = userDataObj._id;
          if (userId) {
            // ✅ Obtiene el JSON completo y extrae authProvider
            const respuesta = await obtenerMetodoAutenticacion(userId);
            metodosActivosArray = respuesta.data.authProvider || [];
            console.log('Métodos activos desde API:', metodosActivosArray);
            
            // ✅ DETERMINAR MÉTODO DE REGISTRO ORIGINAL
            // Si el usuario tiene googleId, se registró con Google
            if (userDataObj.googleId) {
              metodoRegistroOriginal = 'google';
            } 
            // Si no tiene googleId, se registró con correo local
            else if (userDataObj.email && !userDataObj.googleId) {
              metodoRegistroOriginal = 'local';
            }
            console.log('Método de registro original:', metodoRegistroOriginal);
          }
        }
      } catch (err) {
        console.error('Error al obtener métodos activos:', err);
      }

      const metodosConActivo = metodosBackend.map(metodo => {
        // ✅ VERIFICAR SI EL MÉTODO ESTÁ EN EL ARRAY DE ACTIVOS
        const metodoIdEnBackend = metodo.id === 'correo' ? 'local' : metodo.id;
        const estaActivoEnArray = metodosActivosArray.includes(metodoIdEnBackend);
        
        // ✅ SOLO ES MÉTODO DE REGISTRO SI ES EL ORIGINAL
        const esMetodoRegistro = metodoIdEnBackend === metodoRegistroOriginal;
        
        return {
          ...metodo,
          activo: estaActivoEnArray,
          esMetodoRegistro
        };
      });
      
      setMetodos(metodosConActivo);
      setMetodosActivos(metodosConActivo.filter(m => m.activo));
      
    } catch (err) {
      setError('Error al cargar métodos de autenticación');
      console.error('Error cargando métodos:', err);
      
      // Fallback mejorado
      const metodosIniciales: MetodoAutenticacion[] = [
        {
          id: 'correo',
          nombre: 'Correo/Contraseña',
          tipo: 'correo',
          icono: '📧',
          color: 'blue',
          activo: false,
          esMetodoRegistro: false
        },
        {
          id: 'google',
          nombre: 'Google', 
          tipo: 'google',
          icono: '🔐',
          color: 'red',
          activo: false,
          esMetodoRegistro: false
        },
      ];
      
      setMetodos(metodosIniciales);
      setMetodosActivos([]);
    } finally {
      setCargando(false);
    }
  };

  const activarMetodo = async (metodoId: string, datosAdicionales?: any) => {
    try {
      setError(null);
      await apiService.activateAuthMethod(metodoId, datosAdicionales);
      await cargarMetodos(); // Recargar para obtener estado actualizado
    } catch (err) {
      setError(`Error al activar método ${metodoId}: ${err}`);
      throw err;
    }
  };

  const eliminarMetodo = async (metodoId: string) => {
    try {
      setError(null);
      
      // Verificar si es método de registro
      const metodo = metodos.find(m => m.id === metodoId);
      if (metodo?.esMetodoRegistro) {
        throw new Error("No se puede eliminar el método de autenticación con el que te registraste");
      }

      if (metodosActivos.length <= 1) {
        throw new Error("No se puede eliminar el único método de autenticación");
      }

      await apiService.deactivateAuthMethod(metodoId);
      await cargarMetodos(); // Recargar para obtener estado actualizado
    } catch (err) {
      setError(`Error al eliminar método ${metodoId}: ${err}`);
      throw err;
    }
  };

  useEffect(() => {
    cargarMetodos();
  }, []);

  return {
    metodos,
    metodosActivos,
    cargando,
    error,
    activarMetodo,
    eliminarMetodo,
    recargarMetodos: cargarMetodos
  };
}

export default useAuthState;