import { Trabajo, CancelarTrabajoRequest } from "../interfaces/Trabajo.interface";

export const obtenerTrabajo = async (id: string): Promise<Trabajo> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        cliente: "Juan Perez",
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
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Trabajo cancelado por proveedor con justificación:", request.justificacion);
      resolve(true);
    }, 1000);
  });
};