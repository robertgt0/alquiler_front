"use client";

import { useState } from "react";
import { createCategory } from "@/lib/api/categories";

type Props = {
  onCreated: () => void;
};

export default function AddCategoryForm({ onCreated }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      setError("El nombre es obligatorio");
      return;
    }
    if (trimmedName.length < 3) {
      setError("Minimo 3 caracteres para el nombre");
      return;
    }
    if (!trimmedDescription) {
      setError("La descripcion es obligatoria");
      return;
    }
    if (trimmedDescription.length < 20) {
      setError("Minimo 20 caracteres para la descripcion");
      return;
    }

    try {
      setLoading(true);
      const response = await createCategory(trimmedName, trimmedDescription);
      const apiMessage = (response as any)?.message as string | undefined;
      setMessage(apiMessage ?? "Se registro el tipo de trabajo con exito");
      setName("");
      setDescription("");
      onCreated();
    } catch (err: any) {
      setError(err?.message || "No se pudo registrar el tipo de trabajo");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
        placeholder="Nombre del tipo de trabajo"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <textarea
        className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
        placeholder="Descripción general para este tipo de trabajo"
        rows={3}
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      <button
        className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Registrando..." : "Registrar"}
      </button>
      {message && <p className="text-sm text-green-700">{message}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
