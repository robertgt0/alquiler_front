"use client";
import Link from "next/link";
import React from "react";
import type { TrabajoTerminado } from "../interfaces/Trabajo.interface";

// 🕒 Divide el horario "08:00 - 09:30" → { inicio, fin }
function splitHorario(h?: string) {
  if (!h) return { inicio: "-", fin: "-" };
  const parts = h.split("-");
  const inicio = (parts[0] || "").trim();
  const fin = (parts[1] || "").trim();
  return { inicio: inicio || "-", fin: fin || "-" };
}

export default function JobCard({ t }: { t: TrabajoTerminado }) {
  const { inicio, fin } = splitHorario(t.horario);

  return (
    <article
      className="rounded-lg border-2 border-[#0C4FE9]/70 bg-white p-3 md:p-5 hover:shadow-md transition-all duration-200 max-w-[540px] mx-auto"
    >
      <Link
        href={`/trabajo-terminado/${t.id}`}
        className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] items-center gap-3 md:gap-5 no-underline"
      >
        {/* 🧍 Cliente + Estado */}
        <div className="flex items-start gap-2">
          <span
            aria-hidden
            className="shrink-0 inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#0C4FE9]/40 text-[#0C4FE9]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.33 0-8 2.17-8 5v1h16v-1c0-2.83-3.67-5-8-5Z"
                fill="currentColor"
              />
            </svg>
          </span>

          <div className="space-y-1">
            <div className="text-[12px] font-semibold text-[#0C4FE9]">Cliente</div>
            <div className="text-[14px] font-medium text-gray-900">{t.cliente}</div>
            <span className="inline-block rounded-md bg-[#31C950] px-4 py-2 text-[13px] font-semibold text-black">
              Terminado
            </span>
          </div>
        </div>

        {/* 📅 Fecha + Horario */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-start gap-2">
            <span aria-hidden className="mt-0.5 text-[#0C4FE9]">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 2v2M17 2v2M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <div>
              <div className="text-[12px] font-semibold text-[#0C4FE9] leading-none">
                Fecha
              </div>
              <div className="text-[14px] text-gray-900">{t.fecha}</div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <span aria-hidden className="mt-0.5 text-[#0C4FE9]">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 7v5l3 3M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div>
              <div className="text-[12px] font-semibold text-[#0C4FE9] leading-none">
                Horario
              </div>
              <div className="text-[14px] text-gray-900">{inicio} - {fin}</div>
            </div>
          </div>
        </div>

        {/* 🔵 Botón */}
        <div className="flex md:justify-end">
          <span className="inline-flex items-center justify-center rounded-md bg-[#0C4FE9] px-4 py-1.5 text-white text-[14px] font-medium hover:bg-blue-700 transition cursor-pointer">
            Ver Detalles
          </span>
        </div>
      </Link>
    </article>
  );
}
