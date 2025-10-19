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

  const [modalVisible, setModalVisible] = useState(false);
  const [editandoDatos, setEditandoDatos] = useState<Oferta | null>(null);
  const [ofertaSeleccionada, setOfertaSeleccionada] = useState<Oferta | null>(null);
  const [nuevaImagen, setNuevaImagen] = useState<File | null>(null);

  // 🔹 Obtener ofertas
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

  // 🔹 Convertir imagen
  const convertirImagen = (imagen?: { data: number[] }) => {
    if (!imagen) return "";
    const base64 = Buffer.from(imagen.data).toString("base64");
    return `data:image/jpeg;base64,${base64}`;
  };

  // 🔹 Abrir modal de edición
  const abrirEditar = (oferta: Oferta) => {
    setEditandoDatos(oferta);
    setNuevaImagen(null);
    setModalVisible(true);
  };

  // 🔹 Guardar cambios de edición
  const guardarCambios = async () => {
    if (!editandoDatos) return;

    try {
      const formData = new FormData();
      formData.append("descripcion", editandoDatos.descripcion);
      formData.append("categoria", editandoDatos.categoria);
      if (nuevaImagen) formData.append("imagen", nuevaImagen);

      const res = await fetch(`http://localhost:4000/api/ofertas/${editandoDatos.id}`, {
        method: "PUT",
        body: formData,
      });
      if (!res.ok) throw new Error("Error al editar la oferta");

      setModalVisible(false);
      setEditandoDatos(null);
      setNuevaImagen(null);
      fetchOfertas();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Abrir modal de confirmación de borrado
  const abrirBorrar = (oferta: Oferta) => {
    setOfertaSeleccionada(oferta);
    setModalVisible(true);
  };

  // 🔹 Borrar oferta
  const borrarOferta = async () => {
    if (!ofertaSeleccionada) return;
    try {
      const res = await fetch(`http://localhost:4000/api/ofertas/${ofertaSeleccionada.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al borrar la oferta");

      setModalVisible(false);
      setOfertaSeleccionada(null);
      fetchOfertas();
    } catch (err) {
      console.error(err);
    }
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
                  onClick={() => abrirEditar(oferta)}
                  className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500"
                >
                  Editar
                </button>
                <button
                  onClick={() => abrirBorrar(oferta)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Borrar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de edición */}
      {modalVisible && editandoDatos && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Fondo difuminado */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

          {/* Contenido del modal */}
          <div className="bg-white rounded-xl p-8 w-96 text-center flex flex-col gap-4 shadow-xl relative z-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Editar Oferta</h2>

            <input
              type="text"
              value={editandoDatos.descripcion}
              onChange={(e) =>
                setEditandoDatos({ ...editandoDatos, descripcion: e.target.value })
              }
              placeholder="Descripción"
              className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="text"
              value={editandoDatos.categoria}
              onChange={(e) =>
                setEditandoDatos({ ...editandoDatos, categoria: e.target.value })
              }
              placeholder="Categoría"
              className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                if (e.target.files?.[0]) setNuevaImagen(e.target.files[0]);
              }}
              className="border border-gray-300 rounded p-2 w-full"
            />

            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={guardarCambios}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Guardar Cambios
              </button>
              <button
                onClick={() => {
                  setModalVisible(false);
                  setEditandoDatos(null);
                  setNuevaImagen(null);
                }}
                className="bg-gray-200 px-6 py-2 rounded hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de borrado */}
      {modalVisible && !editandoDatos && ofertaSeleccionada && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Fondo difuminado */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

          {/* Contenido del modal */}
          <div className="bg-white w-[960px] max-w-full rounded-xl flex flex-col items-center p-8 gap-4 shadow-xl relative z-10">
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              ¿Estás seguro de eliminar esta oferta de trabajo?
            </h2>
            <p className="text-gray-700 text-center">
              Esta acción no se puede deshacer. Eliminar esta oferta la removerá de la lista de ofertas disponibles.
            </p>

            <div className="flex flex-row justify-center items-center gap-4 mt-4 flex-wrap w-full">
              <button
                onClick={borrarOferta}
                className="bg-red-600 text-white font-bold px-6 py-2 rounded-lg flex items-center justify-center hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>

              <button
                onClick={() => {
                  setModalVisible(false);
                  setOfertaSeleccionada(null);
                }}
                className="bg-gray-200 text-gray-800 font-bold px-6 py-2 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
