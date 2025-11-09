import { Trabajo, CancelarTrabajoRequest } from "../interfaces/Trabajo.interface";

export const obtenerTrabajo = async (id: string): Promise<Trabajo> => {
  // Simulación - aquí iría tu llamada real al backend con fetch o axios
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        proveedor: "Armando Paredes",
        fecha: "Jueves 25 de noviembre",
        horario: "10:00 - 11:00",
        descripcion: "El trabajo es la construcción de un muro perimetral de 20 metros.",
        costo: 250,
        estado: "Confirmado",
      });
    }, 500);
  });
};

export const cancelarTrabajoAPI = async (request: CancelarTrabajoRequest): Promise<boolean> => {
  // Simulación - aquí iría tu llamada real al backend
  // Ejemplo: const response = await fetch('/api/trabajos/cancelar', { method: 'POST', body: JSON.stringify(request) });
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Trabajo cancelado con justificación:", request.justificacion);
      resolve(true);
    }, 1000);
  });
};