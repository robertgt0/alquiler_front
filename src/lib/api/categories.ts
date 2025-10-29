"use client";

export type CategoryDTO = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
};

// ✅ Define la URL base del backend dinámicamente
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") || "http://localhost:4000";

// ✅ Obtener todas las categorías
export async function getCategories(): Promise<CategoryDTO[]> {
  try {
    const res = await fetch(`${API_BASE}/api/categories`, { cache: "no-store" });
    if (!res.ok) throw new Error("No se pudo cargar categorías");
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("❌ Error al obtener categorías:", error);
    throw error;
  }
}

// ✅ Crear una nueva categoría
export async function createCategory(name: string): Promise<CategoryDTO> {
  try {
    const res = await fetch(`${API_BASE}/api/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const json = await res.json();

    if (!res.ok || json.success === false) {
      throw new Error(json.message || "No se pudo registrar la categoría");
    }

    return json.data;
  } catch (error) {
    console.error("❌ Error al crear categoría:", error);
    throw error;
  }
}
