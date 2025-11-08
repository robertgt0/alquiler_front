// src/Features/hu5-notifications/hu5-notifications/gmailNotificationService.ts

export async function sendWalletZeroNotification(data: { 
  to: string; 
  subject: string; 
  text: string;
  name?: string;
}): Promise<any> {
  const GMAIL_NOTIFY_URL = "http://localhost:5000/api/gmail-notifications";
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-api-key": "mi_clave_secreta_definida_para_el_modulo_notificaciones_XD",
  };

  const date = new Date().toLocaleDateString("es-BO", {
    weekday: "long",
    day: "numeric",
    month: "long", 
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  const htmlMessage = `
<div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #ddd; border-radius: 6px; padding: 16px;">
  <p style="font-weight: bold; color: #222; margin-bottom: 8px; font-size: 16px;">
    ⚠️ Alerta de Saldo en Cero
  </p>
  <p style="color: #222; margin: 0 0 8px 0;">
    Hola <strong>${data.name || "Usuario"}</strong>,
  </p>
  <p style="color: #222; margin: 0 0 8px 0;">
    Tu billetera Fixer ha llegado a <strong style="color: #E91923;">Bs. 0.00</strong>.
  </p>
  <p style="color: #E91923; font-weight: bold; margin: 12px 0;">
    ❌ No tienes fondos disponibles en este momento.
  </p>
  <p style="color: #444; margin: 0 0 16px 0;">
    Por favor, recarga tu billetera para continuar usando los servicios.
  </p>
  <div style="font-size: 13px; color: #333; border-top: 1px solid #ccc; padding-top: 8px;">
    <p style="margin: 4px 0;"><strong>Fecha:</strong> ${date}</p>
    <p style="margin: 4px 0;"><strong>Tipo:</strong> Notificación Automática HU5</p>
  </div>
</div>
  `.trim();

  const gmailPayload = {
    subject: data.subject,
    message: htmlMessage,
    destinations: [{ 
      email: data.to, 
      name: data.name || "Usuario"
    }],
    fromName: "Sistema de Billetera AlquilerApp"
  };

  try {
    console.log('🔵 HU5: Enviando a', GMAIL_NOTIFY_URL);
    
    const res = await fetch(GMAIL_NOTIFY_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(gmailPayload),
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(body?.message ?? `Error HTTP ${res.status}`);
    }

    console.log('✅ HU5: Respuesta exitosa', body);
    return { success: true, ...body };
    
  } catch (err: any) {
    console.error("❌ HU5: Error al enviar", err);
    throw err;
  }
}