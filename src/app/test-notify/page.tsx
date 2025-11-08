// src/app/test-notify/page.tsx
"use client";

import { useState } from "react";

// 📧 Gmail
import {
  createAndNotify as createAndNotifyGmail,
  updateAndNotify as updateAndNotifyGmail,
  cancelAndNotify as cancelAndNotifyGmail,
} from "@/lib/appointments_gmail";

// 💬 WhatsApp (nuevo formato)
import {
  createAndNotifyWhatsApp,
  updateAndNotifyWhatsApp,
  cancelAndNotifyWhatsApp,
} from "@/lib/appointments_whatsapp";

// 🧩 Datos reales del proveedor (ajusta según tu BD)
const PROVEEDOR = {
  _id: "690c29d00c736bec44e473e4",
  nombre: "namelees",
  apellido: "nameless",
  email: "adrivall1234@gmail.com",
  telefono: "59167436589",
};

const SERVICIO_ID = "690c27190c736bec44e473e0"; // Servicio real

// 👤 Cliente demo
const CLIENTE = {
  id: "68fb93e079308369b5a0f264",
  nombre: "Juan Perez",
  email: "adrianvallejosflores24@gmail.com",
  phone: "59177484270", // ⚠️ cámbialo si querés probar WhatsApp real
};

const CITA_ID = "690d234101f0528d2eb18122"; // opcional, solo para meta/log

type Action = "create" | "update" | "cancel";

export default function TestNotifyPage() {
  const [log, setLog] = useState("");
  const [loading, setLoading] = useState<Action | null>(null);

  const run = async (type: Action) => {
    try {
      setLoading(type);

      let payload: any = {
        proveedorId: PROVEEDOR._id,
        servicioId: SERVICIO_ID,
        cliente: CLIENTE,
        citaId: CITA_ID,
        proveedorTelefono: PROVEEDOR.telefono, // ✅ se pasa explícitamente
        proveedorEmail: PROVEEDOR.email,       // ✅ también útil para Gmail
      };

      if (type === "create") {
        payload = {
          ...payload,
          fecha: "2025-11-14",
          horario: { inicio: "15:30", fin: "16:30" },
          ubicacion: {
            direccion: "Dirección de prueba",
            notas: "Creación de cita desde test-notify",
          },
        };

        setLog("▶ Enviando NUEVA CITA (Gmail + WhatsApp)...");

        const [gmailRes, waRes] = await Promise.all([
          createAndNotifyGmail(payload),
          createAndNotifyWhatsApp(payload),
        ]);

        setLog(
          [
            "✅ NUEVA CITA:",
            gmailRes.ok
              ? "• Gmail OK (cliente + proveedor)"
              : `• Gmail ERROR: ${gmailRes.message}`,
            waRes.ok
              ? "• WhatsApp OK (cliente + proveedor)"
              : `• WhatsApp ERROR: ${waRes.message}`,
          ].join("\n")
        );
      }

      if (type === "update") {
        payload = {
          ...payload,
          fecha: "2025-11-15",
          horario: { inicio: "10:00", fin: "11:00" },
          ubicacion: {
            direccion: "Dirección de prueba actualizada",
            notas: "Ajuste de disponibilidad del cliente",
          },
          cambios: ["Fecha cambiada a 15/11/2025", "Hora cambiada a 10:00"],
        };

        setLog("▶ Enviando CITA ACTUALIZADA (Gmail + WhatsApp)...");

        const [gmailRes, waRes] = await Promise.all([
          updateAndNotifyGmail(payload),
          updateAndNotifyWhatsApp(payload),
        ]);

        setLog(
          [
            "✅ CITA ACTUALIZADA:",
            gmailRes.ok
              ? "• Gmail OK (cliente + proveedor)"
              : `• Gmail ERROR: ${gmailRes.message}`,
            waRes.ok
              ? "• WhatsApp OK (cliente + proveedor)"
              : `• WhatsApp ERROR: ${waRes.message}`,
          ].join("\n")
        );
      }

      if (type === "cancel") {
        payload = {
          ...payload,
          fecha: "2025-11-14",
          horario: { inicio: "15:30", fin: "16:30" },
          ubicacion: {
            direccion: "Dirección de prueba",
            notas: "El cliente no podrá asistir",
          },
        };

        setLog("▶ Enviando CITA CANCELADA (Gmail + WhatsApp)...");

        const [gmailRes, waRes] = await Promise.all([
          cancelAndNotifyGmail(payload),
          cancelAndNotifyWhatsApp(payload),
        ]);

        setLog(
          [
            "✅ CITA CANCELADA:",
            gmailRes.ok
              ? "• Gmail OK (cliente + proveedor)"
              : `• Gmail ERROR: ${gmailRes.message}`,
            waRes.ok
              ? "• WhatsApp OK (cliente + proveedor)"
              : `• WhatsApp ERROR: ${waRes.message}`,
          ].join("\n")
        );
      }
    } catch (err: any) {
      console.error(err);
      setLog("❌ Error inesperado: " + (err?.message || String(err)));
    } finally {
      setLoading(null);
    }
  };

  const busy = !!loading;

  return (
    <main className="min-h-screen flex flex-col items-center py-10 px-4 bg-slate-50">
      <h1 className="text-2xl font-semibold mb-2">
        Test de notificaciones (Gmail + WhatsApp)
      </h1>

      <p className="text-sm text-slate-600 mb-6 text-center max-w-2xl">
        Usa los módulos:{" "}
        <code>appointments_gmail.ts</code> y{" "}
        <code>appointments_whatsapp.ts</code> (nuevo formato).
        <br />
        Asegúrate que el proveedor (<code>{PROVEEDOR._id}</code>) tenga{" "}
        <b>email válido</b> y <b>teléfono</b> en la BD.
      </p>

      <div className="flex flex-col gap-3 w-full max-w-md">
        <button
          onClick={() => run("create")}
          disabled={busy}
          className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading === "create"
            ? "Enviando nueva cita..."
            : "Simular NUEVA CITA"}
        </button>

        <button
          onClick={() => run("update")}
          disabled={busy}
          className="px-4 py-2 rounded bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50"
        >
          {loading === "update"
            ? "Enviando actualización..."
            : "Simular CITA ACTUALIZADA"}
        </button>

        <button
          onClick={() => run("cancel")}
          disabled={busy}
          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
        >
          {loading === "cancel"
            ? "Enviando cancelación..."
            : "Simular CITA CANCELADA"}
        </button>
      </div>

      {log && (
        <pre className="mt-6 text-xs bg-slate-900 text-emerald-300 p-3 rounded max-w-2xl whitespace-pre-wrap">
          {log}
        </pre>
      )}
    </main>
  );
}
