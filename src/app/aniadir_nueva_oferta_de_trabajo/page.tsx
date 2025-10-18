"use client";

import { useState } from "react";
import { crearOferta, NuevaOfertaData } from "@/lib/api";

export default function NuevaOferta() {
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("Seleccionar categoría");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async () => {
    if (!descripcion || categoria === "Seleccionar categoría") {
      setMensaje("Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    setMensaje("");

    try {
      const nuevaOferta: NuevaOfertaData = { descripcion, categoria };
      await crearOferta(nuevaOferta);
      setMensaje("Oferta creada exitosamente ✅");
      setDescripcion("");
      setCategoria("Seleccionar categoría");
    } catch (err) {
      setMensaje("Error al crear la oferta ❌");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col bg-white w-full min-h-screen">
      {/* NAVBAR */}
      <header className="flex justify-between items-center px-10 py-3 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="w-4 h-4 bg-gray-900 rounded-sm" />
          <h1 className="text-lg font-bold text-gray-900">Servineo</h1>
        </div>

        <nav className="flex gap-9 text-sm font-medium text-gray-900">
          <a href="#" className="hover:text-blue-600">Encontrar Fixers</a>
          <a href="#" className="hover:text-blue-600">Fixer</a>
          <a href="#" className="hover:text-blue-600">Mis Ofertas</a>
          <a href="#" className="hover:text-blue-600">Ayuda</a>
        </nav>
      </header>

      {/* CONTENIDO */}
      <section className="flex justify-center p-5">
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col w-[960px] space-y-6">
          {/* TÍTULO */}
          <div className="p-4">
            <h2 className="text-3xl font-bold text-gray-900">Crear nueva Oferta de Servicio</h2>
          </div>

          {/* DESCRIPCIÓN */}
          <div className="p-4 max-w-[480px]">
            <label className="block mb-2 text-gray-900 font-medium">Descripción</label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe tu servicio en 100 caracteres o menos."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {descripcion.length}/100
            </div>
          </div>

          {/* CATEGORÍA */}
          <div className="p-4 max-w-[480px]">
            <label className="block mb-2 text-gray-900 font-medium">Categoría</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option>Seleccionar categoría</option>
              <option>Plomería</option>
              <option>Electricidad</option>
              <option>Pintura</option>
            </select>
          </div>

          {/* MENSAJE */}
          {mensaje && <p className="text-sm text-red-500">{mensaje}</p>}

          {/* BOTONES */}
          <div className="flex justify-between p-4">
            <button
              onClick={() => {
                setDescripcion("");
                setCategoria("Seleccionar categoría");
                setMensaje("");
              }}
              className="bg-gray-100 text-gray-900 font-bold rounded-lg px-6 py-2 hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-600 text-white font-bold rounded-lg px-6 py-2 hover:bg-blue-700"
            >
              {loading ? "Creando..." : "Crear oferta de servicio"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
