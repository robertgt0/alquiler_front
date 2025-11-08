import { MetodoAutenticacion } from '../interfaces/types';

export const formatearFecha = (fecha: Date): string => {
  return fecha.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const obtenerIconoPorTipo = (tipo: string): string => {
  const iconos: { [key: string]: string } = {
    correo: '📧',
    google: '🔐',
    otro: '⚙️'
  };
  
  return iconos[tipo] || '🔑';
};

export const validarMetodoUnico = (
  metodos: MetodoAutenticacion[],
  nuevoTipo: string
): boolean => {
  return !metodos.some(metodo => metodo.tipo === nuevoTipo);
};