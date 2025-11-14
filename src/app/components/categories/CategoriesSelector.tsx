"use client";

import { useEffect, useMemo, useState } from "react";
import { createCategory, getCategories, type CategoryDTO } from "@/lib/api/categories";

type Props = {
  open: boolean;
  selectedIds: string[];
  onClose: () => void;
  onSave: (selected: CategoryDTO[]) => void;
};

const BAD_WORDS = ["xxx", "spam", "broma"];
const NAME_MIN = 3;
const NAME_MAX = 40;
const DESC_MIN = 20;
const DESC_MAX = 800;

function validateName(value: string) {
  const name = value.trim();
  if (!name) return "El nombre es obligatorio";
  if (name.length < NAME_MIN) return `Minimo ${NAME_MIN} caracteres`;
  if (name.length > NAME_MAX) return `Maximo ${NAME_MAX} caracteres`;
  const allowed = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9\s.,-]+$/;
  if (!allowed.test(name)) return "Solo letras, numeros, espacios, punto y guion";
  if (BAD_WORDS.some((word) => name.toLowerCase().includes(word))) return "Contiene palabras no permitidas";
  return null;
}

function validateDescription(value: string) {
  const text = value.trim();
  if (!text) return "La descripcion es obligatoria";
  if (text.length < DESC_MIN) return `Minimo ${DESC_MIN} caracteres`;
  if (text.length > DESC_MAX) return `Maximo ${DESC_MAX} caracteres`;
  return null;
}

export default function CategoriesSelector({ open, selectedIds, onClose, onSave }: Props) {
  const [loading, setLoading] = useState(false);
  const [all, setAll] = useState<CategoryDTO[]>([]);
  const [picked, setPicked] = useState<string[]>(selectedIds);
  const [query, setQuery] = useState("");
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [adding, setAdding] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setPicked(selectedIds);
    setQuery("");
    setNewName("");
    setNewDescription("");
    setNameError(null);
    setDescriptionError(null);
    (async () => {
      try {
        setLoading(true);
        const list = await getCategories();
        setAll(list);
      } catch (error) {
        console.error("No se pudieron cargar categorias", error);
        alert("No se pudieron cargar las categorias");
      } finally {
        setLoading(false);
      }
    })();
  }, [open, selectedIds]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      (category) =>
        category.name.toLowerCase().includes(q) || category.description.toLowerCase().includes(q)
    );
  }, [all, query]);

  const selectedList = useMemo(
    () => all.filter((category) => picked.includes(category.id)),
    [all, picked]
  );

  function toggle(id: string) {
    setPicked((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  async function handleAdd() {
    const nameIssue = validateName(newName);
    const descriptionIssue = validateDescription(newDescription);
    setNameError(nameIssue);
    setDescriptionError(descriptionIssue);
    if (nameIssue || descriptionIssue) return;

    try {
      setAdding(true);
      const created = await createCategory(newName.trim(), newDescription.trim());
      setAll((prev) => [created, ...prev]);
      setPicked((prev) => (prev.includes(created.id) ? prev : [created.id, ...prev]));
      setNewName("");
      setNewDescription("");
      alert("Se registro el nuevo tipo de trabajo");
    } catch (error: any) {
      alert(String(error?.message || "No se pudo registrar la categoria"));
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
          width: "min(940px, 92vw)",
          maxHeight: "92vh",
          borderRadius: 12,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 10px 30px rgba(0,0,0,.25)",
        }}
      >
        <div style={{ padding: 20, borderBottom: "1px solid #e5e7eb" }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#1f2937" }}>Seleccionar tipo de trabajo</h3>
          <p style={{ margin: "6px 0 0", color: "#4b5563", fontSize: 14 }}>
            Marca uno o varios oficios del catalogo. Si falta alguno, puedes crearlo con su descripcion general.
          </p>
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nombre o descripcion"
              style={{
                flex: 1,
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #d1d5db",
                fontSize: 14,
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 12,
            padding: 16,
            overflowY: "auto",
          }}
        >
          {loading ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", color: "#4b5563", fontSize: 14 }}>Cargando...</div>
          ) : filtered.length === 0 ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", color: "#6b7280", fontSize: 14 }}>
              No hay resultados para "{query.trim()}".
            </div>
          ) : (
            filtered.map((category) => (
              <label
                key={category.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  padding: 12,
                  border: "1px solid #e5e7eb",
                  borderRadius: 10,
                  cursor: "pointer",
                  background: picked.includes(category.id) ? "#eef2ff" : "#fff",
                  transition: "border-color .2s ease",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 8, color: "#1f2937", fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={picked.includes(category.id)}
                    onChange={() => toggle(category.id)}
                  />
                  {category.name}
                </span>
                <span style={{ fontSize: 12, color: "#4b5563" }}>
                  {category.description ? category.description : "Sin descripcion general"}
                </span>
              </label>
            ))
          )}
        </div>

        <div
          style={{
            padding: 16,
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <span style={{ fontWeight: 600, color: "#1f2937" }}>Crear nuevo oficio</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <input
              value={newName}
              onChange={(event) => {
                setNewName(event.target.value);
                setNameError(null);
              }}
              placeholder="Nombre del oficio (ej: Sastre)"
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #d1d5db",
                fontSize: 14,
              }}
            />
            {nameError && <span style={{ color: "#dc2626", fontSize: 12 }}>{nameError}</span>}
            <textarea
              value={newDescription}
              onChange={(event) => {
                setNewDescription(event.target.value);
                setDescriptionError(null);
              }}
              placeholder="Descripción general que verán todos los fixers"
              rows={3}
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #d1d5db",
                fontSize: 14,
                resize: "vertical",
              }}
            />
            {descriptionError ? (
              <span style={{ color: "#dc2626", fontSize: 12 }}>{descriptionError}</span>
            ) : (
              <span style={{ color: "#6b7280", fontSize: 12 }}>
                Minimo {DESC_MIN} caracteres, maximo {DESC_MAX}. Describe el servicio de forma general para otros fixers.
              </span>
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={adding}
            style={{
              alignSelf: "flex-start",
              padding: "10px 16px",
              borderRadius: 8,
              border: "none",
              background: adding ? "#9ca3af" : "#2563eb",
              color: "#fff",
              fontWeight: 600,
              cursor: adding ? "not-allowed" : "pointer",
            }}
          >
            {adding ? "Registrando..." : "Registrar tipo de trabajo"}
          </button>
        </div>

        <div
          style={{
            padding: 16,
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
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
              padding: "10px 16px",
              borderRadius: 8,
              border: "none",
              background: "#10b981",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Guardar seleccion
          </button>
        </div>
      </div>
    </div>
  );
}
