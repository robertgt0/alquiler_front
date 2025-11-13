const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

/**
 * Actualiza un registro existente
 * @param collection Nombre de la colección (por ej. "ciudad", "cliente")
 * @param id ID del registro a actualizar
 * @param data Nuevos valores
 */
export async function apiUpdate(collection: string, id: string, data: any) {
  try {
    const res = await fetch(`${API_URL}/api/${collection}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error(`Error al actualizar ${collection} con ID ${id}`);
    return await res.json();
  } catch (error) {
    console.error("❌ apiUpdate error:", error);
    return null;
  }
}
