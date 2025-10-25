// frontend: src/app/VisualizadorDeTrabajosAgendadosVistaCliente/services/api.ts
import { Job } from '../interfaces/types';
import { convertirAISO, normalizarEstado } from '../utils/helpers';

// URL base del backend. La podemos reutilizar para ambas funciones.
const API_URL = 'http://localhost:5000/api/vengadores/trabajos';

// --- FUNCIÓN PARA LA VISTA DEL PROVEEDOR (HU 1.7) ---
export async function fetchTrabajosProveedor(): Promise<Job[]> {
  // Simulación: usamos un ID de proveedor fijo para la prueba
  const proveedorIdDePrueba = 'proveedor_123';
  const res = await fetch(`${API_URL}/proveedor?id=${proveedorIdDePrueba}`);

  if (!res.ok) throw new Error('Error al obtener trabajos del proveedor');
  const data = await res.json();

  // Mapeamos los datos del backend al formato que el frontend necesita (Job)
  return data.map((t: any) => ({
    id: t._id,
    clientName: t.cliente.nombre,
    service: t.servicio,
    startISO: convertirAISO(t.fecha, t.horaInicio),
    endISO: convertirAISO(t.fecha, t.horaFin),
    status: normalizarEstado(t.estado),
  }));
}

// --- NUEVA FUNCION PARA LA VISTA DEL CLIENTE (HU 1.8) ---
export async function fetchTrabajosCliente(clienteId: string): Promise<Job[]> {
  const res = await fetch(`${API_URL}/cliente/${clienteId}`);

  if (!res.ok) throw new Error('Error al obtener trabajos del cliente');
  const data = await res.json();

  // Hacemos el mismo mapeo, pero adaptado para la vista del cliente
  return data.map((t: any) => ({
    id: t._id,
    providerName: t.proveedor.nombre, // Ahora necesitamos el nombre del proveedor
    service: t.servicio,
    startISO: convertirAISO(t.fecha, t.horaInicio),
    endISO: convertirAISO(t.fecha, t.horaFin),
    status: normalizarEstado(t.estado),
  }));
}
