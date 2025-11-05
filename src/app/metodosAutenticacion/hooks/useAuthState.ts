// hooks/useAuthState.ts
import { useState, useEffect } from 'react';
import { MetodoAutenticacion } from '../interfaces/types';
import { apiService } from '../services/api'; // ✅ Importar apiService

export function useAuthState() {
  const [metodos, setMetodos] = useState<MetodoAutenticacion[]>([]);
  const [metodosActivos, setMetodosActivos] = useState<MetodoAutenticacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarMetodos = async () => {
    try {
      setCargando(true);
      setError(null);
      
      // ✅ Ahora usa apiService
      const metodosBackend = await apiService.getAuthMethods();
      
      const metodosConActivo = metodosBackend.map(metodo => ({
        ...metodo,
        activo: metodo.activo || false
      }));
      
      setMetodos(metodosConActivo);
      setMetodosActivos(metodosConActivo.filter(m => m.activo));
      
    } catch (err) {
      setError('Error al cargar métodos de autenticación');
      console.error('Error cargando métodos:', err);
      
      // Fallback
      const metodosIniciales: MetodoAutenticacion[] = [
        {
          id: 'correo',
          nombre: 'Correo/Contraseña',
          tipo: 'correo',
          icono: '📧',
          color: 'blue',
          activo: false
        },
        {
          id: 'google',
          nombre: 'Google', 
          tipo: 'google',
          icono: '🔐',
          color: 'red',
          activo: false
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
      await cargarMetodos();
    } catch (err) {
      setError(`Error al activar método ${metodoId}: ${err}`);
      throw err;
    }
  };

  const eliminarMetodo = async (metodoId: string) => {
    try {
      setError(null);
      
      if (metodosActivos.length <= 1) {
        throw new Error("No se puede eliminar el único método de autenticación");
      }

      await apiService.deactivateAuthMethod(metodoId);
      await cargarMetodos();
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