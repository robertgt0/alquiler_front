import Header from "./components/Header";
import JobsList from "./components/JobsList";
import React from "react";
import "./components/global.css";
import Image from "next/image";
import { getFixer, getFixerJobs } from "@/lib/api/fixer";
import { notFound } from "next/navigation";

type PageProps = {
  searchParams: { id?: string };
};

export default async function Page({ searchParams }: PageProps) {
  const fixerId = searchParams.id;

  if (!fixerId) {
    notFound();
  }

  // Obtener datos del fixer
  let fixerData;
  let jobsData;

  try {
    const fixerResponse = await getFixer(fixerId);
    fixerData = fixerResponse.data;

    // Obtener trabajos con descripciones personalizadas
    const jobsResponse = await getFixerJobs(fixerId);
    jobsData = jobsResponse.data || [];
  } catch (error) {
    console.error("Error al obtener datos del fixer:", error);
    notFound();
  }

  // Calcular antigüedad (tiempo desde createdAt)
  const memberSince = new Date(fixerData.createdAt).toLocaleDateString("es-BO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // Obtener métodos de pago
  const paymentMethods = fixerData.paymentMethods || [];
  const paymentMethodsText = paymentMethods
    .map((method) => {
      if (method === "card") return "Tarjeta";
      if (method === "qr") return "QR";
      if (method === "cash") return "Efectivo";
      return method;
    })
    .join(", ");

  // Número de trabajos (de las categorías o fixerJobs)
  const jobsCount = fixerData.fixerJobs?.length || fixerData.categories?.length || 0;

  // Para el rating y whatsapp, usaremos datos de ejemplo por ahora
  // TODO: Agregar estos campos al modelo Fixer en el backend
  const rating = 4; // Placeholder
  const whatsappNumber = "59176543210"; // Placeholder

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        {/* Avatar centrado arriba */}
        <div className="flex justify-center mb-8">
          <div className="w-36 h-36 rounded-full border border-gray-400 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-4xl font-bold text-gray-500">
            {fixerData.userId?.charAt(0).toUpperCase() || "U"}
          </div>
        </div>

        {/* Grid 2 columnas */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Columna izquierda */}
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Fixer #{fixerData.id.slice(0, 8)}
              </h1>
            </div>

            <div>
              <p className="text-gray-600 dark:text-gray-400">Ciudad:</p>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                {fixerData.location?.address || "No especificada"}
              </p>
            </div>

            {/* AQUÍ MOSTRAMOS LOS TRABAJOS CON DESCRIPCIONES PERSONALIZADAS */}
            <JobsList jobs={jobsData} />

            {/* Métodos de pago */}
            {paymentMethodsText && (
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  Métodos de pago aceptados:
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  {paymentMethodsText}
                </p>
              </div>
            )}
          </div>

          {/* Columna derecha */}
          <div className="space-y-6">
            <div>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Trabajos registrados:</span> {jobsCount}
              </p>
            </div>

            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Calificación</p>
              <div className="mt-1 text-amber-400 text-xl" aria-label={`${rating} de 5`}>
                {"★".repeat(rating)}
                <span className="text-gray-600 dark:text-gray-500">
                  {"★".repeat(5 - rating)}
                </span>
              </div>
            </div>

            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">En Servineo desde</p>
              <p className="text-sm text-gray-500 dark:text-gray-300">{memberSince}</p>
            </div>

            {/* Botón de WhatsApp */}
            <div className="pt-4 flex flex-wrap gap-4">
              
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-green-600 px-6 font-medium text-white shadow-card transition hover:bg-green-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.487 5.235 3.487 8.413 0 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.269.655 4.525 1.903 6.341l.225.404-1.152 3.341 3.437-1.132.379.223z" />
                </svg>
                Contactar
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}