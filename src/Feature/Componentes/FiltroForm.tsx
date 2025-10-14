"use client";

import { useFiltros } from "@Feature/Hooks/useFiltro";
import "./FiltrosForm.css";

export default function FiltrosForm() {
  const {
    ciudades,
    provincias,
    disponibilidad,
    especialidades,
    filtro,
    handleChange,
  } = useFiltros();

  const handleBuscar = () => {
    console.log("Filtros aplicados:", filtro);
  };

  return (
    <div className="filtros-container">
      <div className="buscador">
        <input
          type="text"
          placeholder="Fra..."
          className="buscador-input"
        />
        <button className="buscador-btn">Buscar</button>
      </div>

      <h3 className="titulo">Filtrar por:</h3>

      <div className="filtros-selects">
   <select
  value={filtro.ciudad || ""}
  onChange={(e) => handleChange("ciudad", e.target.value)}
>
  <option value="">Elige una ciudad</option>
  {ciudades.map((c) => (
    <option key={c.value} value={c.value}>
      {c.label}
    </option>
  ))}
</select>

<select
  value={filtro.provincia || ""}
  onChange={(e) => handleChange("provincia", e.target.value)}
>
  {/* Esta opción inicial también está bien */}
  <option value="">Elige una provincia</option>
  {provincias.map((p) => (
    <option key={p.value} value={p.value}>
      {p.label}
    </option>
  ))}
</select>


        <select onChange={(e) => handleChange("disponibilidad", e.target.value)}>
          <option value="">Disponibilidad</option>
          {disponibilidad.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => handleChange("tipoEspecialidad", e.target.value)}
        >
          <option value="">Tipo de Especialidad</option>
          {especialidades.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div className="paginacion">
        <button className="activo">1</button>
        {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <button key={num}>{num}</button>
        ))}
        <button className="siguiente">Siguiente &gt;</button>
      </div>
    </div>
  );
}
