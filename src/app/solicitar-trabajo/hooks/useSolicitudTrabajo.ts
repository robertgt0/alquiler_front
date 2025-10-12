import { useState } from "react";
import { enviarSolicitud } from "../services/solicitudService";
import { ISolicitud } from "../interfaces/ISolicitud";

export function useSolicitudTrabajo() {
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const enviar = async (data: ISolicitud) => {
    setLoading(true);
    await enviarSolicitud(data);
    setLoading(false);
    setEnviado(true);
  };

  return { loading, enviado, enviar };
}
