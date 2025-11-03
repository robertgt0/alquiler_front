

import { fetchTrabajosCliente } from '@/app/epic_VisualizadorDeTrabajosAgendadosVistaCliente/services/api';
import { Job } from '../interfaces/types';
export type Role = 'cliente' | 'proveedor';
// Importamos 'JobStatus' para usarlo en nuestros mocks
import { JobStatus } from '../interfaces/types';
// Las funciones 'convertirAISO' y 'normalizarEstado' no las necesitamos aquí
// porque nuestros datos falsos ya tendrán el formato correcto (ISO y JobStatus).
// import { convertirAISO, normalizarEstado } from '../utils/helpers';

// --- INICIO DE DATOS FALSOS (MOCK) ---
// 1. Creamos una lista de trabajos falsos.
const MOCK_JOBS: Job[] = [
  {
    id: 'mock-1',
    clientName: 'Fidel Vasquez', // ¡Un saludo!
    service: 'Plomería',
    startISO: '2025-10-20T09:00:00.000Z', // Oct 20
    endISO: '2025-10-20T11:00:00.000Z',
    status: 'pending',
    cancelReason: '',
    description: 'Instalación de grifo en la cocina.',
  },
  {
    id: 'mock-2',
    clientName: 'Ana García',
    service: 'Electricidad',
    startISO: '2025-10-21T14:00:00.000Z', // Oct 21
    endISO: '2025-10-21T15:30:00.000Z',
    status: 'pending',
    cancelReason: '',
    description: 'Revisión de tablero eléctrico.',
  },
  {
    id: 'mock-3',
    clientName: 'Carlos Soliz',
    service: 'Pintura',
    startISO: '2025-10-19T08:00:00.000Z', // Oct 19
    endISO: '2025-10-19T17:00:00.000Z',
    status: 'pending',
    cancelReason: '',
    description: 'Pintar la habitación principal.',
  },
  {
    id: 'mock-4',
    clientName: 'Lucía Méndez',
    service: 'Plomería',
    startISO: '2025-10-18T10:00:00.000Z', // Oct 18
    endISO: '2025-10-18T11:00:00.000Z',
    status: 'pending',
    cancelReason: 'Cliente pospuso la cita.',
    description: 'Reparación de fuga en el baño.',
  },
  {
    id: 'mock-5',
    clientName: 'Rodolfo Argote',
    service: 'Desarrollo de Software',
    startISO: '2025-10-22T10:00:00.000Z', // Oct 22
    endISO: '2025-10-22T18:00:00.000Z',
    status: 'pending',
    cancelReason: '',
    description: 'Revisión final del proyecto.',
  },
  {
    id: 'mock-6',
    clientName: 'Mario Fernandez',
    service: 'Albañilería',
    startISO: '2025-10-23T08:00:00.000Z', // Oct 23
    endISO: '2025-10-23T16:00:00.000Z',
    status: 'pending',
    cancelReason: '',
    description: 'Levantar pared en patio trasero.',
  },
  {
    id: 'mock-7',
    clientName: 'Sofia Rojas',
    service: 'Jardinería',
    startISO: '2025-10-23T11:00:00.000Z', // Oct 23
    endISO: '2025-10-23T13:00:00.000Z',
    status: 'pending',
    cancelReason: '',
    description: 'Mantenimiento mensual de jardín.',
  },
  {
    id: 'mock-8',
    clientName: 'David Luna',
    service: 'Cerrajería',
    startISO: '2025-10-24T10:30:00.000Z', // Oct 24
    endISO: '2025-10-24T11:00:00.000Z',
    status: 'pending',
    cancelReason: '',
    description: 'Cambio de chapa puerta principal.',
  },
  {
    id: 'mock-9',
    clientName: 'Valeria Torres',
    service: 'Limpieza',
    startISO: '2025-10-24T15:00:00.000Z', // Oct 24
    endISO: '2025-10-24T18:00:00.000Z',
    status: 'pending',
    cancelReason: '',
    description: 'Limpieza profunda de departamento.',
  },
  {
    id: 'mock-10',
    clientName: 'Jorge Campos',
    service: 'Gasfitería',
    startISO: '2025-10-25T09:00:00.000Z', // Oct 25
    endISO: '2025-10-25T11:00:00.000Z',
    status: 'pending',
    cancelReason: '',
    description: 'Instalación de calefón.',
  },
  {
    id: 'mock-11',
    clientName: 'Clara Montes',
    service: 'Mudanza',
    startISO: '2025-10-26T08:00:00.000Z', // Oct 26
    endISO: '2025-10-26T14:00:00.000Z',
    status: 'pending',
    cancelReason: '',
    description: 'Servicio de mudanza completo.',
  },
  {
    id: 'mock-12',
    clientName: 'Daniel Acosta',
    service: 'Electricidad',
    startISO: '2025-10-27T16:00:00.000Z', // Oct 27
    endISO: '2025-10-27T17:30:00.000Z',
    status: 'pending',
    cancelReason: '',
    description: 'Instalación de 3 lámparas.',
  },
  {
    id: 'mock-13',
    clientName: 'Patricia Guzman',
    service: 'Pintura',
    startISO: '2025-10-28T09:00:00.000Z', // Oct 28
    endISO: '2025-10-28T13:00:00.000Z',
    status: 'pending',
    cancelReason: '',
    description: 'Pintar 2 habitaciones.',
  },
  {
    id: 'mock-14',
    clientName: 'Luis Vera',
    service: 'Albañilería',
    startISO: '2025-10-29T10:00:00.000Z', // Oct 29
    endISO: '2025-10-29T12:00:00.000Z',
    status: 'pending',
    cancelReason: '',
    description: 'Reparación de revoque.',
  },
  {
    id: 'mock-15',
    clientName: 'Andrea Mejia',
    service: 'Cerrajería',
    startISO: '2025-10-30T14:00:00.000Z', // Oct 30
    endISO: '2025-10-30T14:30:00.000Z',
    status: 'pending',
    cancelReason: '',
    description: 'Apertura de puerta (llaves olvidadas).',
  },
  {
    id: 'mock-c16',
    clientName: 'Armando Paredes',
    service: 'Albañil',
    startISO: '2025-11-25T10:00:00.000Z', // Nov 25
    endISO: '2025-11-25T11:00:00.000Z',
    status: 'cancelled',
    cancelReason: 'Tuve que cancelar porque habia bloqueos y no pude llegar.',
    description: 'El trabajo es la construcción de un muro perimetral de 20 metros.',
  },
  {
    id: 'mock-c17',
    clientName: 'Isac Diaz',
    service: 'Albañil',
    startISO: '2025-11-25T10:00:00.000Z', // Nov 25
    endISO: '2025-11-25T11:00:00.000Z',
    status: 'done',
    cancelReason: '',
    description: 'El trabajo es la construcción de un muro perimetral de 20 metros.',
  },
{
    id: 'mock-c18',
    clientName: 'Dabel Lucana',
    service: 'Carpintería',
    startISO: '2025-11-25T15:00:00.000Z', // Nov 25
    endISO: '2025-11-25T16:00:00.000Z',
    status: 'cancelled',
    cancelReason: '',
    description: 'Arreglar la puerta del garaje.',
  },
];
// --- FIN DE DATOS FALSOS (MOCK) ---

// --- ¡NUEVA LÍNEA! ---
// Ordenamos el array MOCK_JOBS por fecha de inicio (startISO) en orden descendente (más reciente primero)
MOCK_JOBS.sort((a, b) => b.startISO.localeCompare(a.startISO));
// --------------------


/** HU 1.7 – Trabajos por PROVEEDOR (VERSIÓN MOCKEADA PARA QA) */
export async function fetchTrabajosProveedor(proveedorId: string, estado?: string): Promise<Job[]> {
  
  console.log(
    `%c ⚡ MOCK API (Proveedor) ⚡: Devolviendo datos falsos (ordenados) para proveedor: ${proveedorId}`, 
    'color: #FFD700; background: #333; font-weight: bold; padding: 4px 8px; border-radius: 4px;'
  );

  // Simulamos un retraso de red
  return new Promise((resolve) => {
    setTimeout(() => {
      
      // Filtramos la lista YA ORDENADA
      const trabajosFiltrados = (estado && estado !== 'all' && estado !== undefined)
        ? MOCK_JOBS.filter(job => job.status === estado)
        : MOCK_JOBS; // Si es 'all' o no hay estado, devuelve la lista completa (ya ordenada)
        
      resolve(trabajosFiltrados);
      
    }, 1000); // 1 segundo
  });
}

















/* LOQUE ESTABA ANTES
import { Job } from '../interfaces/types';
import { convertirAISO, normalizarEstado } from '../utils/helpers';

/** HU 1.7 – Trabajos por PROVEEDOR 
export async function fetchTrabajosProveedor(proveedorId: string, estado?: string): Promise<Job[]> {
  const url = new URL(`http://localhost:5000/api/vengadores/trabajos/proveedor`);
  url.searchParams.set('proveedorId', proveedorId);
  if (estado) url.searchParams.set('estado', estado); // ← opcional

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Error al obtener trabajos del proveedor');
  const data = await res.json();

  // 👇 En Vista Proveedor mostramos al CLIENTE en el “card header”
  return data.map((t: any) => ({
    id: `${t.proveedor?.id}-${t.cliente?.id}-${t.fecha}-${t.horaInicio}`,
    clientName: t.cliente?.nombre ?? '—', // ← CLIENTE
    service: t.servicio,
    startISO: convertirAISO(t.fecha, t.horaInicio),
    endISO: convertirAISO(t.fecha, t.horaFin),
    status: normalizarEstado(t.estado),
    cancelReason: t.cancelReason ?? '',
    description: t.descripcion ?? '',
  }));
}
*/