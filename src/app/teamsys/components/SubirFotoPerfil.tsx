"use client";
import React from "react";

interface Props {
  file: File | null;
  error: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SubirFotoPerfil({ file, error, onFileChange }: Props) {
  return (
    <div className="flex flex-col items-center border p-4 rounded w-full sm:w-auto">
      <div className="w-32 h-32 bg-gray-200 flex items-center justify-center mb-2">
        {file ? (
          <img
            src={URL.createObjectURL(file)}
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
  );
}
