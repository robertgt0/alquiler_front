const BASE_URL = "http://localhost:5000";

export async function enviarSolicitud(data: {
  date: string;
  horaInicio: string;
  horaFin: string;
}) {
  console.log("📤 Enviando solicitud al backend...", data);

  const res = await fetch(`${BASE_URL}/api/los_vengadores/trabajo-solicitado`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fecha: data.date,          // backend espera "fecha"
      hora_inicio: data.horaInicio,
      hora_fin: data.horaFin,
    }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message || "Error al enviar la solicitud");
  }

  const result = await res.json();
  console.log("✅ Respuesta del backend:", result);
  return result;
}