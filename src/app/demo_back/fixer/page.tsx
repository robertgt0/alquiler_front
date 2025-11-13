"use client";
import { useState } from "react";
import { apiCreate } from "@/lib/apiCreate";
import { apiUpdate } from "@/lib/apiUpdate";
import { apiGet } from "@/lib/apiGet";

export default function FixerDemoPage() {
  const [result, setResult] = useState<any>(null);
  const collection = "fixer";

  /** 🔹 Crear un Fixer de ejemplo */
  const handleCreate = async () => {
    const data = {
      nombre: "Juan",
      usuario: "Pepe Polaco",
      email: `juan${Math.floor(Math.random() * 1000)}@demo.com`,
      hash_password: "hashed123",
      activo: true,
      fecha_registro: new Date().toISOString(),
      telefono: "70012345",
      metodo_pago: "transferencia",
      descripcion: "Especialista en reparaciones eléctricas",

      disponibilidad: {
        dias: [1, 2, 3, 4, 5], // Lunes a Viernes
        horaInicio: "08:00",
        horaFin: "17:00",
        duracionTurno: 60,
      },

      horarioLaboral: {
        modo: "semanal",
        dias: [
          {
            dia: 1,
            activo: true,
            rangos: [
              { inicio: "08:00", fin: "12:00" },
              { inicio: "14:00", fin: "18:00" },
            ],
          },
          {
            dia: 6,
            activo: false,
            rangos: [],
          },
        ],
      },

      ubicacion: {
        lat: -16.5,
        lng: -68.15,
        direccion: "Calle Falsa 123, La Paz",
      },
    };

    const res = await apiCreate(collection, data);
    setResult(res);
  };

  /** 🔹 Actualizar Fixer (solo cambia el nombre o descripción) */
  const handleUpdate = async () => {
    const id = prompt("Ingrese el ID del Fixer a actualizar:");
    if (!id) return alert("ID requerido");
    const data = {
      descripcion: "Actualizado: ahora también repara lavadoras",
    };
    const res = await apiUpdate(collection, id, data);
    setResult(res);
  };

  /** 🔹 Buscar Fixer por ID */
  const handleGet = async () => {
    const id = prompt("Ingrese el ID del Fixer a buscar:");
    if (!id) return alert("ID requerido");
    const res = await apiGet(collection, id);
    setResult(res);
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">🧰 Demo CRUD — Fixer</h1>
      <p className="text-gray-500 mb-4">
        Probando la colección: <strong>{collection}</strong>
      </p>

      <div className="flex flex-col gap-3">
        <button
          onClick={handleCreate}
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          🟢 Crear Fixer
        </button>

        <button
          onClick={handleUpdate}
          className="bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
        >
          🟡 Actualizar Fixer
        </button>

        <button
          onClick={handleGet}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          🔵 Buscar Fixer por ID
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
