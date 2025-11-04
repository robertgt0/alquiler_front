"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SolicitarTrabajoForm from "./modules/SolicitarTrabajoForm";
import { formatEsDateTitle } from "./utils/helpers";
import { IFranjaDisponible } from "./interfaces/Solicitud.interface";

/**
 * Evita el prerender estático: fuerza render dinámico en runtime.
 * (Alternativa a Suspense, pero aquí usamos ambos por robustez.)
 */
export const dynamic = "force-dynamic"; // o: export const revalidate = 0;

/** Contenido real de la página (aquí usamos useSearchParams). */
function PageContent() {
  const searchParams = useSearchParams();

  // Fecha (para el título y la clave de storage)
  const dateParam = searchParams.get("date");
  const date = dateParam || new Date().toISOString().slice(0, 10);
  const titulo = formatEsDateTitle(date);

  // Franjas desde la URL: ?s=HH:MM-HH:MM (se puede repetir s)
  const sParams = searchParams.getAll("s");
  let franjas: IFranjaDisponible[] = sParams
    .map((s) => s.split("-"))
    .filter((p) => p.length === 2)
    .map(([inicio, fin]) => ({ inicio, fin }));

  // Fallback temporal si HU2 aún no envía franjas
  if (franjas.length === 0) {
    franjas = [
      { inicio: "08:00", fin: "12:00" },
      { inicio: "14:00", fin: "18:00" },
      { inicio: "02:00", fin: "05:00" },
    ];
  }

  // Proveedor simulado (cuando tengan HU2/Back, vendrá por URL o contexto)
  const providerId = searchParams.get("providerId") || "proveedor-1";

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white px-4 sm:px-6">
      <div className="w-full max-w-sm sm:max-w-md">
        <h1 className="text-[#0C4FE9] Poppins text-3xl font-bold leading-snug text-center">
          Solicitar trabajo para:
          <br />
          <span className="block mt-1">{titulo}</span>
        </h1>

        <SolicitarTrabajoForm
          franjas={franjas}
          date={date}
          providerId={providerId}
        />
      </div>
    </div>
  );
}

/** Export por defecto: Page envuelta en Suspense (requisito de useSearchParams). */
export default function SolicitarTrabajoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center">
          Cargando…
        </div>
      }
    >
      <PageContent />
    </Suspense>
  );
}
