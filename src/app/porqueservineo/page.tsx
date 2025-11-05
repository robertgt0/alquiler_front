// src/app/porqueservineo/page.tsx
"use client";
import React from "react";
import Image from "next/image";

const PorQueServineo = () => {
  return (
    <section className="w-full min-h-screen bg-gray-50 py-16 px-6 flex flex-col items-center">
      <h1 className="text-3xl md:text-4xl font-bold text-[#2a87ff] mb-10">
        ¿Por qué elegir SERVINEO?
      </h1>

      {/* Banners de beneficios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl">
        <div className="flex flex-col items-center text-center bg-white shadow-md rounded-2xl p-4">
          <div className="relative w-full h-48 mb-3">
            <Image
              src="/banner1.jpg"
              alt="Beneficio 1"
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <h2 className="font-semibold text-lg">Banner de primer beneficio</h2>
          <p className="text-gray-600">
            Información acerca del banner del primer beneficio
          </p>
        </div>

        <div className="flex flex-col items-center text-center bg-white shadow-md rounded-2xl p-4">
          <div className="relative w-full h-48 mb-3">
            <Image
              src="/banner2.jpg"
              alt="Beneficio 2"
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <h2 className="font-semibold text-lg">Banner de segundo beneficio</h2>
          <p className="text-gray-600">
            Información acerca del banner del segundo beneficio
          </p>
        </div>

        <div className="flex flex-col items-center text-center bg-white shadow-md rounded-2xl p-4 md:col-span-2">
          <div className="relative w-full h-56 mb-3">
            <Image
              src="/banner3.jpg"
              alt="Beneficio 3"
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <h2 className="font-semibold text-lg">Banner del tercer beneficio</h2>
          <p className="text-gray-600">
            Información acerca del banner del tercer beneficio
          </p>
        </div>
      </div>

      {/* Tabla comparativa */}
      <div className="mt-12 w-full max-w-5xl overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-center text-sm md:text-base bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-[#2a87ff] text-white">
            <tr>
              <th className="py-3 px-4">Características</th>
              <th className="py-3 px-4">Servineo</th>
              <th className="py-3 px-4">Competidor 1</th>
              <th className="py-3 px-4">Competidor 2</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {[
              ["Registro gratuito", "✔️", "✔️", "✔️"],
              ["Sistema de seguimiento", "✔️", "❌", "✔️"],
              ["Calificación de empleados", "✔️", "❌", "✔️"],
              ["Publicación de empleos", "✔️", "✔️", "✔️"],
              ["Matching automático", "✔️", "✔️", "❌"],
              ["Sin cargos ocultos", "✔️", "❌", "✔️"],
            ].map((row, i) => (
              <tr key={i} className="border-t">
                {row.map((cell, j) => (
                  <td key={j} className="py-3 px-4">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botones inferiores */}
      <div className="mt-10 flex gap-4">
        <a
          href="/"
          className="px-6 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 transition"
        >
          Volver al Home Page
        </a>
        <a
          href="/registro"
          className="px-6 py-2 bg-[#2a87ff] text-white rounded-lg hover:bg-blue-600 transition"
        >
          Ir a registro
        </a>
      </div>
    </section>
  );
};

export default PorQueServineo;
