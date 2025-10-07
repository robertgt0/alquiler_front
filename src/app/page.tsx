"use client";

import RegistroImagen from "./components/RegistroImagen";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-xl space-y-6">
        <h1 className="text-2xl font-bold text-center mb-4">Subir Imagen</h1>
        <RegistroImagen />
      </div>
    </div>
  );
}
