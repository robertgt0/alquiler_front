import type { Category } from "@/types/fixer";
const API = process.env.NEXT_PUBLIC_API_URL!;

export async function fetchCategories(): Promise<Category[]> {
  const r = await fetch(`${API}/api/categories`, { cache: "no-store" });
  const j = await r.json();
  if (!r.ok || !j.success) throw new Error(j.message || "No se pudo cargar categorías");
  return j.data;
}

export async function createCategory(name: string) {
  const r = await fetch(`${API}/api/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  const j = await r.json();
  if (!r.ok || !j.success) throw new Error(j.message || "No se pudo crear categoría");
  return j as { success: true; data: Category; message: string };
}
