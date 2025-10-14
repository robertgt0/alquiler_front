"use client";
import React, { useEffect, useState } from "react";

interface Props {
  file: File | null;
  error: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SubirFotoPerfil({ file, error, onFileChange }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [mapa, setMapa] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleUbicacion = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;

          const url = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lon}&zoom=15&size=200x200&markers=color:red|${lat},${lon}&key=TU_API_KEY`;

          setMapa(url);
        },
        () => alert("No se pudo obtener tu ubicación.")
      );
    } else {
      alert("La geolocalización no está disponible en este navegador.");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center border p-4 rounded w-full sm:w-auto">
      {/* Contenedor de foto */}
      <div className="flex flex-col items-center">
        <div className="w-32 h-32 bg-gray-200 flex items-center justify-center mb-2">
          {preview ? (
            <img
              src={preview}
              alt="Vista previa"
              className="w-32 h-32 object-cover rounded"
            />
          ) : (
            <img
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              alt="persona ejemplo"
              className="w-24 h-24 object-contain"
            />
          )}
        </div>
        <input
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={onFileChange}
          id="fileInput"
          className="hidden"
        />
        <label
          htmlFor="fileInput"
          className="bg-blue-600 text-white py-1 px-4 rounded cursor-pointer hover:bg-blue-700"
        >
          Insertar Foto
        </label>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      {/* Contenedor de mapa */}
      <div className="flex flex-col items-center">
        <div className="w-32 h-32 bg-gray-100 border mb-2 flex items-center justify-center">
          {mapa ? (
            <img src={mapa} alt="Mapa" className="w-32 h-32 object-cover rounded" />
          ) : (
            <p className="text-sm text-gray-500">Mapa no disponible</p>
          )}
        </div>
       <button
  type="button"
  onClick={handleUbicacion}
  className="bg-blue-600 text-white py-1 px-3 rounded cursor-pointer hover:bg-blue-500 w-full text-center"
>
  Insertar Ubicación
</button>
      </div>
    </div>
  );
}
