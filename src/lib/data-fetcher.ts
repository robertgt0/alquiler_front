const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

/** 🧰 Utilidad base para todas las peticiones */
async function fetchFromApi<T = any>(endpoint: string): Promise<T | null> {
  try {
    const url = `${API_URL}${endpoint}`;
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      console.warn(`⚠️ Error HTTP ${res.status} al obtener ${endpoint}`);
      return null;
    }

    const json = await res.json().catch(() => null);
    if (!json) return null;

    // Si la API devuelve { data: ... }, extraemos el contenido
    const data = (json && typeof json === "object" && "data" in json) ? json.data : json;

    // Normalizamos solo lo necesario (_id → id)
    const normalize = (obj: any) => {
      if (obj && typeof obj === "object" && "_id" in obj && !("id" in obj)) {
        obj.id = obj._id;
      }
      return obj;
    };

    if (Array.isArray(data)) return data.map(normalize) as any;
    return normalize(data) as any;
  } catch (err) {
    console.error(`❌ Error al obtener ${endpoint}:`, err);
    return null;
  }
}

/* ===========================================================
   🔹 Funciones específicas por recurso
   =========================================================== */
export async function getProveedorById(proveedorId: string) {
  if (!proveedorId) return null;
  return fetchFromApi(`/api/devcode/proveedores/${proveedorId}`);
}

export async function getServicioById(servicioId: string) {
  if (!servicioId) return null;
  return fetchFromApi(`/api/devcode/servicios/${servicioId}`);
}

export async function getClienteById(clienteId: string) {
  if (!clienteId) return null;
  return fetchFromApi(`/api/devcode/clientes/${clienteId}`);
}

/** 🗓️ Obtener disponibilidad del proveedor en un rango de fechas */
export async function getDisponibilidadProveedor(
  proveedorId: string,
  fechaInicio: string,
  fechaFin: string
) {
  if (!proveedorId || !fechaInicio || !fechaFin) return null;

  return fetchFromApi(
    `/api/devcode/proveedores/${proveedorId}/disponibilidad?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
  );
}

export { fetchFromApi };