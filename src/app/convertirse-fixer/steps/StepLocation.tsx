"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { Coords } from "@/app/components/location/SelectLocationModal";

const SelectLocationModal = dynamic(
  () => import("@/app/components/location/SelectLocationModal"),
  { ssr: false }
);
const SelectedMap = dynamic(
  () => import("@/app/components/location/SelectedMap"),
  { ssr: false }
);

type Props = {
  onNext: () => void;
  onBack: () => void;
};

type Saved = Coords & { address?: string; radiusMeters?: number };

export default function StepLocation({ onNext, onBack }: Props) {
  // estado persistente opcional
  const [selected, setSelected] = useState<Saved | null>(null);
  const [open, setOpen] = useState(false);

  const lat = selected?.lat ?? null;
  const lng = selected?.lng ?? null;

  // abrir modal “Añadir mi ubicación”
  function openModal() {
    setOpen(true);
  }

  function handleConfirm(loc: Saved) {
    setSelected(loc);
    setOpen(false);
  }

  return (
    <div>
      <h1>Establece tu ubicación</h1>
      <p>
        Esta es la zona donde estarás disponible para trabajar, puedes cambiar
        esto más adelante.
      </p>

      <div
        style={{
          border: "1px solid #E5E7EB",
          borderRadius: 12,
          padding: 16,
          marginTop: 12,
        }}
      >
        {!selected ? (
          <>
            <p style={{ marginBottom: 12, color: "#555" }}>
              No has seleccionado una ubicación.
            </p>
            <button
              onClick={openModal}
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                border: "none",
                background: "#2563eb",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Añadir mi ubicación
            </button>
          </>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>
                Ubicación elegida
              </div>
              <button
                onClick={openModal}
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: "1px solid #ddd",
                  background: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cambiar ubicación
              </button>
            </div>

            <div style={{ fontSize: 13, marginBottom: 8 }}>
              Lat: {selected.lat.toFixed(6)} &nbsp; | &nbsp; Lng:{" "}
              {selected.lng.toFixed(6)}{" "}
              {selected.radiusMeters ? (
                <>
                  &nbsp; | &nbsp; Radio:{" "}
                  <b>{Math.round(selected.radiusMeters)} m</b>
                </>
              ) : null}
            </div>

            <SelectedMap
              lat={selected.lat}
              lng={selected.lng}
              radiusMeters={selected.radiusMeters ?? 1000}
              height={260}
            />
          </>
        )}
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
        <button
          onClick={onBack}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #ddd",
            background: "#fff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Atrás
        </button>
        <button
          onClick={onNext}
          disabled={!lat || !lng}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "none",
            background: !lat || !lng ? "#9CA3AF" : "#2563eb",
            color: "#fff",
            fontWeight: 600,
            cursor: !lat || !lng ? "not-allowed" : "pointer",
          }}
        >
          Siguiente
        </button>
      </div>

      {/* Modal */}
      <SelectLocationModal
        open={open}
        initialCenter={selected ? { lat: selected.lat, lng: selected.lng } : null}
        initialRadius={selected?.radiusMeters ?? 1000}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </div>
  );
}
