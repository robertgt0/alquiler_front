"use client";

import { useState } from "react";
import { checkCI, createFixer, updateIdentity } from "@/lib/api/fixer";
import { updateStoredUser } from "@/lib/auth/session";
import StepProgress from "../components/StepProgress";
import { STORAGE_KEYS, saveToStorage } from "../storage";
import type { StepIdentityProps } from "./types";

const CI_REGEX = /^\d{6,10}$/;

export default function StepIdentity({ fixerId, userId, initialCI, onComplete }: StepIdentityProps) {
  const [ci, setCi] = useState(initialCI);
  const [city, setCity] = useState(""); // ✅ Nuevo estado para ciudad
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!userId) {
    return (
      <section className="mx-auto flex max-w-xl flex-col gap-4 rounded-3xl bg-white p-8 text-center shadow-lg">
        <h2 className="text-2xl font-semibold text-slate-900">Selecciona un usuario antes de continuar</h2>
        <p className="text-sm text-slate-500">
          No detectamos un <strong>ObjectId</strong> de usuario valido. Regresa al paso anterior e ingresa el identificador del requester que deseas convertir.
        </p>
      </section>
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const trimmedCI = ci.trim();
    const trimmedCity = city.trim();

    // Validar C.I.
    if (!CI_REGEX.test(trimmedCI)) {
      setError("Ingresa un C.I. valido (solo numeros, 6-10 digitos)");
      return;
    }

    // ✅ Validar ciudad
    if (!trimmedCity) {
      setError("El campo Ciudad es obligatorio");
      return;
    }

    if (trimmedCity.length < 2) {
      setError("La ciudad debe tener al menos 2 caracteres");
      return;
    }

    try {
      setLoading(true);
      const ciCheck = await checkCI(trimmedCI, fixerId ?? undefined);
      if (!ciCheck.unique && !fixerId) {
        setError("Este C.I. ya esta registrado");
        setLoading(false);
        return;
      }

      let currentId = fixerId;
      if (!currentId) {
        // ✅ Enviar ciudad al crear el fixer
        const created = await createFixer({ 
          userId, 
          ci: trimmedCI,
          city: trimmedCity 
        });
        currentId = created.data.id;
      } else {
        await updateIdentity(currentId, trimmedCI);
      }

      saveToStorage(STORAGE_KEYS.ci, trimmedCI);
      if (currentId) {
        saveToStorage(STORAGE_KEYS.fixerId, currentId);
        updateStoredUser({ fixerId: currentId });
      }
      onComplete({ fixerId: currentId!, ci: trimmedCI });
    } catch (err: any) {
      setError(String(err?.message || "No se pudo guardar la información"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-xl flex-col gap-6 rounded-3xl bg-white p-8 shadow-lg">
      <header className="flex flex-col gap-2">
        <StepProgress current={1} />
        <h2 className="text-2xl font-semibold text-slate-900">Cual es tu numero de C.I.?</h2>
        <p className="text-sm text-slate-500">Necesitamos tu documento para validar que puedas trabajar como Fixer en la plataforma.</p>
        <p className="text-xs text-slate-400">
          Usuario actual:
          <code className="ml-2 rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">{userId}</code>
        </p>
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
          required
        />
        <p className="text-xs text-slate-400">Solo numeros, minimo 6 y maximo 10 digitos.</p>
      </div>

      {/* ✅ Nuevo campo: Ciudad */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-slate-700" htmlFor="city-input">
          Ciudad
        </label>
        <input
          id="city-input"
          type="text"
          value={city}
          onChange={(event) => setCity(event.target.value)}
          placeholder="Ej: Cochabamba, La Paz, Santa Cruz"
          className="h-12 rounded-xl border border-slate-200 px-4 text-lg outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          maxLength={120}
          required
        />
        <p className="text-xs text-slate-400">Ciudad donde ofreces tus servicios.</p>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

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
