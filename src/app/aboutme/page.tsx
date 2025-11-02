import Header from "../aboutme/components/Header";
import React from "react";
import Image from "next/image";

export default function Page() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        {/* Avatar centrado arriba */}
        <div className="flex justify-center mb-8">
          <Image
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=144&h=144&q=80"
            alt="Foto de perfil del usuario"
            width={144}
            height={144}
            className="rounded-full border border-gray-400 object-cover"
          />
        </div>

        {/* Grid 2 columnas (izq datos / der métricas) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Columna izquierda */}
          <div className="space-y-5">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Nombre:</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">Juan Pérez</p>
            </div>

            <div>
              <p className="text-gray-600 dark:text-gray-400">Ciudad:</p>
              <p className="text-sm text-gray-500 dark:text-gray-300">Cochabamba</p>
            </div>

            <div>
              <p className="font-medium">Rubros</p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                Carpintero, Albañil, Plomero
              </p>
            </div>

            <div>
              <p className="capitalize font-medium">sobre mi :</p>
              <div className="rounded-2xl border border-green-400 bg-gray-100 dark:bg-gray-800 p-4 text-sm text-gray-800 dark:text-gray-200 shadow-card">
                soy una persona responsable y eficiente que trabajo tanto en obras
                grandes y pequeñas
              </div>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="space-y-6">
            <div>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">trabajos registrados :</span> 45
              </p>
            </div>

            <div>
              <p className="font-medium">Calificacion</p>
              <div className="mt-1 text-amber-400 text-xl" aria-label="4 de 5">
                ★★★★<span className="text-gray-600 dark:text-gray-500">★</span>
              </div>
            </div>

            <div>
              <p className="font-medium">En Servineo desde</p>
              <p className="text-sm text-gray-500 dark:text-gray-300">28-08-2015</p>
            </div>

            <div className="pt-4">
              <button
                type="button"
                className="w-64 h-14 rounded-xl bg-whatsapp text-white font-medium shadow-card hover:brightness-95 transition"
              >
                contactar
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
