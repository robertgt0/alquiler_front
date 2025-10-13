"use client";
import { useState } from "react";

export function useSubirImagen() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const maxSize = 2 * 1024 * 1024; // 2MB
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

  const manejarCambioArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seleccionado = e.target.files?.[0];
    if (!seleccionado) return;

    if (!allowedTypes.includes(seleccionado.type)) {
      setError("Formato no permitido. Usa JPG o PNG.");
      setFile(null);
      return;
    }
    if (seleccionado.size > maxSize) {
      setError("Archivo demasiado grande. Máx 2MB.");
      setFile(null);
      return;
    }

    setError("");
    setFile(seleccionado);
  };

  return { file, error, setError, manejarCambioArchivo };
}
