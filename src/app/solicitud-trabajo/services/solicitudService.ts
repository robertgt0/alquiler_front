import { ISolicitud } from "../interfaces/Solicitud.interface";

export async function enviarSolicitud(data: ISolicitud) {
  console.log("Enviando solicitud al backend...", data);
  // Aquí luego se hará la llamada real a la API (fetch o axios)
  return new Promise((resolve) => setTimeout(resolve, 1000));
}
