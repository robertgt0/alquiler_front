"use client";

import { useEffect, useMemo, useState } from "react";
import { CategoryDTO, createCategory, getCategories } from "@/lib/api/categories";
import CustomDescriptionTextarea from "./CustomDescriptionTextarea";

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
  const [newGeneralDescription, setNewGeneralDescription] = useState("");
  const [adding, setAdding] = useState(false);
  
  const [customDescriptions, setCustomDescriptions] = useState<Record<string, string>>({});
  const [editingDescriptionFor, setEditingDescriptionFor] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setPicked(selectedIds);
    setQuery("");
    setNewName("");
    setNewGeneralDescription("");
    setCustomDescriptions({});
    setEditingDescriptionFor(null);
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
      setPicked((p) => [...p, id]);
      setEditingDescriptionFor(id);
    }
  }

  async function handleAdd() {
    const err = validateName(newName);
    if (err) return alert(err);
    
    const generalDesc = newGeneralDescription.trim();
    if (generalDesc && generalDesc.length > 500) {
      return alert("La descripción general no puede exceder 500 caracteres");
    }
    
    try {
      setAdding(true);
      const created = await createCategory(newName.trim());
      setAll((prev) => [created, ...prev]);
      setPicked((p) => (p.includes(created.id) ? p : [created.id, ...p]));
      
      setNewName("");
      setNewGeneralDescription("");
      alert("Su tipo de trabajo fue registrado con éxito");
      
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
        background: "rgba(0,0,0,.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          background: "#fff",
          width: "min(900px, 92vw)",
          maxHeight: "90vh",
          borderRadius: 16,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 50px rgba(0,0,0,.3)",
        }}
      >
        {/* Header */}
        <div style={{ padding: 20, borderBottom: "2px solid #e5e7eb", background: "linear-gradient(to bottom, #ffffff, #f9fafb)" }}>
          <h3 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "#111827" }}>
            Seleccionar tipo de trabajo
          </h3>
          <p style={{ margin: "8px 0 0", color: "#6b7280", fontSize: "0.95rem" }}>
            Marca uno o varios de la lista. Puedes agregar una descripción personalizada para cada trabajo.
          </p>

          {/* Buscador mejorado */}
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <div style={{ position: "relative", flex: 1 }}>
              <svg
                style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 20, height: 20, color: "#9ca3af" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                placeholder="Buscar trabajos..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 12px 12px 44px",
                  borderRadius: 10,
                  border: "2px solid #e5e7eb",
                  fontSize: "0.95rem",
                  transition: "all 0.2s",
                  outline: "none",
                }}
                onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>
          </div>
        </div>

        {/* Lista mejorada */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            padding: 20,
            overflow: "auto",
            minHeight: 260,
            background: "#f9fafb",
          }}
        >
          {loading ? (
            <div style={{ textAlign: "center", padding: 40, color: "#6b7280" }}>
              <div style={{ display: "inline-block", width: 40, height: 40, border: "4px solid #e5e7eb", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
              <p style={{ marginTop: 16 }}>Cargando trabajos...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "#6b7280" }}>
              <svg style={{ width: 64, height: 64, margin: "0 auto", color: "#d1d5db" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p style={{ marginTop: 16, fontSize: "1.1rem", fontWeight: 600 }}>No hay resultados</p>
              <p style={{ marginTop: 4 }}>No se encontraron trabajos para "{query}"</p>
            </div>
          ) : (
            filtered.map((c) => (
              <div
                key={c.id}
                style={{
                  border: picked.includes(c.id) ? "2px solid #3b82f6" : "2px solid #e5e7eb",
                  borderRadius: 12,
                  padding: 16,
                  background: picked.includes(c.id) ? "#eff6ff" : "#fff",
                  transition: "all 0.2s",
                  boxShadow: picked.includes(c.id) ? "0 4px 12px rgba(59, 130, 246, 0.15)" : "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={picked.includes(c.id)}
                    onChange={() => toggle(c.id)}
                    style={{
                      width: 20,
                      height: 20,
                      cursor: "pointer",
                      accentColor: "#3b82f6",
                    }}
                  />
                  <span style={{ fontWeight: 600, fontSize: "1rem", color: "#111827" }}>{c.name}</span>
                </label>

                {c.description && (
                  <p style={{ margin: "8px 0 0 32px", fontSize: "0.875rem", color: "#6b7280", lineHeight: 1.5 }}>
                    📋 {c.description}
                  </p>
                )}

                {/* Campo de descripción personalizada - Mejorado por Daniel */}
                {picked.includes(c.id) && (
                  <div style={{ marginTop: 16, marginLeft: 32 }}>
                    {editingDescriptionFor === c.id ? (
                      <div>
                        <CustomDescriptionTextarea
                          value={customDescriptions[c.id] || ""}
                          onChange={(value) => {
                            setCustomDescriptions((prev) => ({
                              ...prev,
                              [c.id]: value,
                            }));
                          }}
                          placeholder={`Describe tu experiencia en ${c.name}. Ejemplo: "Especializado en instalaciones eléctricas industriales con 10 años de experiencia..."`}
                        />
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                          <button
                            onClick={() => setEditingDescriptionFor(null)}
                            style={{
                              fontSize: "0.875rem",
                              padding: "8px 16px",
                              borderRadius: 8,
                              border: "2px solid #e5e7eb",
                              background: "#fff",
                              color: "#374151",
                              cursor: "pointer",
                              fontWeight: 600,
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = "#3b82f6";
                              e.currentTarget.style.color = "#3b82f6";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = "#e5e7eb";
                              e.currentTarget.style.color = "#374151";
                            }}
                          >
                            Cerrar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditingDescriptionFor(c.id)}
                          style={{
                            fontSize: "0.875rem",
                            color: "#3b82f6",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            textDecoration: "underline",
                            padding: 0,
                            fontWeight: 600,
                          }}
                        >
                          {customDescriptions[c.id] 
                            ? "✏️ Editar descripción personalizada" 
                            : "➕ Agregar descripción personalizada"}
                        </button>
                        
                        {customDescriptions[c.id] && (
                          <div style={{ 
                            marginTop: 12, 
                            padding: 12,
                            borderRadius: 8,
                            background: "#f0fdf4",
                            border: "1px solid #86efac",
                          }}>
                            <p style={{ 
                              fontSize: "0.875rem", 
                              color: "#166534",
                              fontStyle: "italic",
                              lineHeight: 1.5,
                            }}>
                              ✅ "{customDescriptions[c.id]}"
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Agregar nueva - Mejorado */}
        <div
          style={{
            padding: 20,
            borderTop: "2px solid #e5e7eb",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            background: "#fff",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontWeight: 700, fontSize: "1rem", color: "#111827" }}>¿No está en la lista?</span>
            <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>Agrégalo aquí:</span>
          </div>
          
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nombre del trabajo (ej: Sastre, Plomero, etc.)"
            style={{
              padding: "12px 16px",
              borderRadius: 10,
              border: "2px solid #e5e7eb",
              fontSize: "0.95rem",
              transition: "all 0.2s",
              outline: "none",
            }}
            onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
            onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
          />
          
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
              padding: "12px 16px",
              borderRadius: 10,
              border: "2px solid #e5e7eb",
              resize: "vertical",
              fontSize: "0.95rem",
              transition: "all 0.2s",
              outline: "none",
            }}
            onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
            onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
          />
          <span style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: -8 }}>
            {newGeneralDescription.length}/500 caracteres
          </span>
          
          <button
            onClick={handleAdd}
            disabled={adding}
            style={{
              padding: "12px 20px",
              borderRadius: 10,
              border: "none",
              background: adding ? "#9ca3af" : "#059669",
              color: "#fff",
              fontWeight: 700,
              cursor: adding ? "not-allowed" : "pointer",
              fontSize: "0.95rem",
              transition: "all 0.2s",
              boxShadow: adding ? "none" : "0 2px 8px rgba(5, 150, 105, 0.3)",
            }}
            onMouseEnter={(e) => {
              if (!adding) e.currentTarget.style.background = "#047857";
            }}
            onMouseLeave={(e) => {
              if (!adding) e.currentTarget.style.background = "#059669";
            }}
          >
            {adding ? "Registrando..." : "✨ Registrar tipo de trabajo"}
          </button>
        </div>

        {/* Footer mejorado */}
        <div
          style={{
            padding: 20,
            borderTop: "2px solid #e5e7eb",
            display: "flex",
            gap: 12,
            justifyContent: "flex-end",
            background: "linear-gradient(to top, #ffffff, #f9fafb)",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "12px 24px",
              borderRadius: 10,
              border: "2px solid #e5e7eb",
              background: "#fff",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "0.95rem",
              color: "#374151",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#d1d5db";
              e.currentTarget.style.background = "#f9fafb";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e5e7eb";
              e.currentTarget.style.background = "#fff";
            }}
          >
            Cancelar
          </button>
          <button
            onClick={saveAndClose}
            style={{
              padding: "12px 24px",
              borderRadius: 10,
              border: "none",
              background: "#2563eb",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "0.95rem",
              transition: "all 0.2s",
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#1d4ed8";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#2563eb";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            💾 Guardar selección ({picked.length})
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}