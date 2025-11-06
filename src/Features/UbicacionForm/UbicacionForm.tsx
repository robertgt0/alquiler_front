<<<<<<< HEAD
"use client";
import { useState } from "react";
import "./UbicacionForm.css";

export default function UbicacionForm() {
  const [direccion, setDireccion] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!direccion.trim()) {
      setError("La dirección es obligatoria");
      return;
    }
    setError("");
    console.log("Ubicación guardada:", direccion);
  };

  return (
    <form className="ubicacion-form" onSubmit={handleSubmit}>
      <label htmlFor="direccion">Dirección:</label>
      <input
        id="direccion"
        type="text"
        value={direccion}
        onChange={(e) => setDireccion(e.target.value)}
        placeholder="Ingresa tu dirección"
      />
      {error && <p className="error">{error}</p>}
      <button type="submit">Guardar ubicación</button>
    </form>
  );
}
=======
'use client';

export default function UbicacionForm() {
  return (
    <div>
      <h1>Formulario de Ubicación</h1>
      <p>Componente de formulario de ubicación</p>
    </div>
  );
}
>>>>>>> 0d3f19614c8a0153cb80a559e6d552ea9d75a0e2
