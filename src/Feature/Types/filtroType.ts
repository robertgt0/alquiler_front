export interface Opcion {
  label: string;
  value: string;
}
export interface Filtro {
  ciudad?: string;
  provincia?: string;
  disponibilidad?: "Disponible"| "Ocupado";
  tipoEspecialidad?: string;
}