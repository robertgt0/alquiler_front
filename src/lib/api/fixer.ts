import type { UpsertFixerDTO } from "@/types/fixer";
const API = process.env.NEXT_PUBLIC_API_URL!;

export async function createFixer(data: UpsertFixerDTO) {
  const r = await fetch(`${API}/api/fixer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error((await r.text()) || "No se pudo crear el Fixer");
  return r.json(); // { success, data: { id, ... } }
}

export async function setFixerCategories(fixerId: string, categories: string[]) {
  const r = await fetch(`${API}/api/fixer/${fixerId}/categories`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ categories }),
  });
  const j = await r.json();
  if (!r.ok || !j.success) throw new Error(j.message || "No se pudo guardar categorías");
  return j.data;
}
