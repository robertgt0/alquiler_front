export interface ISolicitud {
  horaInicio: string; // "HH:MM"
  horaFin: string;    // "HH:MM"
}

export interface IFranjaDisponible {
  inicio: string; // "HH:MM"
  fin: string;    // "HH:MM"
}

export type SolicitudStatus =
  | "ok"
  | "unavailable" // fuera de las franjas disponibles
  | "conflict"    // solapa con una reserva previa
  | "error";

export interface ISolicitudResponse {
  ok: boolean;
  status: SolicitudStatus;
  message: string;
}
