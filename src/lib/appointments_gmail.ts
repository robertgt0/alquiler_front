// src/lib/appointments_gmail.ts

/* Para las funciones de actualizacion y cancelacion faltan validar valores para el nombre
 * del cliente, ya que estamos usando el predeterminado, solo se puso su nombre de pila
 */

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
  citaId?: string;
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

/* Utils */

const formatearFechaLarga = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const safeStr = (v: any, fallback = "—") =>
  v === undefined || v === null || v === "" ? fallback : String(v);

/* ===========================================================
   📧 Función base: Gmail
   =========================================================== */

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

  const safeMessage =
    payload.message
      ?.replace(/\*(.*?)\*/g, "<b>$1</b>")
      ?.replace(/\n/g, "<br>") ?? "";

  const formattedPayload = { ...payload, message: safeMessage };

  const maxAttempts = 3;
  const retryDelay = 15000;

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
        console.warn(
          `❌ Error en intento ${attempt}:`,
          body?.message ?? res.statusText
        );

        if (attempt < maxAttempts) {
          console.log(
            `⏳ Esperando ${retryDelay / 1000}s antes del reintento...`
          );
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
        `✅ Notificación enviada correctamente en intento ${attempt} (${
          Date.now() - startTime
        }ms)`
      );

      return { ok: true, data: body?.data ?? body, status: res.status };
    } catch (err: any) {
      console.error(
        `⚠️ Fallo en intento ${attempt}:`,
        err?.message ?? err
      );

      if (attempt >= maxAttempts) {
        return {
          ok: false,
          message:
            err?.message ?? "Error desconocido al enviar notificación.",
        };
      }

      console.log(
        `⏳ Esperando ${retryDelay / 1000}s antes del reintento...`
      );
      await wait(retryDelay);
    }
  }

  return {
    ok: false,
    message: "No se pudo enviar la notificación tras varios intentos.",
  };
}

/* ===========================================================
   📧 CREAR CITA — Requester + Fixer
   =========================================================== */

export async function createAndNotify(payload: CreateAppointmentPayload) {
  try {
    const [proveedorResp, servicioResp, clienteResp] = await Promise.all([
      getProveedorById(payload.proveedorId),
      getServicioById(payload.servicioId),
      payload.cliente?.id ? getClienteById(payload.cliente.id) : null,
    ]);

    const proveedor = proveedorResp ?? (payload as any).proveedor ?? null;
    const servicio = servicioResp ?? (payload as any).servicio ?? null;
    const cliente = clienteResp ?? payload.cliente ?? null;

    const fechaLocal = formatearFechaLarga(payload.fecha);
    const horaInicio = safeStr(payload.horario?.inicio);
    const horaFin = safeStr(payload.horario?.fin);
    const direccion = payload.ubicacion?.direccion ?? "No especificada";
    const notas = payload.ubicacion?.notas ?? "Ninguna";
    const servicioNombre = (servicio as any)?.nombre ?? payload.servicioId;
    const proveedorNombre = (proveedor as any)?.nombre ?? "tu proveedor";
    const clienteNombre = (cliente as any)?.nombre ?? "Cliente";
    const citaId =
      payload.citaId ||
      (payload as any)?._id ||
      (payload as any)?.id ||
      "";

    /* 📨 Requester (cliente) */
    const destinations: Destination[] = [];
    if (cliente && (cliente as any).email) {
      destinations.push({
        email: (cliente as any).email,
        name: clienteNombre,
      });
    }

    const subject = `Creación de cita con ${proveedorNombre}`;
    const message = [
      "✨ *CREACIÓN DE TU CITA* ✨",
      "",
      `Hola *${clienteNombre}*,`,
      "Tu cita ha sido creada exitosamente. A continuación los detalles:",
      "",
      `📅 *Fecha:* ${fechaLocal}`,
      `⏰ *Horario:* ${horaInicio} - ${horaFin}`,
      `🧾 *Servicio:* ${servicioNombre}`,
      `👨‍⚕️ *Proveedor:* ${proveedorNombre}`,
      `📍 *Dirección:* ${direccion}`,
      `🗒️ *Notas:* ${notas}`,
      citaId ? `🆔 *ID de Cita:* ${citaId}` : "",
      "",
      "Gracias por confiar en nosotros 💙  ",
      "— *Sistema de Citas*",
    ]
      .filter(Boolean)
      .join("\n");

    const notifyPayload = {
      subject,
      message,
      destinations,
      fromName: "Sistema de Citas",
      meta: { proveedorId: payload.proveedorId, servicioId: payload.servicioId },
    };

    const requesterResult = destinations.length
      ? await sendNotification(notifyPayload)
      : { ok: true };

    /* 💌 Fixer (solo si tiene email) */
    const fixerEmail: string | undefined = (proveedor as any)?.email;
    const fixerNombre: string = (proveedor as any)?.nombre ?? "Proveedor";

    if (fixerEmail) {
      const fixerSubject = "Nueva cita confirmada";
      const fixerMessage = [
        "✅ *Nueva cita confirmada*",
        "",
        `👋 Hola *${fixerNombre}*,`,
        "Has recibido una nueva cita confirmada.",
        "",
        `📅 *Fecha:* ${fechaLocal}`,
        `🕒 *Hora:* ${horaInicio}${horaFin && horaFin !== "—" ? ` - ${horaFin}` : ""}`,
        `🛠️ *Servicio:* ${servicioNombre}`,
        `👤 *Cliente:* ${clienteNombre}`,
        `📍 *Dirección:* ${direccion}`,
        citaId ? `🆔 *ID de cita:* ${citaId}` : "",
        "",
        "Asegúrate de estar disponible en el horario indicado.",
        "Si necesitas modificar la cita, podrás coordinarlo con el cliente.",
      ]
        .filter(Boolean)
        .join("\n");

      await Promise.allSettled([
        sendNotification({
          subject: fixerSubject,
          message: fixerMessage,
          destinations: [{ email: fixerEmail, name: fixerNombre }],
          fromName: "Sistema de Citas",
          meta: {
            proveedorId: payload.proveedorId,
            servicioId: payload.servicioId,
            tipo: "booking_fixer",
          },
        }),
      ]);
    } else {
      console.warn("ℹ️ Proveedor sin email: no se envía notificación al fixer.");
    }

    return requesterResult.ok
      ? { ok: true, notified: true, notifyResult: requesterResult }
      : { ok: false, notified: false, message: requesterResult.message };
  } catch (err: any) {
    return { ok: false, notified: false, message: err?.message };
  }
}

/* ===========================================================
   📧 UPDATE — Requester + Fixer
   =========================================================== */

export async function updateAndNotify(
  payload: CreateAppointmentPayload & { cambios?: string[] }
) {
  try {
    const [proveedorResp, servicioResp, clienteResp] = await Promise.all([
      getProveedorById(payload.proveedorId),
      getServicioById(payload.servicioId),
      payload.cliente?.id ? getClienteById(payload.cliente.id) : null,
    ]);

    const proveedor = proveedorResp ?? (payload as any).proveedor ?? null;
    const servicio = servicioResp ?? (payload as any).servicio ?? null;
    const cliente = clienteResp ?? payload.cliente ?? null;

    const fechaLocal = formatearFechaLarga(payload.fecha);
    const horaInicio = safeStr(payload.horario?.inicio);
    const horaFin = safeStr(payload.horario?.fin);
    const direccion = payload.ubicacion?.direccion ?? "No especificada";
    const servicioNombre = (servicio as any)?.nombre ?? payload.servicioId;
    const proveedorNombre = (proveedor as any)?.nombre ?? "tu proveedor";
    const clienteNombre = (cliente as any)?.nombre ?? "Cliente";
    const citaId =
      payload.citaId ||
      (payload as any)?._id ||
      (payload as any)?.id ||
      "";
    const cambiosTexto =
      payload.cambios?.length
        ? `🔄 *Cambios realizados:* ${payload.cambios.join(", ")}`
        : "Se han actualizado los detalles de tu cita.";

    /* 📨 Requester */
    const destinos: Destination[] = [];
    if (cliente && (cliente as any).email) {
      destinos.push({
        email: (cliente as any).email,
        name: clienteNombre,
      });
    }

    const subject = `Actualización de tu cita con ${proveedorNombre}`;
    const message = [
      "✨ *ACTUALIZACIÓN DE CITA* ✨",
      "",
      `Hola *Juan Perez*,`,
      "Tu cita ha sido modificada correctamente.",
      "",
      cambiosTexto,
      "",
      `📅 *Fecha:* ${fechaLocal}`,
      `⏰ *Horario:* ${horaInicio} - ${horaFin}`,
      `🧾 *Servicio:* ${servicioNombre}`,
      `👨‍⚕️ *Proveedor:* ${proveedorNombre}`,
      `📍 *Dirección:* ${direccion}`,
      citaId ? `🆔 *ID de Cita:* ${citaId}` : "",
      "",
      "— *Sistema de Citas*",
    ]
      .filter(Boolean)
      .join("\n");

    const requesterResult = destinos.length
      ? await sendNotification({
          subject,
          message,
          destinations: destinos,
          fromName: "Sistema de Citas",
          meta: { proveedorId: payload.proveedorId, tipo: "update" },
        })
      : { ok: true };

    /* 💌 Fixer */
    const fixerEmail: string | undefined = (proveedor as any)?.email;
    const fixerNombre: string = (proveedor as any)?.nombre ?? "Proveedor";
    const motivoUpdate =
      payload.ubicacion?.notas ||
      (payload.cambios?.length
        ? payload.cambios.join(", ")
        : "ajuste de disponibilidad del cliente.");

    if (fixerEmail) {
      const fixerSubject = "Cita actualizada";
      const fixerMessage = [
        "⚠️ *Cita actualizada*",
        "",
        `👋 Hola *${fixerNombre}*,`,
        "La cita con tu cliente ha sido actualizada.",
        "",
        `📅 *Nueva fecha:* ${fechaLocal}`,
        `🕒 *Nueva hora:* ${horaInicio}${
          horaFin && horaFin !== "—" ? ` - ${horaFin}` : ""
        }`,
        `👤 *Cliente:* Juan Perez`,
        `🛠️ *Servicio:* ${servicioNombre}`,
        citaId ? `🆔 *ID de cita:* ${citaId}` : "",
        `📝 *Motivo:* ${motivoUpdate}`,
        "",
        "Si el nuevo horario no te conviene, puedes proponer otro.",
      ]
        .filter(Boolean)
        .join("\n");

      await Promise.allSettled([
        sendNotification({
          subject: fixerSubject,
          message: fixerMessage,
          destinations: [{ email: fixerEmail, name: fixerNombre }],
          fromName: "Sistema de Citas",
          meta: { proveedorId: payload.proveedorId, tipo: "update_fixer" },
        }),
      ]);
    } else {
      console.warn(
        "ℹ️ Proveedor sin email: no se envía notificación de actualización al fixer."
      );
    }

    return requesterResult.ok
      ? { ok: true, notified: true, notifyResult: requesterResult }
      : { ok: false, notified: false, message: requesterResult.message };
  } catch (err: any) {
    console.error("❌ Error en updateAndNotify:", err);
    return { ok: false, notified: false, message: err?.message };
  }
}

/* ===========================================================
   📧 CANCEL — Requester + Fixer
   =========================================================== */

export async function cancelAndNotify(payload: CreateAppointmentPayload) {
  try {
    const [proveedorResp, servicioResp, clienteResp] = await Promise.all([
      getProveedorById(payload.proveedorId),
      getServicioById(payload.servicioId),
      payload.cliente?.id ? getClienteById(payload.cliente.id) : null,
    ]);

    const proveedor = proveedorResp ?? (payload as any).proveedor ?? null;
    const servicio = servicioResp ?? (payload as any).servicio ?? null;
    const cliente = clienteResp ?? payload.cliente ?? null;

    const fechaLocal = formatearFechaLarga(payload.fecha);
    const servicioNombre = (servicio as any)?.nombre ?? payload.servicioId;
    const proveedorNombre = (proveedor as any)?.nombre ?? "tu proveedor";
    const clienteNombre = (cliente as any)?.nombre ?? "Cliente";

    /* 📨 Requester */
    const destinos: Destination[] = [];
    if (cliente && (cliente as any).email) {
      destinos.push({
        email: (cliente as any).email,
        name: clienteNombre,
      });
    }

    const subject = `Cancelación de cita con ${proveedorNombre}`;
    const message = [
      "❌ *CANCELACIÓN DE CITA* ❌",
      "",
      `Hola *Juan Perez*,`,
      `Tu cita programada con *${proveedorNombre}* ha sido cancelada.`,
      "",
      `📅 *Fecha original:* ${fechaLocal}`,
      `🧾 *Servicio:* ${servicioNombre}`,
      "",
      "Si fue un error, puedes volver a programarla cuando desees.  ",
      "— *Sistema de Citas*",
    ].join("\n");

    const requesterResult = destinos.length
      ? await sendNotification({
          subject,
          message,
          destinations: destinos,
          fromName: "Sistema de Citas",
          meta: { proveedorId: payload.proveedorId, tipo: "cancel" },
        })
      : { ok: true };

    /* 💌 Fixer */
    const fixerEmail: string | undefined = (proveedor as any)?.email;
    const fixerNombre: string = (proveedor as any)?.nombre ?? "Proveedor";
    const clienteLabel = clienteNombre || "Cliente";

    if (fixerEmail) {
      const fixerSubject = "Cita cancelada";
      const fixerMessage = [
        "❌ *Cita cancelada*",
        "",
        `👋 Hola *${fixerNombre}*,`,
        "Tu cita con el cliente ha sido cancelada.",
        "",
        `📅 *Fecha original:* ${fechaLocal}`,
        `👤 *Cliente:* Juan Perez`,
        `🛠️ *Servicio:* ${servicioNombre}`,
        "📝 *Motivo:* el cliente presentó un problema y no podrá asistir.",
        "",
        "Te notificaremos si solicita una reprogramación.",
      ].join("\n");

      await Promise.allSettled([
        sendNotification({
          subject: fixerSubject,
          message: fixerMessage,
          destinations: [{ email: fixerEmail, name: fixerNombre }],
          fromName: "Sistema de Citas",
          meta: { proveedorId: payload.proveedorId, tipo: "cancel_fixer" },
        }),
      ]);
    } else {
      console.warn(
        "ℹ️ Proveedor sin email: no se envía notificación de cancelación al fixer."
      );
    }

    return requesterResult.ok
      ? { ok: true, notified: true, notifyResult: requesterResult }
      : { ok: false, notified: false, message: requesterResult.message };
  } catch (err: any) {
    console.error("❌ Error en cancelAndNotify:", err);
    return { ok: false, notified: false, message: err?.message };
  }
}