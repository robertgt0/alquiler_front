// hooks/useAuthState.ts
import { useState, useEffect } from 'react';
import { MetodoAutenticacion } from '../interfaces/types';
import { apiService } from '../services/api';

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
        apiService.getCurrentUser().catch(() => null) // Manejar error silenciosamente
      ]);
      
      // Determinar método de registro del usuario
      let metodoRegistro = '';
      if (userData) {
        // Si el usuario tiene googleId, se registró con Google
        if (userData.googleId) {
          metodoRegistro = 'google';
        } 
        // Si no tiene googleId pero tiene email, se registró con correo
        else if (userData.email && !userData.googleId) {
          metodoRegistro = 'correo';
        }
      }

      const metodosConActivo = metodosBackend.map(metodo => {
        // Si es el método con el que se registró, forzar a activo
        const esMetodoRegistro = metodo.id === metodoRegistro;
        return {
          ...metodo,
          activo: esMetodoRegistro || (metodo.activo || false),
          esMetodoRegistro // Nueva propiedad para identificar
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
          tipo:'local',
          tipoProvider:"local",
          icono: '📧',
          color: 'blue',
          activo: false,
          esMetodoRegistro: false
        },
        {
          id: 'google',
          nombre: 'Google', 
          tipo: 'google',
          tipoProvider:"local",
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