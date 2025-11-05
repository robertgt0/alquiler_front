"use client";

import { useEffect, useMemo, useState } from "react";
import { CategoryDTO, createCategory, getCategories } from "@/lib/api/categories";

type CategoryWithCustomDescription = CategoryDTO & {
  customDescription?: string;
};

type Props = {
  open: boolean;
  selectedIds: string[];
  onClose: () => void;
  onSave: (selected: CategoryWithCustomDescription[]) => void;
};

const BAD_WORDS = ["xxx", "spam", "broma"];

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
  const [newGeneralDescription, setNewGeneralDescription] = useState(""); // ⬇️ NUEVO
  const [adding, setAdding] = useState(false);
  
  // ⬇️ NUEVO: Estado para descripciones personalizadas por categoría
  const [customDescriptions, setCustomDescriptions] = useState<Record<string, string>>({});
  const [editingDescriptionFor, setEditingDescriptionFor] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setPicked(selectedIds);
    setQuery("");
    setNewName("");
    setNewGeneralDescription(""); // ⬇️ NUEVO
    setCustomDescriptions({}); // ⬇️ NUEVO: Reset descripciones personalizadas
    setEditingDescriptionFor(null); // ⬇️ NUEVO
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

  const selectedList = useMemo(() => {
    return all
      .filter((c) => picked.includes(c.id))
      .map((c) => ({
        ...c,
        customDescription: customDescriptions[c.id] || undefined,
      }));
  }, [all, picked, customDescriptions]);

  function toggle(id: string) {
    const isCurrentlySelected = picked.includes(id);
    
    if (isCurrentlySelected) {
      // Deseleccionar
      setPicked((p) => p.filter((x) => x !== id));
      setCustomDescriptions((prev) => {
        const newDesc = { ...prev };
        delete newDesc[id];
        return newDesc;
      });
      if (editingDescriptionFor === id) {
        setEditingDescriptionFor(null);
      }
    } else {
      // Seleccionar
      setPicked((p) => [...p, id]);
      // Mostrar campo de descripción personalizada
      setEditingDescriptionFor(id);
    }
  }

  async function handleAdd() {
    const err = validateName(newName);
    if (err) return alert(err);
    
    // ⬇️ NUEVO: Validar descripción general (opcional pero recomendada)
    const generalDesc = newGeneralDescription.trim();
    if (generalDesc && generalDesc.length > 500) {
      return alert("La descripción general no puede exceder 500 caracteres");
    }
    
    try {
      setAdding(true);
      const created = await createCategory(newName.trim());
      setAll((prev) => [created, ...prev]);
      setPicked((p) => (p.includes(created.id) ? p : [created.id, ...p]));
      
      // ⬇️ NUEVO: Si agregó descripción general, guardarla
      if (generalDesc) {
        // Aquí deberías actualizar la descripción general en el backend si tu API lo permite
        // Por ahora, solo mostramos el campo para UX
      }
      
      setNewName("");
      setNewGeneralDescription(""); // ⬇️ NUEVO
      alert("Su tipo de trabajo fue registrado con éxito");
      
      // ⬇️ NUEVO: Abrir campo de descripción personalizada para la categoría recién creada
      setEditingDescriptionFor(created.id);
    } catch (e: any) {
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
            Marca uno o varios de la lista. Puedes agregar una descripción personalizada para cada trabajo.
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
            display: "flex",
            flexDirection: "column",
            gap: 12,
            padding: 16,
            overflow: "auto",
            minHeight: 260,
          }}
        >
          {loading ? (
            <div style={{ textAlign: "center" }}>Cargando…</div>
          ) : filtered.length === 0 ? (
            <div style={{ color: "#666" }}>
              No hay resultados para "{query}".
            </div>
          ) : (
            filtered.map((c) => (
              <div
                key={c.id}
                style={{
                  border: "1px solid #eee",
                  borderRadius: 10,
                  padding: 12,
                  background: picked.includes(c.id) ? "#f0f9ff" : "#fff",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={picked.includes(c.id)}
                    onChange={() => toggle(c.id)}
                  />
                  <span style={{ fontWeight: 600 }}>{c.name}</span>
                </label>

                {/* ⬇️ NUEVO: Mostrar descripción general si existe */}
                {c.description && (
                  <p style={{ margin: "8px 0 0 30px", fontSize: "0.875rem", color: "#666" }}>
                    {c.description}
                  </p>
                )}

                {/* ⬇️ NUEVO: Campo de descripción personalizada */}
                {picked.includes(c.id) && (
                  <div style={{ marginTop: 12, marginLeft: 30 }}>
                    {editingDescriptionFor === c.id ? (
                      <div>
                        <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: 4, color: "#374151" }}>
                          Descripción personalizada (opcional):
                        </label>
                        <textarea
                          value={customDescriptions[c.id] || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 500) {
                              setCustomDescriptions((prev) => ({
                                ...prev,
                                [c.id]: value,
                              }));
                            }
                          }}
                          placeholder={`Ej: "Especializado en instalaciones eléctricas industriales con 10 años de experiencia..."`}
                          rows={3}
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            borderRadius: 8,
                            border: "1px solid #ddd",
                            fontSize: "0.875rem",
                            resize: "vertical",
                          }}
                        />
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                          <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                            {customDescriptions[c.id]?.length || 0}/500 caracteres
                          </span>
                          <button
                            onClick={() => setEditingDescriptionFor(null)}
                            style={{
                              fontSize: "0.75rem",
                              color: "#2563eb",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              textDecoration: "underline",
                            }}
                          >
                            Cerrar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingDescriptionFor(c.id)}
                        style={{
                          fontSize: "0.875rem",
                          color: "#2563eb",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          textDecoration: "underline",
                          padding: 0,
                        }}
                      >
                        {customDescriptions[c.id] 
                          ? "✏️ Editar descripción personalizada" 
                          : "+ Agregar descripción personalizada"}
                      </button>
                    )}
                    
                    {customDescriptions[c.id] && editingDescriptionFor !== c.id && (
                      <p style={{ 
                        marginTop: 8, 
                        fontSize: "0.875rem", 
                        color: "#059669",
                        fontStyle: "italic" 
                      }}>
                        "{customDescriptions[c.id]}"
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Agregar nueva */}
        <div
          style={{
            padding: 16,
            borderTop: "1px solid #eee",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <span style={{ fontWeight: 600 }}>¿No está en la lista? Agrégalo aquí:</span>
          
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nombre del trabajo (ej: Sastre, Plomero, etc.)"
            style={{
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #ddd",
            }}
          />
          
          {/* ⬇️ NUEVO: Campo de descripción general para trabajos nuevos */}
          <textarea
            value={newGeneralDescription}
            onChange={(e) => {
              if (e.target.value.length <= 500) {
                setNewGeneralDescription(e.target.value);
              }
            }}
            placeholder="Descripción general del trabajo (visible para todos los usuarios)"
            rows={2}
            style={{
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #ddd",
              resize: "vertical",
            }}
          />
          <span style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: -8 }}>
            {newGeneralDescription.length}/500 caracteres
          </span>
          
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
            {adding ? "Registrando..." : "Registrar tipo de trabajo"}
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
            Guardar selección ({picked.length})
          </button>
        </div>
      </div>
    </div>
  );
}