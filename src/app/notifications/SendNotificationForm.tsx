"use client";
import { useState } from "react";

interface Props {
  title: string;
  onSend: (form: { email: string; name: string; details?: string }) => Promise<any>;
  showDetails?: boolean;
}

export default function SendNotificationForm({ title, onSend, showDetails }: Props) {
  const [form, setForm] = useState({ email: "", name: "", details: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación de máximo 500 caracteres
    if (showDetails && form.details.length > 500) {
      setError("El campo Detalles no puede tener más de 500 caracteres.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      await onSend(form);
      setMessage("✅ Notificación enviada correctamente");
      setForm({ email: "", name: "", details: "" });
    } catch (err) {
      setMessage("❌ Error al enviar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-md mx-auto my-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Correo"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="border p-2 rounded w-full"
        />
        {showDetails && (
          <div>
            <textarea
              placeholder="Detalles (máx. 500 caracteres)"
              value={form.details}
              onChange={(e) => {
                if (e.target.value.length <= 500) {
                  setForm({ ...form, details: e.target.value });
                  setError("");
                } else {
                  setError("Máximo 500 caracteres permitidos.");
                }
              }}
              className="border p-2 rounded w-full min-h-[120px] resize-y"
              rows={5}
            />
            {/* Contador dinámico */}
            <p className="text-sm text-gray-500 text-right">
              {form.details.length}/500
            </p>
            {/* Mensaje de error si excede */}
            {error && <p className="text-red-600 text-sm">{error}</p>}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </form>
      {message && <p className="text-center mt-3">{message}</p>}
    </div>
  );
}
