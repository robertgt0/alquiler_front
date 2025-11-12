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
  fecha: string; // ISO o YYYY-MM-DD
  horario?: { inicio?: string; fin?: string };
  cliente?: { nombre?: string; phone?: string; telefono?: string; id?: string; email?: string };
  ubicacion?: { direccion?: string; notas?: string };
  cambios?: string[];
  citaId?: string;
  [key: string]: any; // meta, proveedor, servicio, etc.
};

export type CreateResponse = {
  ok: boolean;
  data?: any;
  message?: string;
  status?: number;
  error?: any;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

/* ----------------------- Helpers de nombres ----------------------- */
function firstNonEmpty(...vals: Array<any>): string | undefined {
  for (const v of vals) {
    const s = (v ?? "").toString().trim();
    if (s) return s;
  }
  return undefined;
}

function resolveNombreDesdeExtras(meta: any, match: { email?: string; phone?: string }) {
  if (!meta || !Array.isArray(meta.extraDestinations)) return undefined;
  const byPhone = meta.extraDestinations.find((d: any) => match.phone && d?.phone && d.phone === match.phone);
  const byEmail = meta.extraDestinations.find((d: any) => match.email && d?.email && d.email === match.email);
  return firstNonEmpty(byPhone?.name, byEmail?.name);
}

/* ----------------------- Extras (UI + .env) ----------------------- */

function parseCsv(v?: string) {
  if (!v) return [];
  return v.split(",").map(s => s.trim()).filter(Boolean);
}

type WADest = { phone?: string; name?: string };

function normalizePhoneExtras(meta: any): WADest[] {
  const list = Array.isArray(meta?.extraDestinations) ? meta.extraDestinations : [];
  const envPhones = parseCsv(process.env.NEXT_PUBLIC_NOTIFY_PHONES);

  const combined: unknown[] = [
    ...envPhones.map((p) => ({ phone: p })),
    ...list,
  ];

  const mapped = combined.map((d: any): WADest | null => {
    if (!d) return null;

    if (typeof d === "string") {
      const phone = d.trim();
      return phone ? { phone } : null;
    }

    const phone = d.phone ?? d.telefono ?? d.mobile;
    const name = d.name ?? d.nombre;

    if (!phone) return null;
    return { phone: String(phone), name: name ? String(name) : undefined };
  });

  return mapped.filter((x): x is WADest => x !== null);
}

function dedupePhoneDests(dests: WADest[]): WADest[] {
  const seen = new Set<string>();
  const out: WADest[] = [];
  for (const d of dests) {
    const key = (d.phone ?? "").trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(d);
  }
  return out;
}

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
   ✨ CREAR CITA — Cliente (+extras) y Proveedor
   =========================================================== */
export async function createAndNotifyWhatsApp(payload: CreateAppointmentPayload) {
  try {
    const [proveedorResp, servicioResp, clienteResp] = await Promise.all([
      getProveedorById(payload.proveedorId),
      getServicioById(payload.servicioId),
      payload.cliente?.id ? getClienteById(payload.cliente.id) : null,
    ]);

    const proveedor = proveedorResp ?? (payload as any).proveedor ?? null;
    const servicio = servicioResp ?? (payload as any).servicio ?? null;
    const cliente = clienteResp ?? payload.cliente ?? null;

    const fechaLocal = new Date(payload.fecha).toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const horaInicio = payload.horario?.inicio ?? "—";
    const horaFin = payload.horario?.fin ?? "—";

    const clienteEmail = payload?.cliente?.email;
    const clientePhone = payload?.cliente?.telefono ?? payload?.cliente?.phone ?? (cliente as any)?.telefono ?? (cliente as any)?.phone;

    const servicioNombre = (servicio as any)?.nombre ?? payload.servicioId;
    const proveedorNombre =
      firstNonEmpty(
        (proveedor as any)?.nombre,
        resolveNombreDesdeExtras((payload as any)?.meta, { phone: (proveedor as any)?.telefono ?? (proveedor as any)?.phone })
      ) ?? "tu proveedor";

    const clienteNombre =
      firstNonEmpty(
        payload?.cliente?.nombre,
        (cliente as any)?.nombre,
        resolveNombreDesdeExtras((payload as any)?.meta, { email: clienteEmail, phone: clientePhone })
      ) ?? "Cliente";

    const direccion = payload.ubicacion?.direccion ?? "No especificada";
    const notas = payload.ubicacion?.notas ?? "Ninguna";
    const citaId = payload.citaId || (payload as any)?._id || "";

    // --- Cliente + extras ---
    const numeroCliente = clientePhone;
    const extraPhones = normalizePhoneExtras((payload as any).meta);
    const destinosCliente = dedupePhoneDests([
      ...(numeroCliente ? [{ phone: String(numeroCliente), name: clienteNombre }] : []),
      ...extraPhones,
    ]);

    if (destinosCliente.length) {
      const msgCliente = `
*✨ CREACIÓN DE TU CITA ✨*

Hola *${clienteNombre}*,
Tu cita ha sido creada exitosamente.

📅 *Fecha:* ${fechaLocal}
⏰ *Horario:* ${horaInicio} - ${horaFin}
🧾 *Servicio:* ${servicioNombre}
👨‍⚕️ *Proveedor:* ${proveedorNombre}
📍 *Dirección:* ${direccion}
🗒️ *Notas:* ${notas}
${citaId ? `🆔 *ID de Cita:* ${citaId}` : ""}

Gracias por confiar en nosotros 💙  
— *Sistema de Citas*
`.trim();

      await sendWhatsAppNotification({
        message: msgCliente,
        destinations: destinosCliente,
        fromName: "Sistema de Citas",
        meta: { tipo: "create_client" },
      });
    }

    // --- Proveedor (fixer) ---
    if ((proveedor as any)?.telefono || (proveedor as any)?.phone) {
      const numeroProveedor = (proveedor as any).telefono ?? (proveedor as any).phone;
      const msgProveedor = `
✅ *Nueva cita confirmada*

👋 Hola *${proveedorNombre}*,
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
        destinations: [{ phone: String(numeroProveedor), name: proveedorNombre }],
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
   🌀 ACTUALIZACIÓN — Cliente (+extras) y Proveedor
   =========================================================== */
export async function updateAndNotifyWhatsApp(
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

    const fechaLocal = new Date(payload.fecha).toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const horaInicio = payload.horario?.inicio ?? "—";
    const horaFin = payload.horario?.fin ?? "—";

    const clienteEmail = payload?.cliente?.email;
    const clientePhone = payload?.cliente?.telefono ?? payload?.cliente?.phone ?? (cliente as any)?.telefono ?? (cliente as any)?.phone;

    const servicioNombre = (servicio as any)?.nombre ?? payload.servicioId;
    const proveedorNombre =
      firstNonEmpty(
        (proveedor as any)?.nombre,
        resolveNombreDesdeExtras((payload as any)?.meta, { phone: (proveedor as any)?.telefono ?? (proveedor as any)?.phone })
      ) ?? "tu proveedor";

    const clienteNombre =
      firstNonEmpty(
        payload?.cliente?.nombre,
        (cliente as any)?.nombre,
        resolveNombreDesdeExtras((payload as any)?.meta, { email: clienteEmail, phone: clientePhone })
      ) ?? "Cliente";

    const citaId = payload.citaId || (payload as any)?._id || "";
    const cambiosTexto = payload.cambios?.length
      ? `🔄 *Cambios realizados:* ${payload.cambios.join(", ")}`
      : "Se han actualizado los detalles de tu cita.";

    // --- Cliente + extras ---
    const numeroCliente = clientePhone;
    const extraPhones = normalizePhoneExtras((payload as any).meta);
    const destinosCliente = dedupePhoneDests([
      ...(numeroCliente ? [{ phone: String(numeroCliente), name: clienteNombre }] : []),
      ...extraPhones,
    ]);

    if (destinosCliente.length) {
      const msgCliente = `
*✨ ACTUALIZACIÓN DE CITA ✨*

Hola *${clienteNombre}*,
Tu cita ha sido modificada correctamente.

${cambiosTexto}

📅 *Fecha:* ${fechaLocal}
⏰ *Horario:* ${horaInicio} - ${horaFin}
🧾 *Servicio:* ${servicioNombre}
👨‍⚕️ *Proveedor:* ${proveedorNombre}
${citaId ? `🆔 *ID de Cita:* ${citaId}` : ""}

— *Sistema de Citas*
`.trim();

      await sendWhatsAppNotification({
        message: msgCliente,
        destinations: destinosCliente,
        fromName: "Sistema de Citas",
        meta: { tipo: "update_client" },
      });
    }

    // --- Proveedor (fixer) ---
    if ((proveedor as any)?.telefono || (proveedor as any)?.phone) {
      const numeroProveedor = (proveedor as any).telefono ?? (proveedor as any).phone;
      const msgProveedor = `
⚠️ *Cita actualizada*

👋 Hola *${proveedorNombre}*,
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
        destinations: [{ phone: String(numeroProveedor), name: proveedorNombre }],
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
   ❌ CANCELACIÓN — Cliente (+extras) y Proveedor
   =========================================================== */
export async function cancelAndNotifyWhatsApp(payload: CreateAppointmentPayload) {
  try {
    const [proveedorResp, servicioResp, clienteResp] = await Promise.all([
      getProveedorById(payload.proveedorId),
      getServicioById(payload.servicioId),
      payload.cliente?.id ? getClienteById(payload.cliente.id) : null,
    ]);

    const proveedor = proveedorResp ?? (payload as any).proveedor ?? null;
    const servicio = servicioResp ?? (payload as any).servicio ?? null;
    const cliente = clienteResp ?? payload.cliente ?? null;

    const fechaLocal = new Date(payload.fecha).toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const clienteEmail = payload?.cliente?.email;
    const clientePhone = payload?.cliente?.telefono ?? payload?.cliente?.phone ?? (cliente as any)?.telefono ?? (cliente as any)?.phone;

    const servicioNombre = (servicio as any)?.nombre ?? payload.servicioId;
    const proveedorNombre =
      firstNonEmpty(
        (proveedor as any)?.nombre,
        resolveNombreDesdeExtras((payload as any)?.meta, { phone: (proveedor as any)?.telefono ?? (proveedor as any)?.phone })
      ) ?? "tu proveedor";

    const clienteNombre =
      firstNonEmpty(
        payload?.cliente?.nombre,
        (cliente as any)?.nombre,
        resolveNombreDesdeExtras((payload as any)?.meta, { email: clienteEmail, phone: clientePhone })
      ) ?? "Cliente";

    // --- Cliente + extras ---
    const numeroCliente = clientePhone;
    const extraPhones = normalizePhoneExtras((payload as any).meta);
    const destinosCliente = dedupePhoneDests([
      ...(numeroCliente ? [{ phone: String(numeroCliente), name: clienteNombre }] : []),
      ...extraPhones,
    ]);

    if (destinosCliente.length) {
      const msgCliente = `
*❌ CANCELACIÓN DE CITA ❌*

Hola *${clienteNombre}*,
Tu cita con *${proveedorNombre}* ha sido cancelada.

📅 *Fecha original:* ${fechaLocal}
🧾 *Servicio:* ${servicioNombre}

Si fue un error, puedes volver a programarla cuando desees.
— *Sistema de Citas*
`.trim();

      await sendWhatsAppNotification({
        message: msgCliente,
        destinations: destinosCliente,
        fromName: "Sistema de Citas",
        meta: { tipo: "cancel_client" },
      });
    }

    // --- Proveedor (fixer) ---
    if ((proveedor as any)?.telefono || (proveedor as any)?.phone) {
      const numeroProveedor = (proveedor as any).telefono ?? (proveedor as any).phone;
      const msgProveedor = `
❌ *Cita cancelada*

👋 Hola *${proveedorNombre}*,
Tu cita con el cliente *${clienteNombre}* ha sido cancelada.

📅 *Fecha original:* ${fechaLocal}
🛠️ *Servicio:* ${servicioNombre}

Te notificaremos si solicita una reprogramación.
`.trim();

      await sendWhatsAppNotification({
        message: msgProveedor,
        destinations: [{ phone: String(numeroProveedor), name: proveedorNombre }],
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
