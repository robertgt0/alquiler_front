export interface Categoria {
  id: string | number;
  titulo: string;
  descripcion: string;
  icono?: string;
  totalServicios?: number;
  slug?: string;
}
