// src/lib/appointments.ts

import {
  getProveedorById,
  getServicioById,
  getClienteById,
} from "@/lib/data-fetcher";

export type Destination = { email?: string; phone?: string; name?: string };

export type CreateAppointmentPayload = {
  proveedorId: string;
  servicioId: string;
  fecha: string; // ISO
  horario?: { inicio?: string; fin?: string };
  cliente?: { nombre?: string; email?: string; phone?: string; id?: string };
  ubicacion?: { direccion?: string; notas?: string };
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

/** 
 * 🔔 Enviar notificación (correo, whatsapp, etc.) con reintentos genéricos y timeout 
 */
export async function sendNotification(payload: {
  subject: string;
  message: string;
  destinations: Destination[];
  fromName?: string;
  meta?: any;
}): Promise<CreateResponse> {
  const NOTIFY_URL = `${API_URL}/api/gmail-notifications`;
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (process.env.NEXT_PUBLIC_API_KEY)
    headers["x-api-key"] = process.env.NEXT_PUBLIC_API_KEY;

  // Reemplazar saltos de línea y *negritas*
  const safeMessage =
    payload.message
      ?.replace(/\*(.*?)\*/g, "<b>$1</b>")
      ?.replace(/\n/g, "<br>") ?? "";

  const formattedPayload = { ...payload, message: safeMessage };

  // 🔁 Reintentos genéricos
  const maxAttempts = 3;
  const retryDelay = 15000; // 5 segundos
  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const startTime = Date.now();

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(NOTIFY_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(formattedPayload),
        signal: controller.signal,
      });

      clearTimeout(timeout);
      const body = await res.json().catch(() => ({}));

      const backendFailed =
        !res.ok ||
        body?.ok === false ||
        body?.error ||
        /invalid_client|Unauthorized|fail|error/i.test(
          JSON.stringify(body)
        );

      if (backendFailed) {
        console.warn(`❌ Error en intento ${attempt}:`, body?.message ?? res.statusText);

        if (attempt < maxAttempts) {
          console.log(`⏳ Esperando ${retryDelay / 1000}s antes del reintento...`);
          await wait(retryDelay);
          continue;
        }

        return {
          ok: false,
          status: res.status,
          message: body?.message ?? "Error al enviar notificación.",
          error: body?.error ?? null,
        };
      }

      console.info(
        `✅ Notificación enviada correctamente en intento ${attempt} (${Date.now() - startTime}ms)`
      );

      return { ok: true, data: body?.data ?? body, status: res.status };
    } catch (err: any) {
      console.error(`⚠️ Fallo en intento ${attempt}:`, err?.message ?? err);

      if (attempt >= maxAttempts) {
        return {
          ok: false,
          message: err?.message ?? "Error desconocido al enviar notificación.",
        };
      }

      console.log(`⏳ Esperando ${retryDelay / 1000}s antes del reintento...`);
      await wait(retryDelay);
    }
  }

  return { ok: false, message: "No se pudo enviar la notificación tras varios intentos." };
}

/**
 * ✉️ Enviar notificación de creación de cita.
 * 
 * Ya no crea la cita — solo envía la notificación.
 */
export async function createAndNotify(payload: CreateAppointmentPayload) {
  try {
    // 1️⃣ Obtener datos reales desde el backend (data-fetcher normaliza)
    const [proveedorResp, servicioResp, clienteResp] = await Promise.all([
      getProveedorById(payload.proveedorId),
      getServicioById(payload.servicioId),
      payload.cliente?.id ? getClienteById(payload.cliente.id) : null,
    ]);

    // 2️⃣ Asegurarnos de usar el objeto correcto (normalizado)
    const proveedor = proveedorResp ?? (payload as any).proveedor ?? null;
    const servicio = servicioResp ?? (payload as any).servicio ?? null;
    const cliente = clienteResp ?? payload.cliente ?? null;

    // 3️⃣ Armar destinatarios (con comprobaciones)
    const destinations: Destination[] = [];
    if (cliente && (cliente as any).email) {
      destinations.push({
        email: (cliente as any).email,
        name: (cliente as any).nombre ?? "Cliente",
      });
    }

    // 4️⃣ Preparar texto de notificación (seguro con fallback)
    const [year, month, day] = payload.fecha.split("-").map(Number);
    const fechaLocal = new Date(year, month - 1, day).toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const horaInicio = payload.horario?.inicio ?? "—";
    const horaFin = payload.horario?.fin ?? "—";

    const subject = `Creación de cita con ${proveedor?.nombre ?? "tu proveedor"}`;
    const message = `
      ✨ *CREACIÓN DE TU CITA* ✨

      Hola *${(cliente as any)?.nombre ?? "Cliente"}*,
      Tu cita ha sido creada exitosamente. A continuación los detalles:

      📅 *Fecha:* ${fechaLocal}
      ⏰ *Horario:* ${horaInicio} - ${horaFin}
      🧾 *Servicio:* ${(servicio as any)?.nombre ?? payload.servicioId}
      👨‍⚕️ *Proveedor:* ${(proveedor as any)?.nombre ?? payload.proveedorId}
      📍 *Dirección:* ${payload.ubicacion?.direccion ?? "No especificada"}
      🗒️ *Notas:* ${payload.ubicacion?.notas ?? "Ninguna"}

      Gracias por confiar en nosotros 💙  
      — *Sistema de Citas*
    `;

    // 5️⃣ Enviar notificación (igual que antes)
    const notifyPayload = {
      subject,
      message,
      destinations,
      fromName: "Sistema de Citas",
      meta: { proveedorId: payload.proveedorId, servicioId: payload.servicioId },
    };

    const notifyResult = await sendNotification(notifyPayload);
    return notifyResult.ok
      ? { ok: true, notified: true, notifyResult }
      : { ok: false, notified: false, message: notifyResult.message };
  } catch (err: any) {
    return { ok: false, notified: false, message: err?.message };
  }
}

/** ✉️ Notificación: cita modificada */
export async function updateAndNotify(
  payload: CreateAppointmentPayload & { cambios?: string[] }
) {
  try {
    // 1️⃣ Obtener datos reales desde el backend
    const [proveedorResp, servicioResp, clienteResp] = await Promise.all([
      getProveedorById(payload.proveedorId),
      getServicioById(payload.servicioId),
      payload.cliente?.id ? getClienteById(payload.cliente.id) : null,
    ]);

    // 2️⃣ Asegurarnos de usar el objeto correcto (normalizado)
    const proveedor = proveedorResp ?? (payload as any).proveedor ?? null;
    const servicio = servicioResp ?? (payload as any).servicio ?? null;
    const cliente = clienteResp ?? payload.cliente ?? null;

    // 3️⃣ Armar destinatarios
    const destinations: Destination[] = [];
    if (cliente && (cliente as any).email) {
      destinations.push({
        email: (cliente as any).email,
        name: (cliente as any).nombre ?? "Cliente",
      });
    }

    // 4️⃣ Texto de cambios
    const cambiosTexto =
      payload.cambios?.length
        ? `🔄 *Cambios realizados:* ${payload.cambios.join(", ")}`
        : "Se han actualizado los detalles de tu cita.";

    // 5️⃣ Fecha formateada
    const [year, month, day] = payload.fecha.split("-").map(Number);
    const fechaLocal = new Date(year, month - 1, day).toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const horaInicio = payload.horario?.inicio ?? "—";
    const horaFin = payload.horario?.fin ?? "—";

    // 6️⃣ Asunto y cuerpo del mensaje
    const subject = `Actualización de tu cita con ${proveedor?.nombre ?? "tu proveedor"}`;
    const message = `
      ✨ *ACTUALIZACIÓN DE CITA* ✨

      Hola *${(cliente as any)?.nombre ?? "Cliente"}*,
      Tu cita ha sido modificada correctamente.

      ${cambiosTexto}

      📅 *Fecha:* ${fechaLocal}
      ⏰ *Horario:* ${horaInicio} - ${horaFin}
      🧾 *Servicio:* ${(servicio as any)?.nombre ?? payload.servicioId}
      👨‍⚕️ *Proveedor:* ${(proveedor as any)?.nombre ?? payload.proveedorId}
      📍 *Dirección:* ${payload.ubicacion?.direccion ?? "No especificada"}
      🗒️ *Notas:* ${payload.ubicacion?.notas ?? "Ninguna"}

      — *Sistema de Citas*
    `;

    // 7️⃣ Enviar notificación
    const notifyPayload = {
      subject,
      message,
      destinations,
      fromName: "Sistema de Citas",
      meta: { proveedorId: payload.proveedorId, tipo: "update" },
    };

    const notifyResult = await sendNotification(notifyPayload);
    return notifyResult.ok
      ? { ok: true, notified: true, notifyResult }
      : { ok: false, notified: false, message: notifyResult.message };
  } catch (err: any) {
    console.error("❌ Error en updateAndNotify:", err);
    return { ok: false, notified: false, message: err?.message };
  }
}

/** ✉️ Notificación: cita cancelada */
export async function cancelAndNotify(payload: CreateAppointmentPayload) {
  try {
    // 1️⃣ Obtener datos reales desde el backend
    const [proveedorResp, servicioResp, clienteResp] = await Promise.all([
      getProveedorById(payload.proveedorId),
      getServicioById(payload.servicioId),
      payload.cliente?.id ? getClienteById(payload.cliente.id) : null,
    ]);

    // 2️⃣ Asegurarnos de usar el objeto correcto (normalizado)
    const proveedor = proveedorResp ?? (payload as any).proveedor ?? null;
    const servicio = servicioResp ?? (payload as any).servicio ?? null;
    const cliente = clienteResp ?? payload.cliente ?? null;

    // 3️⃣ Armar destinatarios
    const destinations: Destination[] = [];
    if (cliente && (cliente as any).email) {
      destinations.push({
        email: (cliente as any).email,
        name: (cliente as any).nombre ?? "Cliente",
      });
    }

    // 4️⃣ Fecha formateada
    const [year, month, day] = payload.fecha.split("-").map(Number);
    const fechaLocal = new Date(year, month - 1, day).toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // 5️⃣ Asunto y mensaje
    const subject = `Cancelación de cita con ${proveedor?.nombre ?? "tu proveedor"}`;
    const message = `
      ❌ *CANCELACIÓN DE CITA* ❌

      Hola *${(cliente as any)?.nombre ?? "Cliente"}*,
      Tu cita programada con *${(proveedor as any)?.nombre ?? payload.proveedorId}* ha sido cancelada.

      📅 *Fecha original:* ${fechaLocal}
      🧾 *Servicio:* ${(servicio as any)?.nombre ?? payload.servicioId}

      Si fue un error, puedes volver a programarla cuando desees.  
      — *Sistema de Citas*
    `;

    // 6️⃣ Enviar notificación
    const notifyPayload = {
      subject,
      message,
      destinations,
      fromName: "Sistema de Citas",
      meta: { proveedorId: payload.proveedorId, tipo: "cancel" },
    };

    const notifyResult = await sendNotification(notifyPayload);
    return notifyResult.ok
      ? { ok: true, notified: true, notifyResult }
      : { ok: false, notified: false, message: notifyResult.message };
  } catch (err: any) {
    console.error("❌ Error en cancelAndNotify:", err);
    return { ok: false, notified: false, message: err?.message };
  }
}