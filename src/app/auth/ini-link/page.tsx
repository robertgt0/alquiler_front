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
  const [magicLink, setMagicLink] = React.useState<string | null>(null); // opcional QA

  const validate = () => {
    if (!isValidEmail(email)) {
      setFieldError("Formato de correo inválido");
      return false;
    }
    setFieldError(null);
    return true;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;       // evita doble click
    if (!validate()) return;

    setLoading(true);
    setBanner({ type: null, text: "" });
    setMagicLink(null);

    try {
      const r = await solicitarEnlaceAcceso(email.trim());

      if (!r.ok && r.notFoundEmail) {
        setFieldError(r.message); // mensaje exacto bajo el input
        return;
      }
      if (!r.ok) throw new Error(r.message);

      setBanner({ type: "ok", text: r.message }); // “Válido solo por 5 minutos.”
      if (r.data?.magicLink) setMagicLink(r.data.magicLink); // opcional QA
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
          Ingresa tu correo y te enviaremos un enlace para ingresar a <strong>Servineo</strong>.
          Es de <strong>un solo uso</strong> y dura <strong>5 minutos</strong>.
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
            <p className="mt-1 text-xs text-gray-500">Máx. 30 caracteres</p>
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

        {banner.type === "ok" && (
          <div className="mt-4 rounded-xl border border-green-300 bg-green-50 p-3 text-sm text-green-800 whitespace-pre-line">
            {banner.text}
          </div>
        )}
        {banner.type === "err" && (
          <div className="mt-4 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800">
            {banner.text}
          </div>
        )}

        {/* Opcional: mostrar el enlace que retorna el back para pruebas */}
        {magicLink && (
          <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm">
            <div className="font-medium mb-1">Enlace generado (QA):</div>
            <div className="break-all text-gray-800">{magicLink}</div>
          </div>
        )}
      </div>
    </div>
  );
}
