"use client";
import { useState } from "react";
import SubirFotoPerfil from "../components/SubirFotoPerfil";
import AceptarTerminos from "../components/AceptarTerminos";
import { useSubirImagen } from "../hooks/useSubirImagen";

export default function FormularioRegistro() {
  const { file, error, setError, manejarCambioArchivo } = useSubirImagen();
  const [aceptado, setAceptado] = useState(false);

  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Selecciona una imagen antes de continuar.");
      return;
    }
    if (!aceptado) {
      setError("Debes aceptar los términos y condiciones.");
      return;
    }
    alert("¡Imagen lista para enviar!");
  };

  return (
    <form
      onSubmit={manejarEnvio}
      className="flex flex-col gap-4 items-center border p-6 rounded shadow-md w-full max-w-md bg-white mx-auto"
    >
      <h2 className="text-xl font-bold text-center">Subir Imagen</h2>

      <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
        <SubirFotoPerfil file={file} error={error} onFileChange={manejarCambioArchivo} />
      </div>

      <AceptarTerminos aceptado={aceptado} onToggle={() => setAceptado(!aceptado)} />

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