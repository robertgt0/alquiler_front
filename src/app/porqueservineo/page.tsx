"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const PorQueServineoPage: React.FC = () => {
  const router = useRouter();

  return (
    <main className="w-full flex flex-col items-center justify-center bg-gray-50 text-center">
      {/* 🔹 Header principal */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-12 w-full">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-6 md:mr-8">
              <img
                src="/logo-servineo.jpg"
                alt="SERVINEO Logo"
                className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-full border-2 border-white shadow-lg"
              />
            </div>
            <div className="flex-1 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                ¿Por Qué Elegir SERVINEO?
              </h1>
              <p className="text-lg md:text-xl">
                La plataforma líder para servicios locales en tu comunidad
              </p>
            </div>
            <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0"></div>
          </div>
        </div>
      </section>

      {/* 🔹 Contenido principal */}
      <section className="w-full max-w-7xl px-6 py-16 space-y-24 text-left">
        {/* Beneficio 1 */}
        <div className="flex flex-col md:flex-row items-center gap-10">
          <Image
            src="/beneficio1.png"
            alt="Beneficio 1"
            width={800}
            height={500}
            className="rounded-2xl shadow-2xl object-cover w-full md:w-[50%] h-[400px]"
          />
          <div className="md:w-1/2">
            <h2 className="text-2xl font-bold mb-2 text-gray-900">
              Beneficio 1: Servicio a Domicilio
            </h2>
            <p className="italic text-gray-600 mb-3">
              "Profesionales que van hasta ti"
            </p>
            <p className="text-gray-700 text-justify leading-relaxed">
              Con <span className="font-semibold text-blue-700">SERVINEO</span> no
              necesitas perder tiempo en desplazamientos ni salir de casa. Los
              profesionales llegan directamente a tu puerta, brindándote mayor
              comodidad al recibir el servicio en la tranquilidad de tu hogar u
              oficina. Puedes agendar según tu disponibilidad y adaptarte a tu
              propia rutina con total flexibilidad horaria. Además, tendrás la
              ventaja de supervisar directamente todo el trabajo y recibirlo en un
              entorno familiar, seguro y controlado.
            </p>
          </div>
        </div>

        {/* Beneficio 2 */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-10">
          <Image
            src="/beneficio2.png"
            alt="Beneficio 2"
            width={800}
            height={500}
            className="rounded-2xl shadow-2xl object-cover w-full md:w-[50%] h-[400px]"
          />
          <div className="md:w-1/2">
            <h2 className="text-2xl font-bold mb-2 text-gray-900">
              Beneficio 2: Garantía y Confianza
            </h2>
            <p className="italic text-gray-600 mb-3">
              "Tu satisfacción está asegurada"
            </p>
            <p className="text-gray-700 text-justify leading-relaxed">
              Todos los servicios en{" "}
              <span className="font-semibold text-blue-700">SERVINEO</span> están
              respaldados por nuestra garantía de satisfacción, lo que significa que
              si no estás conforme con el resultado, lo resolvemos sin costo
              adicional. Cada trabajo está cubierto por nuestra póliza de garantía y
              contarás con soporte post-servicio para cualquier asistencia que
              necesites después de finalizado el trabajo. Tu dinero está protegido
              hasta que apruebes completamente el servicio.
            </p>
          </div>
        </div>

        {/* Beneficio 3 */}
        <div className="flex flex-col md:flex-row items-center gap-10">
          <Image
            src="/beneficio3.png"
            alt="Beneficio 3"
            width={800}
            height={500}
            className="rounded-2xl shadow-2xl object-cover w-full md:w-[50%] h-[400px]"
          />
          <div className="md:w-1/2">
            <h2 className="text-2xl font-bold mb-2 text-gray-900">
              Beneficio 3: Calificación y Transparencia
            </h2>
            <p className="italic text-gray-600 mb-3">
              "Opiniones reales para decisiones seguras"
            </p>
            <p className="text-gray-700 text-justify leading-relaxed">
              En <span className="font-semibold text-blue-700">SERVINEO</span> puedes
              revisar opiniones y valoraciones por estrellas de usuarios antes de
              contratar, lo que permite tomar decisiones informadas. Nuestros
              profesionales pasan por un proceso de validación estricta para
              garantizar confianza y seguridad en cada contratación.
            </p>
          </div>
        </div>
      </section>

      {/* 🔹 Tabla comparativa que toca los bordes */}
      <section className="w-full bg-white">
        <div className="overflow-x-auto w-full">
          <table className="w-full border-collapse border border-gray-300 text-center text-base md:text-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 p-4"></th>
                <th className="border border-gray-300 p-4 text-blue-700 font-bold">
                  Servineo
                </th>
                <th className="border border-gray-300 p-4 font-semibold">
                  Competidor 1
                </th>
                <th className="border border-gray-300 p-4 font-semibold">
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
                      className="border border-gray-300 p-4 text-gray-700"
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

      {/* 🔹 Footer con misma paleta de colores que el header */}
      <section className="w-full py-16 flex flex-col items-center bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <h2 className="text-3xl font-semibold mb-8">
          ¿Listo para Unirte a SERVINEO?
        </h2>
        <div className="flex flex-wrap gap-8 justify-center">
          <button
            onClick={() => router.push("/")}
            className="px-8 py-4 bg-white text-blue-700 font-semibold rounded-lg shadow hover:bg-gray-100 transition"
          >
            Volver al home page
          </button>
          <button
            onClick={() => router.push("/registro")}
            className="px-8 py-4 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition"
          >
            Ir a registro
          </button>
        </div>
      </section>
    </main>
  );
};

export default PorQueServineoPage;
