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
/* ===========================================================
   💬 WHATSAPP — Creación de Cita (solo con datos locales)
   =========================================================== */

export async function createAndNotifyWhatsApp(payload: CreateAppointmentPayload) {
  try {
    // 1️⃣ Recuperar datos desde localStorage
    const storedData = localStorage.getItem("env_prueba");
    const userData = storedData ? JSON.parse(storedData) : null;

    if (!userData || !userData.request || !userData.fixer) {
      console.warn("⚠️ No hay datos válidos en env_prueba (request/fixer)");
      return { ok: false, message: "Faltan datos locales para enviar notificación WhatsApp." };
    }

    const { request, fixer } = userData;

    // 2️⃣ Datos base
    const clienteNombre = request.nombre || "Cliente";
    const clienteNumero = request.numero || "";
    const fixerNombre = fixer.nombre || "Proveedor";
    const fixerNumero = fixer.numero || "";

    // 3️⃣ Datos de la cita
    const fechaLocal = new Date(payload.fecha).toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const horaInicio = payload.horario?.inicio ?? "—";
    const horaFin = payload.horario?.fin ?? "—";
    const servicioNombre = payload.servicioId ?? "Servicio no especificado";
    const direccion = payload.ubicacion?.direccion ?? "No especificada";
    const notas = payload.ubicacion?.notas ?? "Ninguna";
    const citaId = payload.citaId || (payload as any)?._id || "";

    // 🔹 Mensaje para el cliente (request)
    if (clienteNumero) {
      const msgCliente = `
*✨ CREACIÓN DE TU CITA ✨*

Hola *${clienteNombre}*,
Tu cita ha sido creada exitosamente.

📅 *Fecha:* ${fechaLocal}
⏰ *Horario:* ${horaInicio} - ${horaFin}
🧾 *Servicio:* ${servicioNombre}
👨‍⚕️ *Proveedor:* ${fixerNombre}
📍 *Dirección:* ${direccion}
🗒️ *Notas:* ${notas}
${citaId ? `🆔 *ID de Cita:* ${citaId}` : ""}

Gracias por confiar en nosotros 💙  
— *Sistema de Citas*
`.trim();

      await sendWhatsAppNotification({
        message: msgCliente,
        destinations: [{ phone: clienteNumero, name: clienteNombre }],
        fromName: "Sistema de Citas",
        meta: { tipo: "create_client" },
      });
    }

    // 🔹 Mensaje para el fixer
    if (fixerNumero) {
      const msgProveedor = `
✅ *Nueva cita confirmada*

👋 Hola *${fixerNombre}*,
Has recibido una nueva cita confirmada.

📅 *Fecha:* ${fechaLocal}
🕒 *Hora:* ${horaInicio} - ${horaFin}
🛠️ *Servicio:* ${servicioNombre}
👤 *Cliente:* ${clienteNombre}
📍 *Dirección:* ${direccion}
${citaId ? `🆔 *ID de Cita:* ${citaId}` : ""}

Asegúrate de estar disponible en el horario indicado.
`.trim();

      await sendWhatsAppNotification({
        message: msgProveedor,
        destinations: [{ phone: fixerNumero, name: fixerNombre }],
        fromName: "Sistema de Citas",
        meta: { tipo: "create_provider" },
      });
    }

    return { ok: true, notified: true };
  } catch (err: any) {
    console.error("❌ Error en createAndNotifyWhatsApp:", err);
    return { ok: false, notified: false, message: err?.message };
  }
}


/* ===========================================================
   🌀 ACTUALIZACIÓN — Cliente + Proveedor
   =========================================================== */
/* ===========================================================
   💬 WHATSAPP — Actualización de Cita (solo con datos locales)
   =========================================================== */

export async function updateAndNotifyWhatsApp(
  payload: CreateAppointmentPayload & { cambios?: string[] }
) {
  try {
    // 1️⃣ Recuperar datos desde localStorage
    const storedData = localStorage.getItem("env_prueba");
    const userData = storedData ? JSON.parse(storedData) : null;

    if (!userData || !userData.request || !userData.fixer) {
      console.warn("⚠️ No hay datos válidos en env_prueba (request/fixer)");
      return { ok: false, message: "Faltan datos locales para enviar notificación WhatsApp." };
    }

    const { request, fixer } = userData;

    // 2️⃣ Datos base
    const clienteNombre = request.nombre || "Cliente";
    const clienteNumero = request.numero || "";
    const fixerNombre = fixer.nombre || "Proveedor";
    const fixerNumero = fixer.numero || "";

    // 3️⃣ Datos de la cita
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
    const servicioNombre = payload.servicioId ?? "Servicio no especificado";
    const citaId = payload.citaId || (payload as any)?._id || "";

    // 🔹 Mensaje para el cliente (request)
    if (clienteNumero) {
      const msgCliente = `
*✨ ACTUALIZACIÓN DE CITA ✨*

Hola *${clienteNombre}*,
Tu cita ha sido modificada correctamente.

${cambiosTexto}

📅 *Fecha:* ${fechaLocal}
⏰ *Horario:* ${horaInicio} - ${horaFin}
🧾 *Servicio:* ${servicioNombre}
👨‍⚕️ *Proveedor:* ${fixerNombre}
${citaId ? `🆔 *ID de Cita:* ${citaId}` : ""}

— *Sistema de Citas*
`.trim();

      await sendWhatsAppNotification({
        message: msgCliente,
        destinations: [{ phone: clienteNumero, name: clienteNombre }],
        fromName: "Sistema de Citas",
        meta: { tipo: "update_client" },
      });
    }

    // 🔹 Mensaje para el fixer (proveedor)
    if (fixerNumero) {
      const msgProveedor = `
⚠️ *Cita actualizada*

👋 Hola *${fixerNombre}*,
La cita con tu cliente ha sido actualizada.

📅 *Nueva fecha:* ${fechaLocal}
🕒 *Nueva hora:* ${horaInicio} - ${horaFin}
👤 *Cliente:* ${clienteNombre}
🛠️ *Servicio:* ${servicioNombre}
${citaId ? `🆔 *ID de Cita:* ${citaId}` : ""}

Si el nuevo horario no te conviene, puedes coordinar con el cliente.
`.trim();

      await sendWhatsAppNotification({
        message: msgProveedor,
        destinations: [{ phone: fixerNumero, name: fixerNombre }],
        fromName: "Sistema de Citas",
        meta: { tipo: "update_provider" },
      });
    }

    return { ok: true, notified: true };
  } catch (err: any) {
    console.error("❌ Error en updateAndNotifyWhatsApp:", err);
    return { ok: false, notified: false, message: err?.message };
  }
}


/* ===========================================================
   ❌ CANCELACIÓN — Cliente + Proveedor
   =========================================================== */
/* ===========================================================
   💬 WHATSAPP — Cancelación de Cita (solo con datos locales)
   =========================================================== */

export async function cancelAndNotifyWhatsApp(payload: CreateAppointmentPayload) {
  try {
    // 1️⃣ Recuperar datos locales desde el storage
    const storedData = localStorage.getItem("env_prueba");
    const userData = storedData ? JSON.parse(storedData) : null;

    if (!userData || !userData.request || !userData.fixer) {
      console.warn("⚠️ No hay datos válidos en env_prueba (request/fixer)");
      return { ok: false, message: "Faltan datos locales para enviar notificación WhatsApp." };
    }

    const { request, fixer } = userData;

    // 2️⃣ Datos base
    const clienteNombre = request.nombre || "Cliente";
    const clienteNumero = request.numero || "";
    const fixerNombre = fixer.nombre || "Proveedor";
    const fixerNumero = fixer.numero || "";

    // 3️⃣ Información de la cita
    const fechaLocal = new Date(payload.fecha).toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const servicioNombre = payload.servicioId ?? "Servicio no especificado";

    // 🔹 Mensaje para el cliente (request)
    if (clienteNumero) {
      const msgCliente = `
*❌ CANCELACIÓN DE CITA ❌*

Hola *${clienteNombre}*,
Tu cita con *${fixerNombre}* ha sido cancelada.

📅 *Fecha original:* ${fechaLocal}
🧾 *Servicio:* ${servicioNombre}

Si fue un error, puedes volver a programarla cuando desees.
— *Sistema de Citas*
`.trim();

      await sendWhatsAppNotification({
        message: msgCliente,
        destinations: [{ phone: clienteNumero, name: clienteNombre }],
        fromName: "Sistema de Citas",
        meta: { tipo: "cancel_client" },
      });
    }

    // 🔹 Mensaje para el fixer (proveedor)
    if (fixerNumero) {
      const msgProveedor = `
❌ *Cita cancelada*

👋 Hola *${fixerNombre}*,
Tu cita con el cliente *${clienteNombre}* ha sido cancelada.

📅 *Fecha original:* ${fechaLocal}
🛠️ *Servicio:* ${servicioNombre}

Te notificaremos si solicita una reprogramación.
`.trim();

      await sendWhatsAppNotification({
        message: msgProveedor,
        destinations: [{ phone: fixerNumero, name: fixerNombre }],
        fromName: "Sistema de Citas",
        meta: { tipo: "cancel_provider" },
      });
    }

    return { ok: true, notified: true };
  } catch (err: any) {
    console.error("❌ Error en cancelAndNotifyWhatsApp:", err);
    return { ok: false, notified: false, message: err?.message };
  }
}
