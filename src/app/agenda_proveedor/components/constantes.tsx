// constantes.tsx - SIN DATOS MOCK

export interface Horario {
  id?: number; // Ya no es requerido porque viene del backend
  horaInicio: string;
  horaFin: string;
  costo: number;
  moneda: string;
}

export const diasSemanaCompletos: string[] = [
  "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"
];

export const diasSemanaCortos: string[] = [
  "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"
];

export const mesesNombres: string[] = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// ⚠️ YA NO NECESITAMOS horariosDisponibles mock
// Los horarios ahora vienen del backend