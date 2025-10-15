"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { LocationDTO } from "@/types/fixer";
import { createFixer } from "@/lib/api/fixer";
import { LocationField } from "@/app/components/location/LocationField";

export default function Step2Location() {
  const router = useRouter();
  const [location, setLocation] = useState<LocationDTO | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleNext() {
    if (!location) { alert("Selecciona tu ubicación"); return; }

    try {
      setLoading(true);

      // 1) Guardar fixer en backend (HU02)
      const res = await createFixer({ userId: "dummy-user-123", location });
      const fixerId = res?.data?.id || res?.id;
      if (fixerId) localStorage.setItem("FIXER_ID", fixerId);

      // 2) Navegar al paso 3 (HU03)
      router.push("/convertirse-fixer/step-3");
    } catch (err: any) {
      alert(err?.message || "No se pudo guardar la ubicación");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-sm">2/5</div>
      <div className="w-full bg-gray-200 h-1 rounded">
        <div className="bg-blue-600 h-1 rounded" style={{ width: "40%" }} />
      </div>

      <h1 className="text-2xl font-bold">Configura tu ubicación de trabajo</h1>
      <p className="text-gray-600">Podrás cambiarla más adelante.</p>

      <LocationField value={location} onChange={setLocation} />

      <div className="flex justify-end pt-4 gap-2">
        <button type="button" className="px-4 py-2 rounded border" onClick={() => history.back()}>
          Atrás
        </button>
        <button
          type="button"                           // ⛔ evita submit/recarga
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
          disabled={loading}
          onClick={handleNext}                    // ✅ navega al terminar
        >
          {loading ? "Guardando..." : "Siguiente"}
        </button>
      </div>
    </div>
  );
}
