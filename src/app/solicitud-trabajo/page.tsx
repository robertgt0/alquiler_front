"use client";

import { useSearchParams } from "next/navigation";
import SolicitarTrabajoForm from "./modules/SolicitarTrabajoForm";
import { formatEsDateTitle } from "./utils/helpers";

export default function SolicitarTrabajoPage() {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");
  const date = dateParam || new Date().toISOString().slice(0, 10);
  const titulo = formatEsDateTitle(date);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white px-4 sm:px-6">
      <div className="w-full max-w-sm sm:max-w-md">
        <h1 className="text-[#0C4FE9] Poppins text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 leading-snug">
          Solicitar trabajo para {titulo}
        </h1>

        <SolicitarTrabajoForm />
      </div>
    </div>
  );
}
