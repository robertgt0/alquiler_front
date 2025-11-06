// Define la estructura de un rango de tiempo individual
// Define la estructura de la configuración semanal
export type WeeklySchedule = {
  selectedDays: DayName[];   // Array de días a los que aplica este horario
  ranges: TimeRange[];       // Rango(s) de tiempo fijo(s)
};

// ... (El resto de tipos como TimeRange, DaySchedule, ScheduleConfig, etc., se mantiene)

export type TimeRange = {
  start: string; // Formato HH:MM
  end: string;   // Formato HH:MM
};

// Define la estructura de la configuración para un solo día
export type DaySchedule = {
  enabled: boolean;
  ranges: TimeRange[];
};

// Mapea los días de la semana a su respectiva configuración de horario
export type ScheduleConfig = {
  Lunes: DaySchedule;
  Martes: DaySchedule;
  Miercoles: DaySchedule;
  Jueves: DaySchedule;
  Viernes: DaySchedule;
  Sabado: DaySchedule;
  Domingo: DaySchedule;
};

// Tipo para el estado de errores
// Puede mapear un día completo (para errores de superposición) o un rango específico (día-indice)
export type ScheduleErrors = {
    [key: string]: string; // Ejemplo: { Lunes: "Error de superposición", "Lunes-0": "Hora de fin inválida" }
};

// Días de la semana para iteración
export const DAYS_OF_WEEK = [
  'Lunes',
  'Martes',
  'Miercoles',
  'Jueves',
  'Viernes',
  'Sabado',
  'Domingo',
] as const;

export type DayName = typeof DAYS_OF_WEEK[number];

// ... (Tus tipos DaySchedule, TimeRange, ScheduleConfig, etc. previos) ...

// Nuevo tipo para la configuración semanal uniforme
// ... (Tus tipos DaySchedule, TimeRange, ScheduleConfig, etc. previos) ...

// Nuevo tipo para la configuración semanal uniforme
export type WeeklyUniformSchedule = {
  selectedDays: DayName[];
  // CAMBIO CLAVE: Ahora es un array para soportar múltiples rangos
  ranges: TimeRange[];       
};
// ... (Tus tipos DaySchedule, TimeRange, ScheduleConfig, etc. previos) ...

