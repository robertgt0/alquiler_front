"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { updateLocation as updateLocationApi } from "@/lib/api/fixer";
import StepProgress from "../components/StepProgress";
import { STORAGE_KEYS, saveToStorage } from "../storage";
import type { StepLocationProps } from "./types";

const SelectLocationModal = dynamic(() => import("@/app/components/location/SelectLocationModal"), { ssr: false });
const SelectedMap = dynamic(() => import("@/app/components/location/SelectedMap"), { ssr: false });

type SavedLocation = {
  lat: number;
  lng: number;
  address?: string;
  radiusMeters?: number;
};

export default function StepLocation({ fixerId, initialLocation, onBack, onComplete }: StepLocationProps) {
  const [selected, setSelected] = useState<SavedLocation | null>(initialLocation ?? null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function openModal() {
    setModalOpen(true);
  }

  function handleConfirm(location: SavedLocation) {
    setSelected(location);
    setModalOpen(false);
  }

  async function handleNext() {
    if (!selected) {
      setError("Selecciona una ubicacion antes de continuar");
      return;
    }

    try {
      setError(null);
      setLoading(true);
      const payload = { lat: selected.lat, lng: selected.lng, address: selected.address };
      await updateLocationApi(fixerId, payload);
      saveToStorage(STORAGE_KEYS.location, payload);
      onComplete(payload);
    } catch (err: any) {
      setError(String(err?.message || "No se pudo guardar la ubicacion"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto flex max-w-4xl flex-col gap-6">
      <header className="rounded-3xl bg-white p-8 shadow-lg">
        <div className="flex flex-col gap-2">
          <StepProgress current={2} />
          <h2 className="text-2xl font-semibold text-slate-900">Establece tu ubicacion de trabajo</h2>
          <p className="text-sm text-slate-500">Selecciona la zona donde estaras disponible para trabajar. Podras modificarla mas adelante.</p>
        </div>
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          {!selected ? (
            <div className="flex flex-col items-start gap-4">
              <p className="text-sm text-slate-600">Aun no has seleccionado tu ubicacion.</p>
              <button
                type="button"
                onClick={openModal}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Añadir mi ubicacion
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Ubicacion elegida</p>
                  <p className="text-xs text-slate-500">
                    Lat: {selected.lat.toFixed(6)} · Lng: {selected.lng.toFixed(6)}
                    {selected.address ? ` · ${selected.address}` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openModal}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-500 hover:text-blue-600"
                >
                  Cambiar ubicacion
                </button>
              </div>
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <SelectedMap
                  lat={selected.lat}
                  lng={selected.lng}
                  radiusMeters={selected.radiusMeters ?? 1000}
                  height={280}
                />
              </div>
            </div>
          )}
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
          disabled={!selected || loading}
          className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Guardando..." : "Siguiente"}
        </button>
      </footer>

      <SelectLocationModal
        open={modalOpen}
        initialCenter={selected ? { lat: selected.lat, lng: selected.lng } : null}
        initialRadius={selected?.radiusMeters ?? 1000}
        onConfirm={handleConfirm}
        onCancel={() => setModalOpen(false)}
      />
    </section>
  );
}
