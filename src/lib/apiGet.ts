const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

/**
 * Busca un registro por su _id (de MongoDB)
 * @param collection Nombre de la colección
 * @param id _id del documento
 */
export async function apiGet(collection: string, id: string) {
  try {
    const res = await fetch(`${API_URL}/api/${collection}/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error(`Error al obtener ${collection} con _id ${id}`);
    return await res.json();
  } catch (error) {
    console.error("❌ apiGet error:", error);
    return null;
  }
}
