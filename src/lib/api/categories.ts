"use client";

export type CategoryDTO = {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") || "http://localhost:4000";

export async function getCategories(): Promise<CategoryDTO[]> {
  try {
    const res = await fetch(`${API_BASE}/api/categories`, { cache: "no-store" });
    if (!res.ok) throw new Error("No se pudieron obtener categorias");
    const json = await res.json();
    return (json.data as CategoryDTO[]) || [];
  } catch (error) {
    console.error("Error al obtener categorias", error);
    throw error;
  }
}

export async function createCategory(name: string, description: string): Promise<CategoryDTO> {
  try {
    const res = await fetch(`${API_BASE}/api/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });
    const json = await res.json();

    if (!res.ok || json.success === false) {
      throw new Error(json.message || "No se pudo registrar la categoria");
    }

    return json.data as CategoryDTO;
  } catch (error) {
    console.error("Error al crear categoria", error);
    throw error;
  }
}
