"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const PorQueServineoPage: React.FC = () => {
  const router = useRouter();

  return (
    <main className="w-full flex flex-col items-center justify-center bg-gray-50 text-center">
      <section className="w-full max-w-7xl px-6 py-16">
        <h1 className="text-3xl font-bold mb-12 text-gray-800">
          ¿Por Qué Elegir SERVINEO?
        </h1>

        {/* Banners de beneficios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center mb-12">
          <div>
            <Image
              src="/images/beneficio1.png"
              alt="Primer beneficio"
              width={300}
              height={180}
              className="rounded-xl shadow-md mx-auto"
            />
            <p className="mt-3 text-gray-700">
              Información acerca del banner primer beneficio
            </p>
          </div>

          <div>
            <Image
              src="/images/beneficio2.png"
              alt="Segundo beneficio"
              width={300}
              height={180}
              className="rounded-xl shadow-md mx-auto"
            />
            <p className="mt-3 text-gray-700">
              Información acerca del banner del segundo beneficio
            </p>
          </div>

          <div>
            <Image
              src="/images/beneficio3.png"
              alt="Tercer beneficio"
              width={300}
              height={180}
              className="rounded-xl shadow-md mx-auto"
            />
            <p className="mt-3 text-gray-700">
              Información acerca del banner del tercer beneficio
            </p>
          </div>
        </div>
      </section>

      {/* Tabla comparativa que toca los bordes */}
      <section className="w-full bg-white">
        <div className="overflow-x-auto w-full">
          <table className="w-full border-collapse border border-gray-300 text-center text-sm md:text-base">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 p-3"> </th>
                <th className="border border-gray-300 p-3 text-blue-700 font-bold">
                  Servineo
                </th>
                <th className="border border-gray-300 p-3 font-semibold">
                  Competidor 1
                </th>
                <th className="border border-gray-300 p-3 font-semibold">
                  Competidor 2
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Registro gratuito", "✔️", "✔️", "✔️"],
                ["Sistema de seguimiento", "✔️", "✔️", "❌"],
                ["Calificación de empleados", "✔️", "❌", "✔️"],
                ["Publicación de empleos", "✔️", "✔️", "❌"],
                ["Matching automático", "✔️", "❌", "✔️"],
                ["Sin cargos ocultos", "✔️", "❌", "❌"],
              ].map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className="border border-gray-300 p-3 text-gray-700"
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

      {/* Sección final */}
      <section className="w-full py-12 flex flex-col items-center bg-gray-50">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          ¿Listo para Unirte a SERVINEO?
        </h2>
        <div className="flex flex-wrap gap-6 justify-center">
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-white border border-gray-400 rounded-lg shadow hover:bg-gray-100 transition"
          >
            Volver al home page
          </button>
          <button
            onClick={() => router.push("/registro")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Ir a registro
          </button>
        </div>
      </section>
    </main>
  );
};

export default PorQueServineoPage;
