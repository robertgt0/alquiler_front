"use client";

import SolicitarTrabajoForm from "./modules/SolicitarTrabajoForm";

export default function SolicitarTrabajoPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white rounded-2xl shadow-xl w-[400px] p-8 relative overflow-hidden border border-gray-200">
        <h1 className="text-[#0C4FE9] Poppins text-2xl mb-6 leading-tight">
          Solicitar trabajo para Jueves 10 de Mayo
        </h1>

        <SolicitarTrabajoForm />

        {/* Franja azul inferior */}
        <div className="absolute bottom-0 left-0 w-full h-3 bg-[#0C4FE9] rounded-b-2xl"></div>
      </div>
    </div>
  );
}
