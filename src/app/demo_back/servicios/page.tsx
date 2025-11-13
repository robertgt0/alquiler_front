"use client";
import { useState } from "react";
import { apiCreate } from "@/lib/apiCreate";
import { apiUpdate } from "@/lib/apiUpdate";
import { apiGet } from "@/lib/apiGet";

export default function ServicioDemoPage() {
  const [result, setResult] = useState<any>(null);
  const collection = "servicio";

  /** 🟢 Crear un nuevo servicio */
  const handleCreate = async () => {
    const data = {
      id_servicio: Math.floor(Math.random() * 10000),
      nombre: "Servicio de Limpieza Hogar",
      descripcion: "Limpieza general de casa o departamento.",
      duracion: 90,
      duracion_estimada: 120,
      precio: 50,
      precio_base: 40,
      rating: 4.8,
      fecha_creacion: new Date(),
    };

    const res = await apiCreate(collection, data);
    setResult(res);
  };

  /** 🟡 Actualizar servicio (por ejemplo cambiar precio o rating) */
  const handleUpdate = async () => {
    const id = prompt("Ingrese el ID MongoDB del servicio a actualizar:");
    if (!id) return alert("ID requerido");

    const data = {
      precio: 60,
      rating: 5,
    };

    const res = await apiUpdate(collection, id, data);
    setResult(res);
  };

  /** 🔵 Obtener servicio por ID */
  const handleGet = async () => {
    const id = prompt("Ingrese el ID MongoDB del servicio a buscar:");
    if (!id) return alert("ID requerido");
    const res = await apiGet(collection, id);
    setResult(res);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🧰 Demo CRUD — Servicio</h1>
      <p className="text-gray-500 mb-4">
        Probando la colección: <strong>{collection}</strong>
      </p>

      <div className="flex flex-col gap-3">
        <button
          onClick={handleCreate}
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          🟢 Crear Servicio
        </button>

        <button
          onClick={handleUpdate}
          className="bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
        >
          🟡 Actualizar Servicio
        </button>

        <button
          onClick={handleGet}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          🔵 Buscar Servicio por ID
        </button>
      </div>

      {result && (
        <pre className="mt-5 bg-gray-100 p-3 rounded text-sm overflow-x-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
