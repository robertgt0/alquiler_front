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
    // 🔹 Buscar datos reales desde la API
    const [proveedor, servicio, cliente] = await Promise.all([
      getProveedorById(payload.proveedorId),
      getServicioById(payload.servicioId),
      getClienteById(payload.clienteId),
    ]);

    if (!proveedor) throw new Error("Proveedor no encontrado");
    if (!servicio) throw new Error("Servicio no encontrado");
    if (!cliente) throw new Error("Cliente no encontrado");

    // 🔹 Formateos
    const fechaLocal = formatearFechaLarga(payload.fecha);
    const horaInicio = safeStr(payload.horario?.inicio);
    const horaFin = safeStr(payload.horario?.fin);
    const direccion = payload.ubicacion?.direccion ?? "No especificada";
    const notas = payload.ubicacion?.notas ?? "Ninguna";
    const citaId =
      payload.citaId ||
      (payload as any)?._id ||
      (payload as any)?.id ||
      "";

    const servicioNombre = (servicio as any)?.nombre ?? payload.servicioId;
    const proveedorNombre = (proveedor as any)?.nombre ?? "Proveedor";
    const clienteNombre = (cliente as any)?.nombre ?? "Cliente";

    /* ===============================
       📨 Notificación al cliente
       =============================== */
    const clienteEmail = (cliente as any)?.correo ?? (cliente as any)?.email;
    const destinosCliente: Destination[] = [];

    if (clienteEmail)
      destinosCliente.push({ email: clienteEmail, name: clienteNombre });

    const subjectCliente = `Creación de cita con ${proveedorNombre}`;
    const messageCliente = [
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
      "Gracias por confiar en nosotros 💙",
      "— *Sistema de Citas*",
    ]
      .filter(Boolean)
      .join("\n");

    const resultCliente = destinosCliente.length
      ? await sendNotification({
          subject: subjectCliente,
          message: messageCliente,
          destinations: destinosCliente,
          fromName: "Sistema de Citas",
          meta: { proveedorId: payload.proveedorId, servicioId: payload.servicioId },
        })
      : { ok: true };

    /* ===============================
       💌 Notificación al proveedor
       =============================== */
    const fixerEmail = (proveedor as any)?.email;
    if (fixerEmail) {
      const fixerSubject = "Nueva cita confirmada";
      const fixerMessage = [
        "✅ *Nueva cita confirmada*",
        "",
        `👋 Hola *${proveedorNombre}*,`,
        "Has recibido una nueva cita confirmada:",
        "",
        `📅 *Fecha:* ${fechaLocal}`,
        `🕒 *Hora:* ${horaInicio}${horaFin && horaFin !== "—" ? ` - ${horaFin}` : ""}`,
        `🛠️ *Servicio:* ${servicioNombre}`,
        `👤 *Cliente:* ${clienteNombre}`,
        `📍 *Dirección:* ${direccion}`,
        citaId ? `🆔 *ID de cita:* ${citaId}` : "",
        "",
        "Por favor, asegúrate de estar disponible en el horario indicado.",
      ]
        .filter(Boolean)
        .join("\n");

      await sendNotification({
        subject: fixerSubject,
        message: fixerMessage,
        destinations: [{ email: fixerEmail, name: proveedorNombre }],
        fromName: "Sistema de Citas",
        meta: {
          proveedorId: payload.proveedorId,
          servicioId: payload.servicioId,
          tipo: "booking_fixer",
        },
      });
    } else {
      console.warn("ℹ️ Proveedor sin email, no se envía notificación.");
    }

    return resultCliente.ok
      ? { ok: true, notified: true }
      : { ok: false, notified: false, message: resultCliente.message };
  } catch (err: any) {
    console.error("❌ Error en createAndNotify:", err);
    return { ok: false, notified: false, message: err?.message ?? "Error desconocido" };
  }
}

/* ===========================================================
   📧 UPDATE — Requester + Fixer
   =========================================================== */

export async function updateAndNotify(
  payload: CreateAppointmentPayload & { cambios?: string[] }
) {
  try {

    /*

    alert(`
    ==== DEBUG PAYLOAD (ANTES DE API) ====

    ProveedorId: ${payload.proveedorId}
    ServicioId: ${payload.servicioId}
    ClienteId: ${payload.clienteId ?? "NULL"}
    Fecha: ${payload.fecha}

    Horario:
      Inicio: ${payload.horario?.inicio}
      Fin:    ${payload.horario?.fin}

    Ubicación:
      Dirección: ${payload.ubicacion?.direccion}
      Notas:     ${payload.ubicacion?.notas}

    Cambios: ${payload.cambios?.join(", ") || "Ninguno"}

    =====================================
        `);
    */

    const clienteIdReal =
      (payload.clienteId as any)?._id ||
      (payload.clienteId as any)?.id ||
      payload.clienteId;

    // 🔹 Buscar datos reales desde la API (cliente ya NO sale del payload)
    const [proveedor, servicio, cliente] = await Promise.all([
      getProveedorById(payload.proveedorId),
      getServicioById(payload.servicioId),
      getClienteById(clienteIdReal), // ✅ <–– AQUÍ EL CAMBIO
    ]);

    /*
    alert(`
    === DEBUG CLIENTE ===
    Proveedor: ${proveedor?._id || proveedor?.id || "NULL"}
    Servicio: ${servicio?._id || servicio?.id || "NULL"}
    Cliente encontrado: ${cliente?._id || cliente?.id || "NULL"}
    `);

    */

    if (!proveedor) throw new Error("Proveedor no encontrado");
    if (!servicio) throw new Error("Servicio no encontrado");
    if (!cliente) throw new Error("Cliente no encontrado");

    // 🔹 Formateos
    const fechaLocal = formatearFechaLarga(payload.fecha);
    const horaInicio = safeStr(payload.horario?.inicio);
    const horaFin = safeStr(payload.horario?.fin);
    const direccion = payload.ubicacion?.direccion ?? "No especificada";
    const notas = payload.ubicacion?.notas ?? "Ninguna";
    const citaId =
      payload.citaId ||
      (payload as any)?._id ||
      (payload as any)?.id ||
      "";

    const servicioNombre = (servicio as any)?.nombre ?? payload.servicioId;
    const proveedorNombre = (proveedor as any)?.nombre ?? "Proveedor";
    const clienteNombre = (cliente as any)?.nombre ?? "Cliente";

    const cambiosTexto = payload.cambios?.length
      ? `🔄 *Cambios realizados:* ${payload.cambios.join(", ")}`
      : "Se han actualizado los detalles de tu cita.";

    /* =====================================
       📨 Notificación al cliente
       ===================================== */
    const clienteEmail = (cliente as any)?.correo ?? (cliente as any)?.email;

    const destinosCliente: Destination[] = [];
    if (clienteEmail)
      destinosCliente.push({ email: clienteEmail, name: clienteNombre });

    const subjectCliente = `Actualización de tu cita con ${proveedorNombre}`;
    const messageCliente = [
      "✨ *ACTUALIZACIÓN DE TU CITA* ✨",
      "",
      `Hola *${clienteNombre}*,`,
      "Tu cita ha sido modificada correctamente.",
      "",
      cambiosTexto,
      "",
      `📅 *Fecha:* ${fechaLocal}`,
      `⏰ *Horario:* ${horaInicio}${horaFin && horaFin !== "—" ? ` - ${horaFin}` : ""}`,
      `🧾 *Servicio:* ${servicioNombre}`,
      `👨‍⚕️ *Proveedor:* ${proveedorNombre}`,
      `📍 *Dirección:* ${direccion}`,
      `🗒️ *Notas:* ${notas}`,
      citaId ? `🆔 *ID de Cita:* ${citaId}` : "",
      "",
      "Gracias por confiar en nosotros 💙",
      "— *Sistema de Citas*",
    ]
      .filter(Boolean)
      .join("\n");

    const resultCliente = destinosCliente.length
      ? await sendNotification({
          subject: subjectCliente,
          message: messageCliente,
          destinations: destinosCliente,
          fromName: "Sistema de Citas",
          meta: {
            proveedorId: payload.proveedorId,
            servicioId: payload.servicioId,
            tipo: "update_client",
          },
        })
      : { ok: true };

    /* =====================================
       💌 Notificación al proveedor
       ===================================== */
    const fixerEmail = (proveedor as any)?.email;

    if (fixerEmail) {
      const fixerSubject = "Cita actualizada";
      const motivoUpdate =
        payload.ubicacion?.notas ||
        (payload.cambios?.length
          ? payload.cambios.join(", ")
          : "Ajuste de disponibilidad del cliente.");

      const fixerMessage = [
        "⚠️ *Cita actualizada*",
        "",
        `👋 Hola *${proveedorNombre}*,`,
        "La cita con tu cliente ha sido actualizada.",
        "",
        `📅 *Nueva fecha:* ${fechaLocal}`,
        `🕒 *Hora:* ${horaInicio}${horaFin && horaFin !== "—" ? ` - ${horaFin}` : ""}`,
        `👤 *Cliente:* ${clienteNombre}`,
        `🛠️ *Servicio:* ${servicioNombre}`,
        citaId ? `🆔 *ID de cita:* ${citaId}` : "",
        `📝 *Motivo:* ${motivoUpdate}`,
        "",
        "Si el nuevo horario no te conviene, puedes proponer otro.",
      ]
        .filter(Boolean)
        .join("\n");

      await sendNotification({
        subject: fixerSubject,
        message: fixerMessage,
        destinations: [{ email: fixerEmail, name: proveedorNombre }],
        fromName: "Sistema de Citas",
        meta: {
          proveedorId: payload.proveedorId,
          servicioId: payload.servicioId,
          tipo: "update_fixer",
        },
      });
    }

    return resultCliente.ok
      ? { ok: true, notified: true }
      : { ok: false, notified: false, message: resultCliente.message };
  } catch (err: any) {
    console.error("❌ Error en updateAndNotify:", err);
    return { ok: false, notified: false, message: err?.message ?? "Error desconocido" };
  }
}


/* ===========================================================
   📧 CANCEL — Requester + Fixer
   =========================================================== */

export async function cancelAndNotify(payload: CreateAppointmentPayload) {
  try {
    const clienteIdReal =
      (payload.clienteId as any)?._id ||
      (payload.clienteId as any)?.id ||
      payload.clienteId;

    // 🔹 Obtener los datos reales desde la base de datos
    const [proveedor, servicio, cliente] = await Promise.all([
      getProveedorById(payload.proveedorId),
      getServicioById(payload.servicioId),
      getClienteById(clienteIdReal),
    ]);

    if (!proveedor) throw new Error("Proveedor no encontrado");
    if (!servicio) throw new Error("Servicio no encontrado");
    if (!cliente) throw new Error("Cliente no encontrado");

    // 🔹 Formatear datos
    const fechaLocal = formatearFechaLarga(payload.fecha);
    const servicioNombre = (servicio as any)?.nombre ?? payload.servicioId;
    const proveedorNombre = (proveedor as any)?.nombre ?? "Proveedor";
    const clienteNombre = (cliente as any)?.nombre ?? "Cliente";

    const clienteEmail = (cliente as any)?.correo ?? (cliente as any)?.email;
    const fixerEmail = (proveedor as any)?.email;
    const fixerNombre = proveedorNombre;

    const citaId =
      payload.citaId ||
      (payload as any)?._id ||
      (payload as any)?.id ||
      "";

    /* ===============================
       📨 Notificación al cliente
       =============================== */
    const destinosCliente: Destination[] = [];
    if (clienteEmail)
      destinosCliente.push({ email: clienteEmail, name: clienteNombre });

    const subjectCliente = `Cancelación de tu cita con ${proveedorNombre}`;
    const messageCliente = [
      "❌ *CANCELACIÓN DE CITA* ❌",
      "",
      `Hola *${clienteNombre}*,`,
      `Tu cita programada con *${proveedorNombre}* ha sido cancelada.`,
      "",
      `📅 *Fecha original:* ${fechaLocal}`,
      `🧾 *Servicio:* ${servicioNombre}`,
      citaId ? `🆔 *ID de Cita:* ${citaId}` : "",
      "",
      "Si fue un error, puedes volver a programarla cuando desees.",
      "",
      "— *Sistema de Citas*",
    ]
      .filter(Boolean)
      .join("\n");

    const resultCliente = destinosCliente.length
      ? await sendNotification({
          subject: subjectCliente,
          message: messageCliente,
          destinations: destinosCliente,
          fromName: "Sistema de Citas",
          meta: {
            proveedorId: payload.proveedorId,
            servicioId: payload.servicioId,
            tipo: "cancel_cliente",
          },
        })
      : { ok: true };

    /* ===============================
       💌 Notificación al proveedor
       =============================== */
    if (fixerEmail) {
      const fixerSubject = "Cita cancelada";
      const fixerMessage = [
        "❌ *CITA CANCELADA*",
        "",
        `👋 Hola *${fixerNombre}*,`,
        "Tu cita con el cliente ha sido cancelada.",
        "",
        `📅 *Fecha original:* ${fechaLocal}`,
        `👤 *Cliente:* ${clienteNombre}`,
        `🛠️ *Servicio:* ${servicioNombre}`,
        citaId ? `🆔 *ID de Cita:* ${citaId}` : "",
        "📝 *Motivo:* el cliente presentó un problema y no podrá asistir.",
        "",
        "Te notificaremos si solicita una reprogramación.",
      ]
        .filter(Boolean)
        .join("\n");

      await sendNotification({
        subject: fixerSubject,
        message: fixerMessage,
        destinations: [{ email: fixerEmail, name: fixerNombre }],
        fromName: "Sistema de Citas",
        meta: {
          proveedorId: payload.proveedorId,
          servicioId: payload.servicioId,
          tipo: "cancel_fixer",
        },
      });
    } else {
      console.warn("ℹ️ Proveedor sin email, no se envía notificación de cancelación.");
    }

    return resultCliente.ok
      ? { ok: true, notified: true }
      : { ok: false, notified: false, message: resultCliente.message };
  } catch (err: any) {
    console.error("❌ Error en cancelAndNotify:", err);
    return {
      ok: false,
      notified: false,
      message: err?.message ?? "Error desconocido en cancelAndNotify",
    };
  }
}
