"use client";

import { useEffect, useState, ChangeEvent } from "react";

interface Oferta {
  id: string;
  descripcion: string;
  categoria: string;
  imagen?: { data: number[] };
}

export default function VerOfertas() {
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOfertas = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/ofertas");
      if (!res.ok) throw new Error("Error al obtener las ofertas");
      const data = await res.json();
      setOfertas(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfertas();
  }, []);

  const convertirImagen = (imagen?: { data: number[] }) => {
    if (!imagen) return "";
    const base64 = Buffer.from(imagen.data).toString("base64");
    return `data:image/jpeg;base64,${base64}`;
  };

  const borrarOferta = async (id: string) => {
    if (!confirm("¿Seguro quieres borrar esta oferta?")) return;
    try {
      const res = await fetch(`http://localhost:4000/api/ofertas/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al borrar la oferta");
      fetchOfertas();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Editar oferta con descripción, categoría e imagen
  const editarOferta = async (oferta: Oferta) => {
    const nuevaDescripcion = prompt("Nueva descripción:", oferta.descripcion);
    if (nuevaDescripcion === null) return;

    const nuevaCategoria = prompt("Nueva categoría:", oferta.categoria);
    if (nuevaCategoria === null) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      let formData = new FormData();
      formData.append("descripcion", nuevaDescripcion);
      formData.append("categoria", nuevaCategoria);
      if (file) formData.append("imagen", file);

      try {
        const res = await fetch(`http://localhost:4000/api/ofertas/${oferta.id}`, {
          method: "PUT",
          body: formData,
        });
        if (!res.ok) throw new Error("Error al editar la oferta");
        fetchOfertas();
      } catch (err) {
        console.error(err);
      }
    };
    input.click();
  };

  if (loading) return <p className="p-6 text-gray-600">Cargando ofertas...</p>;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">📋 Ofertas registradas</h1>

      {ofertas.length === 0 ? (
        <p className="text-gray-500">No hay ofertas disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ofertas.map((oferta) => (
            <div key={oferta.id} className="bg-white rounded-lg shadow p-4">
              {oferta.imagen ? (
                <img
                  src={convertirImagen(oferta.imagen)}
                  alt="oferta"
                  className="w-full h-48 object-cover rounded-md mb-3"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded-md mb-3 flex items-center justify-center text-gray-500">
                  Sin imagen
                </div>
              )}
              <h2 className="font-bold text-gray-800">{oferta.descripcion}</h2>
              <p className="text-gray-600">{oferta.categoria}</p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => editarOferta(oferta)}
                  className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500"
                >
                  Editar
                </button>
                <button
                  onClick={() => borrarOferta(oferta.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Borrar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
