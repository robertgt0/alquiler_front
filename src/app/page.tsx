//(front Libelula)
"use client";
import { useState } from "react";

const initialFormData = {
  email_cliente: "",
  identificador_deuda: "",
  descripcion: "",
  nombre_cliente: "",
  apellido_cliente: "",
  ci: "",
  nit: "",
  descripcion_envio: "",
  concepto: "",
  Costo_Unitario: 0,
};
interface FormErrors {
  nombre_cliente?: string;
  apellido_cliente?: string;
  ci?: string;
  //se pueden añadir más errores de otros campos aquí
}

export default function HomePage() {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [message, setMessage] = useState("");

  //manejador para todos los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    // Validar campos que solo deben ser alfabéticos (nombre y apellido)
    if (name === "nombre_cliente" || name === "apellido_cliente") {
      const regex = /^[p{L} ]*$/u;

      if (regex.test(value) || value === "") {
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
      } else {
        setErrors((prev) => ({
          ...prev,
          [name]: "Solo se pueden ingresar caracteres alfabéticos",
        }));
      }
      return;
    }

    //validar campo ci (solo digitos, max 8 caracteres y caracteres alfabéticos)
    if (name === "ci") {
      const regex = /^[0-9]*$/;

      if ((regex.test(value) && value.length <= 8) || value === "") {
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
      } else {
        setErrors((prev) => ({
          ...prev,
          [name]: "Solo se aceptan dígitos y hasta un máximo de 8.",
        }));
      }
      return;
    }

    //manejo estándar para otros campos
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.ci.length !== 8){
      setErrors((prev) => ({
        ...prev,
        ci: "El CI debe tener exactamente 8 dígitos.",
      }));
      setMessage("Por favor, corrija los errores en el formulario.");
      return;
    }

    if (Object.values(errors).some((error) => error)) {
      setMessage("Por favor, corrija los errores en el formulario.");
      return;
    }

    setMessage("Procesando");

    try {
      const response = await fetch(
        "http://localhost:5000/api/payments/registrar-deuda",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok && !data.error && data.url_pasarela_pagos) {
        setMessage("Redirigiendo a la pasarela de pago");
        window.location.href = data.url_pasarela_pagos;
      } else {
        setMessage(
          data.message ||
            "No se pudo redirigir. Verificá los datos o intenta nuevamente."
        );
      }
    } catch (err: any) {
      setMessage("Error: " + err.message);
    }
  };

  const inputStyle = {
    padding: "0.5rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    color: "#000",
  };
  
  const errorStyle = {
    color: "red",
    fontSize: "0.8rem",
    margin: "0 0 0.5rem 0",
    height: "1rem",
  };

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        backgroundColor: "#f4f4f4",
        padding: "2rem",
        display: "flex",
        justifyContent: "center",
        color: "#000",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          maxWidth: "500px",
          width: "100%",
          color: "#000",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1rem", color: "#000" }}>
          Registro de Deuda
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            color: "#000",
          }}
          noValidate
        >
          <h4 style={{ color: "#000", marginBottom: 0 }}>Datos personales</h4>
          <input
            name="email_cliente"
            placeholder="Correo electrónico"
            value={formData.email_cliente}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            name="nombre_cliente"
            placeholder="Nombre del cliente"
            value={formData.nombre_cliente}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          {/* Mensaje de error específico para el nombre */}
          <p style={errorStyle}>{errors.nombre_cliente || " "}</p>

          <input
            name="apellido_cliente"
            placeholder="Apellido del cliente"
            value={formData.apellido_cliente}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          {/* Mensaje de error específico para el apellido */}
          <p style={errorStyle}>{errors.apellido_cliente || " "}</p>
          
          <input
            name="ci"
            placeholder="CI"
            value={formData.ci}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          {/* Mensaje de error específico para CI */}
          <p style={errorStyle}>{errors.ci || " "}</p>

          <h4 style={{ color: "#000", margin: "1rem 0 0 0" }}>
            Datos de la deuda
          </h4>
          <input
            name="identificador_deuda"
            placeholder="Identificador de deuda"
            value={formData.identificador_deuda}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            name="nit"
            placeholder="NIT"
            value={formData.nit}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            name="descripcion"
            placeholder="Descripción"
            value={formData.descripcion}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            name="descripcion_envio"
            placeholder="Descripción del envío"
            value={formData.descripcion_envio}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            name="concepto"
            placeholder="Concepto"
            value={formData.concepto}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            name="Costo_Unitario"
            type="number"
            placeholder="Costo unitario"
            value={formData.Costo_Unitario}
            onChange={handleChange}
            required
            style={inputStyle}
            min="0"
          />

          <button
            type="submit"
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              padding: "0.75rem",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginTop: "1rem",
            }}
          >
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