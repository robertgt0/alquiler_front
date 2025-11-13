"use client";
import { useState } from "react";
import { apiCreate } from "@/lib/apiCreate";
import { apiUpdate } from "@/lib/apiUpdate";
import { apiGet }  from "@/lib/apiGet";

export default function DemoPage() {
  const [result, setResult] = useState<any>(null);

  // Ejemplo de uso con la colección "ciudad"
  const collection = "ciudad";

  const handleCreate = async () => {
    const data = {
      id_ciudad: Math.floor(Math.random() * 10000),
      nombre: "Demo City",
      zona: "Centro",
      codigo_postal: "1000",
      fecha_creacion: new Date().toISOString(),
    };
    const res = await apiCreate(collection, data);
    setResult(res);
  };

  const handleUpdate = async () => {
    const id = prompt("Ingrese ID MongoDB a actualizar:");
    if (!id) return alert("ID requerido");
    const data = { nombre: "Ciudad Actualizada" };
    const res = await apiUpdate(collection, id, data);
    setResult(res);
  };

  const handleGet = async () => {
    const id = prompt("Ingrese ID MongoDB a buscar:");
    if (!id) return alert("ID requerido");
    const res = await apiGet(collection, id);
    setResult(res);
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">🔍 Demo CRUD de Colecciones</h1>
      <p className="text-gray-500 mb-4">
        Probando la colección: <strong>{collection}</strong>
      </p>

      <div className="flex flex-col gap-3">
        <button
          onClick={handleCreate}
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          🟢 Crear registro
        </button>

        <button
          onClick={handleUpdate}
          className="bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
        >
          🟡 Actualizar registro
        </button>

        <button
          onClick={handleGet}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          🔵 Buscar por ID
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
