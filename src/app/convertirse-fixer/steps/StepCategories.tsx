"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { CategoryDTO } from "@/lib/api/categories";
import { updateCategories as updateCategoriesApi } from "@/lib/api/fixer";
import StepProgress from "../components/StepProgress";
import { STORAGE_KEYS, saveToStorage } from "../storage";
import type { StepCategoriesProps } from "./types";

const CategoriesSelector = dynamic(() => import("@/app/components/categories/CategoriesSelector"), { ssr: false });

export default function StepCategories({ fixerId, selected, onBack, onComplete }: StepCategoriesProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryDTO[]>(selected);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleSave(list: CategoryDTO[]) {
    setCategories(list);
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
      setError(null);
      setLoading(true);
      const ids = categories.map((category) => category.id);
      await updateCategoriesApi(fixerId, ids);
      saveToStorage(STORAGE_KEYS.categories, categories);
      onComplete(categories);
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
          <h2 className="text-2xl font-semibold text-slate-900">¿Que tipos de trabajos sabes hacer?</h2>
          <p className="text-sm text-slate-500">Selecciona los servicios que ofreces. Podras agregar mas categorias despues.</p>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          {categories.length === 0 ? (
            <p className="text-sm text-slate-500">Aun no has seleccionado tipos de trabajo.</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <span key={category.id} className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                  {category.name}
                  <button
                    type="button"
                    onClick={() => handleRemove(category.id)}
                    className="rounded-full bg-white px-2 text-xs font-semibold text-blue-500 shadow hover:text-blue-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="mt-4 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-blue-500 hover:text-blue-600"
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
          Atrás
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
