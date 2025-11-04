import { Job } from '../interfaces/types';
// Importamos 'JobStatus' para usarlo en nuestros mocks
import { JobStatus } from '../interfaces/types';
// Las funciones 'convertirAISO' y 'normalizarEstado' no las necesitamos aquí
// porque nuestros datos falsos ya tendrán el formato correcto (ISO y JobStatus).
// import { convertirAISO, normalizarEstado } from '../utils/helpers';

// --- INICIO DE DATOS FALSOS (MOCK) ---
// 1. Creamos una lista de trabajos falsos.
// Nota: 'clientName' aquí guardará el nombre del PROVEEDOR (persona)
const MOCK_JOBS: Job[] = [
  {
    id: 'mock-c1',
    clientName: 'Juan Carlos Pérez', // <-- Nombre del Proveedor
    service: 'Plomería',
    startISO: '2025-10-20T09:00:00.000Z', // Oct 20
    endISO: '2025-10-20T11:00:00.000Z',
    status: 'pending',
    cancelReason: '',
    description: 'Instalación de grifo en la cocina.',
  },
  {
    id: 'mock-c2',
    clientName: 'Omar Flores', // <-- Nombre del Proveedor
    service: 'Electricidad',
    startISO: '2025-10-21T14:00:00.000Z', // Oct 21
    endISO: '2025-10-21T15:30:00.000Z',
    status: 'pending',
    cancelReason: '',
    description: 'Revisión de tablero eléctrico.',
  },
  {
    id: 'mock-c3',
    clientName: 'Yony Chavez', // <-- Nombre del Proveedor
    service: 'Pintura',
    startISO: '2025-10-19T08:00:00.000Z', // Oct 19
    endISO: '2025-10-19T17:00:00.000Z',
    status: 'pending',
    cancelReason: '',
    description: 'Pintar la habitación principal.',
  },
  {
    id: 'mock-c4',
    clientName: 'Juandy Pérez', // <-- Nombre del Proveedor
    service: 'Plomería',
    startISO: '2025-10-18T10:00:00.000Z', // Oct 18
    endISO: '2025-10-18T11:00:00.000Z',
    status: 'pending',
    cancelReason: 'Cliente pospuso la cita.',
    description: 'Reparación de fuga en el baño.',
  },
  {
    id: 'mock-c5',
    clientName: 'Mario Fernandez',
    service: 'Albañilería',
    startISO: '2025-10-23T08:00:00.000Z', // Oct 23
    endISO: '2025-10-23T16:00:00.000Z',
    status: 'pending',
    cancelReason: '',
    description: 'Levantar pared en patio trasero.',
  },
  {
    id: 'mock-c6',
    clientName: 'Sofia Rojas',
    service: 'Jardinería',
    startISO: '2025-10-23T11:00:00.000Z', // Oct 23
    endISO: '2025-10-23T13:00:00.000Z',
    status: 'pending',
    cancelReason: '',
    description: 'Mantenimiento mensual de jardín.',
  },
  {
    id: 'mock-c7',
    clientName: 'David Luna',
    service: 'Cerrajería',
    startISO: '2025-10-24T10:30:00.000Z', // Oct 24
    endISO: '2025-10-24T11:00:00.000Z',
    status: 'pending',
    cancelReason: '',
    description: 'Cambio de chapa puerta principal.',
  },
  {
    id: 'mock-c8',
    clientName: 'Valeria Torres',
    service: 'Limpieza',
    startISO: '2025-10-24T15:00:00.000Z', // Oct 24
    endISO: '2025-10-24T18:00:00.000Z',
    status: 'pending',
    cancelReason: '',
    description: 'Limpieza profunda de departamento.',
  },
  {
    id: 'mock-c9',
    clientName: 'Jorge Campos',
    service: 'Gasfitería',
    startISO: '2025-10-25T09:00:00.000Z', // Oct 25
    endISO: '2025-10-25T11:00:00.000Z',
    status: 'pending',
    cancelReason: '',
    description: 'Instalación de calefón.',
  },
  {
    id: 'mock-c10',
    clientName: 'Clara Montes',
    service: 'Mudanza',
    startISO: '2025-10-26T08:00:00.000Z', // Oct 26
    endISO: '2025-10-26T14:00:00.000Z',
    status: 'pending',
    cancelReason: '',
    description: 'Servicio de mudanza completo.',
  },
  {
    id: 'mock-c11',
    clientName: 'Daniel Acosta',
    service: 'Electricidad',
    startISO: '2025-10-27T16:00:00.000Z', // Oct 27
    endISO: '2025-10-27T17:30:00.000Z',
    status: 'pending',
    cancelReason: '',
    description: 'Instalación de 3 lámparas.',
  },
  {
    id: 'mock-c12',
    clientName: 'Patricia Guzman',
    service: 'Pintura',
    startISO: '2025-10-28T09:00:00.000Z', // Oct 28
    endISO: '2025-10-28T13:00:00.000Z',
    status: 'pending',
    cancelReason: '',
    description: 'Pintar 2 habitaciones.',
  },
  {
    id: 'mock-c13',
    clientName: 'Luis Vera',
    service: 'Albañilería',
    startISO: '2025-10-29T10:00:00.000Z', // Oct 29
    endISO: '2025-10-29T12:00:00.000Z',
    status: 'pending',
    cancelReason: '',
    description: 'Reparación de revoque.',
  },
  {
    id: 'mock-c14',
    clientName: 'Andrea Mejia',
    service: 'Cerrajería',
    startISO: '2025-10-30T14:00:00.000Z', // Oct 30
    endISO: '2025-10-30T14:30:00.000Z',
    status: 'pending',
    cancelReason: '',
    description: 'Apertura de puerta (llaves olvidadas).',
  },
  {
    id: 'mock-c15',
    clientName: 'Ricardo Solis',
    service: 'Gasfitería',
    startISO: '2025-10-31T09:00:00.000Z', // Oct 31
    endISO: '2025-10-31T10:00:00.000Z',
    status: 'pending',
    cancelReason: '',
    description: 'Revisión de tuberías.',
  },
];

// --- FIN DE DATOS FALSOS (MOCK) ---

// --- ¡NUEVA LÍNEA! ---
// Ordenamos el array MOCK_JOBS por fecha de inicio (startISO) en orden descendente (más reciente primero)
MOCK_JOBS.sort((a, b) => b.startISO.localeCompare(a.startISO));
// --------------------


/** HU 1.8 – Trabajos por CLIENTE (VERSIÓN MOCKEADA PARA QA) */
export async function fetchTrabajosCliente(clienteId: string, estado?: string): Promise<Job[]> {
  
  console.log(
    `%c ⚡ MOCK API (Cliente) ⚡: Devolviendo datos falsos (ordenados) para cliente: ${clienteId}`, 
    'color: #00BFFF; background: #333; font-weight: bold; padding: 4px 8px; border-radius: 4px;'
  );

  // Simulamos un retraso de red
  return new Promise((resolve) => {
    setTimeout(() => {
      
      // Filtramos la lista YA ORDENADA
      const trabajosFiltrados = (estado && estado !== 'all' && estado !== undefined)
        ? MOCK_JOBS.filter(job => job.status === estado)
        : MOCK_JOBS; // Si es 'all' o no hay estado, devuelve la lista completa (ya ordenada)
        
      resolve(trabajosFiltrados);
      
    }, 800); // 800 milisegundos
  });
}

























/*
//LO QUE ESTABA ANTES
/// src/app/epic_VisualizadorDeTrabajosAgendadosVistaCliente/services/api.ts
import { Job } from '../interfaces/types';
import { convertirAISO, normalizarEstado } from '../utils/helpers';

/** HU 1.8 – Trabajos por CLIENTE 
export async function fetchTrabajosCliente(clienteId: string, estado?: string) {
  const url = new URL(`http://localhost:5000/api/vengadores/trabajos/cliente/${clienteId}`); // ← usa param
  if (estado) url.searchParams.set('estado', estado); // (opcional)

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Error al obtener trabajos del cliente');
  const data = await res.json();

  // 👇 En Vista Cliente mostramos al PROVEEDOR en el “card header”
  return data.map((t: any) => ({
    id: `${t.proveedor?.id}-${t.cliente?.id}-${t.fecha}-${t.horaInicio}`,
    clientName: t.proveedor?.nombre ?? '—', // ← PROVEEDOR
    service: t.servicio,
    startISO: convertirAISO(t.fecha, t.horaInicio),
    endISO: convertirAISO(t.fecha, t.horaFin),
    status: normalizarEstado(t.estado),     // 'Pendiente' -> 'pending'
    cancelReason: t.cancelReason ?? '',
    description: t.descripcion ?? '',
  }));
}
*/