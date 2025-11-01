// src/lib/appointments.ts

export type Destination = { email?: string; phone?: string; name?: string };

export type CreateAppointmentPayload = {
  proveedorId: string;
  servicioId: string;
  fecha: string; // ISO
  horario?: { inicio?: string; fin?: string };
  cliente?: { nombre?: string; email?: string; phone?: string; id?: string };
  [key: string]: any;
};

export type CreateResponse = {
  ok: boolean;
  data?: any;
  message?: string;
  status?: number;
  error?: any;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

/** Crear cita */
export async function createAppointment(
  payload: CreateAppointmentPayload
): Promise<CreateResponse> {
  const url = `${API_URL}/api/devcode/citas`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        message: body?.message ?? `HTTP ${res.status}`,
        data: body,
        error: body,
      };
    }

    return {
      ok: true,
      data: body?.data ?? body,
      status: res.status,
    };
  } catch (err: any) {
    return { ok: false, message: err?.message ?? String(err) };
  }
}

/** Enviar notificación (correo, whatsapp, etc.) */
export async function sendNotification(payload: {
  subject: string;
  message: string;
  destinations: Destination[];
  fromName?: string;
  meta?: any;
}): Promise<CreateResponse> {
  const NOTIFY_URL = `${API_URL}/api/gmail-notifications`; // o /api/notifications si usas otro endpoint
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (process.env.NEXT_PUBLIC_API_KEY) {
    headers["x-api-key"] = process.env.NEXT_PUBLIC_API_KEY;
  }

  try {
    const res = await fetch(NOTIFY_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        message: body?.message ?? `HTTP ${res.status}`,
        data: body,
        error: body,
      };
    }

    return {
      ok: true,
      data: body?.data ?? body,
      status: res.status,
    };
  } catch (err: any) {
    return { ok: false, message: err?.message ?? String(err) };
  }
}

/**
 * Función de alto nivel: crea cita y (si se creó) manda notificación.
 * Retorna un resultado uniforme para fácil manejo en frontend.
 */
export async function createAndNotify(payload: CreateAppointmentPayload) {
  // 1️⃣ Crear la cita
  const creation = await createAppointment(payload);

  if (!creation.ok) {
    return {
      ok: false,
      status: creation.status ?? 500,
      created: false,
      notified: false,
      error: creation.error ?? creation.message,
    };
  }

  // 2️⃣ Obtener datos creados (y posibles relaciones del backend)
  const createdData = creation.data ?? {};

  // 3️⃣ Preparar destinatarios
  let destinations: Destination[] = [];

  // Cliente
  if (payload.cliente?.email)
    destinations.push({
      email: payload.cliente.email,
      name: payload.cliente.nombre ?? "Cliente",
    });

  // Proveedor (si viene del backend o payload)
  const proveedor = createdData.proveedor ?? { email: "", nombre: "Proveedor" };
  if (proveedor?.email)
    destinations.push({
      email: proveedor.email,
      name: proveedor.nombre ?? "Proveedor",
    });

  // 4️⃣ Crear cuerpo del correo
  const fechaLocal = new Date(payload.fecha).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const horaInicio = payload.horario?.inicio ?? "";
  const horaFin = payload.horario?.fin ?? "";

  const subject = `Creacion de cita con ${proveedor.nombre}`;
  const message = `
  Hola ${payload.cliente?.nombre ?? "Cliente"},

  Tu cita ha sido creada exitosamente 🎉

  \n📅 *Fecha:* ${fechaLocal}
  \n⏰ *Horario:* ${horaInicio} - ${horaFin}
  \n👨‍⚕️ *Proveedor:* ${proveedor.nombre ?? "Proveedor"}
  \n🧾 *Servicio:* ${payload.servicioId}
  \n📍 *Dirección:* ${payload.ubicacion?.direccion ?? "No especificada"}
  \n🗒️ *Nota adicional:* ${payload.ubicacion?.notas ?? "Ninguna"}

  Gracias por confiar en nosotros.
  `;

  // 5️⃣ Enviar correo
  const notifyPayload = {
    subject,
    message,
    destinations,
    fromName: "Sistema de Citas",
    meta: {
      appointmentId: createdData.id ?? createdData._id ?? null,
    },
  };

  let notifyResult = await sendNotification(notifyPayload);
  const notified = notifyResult.ok;

  return {
    ok: true,
    created: true,
    notified,
    creation,
    notifyResult,
  };
}