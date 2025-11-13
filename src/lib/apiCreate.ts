const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

/**
 * Crea un nuevo registro en la colección especificada
 * @param collection Nombre de la colección (por ej. "ciudad", "servicio", "cliente")
 * @param data Objeto con los datos a guardar
 */
export async function apiCreate(collection: string, data: any) {
  try {
    const res = await fetch(`${API_URL}/api/${collection}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error(`Error al crear registro en ${collection}`);
    return await res.json();
  } catch (error) {
    console.error("❌ apiCreate error:", error);
    return null;
  }
}
