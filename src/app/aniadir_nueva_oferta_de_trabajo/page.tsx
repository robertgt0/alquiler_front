"use client";

import React, { useState, type FormEvent, type DragEvent } from "react";

type ImgItem = { name: string; type: string; dataUrl: string };

export default function NuevaOferta() {
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [imagenes, setImagenes] = useState<ImgItem[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const MAX_LEN = 100;
  const MAX_IMGS = 5;
  const MAX_MB = 1;

  function onDescChange(v: string) {
    if (v.length <= MAX_LEN) setDescripcion(v);
  }

  async function handleFiles(files: FileList | null) {
    if (!files) return;
    const arr = Array.from(files);

    if (imagenes.length + arr.length > MAX_IMGS) {
      setMsg(`❌ Máximo ${MAX_IMGS} imágenes.`);
      return;
    }

    const newOnes: ImgItem[] = [];
    for (const f of arr) {
      if (!f.type.startsWith("image/")) {
        setMsg("❌ Solo se permiten imágenes.");
        continue;
      }
      if (f.size > MAX_MB * 1024 * 1024) {
        setMsg(`❌ ${f.name} supera ${MAX_MB}MB`);
        continue;
      }
      const dataUrl = await fileToDataUrl(f);
      newOnes.push({ name: f.name, type: f.type, dataUrl });
    }
    setImagenes((prev) => [...prev, ...newOnes]);
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (!descripcion.trim()) return setMsg("❌ La descripción es obligatoria.");
    if (!categoria) return setMsg("❌ Selecciona una categoría.");

    setEnviando(true);
    try {
      const res = await fetch("/historias-de-usuario/oferta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: `Oferta - ${categoria}`,
          descripcion: descripcion.trim(),
          categoria,
          imagenes, // [{name,type,dataUrl}]
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        setMsg(data?.message ?? "❌ Error al guardar.");
        setEnviando(false);
        return;
      }
      setMsg("✅ ¡Oferta creada!");
      setDescripcion("");
      setCategoria("");
      setImagenes([]);
    } catch (err) {
      console.error(err);
      setMsg("❌ Error de red/servidor.");
    } finally {
      setEnviando(false);
    }
  }

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
        <form onSubmit={onSubmit} className="flex flex-col w-[960px] space-y-6">
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
              onChange={(e) => onDescChange(e.target.value)}
              placeholder="Describe tu servicio en 100 caracteres o menos."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {descripcion.length}/{MAX_LEN}
            </div>
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
              <option value="">Seleccionar categoría</option>
              <option value="Plomería">Plomería</option>
              <option value="Electricidad">Electricidad</option>
              <option value="Pintura">Pintura</option>
              <option value="Carpintería">Carpintería</option>
              <option value="Limpieza">Limpieza</option>
            </select>
          </div>

          {/* ADJUNTAR IMÁGENES */}
          <div
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOver(true); }}
            onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragOver(false); }}
            onDrop={onDrop}
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-14 space-y-6 transition-colors ${
              dragOver ? "border-blue-400 bg-blue-50/50" : "border-gray-300"
            }`}
          >
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900">Adjuntar Imágenes</h3>
              <p className="text-sm text-gray-600">
                Sube imágenes para una mejor descripción de tu servicio
              </p>
            </div>

            {/* Botón subir (input oculto) */}
            <label className="bg-gray-100 text-gray-700 rounded-lg px-6 py-2 hover:bg-gray-200 cursor-pointer">
              Subir imagen
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </label>

            {/* Previews */}
            {imagenes.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 w-full">
                {imagenes.map((img, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-2 text-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.dataUrl}
                      alt={img.name}
                      className="w-full h-28 object-cover rounded-md"
                    />
                    <div className="text-[11px] text-gray-600 mt-1 break-words">{img.name}</div>
                    <button
                      type="button"
                      onClick={() => setImagenes((prev) => prev.filter((_, x) => x !== i))}
                      className="mt-2 inline-block text-xs px-3 py-1 rounded-full border border-red-500 text-red-600 hover:bg-red-50"
                    >
                      Quitar
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="text-xs text-gray-500">
              Máximo {MAX_IMGS} imágenes, {MAX_MB}MB c/u
            </div>
          </div>

          {/* BOTONES */}
          <div className="flex justify-between p-4">
            <button
              type="button"
              onClick={() => history.back()}
              className="bg-gray-100 text-gray-900 font-bold rounded-lg px-6 py-2 hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="bg-blue-600 text-white font-bold rounded-lg px-6 py-2 hover:bg-blue-700 disabled:opacity-80"
            >
              {enviando ? "Guardando..." : "Crear oferta de servicio"}
            </button>
          </div>

          {msg && (
            <p className={`text-center font-semibold ${msg.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
              {msg}
            </p>
          )}
        </form>
      </section>
    </main>
  );
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result));
    fr.onerror = reject;
    fr.readAsDataURL(file); // data:image/png;base64,....
  });
}
