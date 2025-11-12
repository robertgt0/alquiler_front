"use client";

import { useEffect, useMemo, useState } from "react";
import { CategoryDTO, createCategory, getCategories } from "@/lib/api/categories";

type Props = {
  open: boolean;
  selectedIds: string[];
  onClose: () => void;
  onSave: (selected: CategoryDTO[]) => void;
};

const BAD_WORDS = ["xxx", "spam", "broma"]; // ajusta si quieres

function validateName(v: string) {
  const name = v.trim();
  if (!name) return "El campo es obligatorio";
  if (name.length < 3) return "Mínimo 3 caracteres";
  if (name.length > 40) return "Máximo 40 caracteres";
  if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]+$/.test(name)) return "Solo letras y espacios";
  if (BAD_WORDS.some((w) => name.toLowerCase().includes(w))) return "Contiene palabras inválidas";
  return null;
}

export default function CategoriesSelector({
  open,
  selectedIds,
  onClose,
  onSave,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [all, setAll] = useState<CategoryDTO[]>([]);
  const [picked, setPicked] = useState<string[]>(selectedIds);
  const [query, setQuery] = useState("");
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!open) return;
    setPicked(selectedIds);
    setQuery("");
    setNewName("");
    (async () => {
      try {
        setLoading(true);
        const list = await getCategories();
        setAll(list);
      } catch (e) {
        alert("No se pudo cargar categorías");
      } finally {
        setLoading(false);
      }
    })();
  }, [open, selectedIds]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((c) => c.name.toLowerCase().includes(q));
  }, [all, query]);

  const selectedList = useMemo(
    () => all.filter((c) => picked.includes(c.id)),
    [all, picked]
  );

  function toggle(id: string) {
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  }

  async function handleAdd() {
    const err = validateName(newName);
    if (err) return alert(err);
    try {
      setAdding(true);
      const created = await createCategory(newName.trim());
      // Si se creó con éxito, agregar a la lista y marcarlo seleccionado
      setAll((prev) => [created, ...prev]);
      setPicked((p) => (p.includes(created.id) ? p : [created.id, ...p]));
      setNewName("");
      alert("Su tipo de trabajo fue registrado con éxito");
    } catch (e: any) {
      // Mensaje del backend (p.ej. "El tipo de trabajo ya existe")
      alert(String(e.message || "No se pudo registrar"));
    } finally {
      setAdding(false);
    }
  }

  function saveAndClose() {
    onSave(selectedList);
  }

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          width: "min(900px, 92vw)",
          maxHeight: "90vh",
          borderRadius: 12,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 10px 30px rgba(0,0,0,.25)",
        }}
      >
        {/* Header */}
        <div style={{ padding: 16, borderBottom: "1px solid #eee" }}>
          <h3 style={{ margin: 0 }}>Seleccionar tipo de trabajo</h3>
          <p style={{ margin: "6px 0 0", color: "#555" }}>
            Marca uno o varios de la lista. Si no existe, agrégalo aquí mismo.
          </p>

          {/* Buscador */}
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <input
              placeholder="Buscar..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                flex: 1,
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #ddd",
              }}
            />
          </div>
        </div>

        {/* Lista */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            padding: 16,
            overflow: "auto",
            minHeight: 260,
          }}
        >
          {loading ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center" }}>
              Cargando…
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ gridColumn: "1 / -1", color: "#666" }}>
              No hay resultados para “{query}”.
            </div>
          ) : (
            filtered.map((c) => (
              <label
                key={c.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: 8,
                  border: "1px solid #eee",
                  borderRadius: 10,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={picked.includes(c.id)}
                  onChange={() => toggle(c.id)}
                />
                {c.name}
              </label>
            ))
          )}
        </div>

        {/* Agregar nueva */}
        <div
          style={{
            padding: 16,
            borderTop: "1px solid #eee",
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontWeight: 600 }}>¿No está en la lista?</span>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Escribe un nuevo tipo de trabajo…"
            style={{
              flex: 1,
              minWidth: 220,
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #ddd",
            }}
          />
          <button
            onClick={handleAdd}
            disabled={adding}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "none",
              background: adding ? "#9CA3AF" : "#059669",
              color: "#fff",
              fontWeight: 600,
              cursor: adding ? "not-allowed" : "pointer",
            }}
          >
            Registrar tipo de trabajo
          </button>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: 16,
            borderTop: "1px solid #eee",
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #ddd",
              background: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
          <button
            onClick={saveAndClose}
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
            Guardar selección
          </button>
        </div>
      </div>
    </div>
  );
}
