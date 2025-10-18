export interface Horario {
  id: number;
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

export const horariosDisponibles: HorariosDisponiblesType = {
  "2025-10-29": [
    { id: 1, horaInicio: "08:00", horaFin: "12:00", costo: 25, moneda: "Bs/Hr." },
    { id: 2, horaInicio: "14:00", horaFin: "18:00", costo: 25, moneda: "Bs/Hr." },
    { id: 3, horaInicio: "02:00", horaFin: "05:00", costo: 35, moneda: "Bs/Hr." }
  ],
  "2025-10-12": [
    { id: 1, horaInicio: "08:00", horaFin: "12:00", costo: 25, moneda: "Bs/Hr." },
    { id: 2, horaInicio: "14:00", horaFin: "18:00", costo: 25, moneda: "Bs/Hr." }
  ],
  "2025-10-24": [
    { id: 1, horaInicio: "10:00", horaFin: "14:00", costo: 30, moneda: "Bs/Hr." }
  ]
};