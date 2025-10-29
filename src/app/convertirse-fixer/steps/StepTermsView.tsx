"use client";

import { useState } from "react";
import { acceptTerms } from "@/lib/api/fixer";
import StepProgress from "../components/StepProgress";
import type { StepTermsProps } from "./types";

const METHOD_LABEL: Record<string, string> = {
  card: "Tarjeta",
  qr: "Codigo QR",
  cash: "Efectivo",
};

export default function StepTermsView({ fixerId, summary, onBack, onFinish }: StepTermsProps) {
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAccept() {
    if (!checked) {
      setError("Debes aceptar los terminos para continuar");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await acceptTerms(fixerId);
      onFinish();
    } catch (err: any) {
      setError(String(err?.message || "No se pudo registrar la aceptacion"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-6">
      <header className="rounded-3xl bg-white p-8 shadow-lg">
        <StepProgress current={5} />
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Terminos y condiciones</h2>
        <p className="mt-2 text-sm text-slate-500">Antes de finalizar, revisa el resumen de tu registro y acepta los terminos para comenzar a ofrecer tus servicios.</p>

        <div className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">Documento</p>
            <p className="text-lg font-semibold text-slate-800">C.I. {summary.ci}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">Categorias seleccionadas</p>
            {summary.categories.length ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {summary.categories.map((category) => (
                  <span key={category.id} className="rounded-full bg-blue-600/10 px-3 py-1 text-sm font-medium text-blue-700">
                    {category.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-500">Sin categorias registradas.</p>
            )}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">Metodos de pago</p>
            {summary.payment.methods.length ? (
              <ul className="mt-2 space-y-1 text-sm text-slate-700">
                {summary.payment.methods.map((method) => (
                  <li key={method}>
                    <span className="font-semibold text-slate-800">{METHOD_LABEL[method] ?? method}</span>
                    {method === "card" && summary.payment.card && (
                      <span className="text-slate-500"> · Titular {summary.payment.card.holder}</span>
                    )}
                    {method === "qr" && summary.payment.qr && (
                      <span className="text-slate-500"> · Titular {summary.payment.qr.holder}</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-slate-500">Aun no definiste metodos de pago.</p>
            )}
          </div>
        </div>
      </header>

      <article className="rounded-3xl bg-white p-8 shadow-lg">
        <h3 className="text-lg font-semibold text-slate-900">Contrato de terminos y servicios</h3>
        <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
          <p>El Fixer se compromete a brindar servicios de calidad respetando las politicas de Servineo, la normativa vigente y a entregar informacion veridica dentro de la plataforma.</p>
          <p>Al aceptar este documento autorizas el tratamiento de tus datos personales segun la Politica de Privacidad y garantizas que utilizaras la aplicacion de forma etica y responsable.</p>
          <p>Servineo podra actualizar estos terminos cuando sea necesario. Te notificaremos cualquier cambio relevante por los canales oficiales.</p>
        </div>
      </article>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      <footer className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-lg">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={checked}
            onChange={(event) => setChecked(event.target.checked)}
            className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-slate-600">He leido y acepto los terminos y condiciones de Servineo.</span>
        </label>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-blue-500 hover:text-blue-600"
          >
            Atrás
          </button>
          <button
            type="button"
            onClick={handleAccept}
            disabled={!checked || loading}
            className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Guardando..." : "Aceptar y finalizar"}
          </button>
        </div>
      </footer>
    </section>
  );
}
