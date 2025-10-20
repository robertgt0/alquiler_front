"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  createOffer,
  updateOffer,
  getOfferById,
  type Offer,
} from "@/app/offers/services/offersService";

export default function NuevaOferta() {
  const router = useRouter();
  const search = useSearchParams();
  const editId = search.get("edit"); // si existe, estamos editando

  const [descripcion, setDescripcion] = React.useState("");
  const [categoria, setCategoria] = React.useState("Seleccionar categoría");
  const [imagen, setImagen] = React.useState<File | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [mensaje, setMensaje] = React.useState("");

  // Si estamos en modo edición, precargar datos
  React.useEffect(() => {
    let alive = true;
    (async () => {
      if (!editId) return;
      try {
        const o = await getOfferById(editId);
        if (!alive || !o) return;
        // precargar
        setDescripcion(o.description || o.title || "");
        setCategoria(o.category || "Seleccionar categoría");
      } catch {
        // si falla, volvemos al detalle o listado
        router.push("/offers");
      }
    })();
    return () => {
      alive = false;
    };
  }, [editId, router]);

  async function fileToDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const handleSubmit = async () => {
    if (!descripcion || categoria === "Seleccionar categoría") {
      setMensaje("Por favor completa descripción y categoría");
      return;
    }

    setLoading(true);
    setMensaje("");

    try {
      let images: string[] | undefined = undefined;
      if (imagen) {
        // 1 imagen (puedes ampliar a 5 si quieres)
        images = [await fileToDataURL(imagen)];
      }

      if (editId) {
        // 🔧 EDITAR
        await updateOffer(editId, {
          title: descripcion.slice(0, 40) || "Oferta",
          description: descripcion,
          category: categoria,
          images,
        });
        setMensaje("Cambios guardados ✅");
        // Vuelve al detalle de la oferta
        router.push(`/offers/${editId}`);
      } else {
        // ✨ CREAR
        const created = await createOffer({
          title: descripcion.slice(0, 40) || "Oferta",
          description: descripcion,
          category: categoria,
          images,
          contact: { whatsapp: "555-000-0000" },
        });
        setMensaje("Oferta creada exitosamente ✅");
        // limpia
        setDescripcion("");
        setCategoria("Seleccionar categoría");
        setImagen(null);
        const fileInput = document.getElementById("input-imagen") as HTMLInputElement | null;
        if (fileInput) fileInput.value = "";
        // navega al detalle recién creado
        router.push(`/offers/${created.id}`);
      }
    } catch (err) {
      console.error(err);
      setMensaje(editId ? "Error al guardar cambios ❌" : "Error al crear la oferta ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col bg-white w-full min-h-screen">
      <header className="flex justify-between items-center px-10 py-3 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="w-4 h-4 bg-gray-900 rounded-sm" />
          <h1 className="text-lg font-bold text-gray-900">Servineo</h1>
        </div>
      </header>

      <section className="flex justify-center p-5">
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col w-[960px] space-y-6">
          <h2 className="text-xl font-bold text-gray-900">
            {editId ? "Editar oferta de servicio" : "Crear nueva oferta de servicio"}
          </h2>

          {/* DESCRIPCIÓN */}
          <div className="p-4 max-w-[480px]">
            <label className="block mb-2 text-gray-900 font-medium">Descripción</label>
            <input
              type="text"
              maxLength={100}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe tu servicio en 100 caracteres o menos."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <div className="text-right text-xs text-gray-500 mt-1">{descripcion.length}/100</div>
          </div>

          {/* CATEGORÍA */}
          <div className="p-4 max-w-[480px]">
            <label className="block mb-2 text-gray-900 font-medium">Categoría</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option>Seleccionar categoría</option>
              <option>Plomería</option>
              <option>Electricidad</option>
              <option>Pintura</option>
              <option>Carpintería</option>
              <option>General</option>
            </select>
          </div>

          {/* IMAGEN */}
          <div className="p-4 max-w-[480px]">
            <label className="block mb-2 text-gray-900 font-medium">Imagen (opcional)</label>
            <input
              id="input-imagen"
              type="file"
              accept="image/*"
              onChange={(e) => setImagen(e.target.files ? e.target.files[0] : null)}
              className="w-full"
            />
          </div>

          {/* MENSAJE */}
          {mensaje && <p className="text-sm text-blue-600">{mensaje}</p>}

          {/* BOTONES */}
          <div className="flex justify-between p-4">
            <button
              type="button"
              onClick={() => router.push(editId ? `/offers/${editId}` : "/offers")}
              className="bg-gray-100 text-gray-900 font-bold rounded-lg px-6 py-2 hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-600 text-white font-bold rounded-lg px-6 py-2 hover:bg-blue-700"
            >
              {loading ? (editId ? "Guardando..." : "Creando...") : (editId ? "Guardar cambios" : "Crear oferta")}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
