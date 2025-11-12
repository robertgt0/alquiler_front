"use client";
import React, { useState } from "react";
import { useQuickRecipients } from "./NotificationsContext";

export default function QuickRecipientsFloating() {
  const {
    requester, fixer, setRequester, setFixer,
    confirmed, saveRecipients, clearRecipients,
    defaults
  } = useQuickRecipients();
  const [open, setOpen] = useState(true);

  const disabled = confirmed;

  return (
    <div className="fixed z-[9999] bottom-4 right-4 w-80 rounded-2xl border border-neutral-800 bg-neutral-900/85 backdrop-blur p-3 shadow-xl text-neutral-100">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-green-400">
          Destinatarios rápidos {confirmed && <span className="ml-2 text-[10px] px-2 py-0.5 rounded bg-green-600/60">guardado</span>}
        </h4>
        <button
          onClick={() => setOpen(o => !o)}
          className="text-xs px-2 py-1 rounded-lg border border-neutral-700 hover:bg-neutral-800"
        >
          {open ? "–" : "+"}
        </button>
      </div>

      {open && (
        <div className="mt-3 space-y-3">
          {/* REQUESTER */}
          <section className="space-y-2">
            <p className="text-xs text-neutral-400">Requester (Cliente)</p>
            <input
              className="w-full rounded-lg bg-neutral-800/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-60"
              placeholder="Nombre (opcional)"
              disabled={disabled}
              value={requester.name ?? ""}
              onChange={e => setRequester({ ...requester, name: e.target.value })}
            />
            <input
              className="w-full rounded-lg bg-neutral-800/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-60"
              placeholder="Email cliente"
              list="qr-emails"
              disabled={disabled}
              value={requester.email ?? ""}
              onChange={e => setRequester({ ...requester, email: e.target.value })}
            />
            <input
              className="w-full rounded-lg bg-neutral-800/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-60"
              placeholder="Teléfono/WhatsApp cliente"
              list="qr-phones"
              disabled={disabled}
              value={requester.phone ?? ""}
              onChange={e => setRequester({ ...requester, phone: e.target.value })}
            />
          </section>

          {/* FIXER */}
          <section className="space-y-2">
            <p className="text-xs text-neutral-400">Fixer (Solo notificación)</p>
            <input
              className="w-full rounded-lg bg-neutral-800/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-60"
              placeholder="Nombre proveedor (opcional)"
              disabled={disabled}
              value={fixer.name ?? ""}
              onChange={e => setFixer({ ...fixer, name: e.target.value })}
            />
            <input
              className="w-full rounded-lg bg-neutral-800/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-60"
              placeholder="Email proveedor"
              list="qr-emails"
              disabled={disabled}
              value={fixer.email ?? ""}
              onChange={e => setFixer({ ...fixer, email: e.target.value })}
            />
            <input
              className="w-full rounded-lg bg-neutral-800/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-60"
              placeholder="Teléfono/WhatsApp proveedor"
              list="qr-phones"
              disabled={disabled}
              value={fixer.phone ?? ""}
              onChange={e => setFixer({ ...fixer, phone: e.target.value })}
            />
          </section>

          <datalist id="qr-emails">
            {defaults.emails.map(e => <option key={e} value={e} />)}
          </datalist>
          <datalist id="qr-phones">
            {defaults.phones.map(p => <option key={p} value={p} />)}
          </datalist>

          {/* Acciones */}
          <div className="flex gap-2 pt-1">
            {!confirmed ? (
              <button
                onClick={saveRecipients}
                className="flex-1 text-sm px-3 py-2 rounded-lg bg-green-600 hover:bg-green-500"
              >
                Confirmar
              </button>
            ) : (
              <button
                onClick={clearRecipients}
                className="flex-1 text-sm px-3 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600"
              >
                Limpiar
              </button>
            )}
          </div>

          <p className="text-[11px] text-neutral-400">
            Se añadirán a los destinatarios cuando crees, edites o canceles una cita.
          </p>
        </div>
      )}
    </div>
  );
}
