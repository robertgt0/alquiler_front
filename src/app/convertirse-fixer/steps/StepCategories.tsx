"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { updateCategories as updateCategoriesApi } from "@/lib/api/fixer";
import type { CategoryDTO } from "@/lib/api/categories";
import StepProgress from "../components/StepProgress";
import { STORAGE_KEYS, saveToStorage } from "../storage";
import type { SelectedCategory, StepCategoriesProps } from "./types";

const CategoriesSelector = dynamic(() => import("@/app/components/categories/CategoriesSelector"), { ssr: false });

const CUSTOM_MIN = 10;
const CUSTOM_MAX = 800;

function trimValue(value: string | undefined) {
  return (value ?? "").trim();
}

export default function StepCategories({ fixerId, selected, onBack, onComplete }: StepCategoriesProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [categories, setCategories] = useState<SelectedCategory[]>(selected);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleSave(list: CategoryDTO[]) {
    setCategories((prev) => {
      const prevMap = new Map(prev.map((item) => [item.id, item.customDescription ?? ""]));
      return list.map((item) => ({
        ...item,
        customDescription: prevMap.get(item.id) ?? "",
      }));
    });
    setFieldErrors({});
    setModalOpen(false);
  }

  function handleRemove(id: string) {
    setCategories((prev) => prev.filter((item) => item.id !== id));
    setFieldErrors((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function handleCustomChange(id: string, value: string) {
    setCategories((prev) =>
      prev.map((item) => (item.id === id ? { ...item, customDescription: value } : item))
    );
    setFieldErrors((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  async function handleNext() {
    if (!categories.length) {
      setError("Selecciona al menos un tipo de trabajo");
      return;
    }

    const validation: Record<string, string | null> = {};
    categories.forEach((category) => {
      const text = trimValue(category.customDescription);
      if (!text) return;
      if (text.length < CUSTOM_MIN) {
        validation[category.id] = `Minimo ${CUSTOM_MIN} caracteres`;
      } else if (text.length > CUSTOM_MAX) {
        validation[category.id] = `Maximo ${CUSTOM_MAX} caracteres`;
      }
    });

    if (Object.keys(validation).length) {
      setFieldErrors(validation);
      setError("Corrige las descripciones marcadas antes de continuar");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const ids = categories.map((category) => category.id);
      const skills = categories
        .map((category) => {
          const text = trimValue(category.customDescription);
          return text ? { categoryId: category.id, customDescription: text } : null;
        })
        .filter(
          (entry): entry is { categoryId: string; customDescription: string } => entry !== null
        );

      await updateCategoriesApi(fixerId, { categories: ids, skills });

      const stored = categories.map((category) => ({
        ...category,
        customDescription: trimValue(category.customDescription) || undefined,
      }));
      saveToStorage(STORAGE_KEYS.categories, stored);
      onComplete(stored);
    } catch (err: any) {
      setError(String(err?.message || "No se pudieron guardar las categorias"));
    } finally {
      setLoading(false);
    }
  }

  const helperNote = useMemo(
    () => (
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
        <p>
          <span className="font-semibold">Descripcion personalizada:</span> Es tu mensaje unico para este oficio. Solo
          aparece en tu perfil.
        </p>
        <p className="mt-2">
          <span className="font-semibold">Descripcion general:</span> Es la descripcion comun del catalogo. Se muestra
          cuando otro fixer no define una personalizada.
        </p>
        <p className="mt-2 text-xs text-blue-600">
          Si agregas un oficio nuevo, la descripcion general que registres sera visible para todos los fixers.
        </p>
      </div>
    ),
    []
  );

  return (
    <section className="mx-auto flex max-w-4xl flex-col gap-6">
      <header className="rounded-3xl bg-white p-8 shadow-lg">
        <div className="flex flex-col gap-2">
          <StepProgress current={3} />
          <h2 className="text-2xl font-semibold text-slate-900">Que tipos de trabajo ofreces?</h2>
          <p className="text-sm text-slate-500">
            Selecciona tus habilidades y personaliza cada oficio para destacar frente a los requesters.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          {helperNote}

          {categories.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
              Aun no has seleccionado tipos de trabajo. Usa el boton siguiente para agregar tus habilidades.
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => {
                const general = trimValue(category.description) || "Sin descripcion general registrada.";
                const personal = category.customDescription ?? "";
                const message = fieldErrors[category.id] ?? null;

                return (
                  <div key={category.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">{category.name}</h3>
                        <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Descripcion general
                        </p>
                        <p className="text-sm text-slate-600">{general}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemove(category.id)}
                        className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-red-300 hover:text-red-600"
                      >
                        Quitar
                      </button>
                    </div>

                    <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor={`custom-${category.id}`}>
                      Mi descripcion (opcional)
                    </label>
                    <textarea
                      id={`custom-${category.id}`}
                      value={personal}
                      onChange={(event) => handleCustomChange(category.id, event.target.value)}
                      maxLength={CUSTOM_MAX}
                      placeholder="Describe tu experiencia o estilo de trabajo en este oficio"
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      rows={4}
                    />
                    <div className="mt-2 text-xs">
                      {message ? (
                        <p className="text-red-600">{message}</p>
                      ) : (
                        <p className="text-slate-500">
                          Puedes dejarlo vacio para usar la descripcion general. Minimo {CUSTOM_MIN} caracteres si decides personalizar.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="w-full rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-blue-500 hover:text-blue-600"
          >
            Seleccionar tipo de trabajo
          </button>
        </div>

        {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      </header>

      <footer className="flex items-center justify-between rounded-3xl bg-white p-6 shadow-lg">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-blue-500 hover:text-blue-600"
        >
          Atras
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={loading}
          className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Guardando..." : "Siguiente"}
        </button>
      </footer>

      <CategoriesSelector
        open={modalOpen}
        selectedIds={categories.map((category) => category.id)}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </section>
  );
}
