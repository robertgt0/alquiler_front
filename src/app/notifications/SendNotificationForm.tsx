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
  const [error, setError] = useState(""); // ⚙️ Nuevo estado para errores locales (ej: límite de caracteres)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🟠 Validación de máximo 500 caracteres
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
    } catch (err: any) {
      // 🔍 Mostrar mensaje de error del backend si existe
      const errorMsg =
        err?.message?.includes("Error") && err?.message?.includes(":")
          ? err.message // Ej: "Error 400: Bad Request"
          : err?.message || "❌ Error desconocido";

      setMessage(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6 w-full max-w-md mx-auto my-6 transition-all duration-300 hover:shadow-lg">
      <h2 className="text-xl font-semibold text-blue-700 mb-4">{title}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Correo"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-2.5 rounded-lg w-full outline-none transition"
        />
        <input
          type="text"
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-2.5 rounded-lg w-full outline-none transition"
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
              className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-2.5 rounded-lg w-full min-h-[120px] resize-y outline-none transition"
              rows={5}
            />
            <p className="text-sm text-gray-500 text-right">{form.details.length}/500</p>
            {error && <p className="text-red-600 text-sm">{error}</p>}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg w-full font-medium transition"
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </form>
      {message && (
        <p
          className={`text-center mt-3 text-sm ${
            message.startsWith("✅")
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}