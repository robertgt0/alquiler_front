"use client";

import { useState } from "react";
import { checkCI, createFixer, updateIdentity } from "@/lib/api/fixer";
import StepProgress from "../components/StepProgress";
import { STORAGE_KEYS, saveToStorage } from "../storage";
import type { StepIdentityProps } from "./types";

const CI_REGEX = /^\d{6,10}$/;

export default function StepIdentity({ fixerId, userId, initialCI, onComplete }: StepIdentityProps) {
  const [ci, setCi] = useState(initialCI);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const trimmed = ci.trim();
    if (!CI_REGEX.test(trimmed)) {
      setError("Ingresa un C.I. valido (solo numeros, 6-10 digitos)");
      return;
    }

    try {
      setLoading(true);
      const ciCheck = await checkCI(trimmed, fixerId ?? undefined);
      if (!ciCheck.unique && !fixerId) {
        setError("Este C.I. ya esta registrado");
        setLoading(false);
        return;
      }

      let currentId = fixerId;
      if (!currentId) {
        const created = await createFixer({ userId, ci: trimmed });
        currentId = created.data.id;
      } else {
        await updateIdentity(currentId, trimmed);
      }

      saveToStorage(STORAGE_KEYS.ci, trimmed);
      if (currentId) saveToStorage(STORAGE_KEYS.fixerId, currentId);
      onComplete({ fixerId: currentId!, ci: trimmed });
    } catch (err: any) {
      setError(String(err?.message || "No se pudo guardar el C.I."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-xl flex-col gap-6 rounded-3xl bg-white p-8 shadow-lg">
      <header className="flex flex-col gap-2">
        <StepProgress current={1} />
        <h2 className="text-2xl font-semibold text-slate-900">¿Cual es tu numero de C.I.?</h2>
        <p className="text-sm text-slate-500">Necesitamos tu documento para validar que puedas trabajar como Fixer en la plataforma.</p>
      </header>

      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-slate-700" htmlFor="ci-input">
          Numero de C.I.
        </label>
        <input
          id="ci-input"
          type="text"
          inputMode="numeric"
          value={ci}
          onChange={(event) => setCi(event.target.value.replace(/[^0-9]/g, ""))}
          placeholder="Ingresa tu numero de C.I."
          className="h-12 rounded-xl border border-slate-200 px-4 text-center text-lg font-semibold tracking-wider outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
        <p className="text-xs text-slate-400">Solo numeros, minimo 6 y maximo 10 digitos.</p>
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Validando..." : "Siguiente"}
        </button>
      </div>
    </form>
  );
}
