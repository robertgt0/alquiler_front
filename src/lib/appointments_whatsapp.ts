import {
  getProveedorById,
  getServicioById,
  getClienteById,
} from "@/lib/data-fetcher";

/* Para las funciones de actualizacion y cancelacion faltan validar valores para el nombre
 * del cliente, ya que estamos usando el predeterminado, solo se puso su nombre de pila
 */

export type Destination = { phone?: string; name?: string };

export type CreateAppointmentPayload = {
  proveedorId: string;
  servicioId: string;
  fecha: string;
  horario?: { inicio?: string; fin?: string };
  cliente?: { nombre?: string; phone?: string; id?: string };
  ubicacion?: { direccion?: string; notas?: string };
  cambios?: string[];
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

/* ===========================================================
   📱 Base para enviar notificación WhatsApp
   =========================================================== */
export async function sendWhatsAppNotification(payload: {
  message: string;
  destinations: Destination[];
  fromName?: string;
  meta?: any;
}): Promise<CreateResponse> {
  const NOTIFY_URL = `${API_URL}/api/whatsapp-notifications`;
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (process.env.NEXT_PUBLIC_API_KEY)
    headers["x-api-key"] = process.env.NEXT_PUBLIC_API_KEY;

  const maxAttempts = 3;
  const retryDelay = 15000;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(NOTIFY_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeout);
      const body = await res.json().catch(() => ({}));

      if (!res.ok || body?.ok === false || body?.error) {
        console.warn(`❌ Error intento ${attempt}:`, body?.message ?? res.statusText);
        if (attempt < maxAttempts) {
          await new Promise((r) => setTimeout(r, retryDelay));
          continue;
        }
        return {
          ok: false,
          status: res.status,
          message: body?.message ?? "Error al enviar WhatsApp.",
          error: body?.error ?? null,
        };
      }

      console.info(`✅ WhatsApp enviado (intento ${attempt})`);
      return { ok: true, data: body?.data ?? body, status: res.status };
    } catch (err: any) {
      console.error(`⚠️ Fallo intento ${attempt}:`, err?.message ?? err);
      if (attempt >= maxAttempts)
        return { ok: false, message: err?.message ?? "Error desconocido en WhatsApp." };
      await new Promise((r) => setTimeout(r, retryDelay));
    }
  }

  return { ok: false, message: "No se pudo enviar la notificación tras varios intentos." };
}

/* ===========================================================
   ✨ CREAR CITA — Cliente + Proveedor
   =========================================================== */
export async function createAndNotifyWhatsApp(payload: CreateAppointmentPayload) {
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
    const fechaLocal = new Date(payload.fecha).toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const horaInicio = payload.horario?.inicio ?? "—";
    const horaFin = payload.horario?.fin ?? "—";
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
       💬 Notificación al cliente
       =============================== */
    const clienteNumero = (cliente as any)?.telefono ?? (cliente as any)?.phone;
    if (clienteNumero) {
      const msgCliente = [
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

      await sendWhatsAppNotification({
        message: msgCliente,
        destinations: [{ phone: clienteNumero, name: clienteNombre }],
        fromName: "Sistema de Citas",
        meta: { proveedorId: payload.proveedorId, servicioId: payload.servicioId },
      });
    } else {
      console.warn("ℹ️ Cliente sin número de teléfono, no se envía WhatsApp.");
    }

    /* ===============================
       💬 Notificación al proveedor
       =============================== */
    const fixerNumero = (proveedor as any)?.telefono ?? (proveedor as any)?.phone;
    if (fixerNumero) {
      const msgProveedor = [
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

      await sendWhatsAppNotification({
        message: msgProveedor,
        destinations: [{ phone: fixerNumero, name: proveedorNombre }],
        fromName: "Sistema de Citas",
        meta: {
          proveedorId: payload.proveedorId,
          servicioId: payload.servicioId,
          tipo: "booking_fixer",
        },
      });
    } else {
      console.warn("ℹ️ Proveedor sin número de teléfono, no se envía WhatsApp.");
    }

    return { ok: true, notified: true };
  } catch (err: any) {
    console.error("❌ Error en createAndNotifyWhatsApp:", err);
    return { ok: false, notified: false, message: err?.message ?? "Error desconocido" };
  }
}


/* ===========================================================
   🌀 ACTUALIZACIÓN — Cliente + Proveedor
   =========================================================== */
export async function updateAndNotifyWhatsApp(
  payload: CreateAppointmentPayload & { cambios?: string[] }
) {
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
    const fechaLocal = new Date(payload.fecha).toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const horaInicio = payload.horario?.inicio ?? "—";
    const horaFin = payload.horario?.fin ?? "—";
    const cambiosTexto = payload.cambios?.length
      ? `🔄 *Cambios realizados:* ${payload.cambios.join(", ")}`
      : "Se han actualizado los detalles de tu cita.";

    const servicioNombre = (servicio as any)?.nombre ?? payload.servicioId;
    const proveedorNombre = (proveedor as any)?.nombre ?? "Proveedor";
    const clienteNombre = (cliente as any)?.nombre ?? "Cliente";
    const citaId =
      payload.citaId ||
      (payload as any)?._id ||
      (payload as any)?.id ||
      "";

    /* ===============================
       💬 Notificación al cliente
       =============================== */
    const clienteNumero = (cliente as any)?.telefono ?? (cliente as any)?.phone;
    if (clienteNumero) {
      const msgCliente = [
        "✨ *ACTUALIZACIÓN DE CITA* ✨",
        "",
        `Hola *${clienteNombre}*,`,
        "Tu cita ha sido modificada correctamente.",
        "",
        cambiosTexto,
        "",
        `📅 *Fecha:* ${fechaLocal}`,
        `⏰ *Horario:* ${horaInicio} - ${horaFin}`,
        `🧾 *Servicio:* ${servicioNombre}`,
        `👨‍⚕️ *Proveedor:* ${proveedorNombre}`,
        citaId ? `🆔 *ID de Cita:* ${citaId}` : "",
        "",
        "— *Sistema de Citas*",
      ]
        .filter(Boolean)
        .join("\n");

      await sendWhatsAppNotification({
        message: msgCliente,
        destinations: [{ phone: clienteNumero, name: clienteNombre }],
        fromName: "Sistema de Citas",
        meta: {
          proveedorId: payload.proveedorId,
          servicioId: payload.servicioId,
          tipo: "update_cliente",
        },
      });
    } else {
      console.warn("ℹ️ Cliente sin número de teléfono, no se envía WhatsApp.");
    }

    /* ===============================
       💬 Notificación al proveedor
       =============================== */
    const fixerNumero = (proveedor as any)?.telefono ?? (proveedor as any)?.phone;
    if (fixerNumero) {
      const msgProveedor = [
        "⚠️ *CITA ACTUALIZADA*",
        "",
        `👋 Hola *${proveedorNombre}*,`,
        "La cita con tu cliente ha sido actualizada.",
        "",
        `📅 *Nueva fecha:* ${fechaLocal}`,
        `🕒 *Nueva hora:* ${horaInicio}${horaFin && horaFin !== "—" ? ` - ${horaFin}` : ""}`,
        `👤 *Cliente:* ${clienteNombre}`,
        `🛠️ *Servicio:* ${servicioNombre}`,
        citaId ? `🆔 *ID de Cita:* ${citaId}` : "",
        "",
        "Si el nuevo horario no te conviene, puedes coordinar con el cliente.",
      ]
        .filter(Boolean)
        .join("\n");

      await sendWhatsAppNotification({
        message: msgProveedor,
        destinations: [{ phone: fixerNumero, name: proveedorNombre }],
        fromName: "Sistema de Citas",
        meta: {
          proveedorId: payload.proveedorId,
          servicioId: payload.servicioId,
          tipo: "update_fixer",
        },
      });
    } else {
      console.warn("ℹ️ Proveedor sin número de teléfono, no se envía WhatsApp.");
    }

    return { ok: true, notified: true };
  } catch (err: any) {
    console.error("❌ Error en updateAndNotifyWhatsApp:", err);
    return { ok: false, notified: false, message: err?.message ?? "Error desconocido" };
  }
}

/* ===========================================================
   ❌ CANCELACIÓN — Cliente + Proveedor
   =========================================================== */
export async function cancelAndNotifyWhatsApp(payload: CreateAppointmentPayload) {
  try {
    // 🔹 Obtener datos reales desde la API
    const [proveedor, servicio, cliente] = await Promise.all([
      getProveedorById(payload.proveedorId),
      getServicioById(payload.servicioId),
      getClienteById(payload.clienteId),
    ]);

    if (!proveedor) throw new Error("Proveedor no encontrado");
    if (!servicio) throw new Error("Servicio no encontrado");
    if (!cliente) throw new Error("Cliente no encontrado");

    // 🔹 Datos base
    const fechaLocal = new Date(payload.fecha).toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const servicioNombre = (servicio as any)?.nombre ?? payload.servicioId;
    const proveedorNombre = (proveedor as any)?.nombre ?? "Proveedor";
    const clienteNombre = (cliente as any)?.nombre ?? "Cliente";
    const citaId =
      payload.citaId ||
      (payload as any)?._id ||
      (payload as any)?.id ||
      "";

    /* ===============================
       💬 Notificación al cliente
       =============================== */
    const clienteNumero = (cliente as any)?.telefono ?? (cliente as any)?.phone;
    if (clienteNumero) {
      const msgCliente = [
        "❌ *CANCELACIÓN DE CITA* ❌",
        "",
        `Hola *${clienteNombre}*,`,
        `Tu cita con *${proveedorNombre}* ha sido cancelada.`,
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

      await sendWhatsAppNotification({
        message: msgCliente,
        destinations: [{ phone: clienteNumero, name: clienteNombre }],
        fromName: "Sistema de Citas",
        meta: {
          proveedorId: payload.proveedorId,
          servicioId: payload.servicioId,
          tipo: "cancel_cliente",
        },
      });
    } else {
      console.warn("ℹ️ Cliente sin número de teléfono, no se envía WhatsApp.");
    }

    /* ===============================
       💬 Notificación al proveedor
       =============================== */
    const fixerNumero = (proveedor as any)?.telefono ?? (proveedor as any)?.phone;
    if (fixerNumero) {
      const msgProveedor = [
        "⚠️ *CITA CANCELADA*",
        "",
        `👋 Hola *${proveedorNombre}*,`,
        `La cita con tu cliente *${clienteNombre}* ha sido cancelada.`,
        "",
        `📅 *Fecha original:* ${fechaLocal}`,
        `🛠️ *Servicio:* ${servicioNombre}`,
        citaId ? `🆔 *ID de Cita:* ${citaId}` : "",
        "",
        "Te notificaremos si el cliente solicita una reprogramación.",
        "",
        "— *Sistema de Citas*",
      ]
        .filter(Boolean)
        .join("\n");

      await sendWhatsAppNotification({
        message: msgProveedor,
        destinations: [{ phone: fixerNumero, name: proveedorNombre }],
        fromName: "Sistema de Citas",
        meta: {
          proveedorId: payload.proveedorId,
          servicioId: payload.servicioId,
          tipo: "cancel_fixer",
        },
      });
    } else {
      console.warn("ℹ️ Proveedor sin número de teléfono, no se envía WhatsApp.");
    }

    return { ok: true, notified: true };
  } catch (err: any) {
    console.error("❌ Error en cancelAndNotifyWhatsApp:", err);
    return { ok: false, notified: false, message: err?.message ?? "Error desconocido" };
  }
}