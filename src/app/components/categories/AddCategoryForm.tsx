"use client";
import { useState } from "react";
import { createCategory } from "@/lib/api/categories";

export default function AddCategoryForm({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setError(null);

    try {
      setLoading(true);

      const res = await createCategory(name);
      // 👇 No cambiamos el tipo del retorno. Solo leemos 'message' si existe.
      const msgFromApi = (res as any)?.message as string | undefined;

      setMsg(msgFromApi ?? "Su tipo de trabajo fue registrado con éxito");
      setName("");
      onCreated(); // recargar listado
    } catch (err: any) {
      setError(err?.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <div className="flex gap-2">
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Ingresa tu tipo de trabajo"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Registrando..." : "Registrar"}
        </button>
      </div>
      {msg && <p className="text-green-700 text-sm">{msg}</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </form>
  );
}
