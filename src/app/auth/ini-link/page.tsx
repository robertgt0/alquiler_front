"use client";
import React from "react";
import { solicitarEnlaceAcceso } from "../../teamsys/services/UserService"; // ajusta si tu ruta real es distinta

const isValidEmail = (v: string) => {
  const s = v.trim();
  if (!s) return false;
  if (s.length > 30) return false; // HU: ≤ 30
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
};

export default function IniLinkPage() {
  const [email, setEmail] = React.useState("");
  const [fieldError, setFieldError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [banner, setBanner] = React.useState<{ type: "ok" | "err" | null; text: string }>({ type: null, text: "" });
  const [showModal, setShowModal] = React.useState(false);

  const validate = () => {
    if (!isValidEmail(email)) {
      setFieldError("Formato de correo inválido");
      return false;
    }
    setFieldError(null);
    return true;
  };

  const closeOrHide = () => {
    try {
      // intenta cerrar la ventana si fue abierta por window.open
      window.close();
    } catch {
      // no hace nada si falla
    }
    // fallback: limpiar y ocultar modal
    setShowModal(false);
    setEmail("");
    setFieldError(null);
    setBanner({ type: null, text: "" });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // evita doble click
    if (!validate()) return;

    setLoading(true);
    setBanner({ type: null, text: "" });
    setShowModal(false);

    try {
      const r = await solicitarEnlaceAcceso(email.trim());

      if (!r.ok && r.notFoundEmail) {
        setFieldError(r.message); // mensaje exacto bajo el input
        return;
      }
      if (!r.ok) throw new Error(r.message);

      // mostrar modal de éxito (sin enseñar el link)
      setBanner({ type: "ok", text: r.message });
      setShowModal(true);

      // auto-cerrar modal / pestaña después de 3.5s (intento)
      setTimeout(() => {
        // primero intenta cerrar la pestaña (funciona si fue abierta con window.open)
        try {
          window.close();
        } catch {
          // si no se puede, simplemente ocultamos el modal y limpiamos
          setShowModal(false);
          setEmail("");
        }
      }, 3500);
    } catch (err: any) {
      setBanner({ type: "err", text: err?.message || "Error inesperado" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow">
        <h1 className="mb-2 text-center text-2xl font-semibold text-gray-800">Acceso rápido por enlace</h1>
        <p className="mb-6 text-center text-sm text-gray-600">
          Ingresa tu correo y te enviaremos un enlace para ingresar a servineo
        </p>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
            <input
              id="email"
              type="email"
              maxLength={30}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-800 placeholder-gray-400 focus:border-blue-600 focus:ring focus:ring-blue-200"
              placeholder="tucorreo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={validate}
              aria-invalid={!!fieldError}
              aria-describedby={fieldError ? "email-error" : undefined}
              required
            />
            <p className="mt-1 text-xs text-gray-500"></p>
            {fieldError && <p id="email-error" className="mt-1 text-xs text-red-600">{fieldError}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 px-4 py-2 font-medium text-white shadow hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Enviando…" : "Enviar enlace de acceso"}
          </button>
        </form>

        {banner.type === "err" && (
          <div className="mt-4 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800">
            {banner.text}
          </div>
        )}
      </div>

      {/* Modal emergente de éxito */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-green-700 mb-2">¡Listo!</h3>
            <p className="text-sm text-gray-700 mb-4">{banner.text}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={closeOrHide}
                className="rounded px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
