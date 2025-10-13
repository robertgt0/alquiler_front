"use client";

import React, { useState } from "react";

const RegistroMockup: React.FC = () => {
  const [foto, setFoto] = useState<string | null>(null);
  const [ubicacion, setUbicacion] = useState<string | null>(null);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setFoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUbicacion = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const mapaUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lon}&zoom=15&size=200x200&markers=color:red|${lat},${lon}&key=TU_API_KEY`;
          setUbicacion(mapaUrl);
        },
        () => alert("No se pudo obtener tu ubicación.")
      );
    } else {
      alert("La geolocalización no está disponible en este navegador.");
    }
  };

  return (
    <div className="bg-[#2B5CF4] flex justify-center items-center min-h-screen">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-2xl flex flex-col items-center gap-6">
        
        {/* Contenedor de opciones */}
        <div className="flex flex-col md:flex-row gap-8 justify-center w-full">
          {/* Subir foto */}
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 bg-gray-100 border-2 border-gray-300 rounded-lg flex justify-center items-center overflow-hidden">
              {foto ? (
                <img src={foto} alt="perfil" className="w-full h-full object-cover" />
              ) : (
                <img
                  src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                  alt="placeholder"
                  className="w-24 h-24 opacity-70"
                />
              )}
            </div>
            <label className="mt-3 cursor-pointer bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md text-sm font-medium">
              Insertar tu foto de perfil
              <input
                type="file"
                accept="image/*"
                onChange={handleFotoChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Insertar ubicación */}
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 bg-gray-100 border-2 border-gray-300 rounded-lg flex justify-center items-center overflow-hidden">
              {ubicacion ? (
                <img src={ubicacion} alt="ubicación" className="w-full h-full object-cover" />
              ) : (
                <img
                  src="https://cdn-icons-png.flaticon.com/512/684/684908.png"
                  alt="mapa"
                  className="w-24 h-24 opacity-70"
                />
              )}
            </div>
            <button
              onClick={handleUbicacion}
              className="mt-3 bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md text-sm font-medium"
            >
              Insertar tu ubicación
            </button>
          </div>
        </div>

        {/* Términos y condiciones */}
        <div className="flex items-start gap-2 text-sm text-gray-700 w-full max-w-lg">
          <input
            type="checkbox"
            checked={aceptaTerminos}
            onChange={(e) => setAceptaTerminos(e.target.checked)}
            className="mt-1 accent-blue-500"
          />
          <label>
            Al crear una cuenta, aceptas nuestros{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Términos de servicio
            </a>{" "}
            y nuestra{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Política de privacidad
            </a>.
          </label>
        </div>

        {/* Botón continuar */}
        <button
          disabled={!aceptaTerminos}
          className={`w-full max-w-xs font-medium py-2 rounded-full transition text-white ${
            aceptaTerminos
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default RegistroMockup;