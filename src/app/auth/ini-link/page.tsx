"use client";
import React from "react";
import { solicitarEnlaceAcceso } from "../../teamsys/services/UserService"; // ajusta si tu ruta real es distinta
import { useRouter } from "next/navigation";  

const isValidEmail = (v: string) => {
  const s = v.trim();
  if (!s) return false;
  if (s.length > 30) return false; // HU: ≤ 30
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
};

export default function IniLinkPage() {
  const router = useRouter();
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
    <div className="flex min-h-screen items-center justify-center bg-[#4F6BFF] px-4">
      <div className="w-full max-w-md rounded-4xl bg-white p-5 shadow">
        <h1 className="mb-2 text-center text-2xl font-semibold text-blue-600">Inicio de session sin contraseña</h1>
        <p className="mb-6 text-center text-sm text-gray-600">
          Ingresa tu correo electrónico registrado 
        </p>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700"></label>
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

          {/* Botones al estilo mock: Cancelar / Aceptar */}
<div className="mt-6 flex justify-end gap-4">
  <button
    type="button"
    onClick={() => router.push("/login")} // 👈 ruta de tu login
    className="
    rounded-full
    px-6 py-2
    text-sm font-semibold
    bg-blue-600
    text-white
    hover:bg-blue-700
    "
  >
    Cancelar
  </button>

  <button
    type="submit"
    disabled={loading}
    className="
      rounded-full
      bg-blue-600
      px-6 py-2
      text-sm font-semibold
      text-white
      shadow
      hover:bg-blue-700
      disabled:opacity-60
    "
  >
    {loading ? "Enviando…" : "Aceptar"}
  </button>
</div>
        </form>

        {banner.type === "err" && (
          <div className="mt-4 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800">
            {banner.text}
          </div>
        )}
      </div>

{/* Modal emergente de éxito – estilo “pastilla” */}
{showModal && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
    onClick={closeOrHide}
  >
    <div
      className="relative"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Pastilla completa (incluye icono adentro) */}
      <div
        className="
          max-w-[300px]
          rounded-full
          border-4 border-gray-400
          bg-white
          px-6 py-1 
          shadow-md
          text-center
          flex flex-col items-center
          gap-3
        "
      >

        {/* ICONO VERDE ADENTRO — igual a tu imagen */}
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500">
          <span className="text-white text-xl font-bold">✓</span>
        </div>

        {/* TEXTO */}
        <p className="text-sm font-medium text-gray-800">
          Te enviamos un link de acceso a tu correo electrónico.
        </p>
        <p className="text-xs text-gray-600 font-semibold">
          Válido solo por 5 minutos.
        </p>

        {/* BOTÓN CERRAR */}
        <button
          onClick={closeOrHide}
          className="mt-1 text-xs font-semibold text-violet-600 hover:underline"
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
