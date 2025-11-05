"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const PorQueServineoPage: React.FC = () => {
  const router = useRouter();

  return (
    <main className="w-full flex flex-col items-center justify-center bg-gray-50 text-center">
      <section className="w-full max-w-6xl px-6 py-16">
        <h1 className="text-3xl font-bold mb-16 text-gray-800">
          ¿Por Qué Elegir SERVINEO?
        </h1>

        {/* Banner 1 - Imagen izquierda */}
        <div className="flex flex-col md:flex-row items-center mb-20 gap-10">
          <Image
            src="/beneficio1.png"
            alt="Beneficio 1"
            width={450}
            height={250}
            className="rounded-xl shadow-lg object-cover"
          />
          <p className="text-gray-700 text-justify">
            Con SERVINEO no necesitas perder tiempo en desplazamientos ni salir de casa.
            Los profesionales llegan directamente a tu puerta, brindándote mayor comodidad
            al recibir el servicio en la tranquilidad de tu hogar u oficina. Puedes
            agendar según tu disponibilidad y adaptarte a tu propia rutina con total
            flexibilidad horaria. Además, tendrás la ventaja de supervisar directamente
            todo el trabajo y recibirlo en un entorno familiar, seguro y controlado.
          </p>
        </div>

        {/* Banner 2 - Imagen derecha */}
        <div className="flex flex-col md:flex-row-reverse items-center mb-20 gap-10">
          <Image
            src="/beneficio2.png"
            alt="Beneficio 2"
            width={450}
            height={250}
            className="rounded-xl shadow-lg object-cover"
          />
          <p className="text-gray-700 text-justify">
            Todos los servicios en SERVINEO están respaldados por nuestra garantía
            de satisfacción, lo que significa que si no estás conforme con el resultado,
            lo resolvemos sin costo adicional. Cada trabajo está cubierto por nuestra
            póliza de garantía y contarás con soporte post-servicio para cualquier
            asistencia que necesites después de finalizado el trabajo. Tu dinero está
            protegido hasta que apruebes completamente el servicio.
          </p>
        </div>

        {/* Banner 3 - Imagen izquierda */}
        <div className="flex flex-col md:flex-row items-center mb-20 gap-10">
          <Image
            src="/beneficio3.png"
            alt="Beneficio 3"
            width={450}
            height={250}
            className="rounded-xl shadow-lg object-cover"
          />
          <p className="text-gray-700 text-justify">
            En SERVINEO puedes revisar opiniones y valoraciones por estrellas de usuarios 
            antes de contratar, lo que permite tomar decisiones informadas. Nuestros 
            profesionales pasan por un proceso de validación estricta para garantizar 
            confianza y seguridad en cada contratación.
          </p>
        </div>
      </section>

      {/* Tabla comparativa */}
      <section className="w-full bg-white">
        <div className="overflow-x-auto w-full">
          <table className="w-full border-collapse border border-gray-300 text-center text-sm md:text-base">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 p-3"></th>
                <th className="border border-gray-300 p-3 text-blue-700 font-bold">Servineo</th>
                <th className="border border-gray-300 p-3 font-semibold">Competidor 1</th>
                <th className="border border-gray-300 p-3 font-semibold">Competidor 2</th>
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
                    <td key={j} className="border border-gray-300 p-3 text-gray-700">
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
