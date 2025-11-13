"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// 🔹 Componente de Tabla Comparativa separado
const ComparisonTable = () => {
  const [showAdditionalColumns, setShowAdditionalColumns] = useState(false);

  const toggleAdditionalColumns = () => {
    setShowAdditionalColumns(!showAdditionalColumns);
  };

  // Datos de la tabla
  const tableData = [
    ["Registro gratuito",        "✔", "✔", "✔", "❌", "✔", "❌"],
    ["Sistema de seguimiento",   "✔", "❌", "❌", "✔", "❌", "✔"],
    ["Calificación de empleados","✔", "❌", "✔", "✔", "❌", "❌"],
    ["Publicación de empleos",   "✔", "❌", "✔", "❌", "✔", "✔"],
    ["Matching automático",      "✔", "❌", "✔", "❌", "❌", "✔"],
    ["Sin cargos ocultos",       "✔", "❌", "❌", "✔", "✔", "❌"],
  ];

  const headers = [
    "Características",
    "Servineo",
    "MarketPlace", 
    "Thumbtack",
    "TaskRabbit",      // Competidor A (servicios locales, EE.UU.)
    "HomeAdvisor",     // Competidor B (hogar, mantenimiento)
    "Angi"             // Competidor C (antes Angie’s List, servicios del hogar)
  ];

  return (
    <section className="w-full bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
          Tabla comparativa
        </h2>

        {/* Botón para mostrar/ocultar columnas adicionales */}
        <div className="flex justify-center mb-6">
          <button
            onClick={toggleAdditionalColumns}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
          >
            {showAdditionalColumns ? 'Ocultar competidores' : 'Ver más competidores'}
          </button>
        </div>

        <div className="overflow-x-auto w-full border border-gray-200 rounded-lg shadow-lg">
          <table className="w-full border-collapse text-center text-xs sm:text-base md:text-lg bg-white">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                {headers.map((header, index) => {
                  // Mostrar siempre las primeras 4 columnas, las demás según el estado
                  if (index < 4 || showAdditionalColumns) {
                    return (
                      <th 
                        key={index}
                        className={`border border-gray-300 p-2 sm:p-4 font-bold ${
                          index === 1 ? 'text-blue-700' : 'text-gray-800'
                        } ${
                          index >= 4 ? 'bg-blue-50' : ''
                        }`}
                      >
                        {header}
                      </th>
                    );
                  }
                  return null;
                })}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50 transition-colors duration-150">
                  {row.map((cell, cellIndex) => {
                    // Mostrar siempre las primeras 4 columnas, las demás según el estado
                    if (cellIndex < 4 || showAdditionalColumns) {
                      return (
                        <td
                          key={cellIndex}
                          className={`border border-gray-300 p-2 sm:p-4 text-gray-700 ${
                            cellIndex >= 4 ? 'bg-blue-50' : ''
                          } ${
                            cell === '✔' ? 'text-green-600 font-semibold' : 
                            cell === '❌' ? 'text-red-600 font-semibold' : ''
                          }`}
                        >
                          {cell}
                        </td>
                      );
                    }
                    return null;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Indicador visual cuando hay columnas ocultas */}
        {!showAdditionalColumns && (
          <div className="text-center mt-4">
            <p className="text-gray-600 text-sm">
              💡 <span className="font-semibold">{headers.length - 4} competidores adicionales</span> disponibles
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

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
      <ComparisonTable />

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