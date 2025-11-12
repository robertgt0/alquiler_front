"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Dest = { email?: string; phone?: string; name?: string };

type Ctx = {
  // edición en UI (buffer)
  requester: Dest;
  fixer: Dest;
  setRequester: (d: Dest) => void;
  setFixer: (d: Dest) => void;

  // confirmación / persistencia
  confirmed: boolean;
  saveRecipients: () => void;
  clearRecipients: () => void;

  // listas por defecto (opcional si usas API / .env)
  defaults: { emails: string[]; phones: string[] };

  // lo que realmente se enviará (confirmado o, si no, lo que haya cargado)
  extraDestinations: Dest[];
};

const CtxObj = createContext<Ctx | null>(null);

const STORAGE_KEY = "quickRecipients.v1";

function splitCsv(v?: string) {
  if (!v) return [];
  return v.split(",").map(s => s.trim()).filter(Boolean);
}

export function useQuickRecipients() {
  const ctx = useContext(CtxObj);
  if (!ctx) throw new Error("useQuickRecipients debe usarse dentro de QuickRecipientsProvider");
  return ctx;
}

export function QuickRecipientsProvider({ children }: { children: React.ReactNode }) {
  // buffer de edición
  const [requester, setRequester] = useState<Dest>({});
  const [fixer, setFixer] = useState<Dest>({});

  // persistido
  const [confirmed, setConfirmed] = useState(false);

  // defaults (opcional, puedes poblarlos desde /api/quick-notify/config)
  const [defaults, setDefaults] = useState<{ emails: string[]; phones: string[] }>({ emails: [], phones: [] });

  // Levantar desde localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const { requester: r, fixer: f, confirmed: c } = JSON.parse(raw);
        if (r) setRequester(r);
        if (f) setFixer(f);
        setConfirmed(!!c);
      }
    } catch {}
  }, []);

  // Cargar defaults (si no quieres, puedes eliminar este fetch)
  useEffect(() => {
    fetch("/api/quick-notify/config")
      .then(r => r.ok ? r.json() : { emails: [], phones: [] })
      .then(d => setDefaults({ emails: d.emails ?? [], phones: d.phones ?? [] }))
      .catch(() => setDefaults({ emails: [], phones: [] }));
  }, []);

  const saveRecipients = () => {
    const hasRequester = requester.email || requester.phone;
    const hasFixer = fixer.email || fixer.phone;
    // Si no hay nada, no confirmamos
    if (!hasRequester && !hasFixer) {
      setConfirmed(false);
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    setConfirmed(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ requester, fixer, confirmed: true }));
  };

  const clearRecipients = () => {
    setConfirmed(false);
    setRequester({});
    setFixer({});
    localStorage.removeItem(STORAGE_KEY);
  };

  // Lo que se enviará
  const extraDestinations = useMemo(() => {
    const list: Dest[] = [];
    const a = confirmed ? requester : requester;
    const b = confirmed ? fixer : fixer;
    if (a.email || a.phone) list.push(a);
    if (b.email || b.phone) list.push(b);
    return list;
  }, [requester, fixer, confirmed]);

  return (
    <CtxObj.Provider value={{
      requester, fixer, setRequester, setFixer,
      confirmed, saveRecipients, clearRecipients,
      defaults, extraDestinations
    }}>
      {children}
    </CtxObj.Provider>
  );
}
