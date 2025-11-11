"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const PorQueServineoPage: React.FC = () => {
  const router = useRouter();

  return (
    <main className="w-full flex flex-col items-center justify-center bg-gray-50 text-center overflow-x-hidden">
      {/* 🔹 Header fijo */}
      <section className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-blue-600 to-purple-700 text-white pt-20 pb-8 w-full shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center flex-wrap">
            <div
              className="flex-shrink-0 mr-4 md:mr-8 cursor-pointer transition-transform hover:scale-105"
              onClick={() => router.push("/")}
              title="Volver al inicio"
            >
              <img
                src="/logo-header.png"
                alt="SERVINEO Logo"
                className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-full border-2 border-white shadow-lg"
              />
            </div>

            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
                ¿Por Qué Elegir SERVINEO?
              </h1>
              <p className="text-sm sm:text-lg md:text-xl">
                La plataforma líder para servicios locales en tu comunidad
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🔹 Espaciador */}
      <div className="h-[220px] md:h-[240px]"></div>

      {/* 🔹 Contenido principal */}
      <section className="w-full max-w-7xl px-3 sm:px-4 md:px-6 py-16 space-y-24 text-left">
        {/* Beneficio 1 */}
        <div className="flex flex-row items-center justify-center gap-4 sm:gap-6 flex-nowrap">
          <div className="w-[45%] min-w-[150px]">
            <Image
              src="/beneficio1.png"
              alt="Beneficio 1"
              width={800}
              height={500}
              className="rounded-2xl shadow-2xl object-cover w-full h-[140px] sm:h-[220px] md:h-[350px]"
            />
          </div>
          <div className="w-[45%] min-w-[150px] text-left">
            <h2 className="text-base sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 text-gray-900">
              Beneficio 1: Servicio a Domicilio
            </h2>
            <p className="italic text-gray-600 mb-2 sm:mb-3 text-xs sm:text-sm md:text-base">
              "Profesionales que van hasta ti"
            </p>
            <p className="text-gray-700 text-justify leading-snug sm:leading-relaxed text-xs sm:text-sm md:text-base">
              Con <span className="font-semibold text-blue-700">SERVINEO</span> no
              necesitas perder tiempo en desplazamientos ni salir de casa. Los
              profesionales llegan directamente a tu puerta, brindándote mayor
              comodidad al recibir el servicio en tu hogar u oficina.
            </p>
          </div>
        </div>

        {/* Beneficio 2 */}
        <div className="flex flex-row-reverse items-center justify-center gap-4 sm:gap-6 flex-nowrap">
          <div className="w-[45%] min-w-[150px]">
            <Image
              src="/beneficio2.png"
              alt="Beneficio 2"
              width={800}
              height={500}
              className="rounded-2xl shadow-2xl object-cover w-full h-[140px] sm:h-[220px] md:h-[350px]"
            />
          </div>
          <div className="w-[45%] min-w-[150px] text-left">
            <h2 className="text-base sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 text-gray-900">
              Beneficio 2: Garantía y Confianza
            </h2>
            <p className="italic text-gray-600 mb-2 sm:mb-3 text-xs sm:text-sm md:text-base">
              "Tu satisfacción está asegurada"
            </p>
            <p className="text-gray-700 text-justify leading-snug sm:leading-relaxed text-xs sm:text-sm md:text-base">
              Todos los servicios en{" "}
              <span className="font-semibold text-blue-700">SERVINEO</span> están
              respaldados por nuestra garantía de satisfacción. Si no estás conforme
              con el resultado, lo resolvemos sin costo adicional.
            </p>
          </div>
        </div>

        {/* Beneficio 3 */}
        <div className="flex flex-row items-center justify-center gap-4 sm:gap-6 flex-nowrap">
          <div className="w-[45%] min-w-[150px]">
            <Image
              src="/beneficio3.png"
              alt="Beneficio 3"
              width={800}
              height={500}
              className="rounded-2xl shadow-2xl object-cover w-full h-[140px] sm:h-[220px] md:h-[350px]"
            />
          </div>
          <div className="w-[45%] min-w-[150px] text-left">
            <h2 className="text-base sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 text-gray-900">
              Beneficio 3: Calificación y Transparencia
            </h2>
            <p className="italic text-gray-600 mb-2 sm:mb-3 text-xs sm:text-sm md:text-base">
              "Opiniones reales para decisiones seguras"
            </p>
            <p className="text-gray-700 text-justify leading-snug sm:leading-relaxed text-xs sm:text-sm md:text-base">
              En <span className="font-semibold text-blue-700">SERVINEO</span> puedes
              revisar opiniones y valoraciones por estrellas antes de contratar,
              permitiéndote tomar decisiones seguras y confiables.
            </p>
          </div>
        </div>
      </section>

      {/* 🔹 Tabla comparativa */}
      <section className="w-full bg-white py-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
          Tabla comparativa
        </h2>

        <div className="overflow-x-auto w-full">
          <table className="w-full border-collapse border border-gray-300 text-center text-xs sm:text-base md:text-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 p-2 sm:p-4"></th>
                <th className="border border-gray-300 p-2 sm:p-4 text-blue-700 font-bold">
                  Servineo
                </th>
                <th className="border border-gray-300 p-2 sm:p-4 font-semibold">
                  MarketPlace
                </th>
                <th className="border border-gray-300 p-2 sm:p-4 font-semibold">
                  Thumbtack
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Registro gratuito", "✔", "✔", "✔"],
                ["Sistema de seguimiento", "✔", "❌", "❌"],
                ["Calificación de empleados", "✔", "❌", "✔"],
                ["Publicación de empleos", "✔", "❌", "✔"],
                ["Matching automático", "✔", "❌", "✔"],
                ["Sin cargos ocultos", "✔", "❌", "❌"],
              ].map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className="border border-gray-300 p-2 sm:p-4 text-gray-700"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 🔹 Footer */}
      <section className="w-full py-16 flex flex-col items-center bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-8">
          ¿Listo para Unirte a SERVINEO?
        </h2>
        <div className="flex flex-wrap gap-6 sm:gap-8 justify-center">
          <button
            onClick={() => router.push("/")}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-700 font-semibold rounded-lg shadow hover:bg-gray-100 transition"
          >
            Volver al home page
          </button>
          <button
            onClick={() => router.push("/registro")}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition"
          >
            Ir a registro
          </button>
        </div>
      </section>
    </main>
  );
};

export default PorQueServineoPage;
