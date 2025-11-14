import React from "react";
import Image from "next/image";

// En una aplicación real, estos datos vendrían de una API
const userData = {
  name: "Juan Pérez",
  imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=144&h=144&q=80",
  city: "Cochabamba",
  skills: "Carpintero, Albañil, Plomero",
  about: "Soy una persona responsable y eficiente que trabajo tanto en obras grandes y pequeñas",
  jobsCount: 45,
  rating: 4,
  memberSince: "28-08-2015",
  whatsappNumber: "59176543210" // Número de ejemplo
};

export default function UserProfile() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      {/* Avatar centrado arriba */}
      <div className="flex justify-center mb-8">
        <Image
          src={userData.imageUrl}
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{userData.name}</h1>
          </div>

          <div>
            <p className="text-gray-600 dark:text-gray-400">Ciudad:</p>
            <p className="text-sm text-gray-500 dark:text-gray-300">{userData.city}</p>
          </div>

          <div>
            <p className="font-medium">Rubros</p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300">
              {userData.skills}
            </p>
          </div>

          <div>
            <p className="capitalize font-medium">sobre mi :</p>
            <div className="rounded-2xl border border-green-400 bg-gray-100 dark:bg-gray-800 p-4 text-sm text-gray-800 dark:text-gray-200 shadow-card">
              {userData.about}
            </div>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="space-y-6">
          <div>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">trabajos registrados :</span> {userData.jobsCount}
            </p>
          </div>

          <div>
            <p className="font-medium">Calificacion</p>
            <div className="mt-1 text-amber-400 text-xl" aria-label={`${userData.rating} de 5`}>
              {'★'.repeat(userData.rating)}
              <span className="text-gray-600 dark:text-gray-500">{'★'.repeat(5 - userData.rating)}</span>
            </div>
          </div>

          <div>
            <p className="font-medium">En Servineo desde</p>
            <p className="text-sm text-gray-500 dark:text-gray-300">{userData.memberSince}</p>
          </div>

          <div className="pt-4">
            <a
              href={`https://wa.me/${userData.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-64 h-14 inline-flex items-center justify-center gap-2 rounded-xl bg-whatsapp text-white font-medium shadow-card hover:brightness-95 transition"
            >
              {/* Logo de WhatsApp */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.487 5.235 3.487 8.413 0 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.269.655 4.525 1.903 6.341l.225.404-1.152 3.341 3.437-1.132.379.223z" />
              </svg>
              contactar
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
