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
  identificador_deuda?: string;
  nit?: string;
  descripcion?: string;
  descripcion_envio?: string;
  concepto?: string;
  Costo_Unitario?: string;
  email_cliente?: string;
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
      const regex = /^[\p{L} ]*$/u;

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

    //validar identificador_deuda (solo dígitos)
    if (name === "identificador_deuda") {
      const regex = /^[0-9]*$/;

      if (regex.test(value) || value === "") {
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
      } else {
        setErrors((prev) => ({
          ...prev,
          [name]: "El identificador de deuda solo se permite ingresar digitos numericos",
        }));
      }
      return;
    }

    //validar NIT (solo dígitos, máximo 10)
    if (name === "nit") {
      const regex = /^[0-9]*$/;

      if ((regex.test(value) && value.length <= 10) || value === "") {
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
      } else {
        setErrors((prev) => ({
          ...prev,
          [name]: "Solo se aceptan dígitos y hasta un máximo de 10.",
        }));
      }
      return;
    }

    //validar descripcion (solo letras Unicode y espacios)
    if (name === "descripcion") {
      const regex = /^[\p{L} ]*$/u;

      if (regex.test(value) || value === "") {
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
      } else {
        setErrors((prev) => ({
          ...prev,
          [name]: "No se pueden ingresar caracteres numéricos o especiales",
        }));
      }
      return;
    }

    //validar descripcion_envio (solo letras Unicode y espacios)
    if (name === "descripcion_envio") {
      const regex = /^[\p{L} ]*$/u;

      if (regex.test(value) || value === "") {
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
      } else {
        setErrors((prev) => ({
          ...prev,
          [name]: "No se pueden ingresar caracteres numéricos o especiales",
        }));
      }
      return;
    }

    //validar concepto (solo letras Unicode y espacios)
    if (name === "concepto") {
      const regex = /^[\p{L} ]*$/u;

      if (regex.test(value) || value === "") {
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
      } else {
        setErrors((prev) => ({
          ...prev,
          [name]: "No se pueden ingresar caracteres numéricos o especiales",
        }));
      }
      return;
    }

    if (name === "email_cliente") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
      return;
    }

    //manejo estándar para otros campos
    if (type === "number") {
      const numValue = Number(value);

      if (name === "Costo_Unitario") {
        if (numValue < 0) {
          setErrors((prev) => ({
            ...prev,
            [name]: "El monto no puede ser negativo",
          }));
        } else {
          setFormData((prev) => ({ ...prev, [name]: numValue }));
          setErrors((prev) => ({ ...prev, [name]: "" }));
        }
      } else {
        setFormData((prev) => ({ ...prev, [name]: numValue }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.ci.length !== 8) {
      setErrors((prev) => ({
        ...prev,
        ci: "El CI debe tener exactamente 8 dígitos.",
      }));
      setMessage("Por favor, corrija los errores en el formulario.");
      return;
    }

    if (formData.nit.length !== 10) {
      setErrors((prev) => ({
        ...prev,
        nit: "El campo de NIT solo debe tener 10 digitos",
      }));
      setMessage("Por favor, corrija los errores en el formulario.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email_cliente)) {
      setErrors((prev) => ({
        ...prev,
        email_cliente: "Correo invalido",
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

  return (
    <div className="page-container">
      {/* Columna 1: El Título */}
      <div>
        <h1 className="hero-title">REGISTRO DE DEUDA</h1>
      </div>

      {/* Columna 2: La tarjeta del formulario */}
      <div className="form-container">
        {/* El h2 que estaba aquí fue ELIMINADO */}

        
      <div className="page-container">
        {/* Columna 1: El Título */}
        <div>
          <h1 className="hero-title">REGISTRO DE DEUDA</h1>
        </div>

        {/* --- INICIO DE CAMBIOS: Añadir el form-wrapper y los decorativos --- */}
        {/* Columna 2: La tarjeta del formulario, ahora envuelta en form-wrapper */}
        <div className="form-wrapper">
          <div className="form-blur-background"></div> {/* El blur de fondo */}
          <div className="form-bottom-border"></div> {/* La línea de abajo */}
          
          <div className="form-container"> {/* TU TARJETA BLANCA YA EXISTENTE */}
            <form onSubmit={handleSubmit} className="form-layout" noValidate>
              {/* El contenido del formulario se queda EXACTAMENTE IGUAL */}
              {/* ... (todos los form-group, labels, inputs, errores, etc.) ... */}

              {/* Botón Aceptar */}
              <div className="button-container">
                <button type="submit" className="submit-button">
                  ACEPTAR
                </button>
              </div>
            </form>

            {message && <p className="form-message">{message}</p>}
          </div> {/* Cierre de form-container */}
        </div> {/* Cierre de form-wrapper */}
        {/* --- FIN DE CAMBIOS --- */}
      </div>



        <form onSubmit={handleSubmit} className="form-layout" noValidate>
          <h4 className="form-section-title">Datos personales</h4>
          <input
            name="email_cliente"
            placeholder="Correo electrónico"
            value={formData.email_cliente}
            onChange={handleChange}
            required
            className="form-input"
          />
          {/* Mensaje de error específico para email */}
          <p className="form-error">{errors.email_cliente || " "}</p>

          <input
            name="nombre_cliente"
            placeholder="Nombre del cliente"
            value={formData.nombre_cliente}
            onChange={handleChange}
            required
            className="form-input"
          />
          {/* Mensaje de error específico para el nombre */}
          <p className="form-error">{errors.nombre_cliente || " "}</p>

          <input
            name="apellido_cliente"
            placeholder="Apellido del cliente"
            value={formData.apellido_cliente}
            onChange={handleChange}
            required
            className="form-input"
          />
          {/* Mensaje de error específico para el apellido */}
          <p className="form-error">{errors.apellido_cliente || " "}</p>

          <input
            name="ci"
            placeholder="CI"
            value={formData.ci}
            onChange={handleChange}
            required
            className="form-input"
          />
          {/* Mensaje de error específico para CI */}
          <p className="form-error">{errors.ci || " "}</p>

          <h4 className="form-section-title">Datos de la deuda</h4>
          <input
            name="identificador_deuda"
            placeholder="Identificador de deuda"
            value={formData.identificador_deuda}
            onChange={handleChange}
            required
            className="form-input"
          />
          {/* Mensaje de error específico para identificador_deuda */}
          <p className="form-error">{errors.identificador_deuda || " "}</p>

          <input
            name="nit"
            placeholder="NIT"
            value={formData.nit}
            onChange={handleChange}
            required
            className="form-input"
          />
          {/* Mensaje de error específico para NIT */}
          <p className="form-error">{errors.nit || " "}</p>

          <input
            name="descripcion"
            placeholder="Descripción"
            value={formData.descripcion}
            onChange={handleChange}
            required
            className="form-input"
          />
          {/* Mensaje de error específico para descripción */}
          <p className="form-error">{errors.descripcion || " "}</p>

          <input
            name="descripcion_envio"
            placeholder="Descripción del envío"
            value={formData.descripcion_envio}
            onChange={handleChange}
            required
            className="form-input"
          />
          {/* Mensaje de error específico para descripción envío */}
          <p className="form-error">{errors.descripcion_envio || " "}</p>

          <input
            name="concepto"
            placeholder="Concepto"
            value={formData.concepto}
            onChange={handleChange}
            required
            className="form-input"
          />
          {/* Mensaje de error específico para concepto */}
          <p className="form-error">{errors.concepto || " "}</p>

          <label className="form-label">Monto (en USD)</label>
          <div className="input-group">
            <span className="input-group-addon">$</span>
            <input
              name="Costo_Unitario"
              type="number"
              placeholder="Costo unitario"
              value={formData.Costo_Unitario}
              onChange={handleChange}
              required
              className="form-input input-group-field" // Tiene 2 clases
              min="0"
            />
          </div>
          {/* Mensaje de error específico para Costo Unitario */}
          <p className="form-error">{errors.Costo_Unitario || " "}</p>

          <button type="submit" className="submit-button">
            Aceptar
          </button>
        </form>

        {message && <p className="form-message">{message}</p>}
      </div>
    </div>
  );
}