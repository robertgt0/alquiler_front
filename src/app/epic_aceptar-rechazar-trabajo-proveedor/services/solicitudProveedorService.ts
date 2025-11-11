// src/modules/epic_aceptar-rechazar-trabajo-proveedor/services/solicitudProveedorService.ts

const BASE_URL = "http://localhost:5000/api/los_vengadores_trabajos/trabajos"; 
// 👆 Cambiado a puerto 5000, según tu backend (.env)

export async function confirmarSolicitud(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}/confirmar`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Error al confirmar trabajo");
  }
}

export async function rechazarSolicitud(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}/rechazar`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Error al rechazar trabajo");
  }
}
