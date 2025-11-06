// interfaces/types.ts
export interface MetodoAutenticacion {
  id: string;
  nombre: string;
  tipo: string;
  tipoProvider: string;
  icono: string;
  color: string;
  activo?: boolean; //  Agregar esta propiedad opcional
  fechaActivacion?: Date; //  Opcional: para saber cuándo se activó
  configurado?: boolean; //  Opcional: si está completamente configurado
  esMetodoRegistro?: boolean;
}

export interface GestorMetodosProps {
  metodos: MetodoAutenticacion[];
  metodosActivos: MetodoAutenticacion[];
  cargando: boolean;
  activarMetodo: (metodoId: string, datosAdicionales?: any) => Promise<void>;
  eliminarMetodo: (metodoId: string) => Promise<void>;
  recargarMetodos?: () => void;
}

export interface ModosInterfaz {
  modoSeleccion: boolean;
  modoEliminar: boolean;
  metodosSeleccionados: string[];
  metodosAEliminar: string[];
}

export interface UserData {
  id: string;
  email: string;
  googleId?: string;
  authMethod?: string;
}