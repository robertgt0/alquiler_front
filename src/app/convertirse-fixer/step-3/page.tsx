"use client";
import { useState } from "react";
import CategoriesSelector from "@/app/components/categories/CategoriesSelector";
import AddCategoryForm from "@/app/components/categories/AddCategoryForm";
import { setFixerCategories } from "@/lib/api/fixer";
import { useRouter } from "next/navigation";

export default function Step3Categories() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [saving, setSaving] = useState(false);

  const refresh = () => setRefreshKey(k => k + 1);

  async function handleNext() {
    const FIXER_ID = localStorage.getItem("FIXER_ID") || "";
    if (!FIXER_ID) { alert("Falta el FixerId. Primero completa el Paso 2."); return; }
    if (!selected.length) { alert("Selecciona al menos un tipo de trabajo"); return; }

    try {
      setSaving(true);
      await setFixerCategories(FIXER_ID, selected);
      alert("Categorías guardadas ✅");
      // TODO: cambia a la ruta real del siguiente paso
      // router.push("/convertirse-fixer/step-4");
    } catch (e: any) {
      alert(e?.message || "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-sm">3/5</div>
      <div className="w-full bg-gray-200 h-1 rounded">
        <div className="bg-blue-600 h-1 rounded" style={{ width: "60%" }} />
      </div>

      <h1 className="text-2xl font-bold">¿Qué tipos de trabajos sabes hacer?</h1>
      <p className="text-gray-600">Selecciona uno o más; si no lo encuentras, agrégalo y vuelve a marcarlo.</p>

      <CategoriesSelector value={selected} onChange={setSelected} refreshKey={refreshKey} />

      <div className="pt-2">
        <p className="text-sm font-medium mb-2">¿No encuentras tu tipo de trabajo?</p>
        <AddCategoryForm onCreated={refresh} />
      </div>

      <div className="flex justify-between pt-4">
        <button className="px-4 py-2 rounded border" onClick={() => router.push("/convertirse-fixer/step-2")}>
          Atrás
        </button>
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
          disabled={saving}
          onClick={handleNext}
        >
          {saving ? "Guardando..." : "Siguiente"}
        </button>
      </div>
    </div>
  );
}
