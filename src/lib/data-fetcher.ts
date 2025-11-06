// src/lib/data-fetcher.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

/** 🔎 Utilidad base para todas las peticiones */
async function fetchFromApi<T = any>(endpoint: string): Promise<T | null> {
  try {
    const url = `${API_URL}${endpoint}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      console.warn(`⚠️ Error HTTP ${res.status} al obtener ${endpoint}`);
      return null;
    }
    const json = await res.json().catch(() => null);
    if (json == null) return null;

    // Normalizar: si la API responde { data: ... } devolver data,
    // si responde directamente el recurso (objeto/array) devolverlo tal cual.
    return (json && typeof json === "object" && "data" in json) ? json.data : json;
  } catch (err) {
    console.error(`❌ Error al obtener ${endpoint}:`, err);
    return null;
  }
}

// 🔹 Funciones específicas de obtención de datos
export async function getProveedorById(proveedorId: string) {
  return fetchFromApi(`/api/devcode/proveedores/${proveedorId}`);
}

export async function getServicioById(servicioId: string) {
  return fetchFromApi(`/api/devcode/servicios/${servicioId}`);
}

export async function getClienteById(clienteId: string) {
  return fetchFromApi(`/api/devcode/clientes/${clienteId}`);
}

export async function getCitaById(citaId: string) {
  return fetchFromApi(`/api/devcode/citas/${citaId}`);
}

export async function getDisponibilidadProveedor(proveedorId: string, fechaInicio: string, fechaFin: string) {
  return fetchFromApi(
    `/api/devcode/proveedores/${proveedorId}/disponibilidad?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
  );
}
