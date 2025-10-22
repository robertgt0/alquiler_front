"use client";

export type CategoryDTO = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
};

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function getCategories(): Promise<CategoryDTO[]> {
  const r = await fetch(`${API}/api/categories`, { cache: "no-store" });
  if (!r.ok) throw new Error("No se pudo cargar categorías");
  const json = await r.json();
  return json.data || [];
}

export async function createCategory(name: string): Promise<CategoryDTO> {
  const r = await fetch(`${API}/api/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  const json = await r.json();
  if (!r.ok || json.success === false) {
    throw new Error(json.message || "No se pudo registrar la categoría");
  }
  return json.data;
}
