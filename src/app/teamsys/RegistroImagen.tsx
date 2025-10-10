"use client";
import { useState } from "react";
import Link from "next/link";

export default function RegistroImagen() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [accepted, setAccepted] = useState(false);

  const maxSize = 2 * 1024 * 1024; // 2MB
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!allowedTypes.includes(selected.type)) {
      setError("Formato no permitido. Usa JPG o PNG.");
      setFile(null);
      return;
    }
    if (selected.size > maxSize) {
      setError("Archivo demasiado grande. Máx 2MB.");
      setFile(null);
      return;
    }

    setError("");
    setFile(selected);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Selecciona una imagen antes de continuar.");
      return;
    }
    if (!accepted) {
      setError("Debes aceptar los términos y condiciones.");
      return;
    }
    alert("¡Imagen lista para enviar!");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 items-center border p-6 rounded shadow-md w-full max-w-md bg-white mx-auto"
    >
      <h2 className="text-xl font-bold text-center">Subir Imagen</h2>

      <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
        {/* Cuadro de Imagen */}
        <div className="flex flex-col items-center border p-4 rounded w-full sm:w-auto">
          <div className="w-32 h-32 bg-gray-200 flex items-center justify-center mb-2">
            {file ? (
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
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
            onChange={handleFileChange}
            id="fileInput"
            className="hidden"
          />
          <label
            htmlFor="fileInput"
            className="bg-blue-600 text-white py-1 px-4 rounded cursor-pointer hover:bg-blue-700"
          >
            Insertar Foto
          </label>
        </div>
      </div>

      {/* Checkbox Términos */}
      <div className="flex items-start space-x-2 w-full">
        <input
          type="checkbox"
          checked={accepted}
          onChange={() => setAccepted(!accepted)}
          className="mt-1"
        />
        <span className="text-sm text-gray-700">
          Acepto los{" "}
          <Link href="/terminos" className="text-blue-600 underline">
            Términos y Condiciones
          </Link>{" "}
          y la{" "}
          <Link href="/privacidad" className="text-blue-600 underline">
            Política de Privacidad
          </Link>
          .
        </span>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 w-full"
      >
        Continuar
      </button>
    </form>
  );
}
