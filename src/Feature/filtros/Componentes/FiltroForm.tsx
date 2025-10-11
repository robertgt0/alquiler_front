import React from "react";
import { useFiltros } from "../Hooks/useFiltro";

export const FiltrosForm: React.FC = () => {
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
    <div style={{ padding: "20px", maxWidth: "800px" }}>
      <h3>Filtrar por:</h3>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <select onChange={(e) => handleChange("ciudad", e.target.value)}>
          <option value="">Ciudad</option>
          {ciudades.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        <select onChange={(e) => handleChange("provincia", e.target.value)}>
          <option value="">Provincia</option>
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

        <button onClick={handleBuscar}>Buscar</button>
      </div>
    </div>
  );
};
