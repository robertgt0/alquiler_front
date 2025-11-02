"use client";


import Header from "./Header"; 
import { useState, useRef, useEffect, useMemo } from "react";
import { crearOferta } from "@/lib/api"; // 👈 usamos tu API centralizada

export default function Page() {
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("Seleccionar categoría");
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDirty = useMemo(() => {
    return descripcion !== "" ||
           categoria !== "Seleccionar categoría" ||
           imagenes.length > 0;
  }, [descripcion, categoria, imagenes]);

  const handleSubmit = async () => {
    if (!descripcion || categoria === "Seleccionar categoría" || imagenes.length === 0) {
      setMensaje("Por favor completa todos los campos y selecciona una imagen");
      return;
    }

    setLoading(true);
    setMensaje("");

    try {
      const formData = new FormData();
      formData.append("descripcion", descripcion);
      formData.append("categoria", categoria);
      for (const imagen of imagenes) {
        formData.append("imagenes", imagen);
      }

      
      await crearOferta(formData);

      setMensaje("Oferta creada exitosamente ✅");
      setDescripcion("");
      setCategoria("Seleccionar categoría");
      setImagenes([]);
      setPreviewUrls([]);

      // Reset manual del input file
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error(err);
      setMensaje("Error al crear la oferta ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (files && files[0]) {
      const nuevosArchivos = Array.from(files);

      if (imagenes.length + nuevosArchivos.length > 5) {
        setMensaje("No puedes subir más de 5 imágenes.");
        return;
      }

      for (const file of nuevosArchivos) {
        if (file.size > 5 * 1024 * 1024) { // Límite de 5MB por imagen
          setMensaje(`La imagen "${file.name}" supera los 5MB y no será añadida.`);
          continue; // Salta este archivo y continúa con el siguiente
        }
        setImagenes(prev => [...prev, file]);
        setPreviewUrls(prev => [...prev, URL.createObjectURL(file)]);
      }

      setMensaje("");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleCancel = () => {
    if (isDirty) {
      const confirmed = window.confirm("¿Estás seguro de que quieres salir? Perderás los cambios no guardados.");
      if (!confirmed) {
        return;
      }
    }

    // Resetear el formulario
    setDescripcion("");
    setCategoria("Seleccionar categoría");
    setImagenes([]);
    setMensaje("");
    setPreviewUrls([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    // Limpiar el object URL para evitar memory leaks
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  return (
    <main className="flex flex-col bg-white w-full min-h-screen">
      <Header />
      <section className="flex justify-center p-5">
        <div className="w-[960px]">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">Crear nueva oferta de servicio</h1>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col space-y-6"
          >
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
              </select>
            </div>

            {/* IMAGEN */}
            <div className="p-4 max-w-[480px] space-y-2">
              <label className="block text-gray-900 font-medium">Adjuntar imágenes</label>
              {previewUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative w-full h-24 rounded-lg overflow-hidden border-2 border-gray-300">
                      <img src={url} alt={`Previsualización ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setImagenes(prev => prev.filter((_, i) => i !== index));
                          setPreviewUrls(prev => prev.filter((_, i) => i !== index));
                        }}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                        aria-label={`Eliminar imagen ${index + 1}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {imagenes.length < 5 && (
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" /></svg>
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Arrastra y suelta</span> o haz clic para subir</p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 5MB)</p>
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
                required
              />
            </div>

            {/* MENSAJE */}
            {mensaje && <p className="text-sm text-red-500">{mensaje}</p>}

            {/* BOTONES */}
            <div className="flex justify-between p-4">
              <button
                type="button"
                onClick={handleCancel}
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
                {loading ? "Creando..." : "Crear oferta de servicio"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
