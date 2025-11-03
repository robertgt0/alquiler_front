import type { TrabajoTerminado } from "../interfaces/Trabajo.interface";
import { parseDMY } from "../utils/date";

let MOCK_DATA: TrabajoTerminado[] = [
  {
    id: 1,
    cliente: "Armando Paredes",
    proveedor: "Juan Perez",
    fecha: "25/11/2025",
    horario: "10:00 - 11:00",
    descripcion: "El trabajo es la construcción de un muro perimetral de 20 metros.",
    costo: 250,
    estado: "Terminado",
    calificacion: 5,
  },
  {
    id: 2,
    cliente: "Carlos López",
    proveedor: "Juan Perez",
    fecha: "20/11/2025",
    horario: "08:00 - 09:30",
    descripcion: "Reparación completa de techo y canaletas.",
    costo: 180,
    estado: "Terminado",
    calificacion: 4,
  },
  {
    id: 3,
    cliente: "María Soto",
    proveedor: "Juan Perez",
    fecha: "05/10/2025",
    horario: "14:00 - 16:00",
    descripcion: "Pintura de fachada principal y rejas.",
    costo: 320,
    estado: "Terminado",
  },
];

// Orden (más reciente primero)
function sortByDateDesc(arr: TrabajoTerminado[]) {
  return [...arr].sort((a, b) => parseDMY(b.fecha).getTime() - parseDMY(a.fecha).getTime());
}

// Simula fetch con retardo (para probar loader) y error aleatorio controlado
export async function fetchTrabajosTerminados(opts?: { simulateError?: boolean; delayMs?: number; }): Promise<TrabajoTerminado[]> {
  const { simulateError = false, delayMs = 350 } = opts || {};
  await new Promise(res => setTimeout(res, delayMs));
  if (simulateError) {
    // Mensaje no técnico, como piden los criterios
    throw new Error("No pudimos cargar los trabajos. Revisa tu conexión e inténtalo otra vez.");
  }
  return sortByDateDesc(MOCK_DATA);
}

export async function fetchTrabajoById(id: number): Promise<TrabajoTerminado | undefined> {
  await new Promise(res => setTimeout(res, 150));
  return MOCK_DATA.find(t => t.id === id);
}

/**
 * “Tiempo real” de demostración:
 * Llama al callback cada X ms por si hubiera cambios (en un backend real se usaría WS/SSE).
 * Aquí sólo reenvía el arreglo ordenado actual.
 */
export function subscribeTrabajosTerminados(cb: (data: TrabajoTerminado[]) => void, intervalMs = 5000) {
  const tick = async () => cb(sortByDateDesc(MOCK_DATA));
  const id = setInterval(tick, intervalMs);
  tick(); // primer disparo
  return () => clearInterval(id);
}

// (Utilidad para demos: permitir que en consola se marquen como “Terminado” sin modificar el UI)
// En tu caso real, el “Terminado” ya no se debe poder cambiar (criterio cubierto en el front).
export function __demo_updateMock(fn: (data: TrabajoTerminado[]) => TrabajoTerminado[]) {
  MOCK_DATA = fn(MOCK_DATA);
}
