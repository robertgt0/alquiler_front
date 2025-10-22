"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { CategoryDTO } from "@/lib/api/categories";

const CategoriesSelector = dynamic(
  () => import("@/app/components/categories/CategoriesSelector"),
  { ssr: false }
);

type Props = {
  onNext: () => void;
  onBack: () => void;
};

export default function StepCategories({ onNext, onBack }: Props) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);

  const selectedIds = useMemo(() => categories.map((c) => c.id), [categories]);

  function handleSave(list: CategoryDTO[]) {
    setCategories(list);
    setOpen(false);
  }

  function removeOne(id: string) {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div>
      <h1>¿Qué tipos de trabajo sabes hacer?</h1>
      <p>
        Selecciona los que apliquen a tu trabajo; podrás elegir más después.
      </p>

      <div
        style={{
          border: "1px solid #E5E7EB",
          borderRadius: 12,
          padding: 16,
          marginTop: 12,
        }}
      >
        {categories.length === 0 ? (
          <p style={{ color: "#555", marginBottom: 12 }}>
            Aún no has seleccionado tipos de trabajo.
          </p>
        ) : (
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 12,
            }}
          >
            {categories.map((c) => (
              <span
                key={c.id}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 10px",
                  borderRadius: 999,
                  background: "#EEF2FF",
                  border: "1px solid #C7D2FE",
                  fontSize: 14,
                }}
              >
                {c.name}
                <button
                  onClick={() => removeOne(c.id)}
                  title="Quitar"
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <button
          onClick={() => setOpen(true)}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #ddd",
            background: "#fff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Seleccionar tipo de trabajo
        </button>
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
          disabled={categories.length === 0}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "none",
            background: categories.length === 0 ? "#9CA3AF" : "#2563eb",
            color: "#fff",
            fontWeight: 600,
            cursor: categories.length === 0 ? "not-allowed" : "pointer",
          }}
        >
          Siguiente
        </button>
      </div>

      <CategoriesSelector
        open={open}
        selectedIds={selectedIds}
        onClose={() => setOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
