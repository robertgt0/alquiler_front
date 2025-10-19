export interface Horario {
  id: string;
  horaInicio: string;
  horaFin: string;
  costo: number;
  moneda: string;
}

export type HorariosDisponiblesType = {
  [fecha: string]: Horario[];
};

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
