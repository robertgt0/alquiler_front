"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { updateCategories as updateCategoriesApi } from "@/lib/api/fixer";
import type { CategoryDTO } from "@/lib/api/categories";
import StepProgress from "../components/StepProgress";
import { STORAGE_KEYS, saveToStorage } from "../storage";
import type { SelectedCategory, StepCategoriesProps } from "./types";

const CategoriesSelector = dynamic(() => import("@/app/components/categories/CategoriesSelector"), { ssr: false });

export default function StepCategories({ fixerId, selected, onBack, onComplete }: StepCategoriesProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [categories, setCategories] = useState<SelectedCategory[]>(selected);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleSave(list: CategoryDTO[]) {
    setCategories(
      list.map((item) => ({
        ...item,
        customDescription: undefined,
      }))
    );
    setModalOpen(false);
  }

  function handleRemove(id: string) {
    setCategories((prev) => prev.filter((item) => item.id !== id));
  }

  async function handleNext() {
    if (!categories.length) {
      setError("Selecciona al menos un tipo de trabajo");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const ids = categories.map((category) => category.id);
      await updateCategoriesApi(fixerId, { categories: ids });

      const stored = categories.map((category) => ({
        ...category,
        customDescription: undefined,
      }));
      saveToStorage(STORAGE_KEYS.categories, stored);
      onComplete(stored);
    } catch (err: any) {
      setError(String(err?.message || "No se pudieron guardar las categorias"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto flex max-w-4xl flex-col gap-6">
      <header className="rounded-3xl bg-white p-8 shadow-lg">
        <div className="flex flex-col gap-2">
          <StepProgress current={3} />
          <h2 className="text-2xl font-semibold text-slate-900">Que tipos de trabajo ofreces?</h2>
          <p className="text-sm text-slate-500">
            Selecciona tus habilidades. Puedes definir descripciones personalizadas luego desde tu perfil de Fixer.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          {categories.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
              Aun no has seleccionado tipos de trabajo. Usa el boton siguiente para agregar tus habilidades.
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => {
                const general = (category.description ?? "").trim() || "Sin descripcion general registrada.";

                return (
                  <div key={category.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">{category.name}</h3>
                        <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Descripción general
                        </p>
                        <p className="text-sm text-slate-600">{general}</p>
                        <p className="mt-3 text-xs text-slate-500">
                          Si deseas añadir una descripcion personalizada para este oficio, podras hacerlo desde tu perfil una vez completes el registro.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemove(category.id)}
                        className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-red-300 hover:text-red-600"
                      >
                        Quitar
                      </button>
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
