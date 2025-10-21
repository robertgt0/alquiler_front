//(front Libelula)
"use client";
import { useState } from "react";

export default function HomePage() {
  const [email_cliente, setEmail] = useState("");
  const [identificador_deuda, setIdentificadorDeuda] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [nombre_cliente, setNombreCliente] = useState("");
  const [apellido_cliente, setApellidoCliente] = useState("");
  const [ci, setCi] = useState("");
  const [nit, setNit] = useState("");
  const [descripcion_envio, setDescripcionEnvio] = useState("");
  const [concepto, setConcepto] = useState("");
  const [Costo_Unitario, setCostoUnitario] = useState(0);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Procesando");

    try {
      const response = await fetch("http://localhost:5000/api/payments/registrar-deuda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email_cliente,
          identificador_deuda,
          descripcion,
          nombre_cliente,
          apellido_cliente,
          ci,
          nit,
          descripcion_envio,
          concepto,
          Costo_Unitario,
        }),
      });

      const data = await response.json();

      if (response.ok && !data.error && data.url_pasarela_pagos) {
        setMessage("Redirigiendo a la pasarela de pago");
        window.location.href = data.url_pasarela_pagos;
      } else {
        setMessage("No se pudo redirigir. Verificá los datos o intenta nuevamente.");
      }
    } catch (err: any) {
      setMessage("Error" + err.message);
    }
  };

  return (
    <div style={{
      fontFamily: "sans-serif",
      backgroundColor: "#f4f4f4",
      padding: "2rem",
      display: "flex",
      justifyContent: "center",
      color: "#000",
    }}>
      <div style={{
        backgroundColor: "#fff",
        padding: "2rem",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        maxWidth: "500px",
        width: "100%",
        color: "#000",
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "1rem", color: "#000" }}>
          Registro de Deuda
        </h2>

        <form onSubmit={handleSubmit} style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          color: "#000",
        }}>
          <h4 style={{ color: "#000" }}>Datos personales</h4>
          <input placeholder="Correo electrónico" value={email_cliente} onChange={(e) => setEmail(e.target.value)} required />
          <input placeholder="Nombre del cliente" value={nombre_cliente} onChange={(e) => setNombreCliente(e.target.value)} required />
          <input placeholder="Apellido del cliente" value={apellido_cliente} onChange={(e) => setApellidoCliente(e.target.value)} required />
          <input placeholder="CI" value={ci} onChange={(e) => setCi(e.target.value)} required />

          <h4 style={{ color: "#000" }}> Datos de la deuda</h4>
          <input placeholder="Identificador de deuda" value={identificador_deuda} onChange={(e) => setIdentificadorDeuda(e.target.value)} required />
          <input placeholder="NIT" value={nit} onChange={(e) => setNit(e.target.value)} required />
          <input placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
          <input placeholder="Descripción del envío" value={descripcion_envio} onChange={(e) => setDescripcionEnvio(e.target.value)} required />
          <input placeholder="Concepto" value={concepto} onChange={(e) => setConcepto(e.target.value)} required />
          <input type="number" placeholder="Costo unitario" value={Costo_Unitario} onChange={(e) => setCostoUnitario(Number(e.target.value))} required />
          <div style={{ display: "flex", gap: "1rem" }}>
          </div>

          <button type="submit" style={{
            backgroundColor: "#007bff",
            color: "#fff",
            padding: "0.75rem",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}>
            Aceptar
          </button>
        </form>

        {message && (
          <p style={{ marginTop: "1rem", textAlign: "center", color: "#000" }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
//(front Libelula)