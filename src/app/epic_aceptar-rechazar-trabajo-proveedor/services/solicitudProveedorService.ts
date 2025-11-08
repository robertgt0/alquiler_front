export async function confirmarSolicitud(id: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 600));
  // TODO: POST /api/los_vengadores/solicitudes/:id/confirmar
}

export async function rechazarSolicitud(id: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 600));
  // TODO: POST /api/los_vengadores/solicitudes/:id/rechazar
}
