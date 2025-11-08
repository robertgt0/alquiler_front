import React, { useState, useEffect } from "react";

interface BusquedaAvanzadaProps {
  onAplicarFiltros: (filtros: Filtros) => void;
  onLimpiarFiltros?: () => void;
  onToggle?: (abierta: boolean) => void;
}

export interface Filtros {
  tipoServicio?: string;
  zona?: string;
  precioMin?: number;
  precioMax?: number;
  horario?: string;
  experiencia?: string;
  fecha?: string;
}

const tiposDeServicio = ["Electricidad", "Plomería", "Limpieza", "Pintura", "Carpintería"];
const zonas = ["Zona Sur", "Zona Norte", "Zona Este", "Zona Oeste", "Centro"];
const horarios = ["Mañana", "Tarde", "Noche", "Tiempo Completo"];
const experiencias = ["0 a 1 año", "1 a 3 años", "3 a 5 años", "5 a 10 años"];

const BusquedaAvanzada: React.FC<BusquedaAvanzadaProps> = ({
  onAplicarFiltros,
  onLimpiarFiltros,
}) => {
  const [filtros, setFiltros] = useState<Filtros>({});
  const [expandido, setExpandido] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Cargar filtros guardados solo en el cliente
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("filtrosBusqueda");
      if (saved) setFiltros(JSON.parse(saved));
    }
  }, []);

  // Guardar filtros en localStorage cuando cambien
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("filtrosBusqueda", JSON.stringify(filtros));
    }
  }, [filtros]);

  const handleChange = (campo: keyof Filtros, valor: string) => {
    if ((campo === "precioMin" || campo === "precioMax") && valor && !/^\d*$/.test(valor)) return;

    if (campo === "fecha" && valor) {
      const hoy = new Date().toISOString().split("T")[0];
      if (valor < hoy) {
        setError("No puedes seleccionar fechas anteriores al día actual.");
        return;
      } else {
        setError(null);
      }
    }

    setFiltros((prev) => ({
      ...prev,
      [campo]: campo === "precioMin" || campo === "precioMax" ? Number(valor) : valor,
    }));
  };

  const limpiar = () => {
    setFiltros({});
    if (typeof window !== "undefined") localStorage.removeItem("filtrosBusqueda");
    setMensaje(null);
    setError(null);
    onLimpiarFiltros?.();
  };

  const aplicar = () => {
    if (filtros.precioMin && filtros.precioMax && filtros.precioMin > filtros.precioMax) {
      setError("El valor mínimo no puede ser mayor al valor máximo.");
      return;
    }
    setError(null);
    onAplicarFiltros(filtros);
    setMensaje("Filtros aplicados correctamente.");
    setTimeout(() => setMensaje(null), 3000);
  };

  const hayFiltrosActivos = Object.values(filtros).some((v) => v !== "" && v !== undefined);

  return (
    <div className="w-full bg-white rounded-xl shadow p-4">
      {/* Barra superior */}
      <div className="flex justify-end items-center border-b pb-3">
        <button
          onClick={() => setExpandido(!expandido)}
          className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition cursor-pointer"
        >
          <span> Búsqueda avanzada</span>
          <span className="text-sm">{expandido ? "▲" : "▼"}</span>
        </button>
      </div>

      {/* Contenido expandible */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          expandido ? "max-h-[1200px] opacity-100 mt-6" : "max-h-0 opacity-0 mt-0"
        }`}
      >
        <div className="flex flex-wrap gap-4 justify-between">
          {/* Tipo de servicio */}
          <div className="flex flex-col w-[30%] min-w-[180px]">
            <label className="text-sm font-medium mb-1">Tipo de servicio</label>
            <select
              className={`p-2 border rounded-lg ${filtros.tipoServicio ? "border-blue-500" : ""}`}
              value={filtros.tipoServicio || ""}
              onChange={(e) => handleChange("tipoServicio", e.target.value)}
            >
              <option value="">Selecciona...</option>
              {tiposDeServicio.map((tipo) => (
                <option key={tipo} value={tipo.toLowerCase()}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          {/* Zona */}
          <div className="flex flex-col w-[30%] min-w-[180px]">
            <label className="text-sm font-medium mb-1">Zona</label>
            <select
              className={`p-2 border rounded-lg ${filtros.zona ? "border-blue-500" : ""}`}
              value={filtros.zona || ""}
              onChange={(e) => handleChange("zona", e.target.value)}
            >
              <option value="">Selecciona...</option>
              {zonas.map((z) => (
                <option key={z} value={z.toLowerCase()}>
                  {z}
                </option>
              ))}
            </select>
          </div>

          {/* Rango de precios */}
          <div className="flex flex-col w-[30%] min-w-[180px]">
            <label className="text-sm font-medium mb-1">Precio (mín – máx)</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="mín"
                className={`w-full p-2 border rounded-lg ${filtros.precioMin ? "border-blue-500" : ""}`}
                value={filtros.precioMin || ""}
                onChange={(e) => handleChange("precioMin", e.target.value)}
              />
              <input
                type="text"
                placeholder="máx"
                className={`w-full p-2 border rounded-lg ${filtros.precioMax ? "border-blue-500" : ""}`}
                value={filtros.precioMax || ""}
                onChange={(e) => handleChange("precioMax", e.target.value)}
              />
            </div>
          </div>

          {/* Horario */}
          <div className="flex flex-col w-[30%] min-w-[180px]">
            <label className="text-sm font-medium mb-1">Disponibilidad</label>
            <select
              className={`p-2 border rounded-lg ${filtros.horario ? "border-blue-500" : ""}`}
              value={filtros.horario || ""}
              onChange={(e) => handleChange("horario", e.target.value)}
            >
              <option value="">Selecciona...</option>
              {horarios.map((h) => (
                <option key={h} value={h.toLowerCase()}>
                  {h}
                </option>
              ))}
            </select>
          </div>

          {/* Experiencia */}
          <div className="flex flex-col w-[30%] min-w-[180px]">
            <label className="text-sm font-medium mb-1">Experiencia</label>
            <select
              className={`p-2 border rounded-lg ${filtros.experiencia ? "border-blue-500" : ""}`}
              value={filtros.experiencia || ""}
              onChange={(e) => handleChange("experiencia", e.target.value)}
            >
              <option value="">Selecciona...</option>
              {experiencias.map((exp) => (
                <option key={exp} value={exp}>
                  {exp}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha */}
          <div className="flex flex-col w-[30%] min-w-[180px]">
            <label className="text-sm font-medium mb-1">Fecha</label>
            <input
              type="date"
              className={`p-2 border rounded-lg ${filtros.fecha ? "border-blue-500" : ""}`}
              value={filtros.fecha || ""}
              onChange={(e) => handleChange("fecha", e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        {/* Mensajes */}
        {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
        {mensaje && <p className="text-green-600 text-sm mt-3">{mensaje}</p>}

        {/* Botones */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={aplicar}
            disabled={!hayFiltrosActivos}
            className={`px-5 py-2 rounded-lg transition text-white ${
              hayFiltrosActivos ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Aplicar
          </button>
          <button
            onClick={limpiar}
            disabled={!hayFiltrosActivos}
            className={`px-5 py-2 rounded-lg transition ${
              hayFiltrosActivos ? "bg-gray-200 text-gray-700 hover:bg-gray-300" : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Limpiar
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusquedaAvanzada;
