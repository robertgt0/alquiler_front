"use client";
import { useState } from "react";

const initialFormData = {
  identificador_deuda: "",
  nit: "",
  descripcion: "",
  descripcion_envio: "",
  concepto: "",
  email_cliente: "",
  nombre_cliente: "",
  apellido_cliente: "",
  ci: "",
  Costo_Unitario: 0,
};

interface FormErrors {
  identificador_deuda?: string;
  nit?: string;
  descripcion?: string;
  descripcion_envio?: string;
  concepto?: string;
  email_cliente?: string;
  nombre_cliente?: string;
  apellido_cliente?: string;
  ci?: string;
  Costo_Unitario?: string;
}

export default function HomePage() {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type } = e.target;
      setMessage("");

      let specificError: string | undefined = undefined;

      if (name === "nombre_cliente" || name === "apellido_cliente") {
          const regex = /^[\p{L} ]*$/u;
          if (!regex.test(value) && value !== "") specificError = "Solo caracteres alfabéticos";
      } else if (name === "ci") {
          const regex = /^[0-9]*$/;
          if (!regex.test(value) || value.length > 8) specificError = "Solo 8 dígitos numéricos";
      } else if (name === "identificador_deuda") {
          const regex = /^[0-9]*$/;
          if (!regex.test(value) && value !== "") specificError = "Solo dígitos numéricos";
      } else if (name === "nit") {
          const regex = /^[0-9]*$/;
          if (!regex.test(value) || value.length > 10) specificError = "Solo 10 dígitos numéricos";
      } else if (name === "descripcion" || name === "descripcion_envio" || name === "concepto") {
          const regex = /^[\p{L}\p{N} .,]*$/u;
          if (!regex.test(value) && value !== "") specificError = "No caracteres especiales (excepto . ,)";
      } else if (type === "number" && name === "Costo_Unitario") {
          const numValue = value === "" ? 0 : Number(value);
          if (numValue < 0) {
              specificError = "El monto no puede ser negativo";
          } else {
              setFormData((prev) => ({ ...prev, [name]: numValue }));
              setErrors((prev) => ({ ...prev, [name]: undefined }));
              return;
          }
      }

      setErrors((prev) => ({ ...prev, [name]: specificError }));

      if (!specificError || name === "email_cliente" ) {
           setFormData((prev) => ({
               ...prev,
               [name]: (type === "number" && name === "Costo_Unitario" && specificError) ? prev[name] : // Mantener valor anterior si hay error en Costo
                       (type === "number" && name !== "Costo_Unitario") ? Number(value) : value,
           }));
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    let currentErrors: FormErrors = {};

    if (!formData.identificador_deuda) currentErrors.identificador_deuda = "Requerido";
    if (!formData.nit) currentErrors.nit = "Requerido"; else if (formData.nit.length !== 10) currentErrors.nit = "10 dígitos";
    if (!formData.descripcion) currentErrors.descripcion = "Requerido";
    if (!formData.descripcion_envio) currentErrors.descripcion_envio = "Requerido";
    if (!formData.concepto) currentErrors.concepto = "Requerido";
    if (!formData.email_cliente) currentErrors.email_cliente = "Requerido"; else { const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; if (!emailRegex.test(formData.email_cliente)) currentErrors.email_cliente = "Inválido"; }
    if (!formData.nombre_cliente) currentErrors.nombre_cliente = "Requerido";
    if (!formData.apellido_cliente) currentErrors.apellido_cliente = "Requerido";
    if (!formData.ci) currentErrors.ci = "Requerido"; else if (formData.ci.length !== 8) currentErrors.ci = "8 dígitos";
    if (formData.Costo_Unitario <= 0) currentErrors.Costo_Unitario = "> 0";

    setErrors(currentErrors);

    if (Object.keys(currentErrors).length > 0) {
      setMessage("Por favor, corrija los errores.");
      return;
    }

    setMessage("Procesando...");
     try {
       const response = await fetch("http://localhost:5000/api/payments/registrar-deuda", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify(formData),
         });
       const data = await response.json();
       if (response.ok && !data.error && data.url_pasarela_pagos) {
         setMessage("Redirigiendo...");
         setTimeout(() => { window.location.href = data.url_pasarela_pagos; }, 1500);
       } else {
         setMessage(data.message || "Error al registrar. Verifique datos.");
       }
     } catch (err: any) {
       console.error("Error en fetch:", err);
       setMessage("Error de conexión.");
     }
  };

  const inputClass = (fieldName: keyof FormErrors) => `form-input ${errors[fieldName] ? 'input-error' : ''}`;

  return (
    <div className="page-container">
      {/* Columna 1: Título */}
      <div>
        <h1 className="hero-title">REGISTRO DE DEUDA</h1>
      </div>

      {/* Columna 2: Formulario */}
      <div className="form-wrapper">
        <div className="form-blur-background"></div>

        {/* Tarjeta Blanca */}
        <div className="form-container">
          <form onSubmit={handleSubmit} noValidate style={{ width: '100%' }}>
            <div className="form-layout-internal"> 

              {/* Columna Izquierda */}
              <div className="form-column">
                <div className="form-group">
                  <label htmlFor="id_deuda" className="form-label-styled">Identificador de deuda</label>
                  <input id="id_deuda" name="identificador_deuda" placeholder="0000000000" value={formData.identificador_deuda} onChange={handleChange} required className={inputClass('identificador_deuda')} />
                  <p className="form-error">{errors.identificador_deuda || " "}</p>
                </div>
                <div className="form-group">
                  <label htmlFor="nit" className="form-label-styled">NIT</label>
                  <input id="nit" name="nit" placeholder="0000000000" value={formData.nit} onChange={handleChange} required className={inputClass('nit')} />
                  <p className="form-error">{errors.nit || " "}</p>
                </div>
                <div className="form-group">
                  <label htmlFor="descripcion" className="form-label-styled">Descripción</label>
                  <input id="descripcion" name="descripcion" placeholder="Agregar una descripción." value={formData.descripcion} onChange={handleChange} required className={inputClass('descripcion')} />
                  <p className="form-error">{errors.descripcion || " "}</p>
                </div>
                <div className="form-group">
                  <label htmlFor="descripcion_envio" className="form-label-styled">Descripción del envío</label>
                  <input id="descripcion_envio" name="descripcion_envio" placeholder="Agregar una descripción." value={formData.descripcion_envio} onChange={handleChange} required className={inputClass('descripcion_envio')} />
                  <p className="form-error">{errors.descripcion_envio || " "}</p>
                </div>
                 <div className="form-group">
                  <label htmlFor="concepto" className="form-label-styled">Concepto</label>
                  <input id="concepto" name="concepto" placeholder="Agregar una descripción." value={formData.concepto} onChange={handleChange} required className={inputClass('concepto')} />
                  <p className="form-error">{errors.concepto || " "}</p>
                </div>
              </div> {/* Fin Columna Izquierda */}

              {/* Columna Derecha */}
              <div className="form-column">
                 <div className="form-group">
                  <label htmlFor="email" className="form-label-styled">Correo electrónico</label>
                  <input id="email" name="email_cliente" type="email" placeholder="user@example.com" value={formData.email_cliente} onChange={handleChange} required className={inputClass('email_cliente')} />
                  <p className="form-error">{errors.email_cliente || " "}</p>
                </div>
                 <div className="form-group">
                  <label htmlFor="nombre" className="form-label-styled">Nombres</label>
                  <input id="nombre" name="nombre_cliente" placeholder="Nombres" value={formData.nombre_cliente} onChange={handleChange} required className={inputClass('nombre_cliente')} />
                  <p className="form-error">{errors.nombre_cliente || " "}</p>
                </div>
                 <div className="form-group">
                  <label htmlFor="apellido" className="form-label-styled">Apellidos</label>
                  <input id="apellido" name="apellido_cliente" placeholder="Apellidos" value={formData.apellido_cliente} onChange={handleChange} required className={inputClass('apellido_cliente')} />
                  <p className="form-error">{errors.apellido_cliente || " "}</p>
                </div>
                 <div className="form-group">
                  <label htmlFor="ci" className="form-label-styled">Cédula de Identidad</label>
                  <input id="ci" name="ci" placeholder="00000000" value={formData.ci} onChange={handleChange} required className={inputClass('ci')} />
                  <p className="form-error">{errors.ci || " "}</p>
                </div>
                <div className="form-group">
                  <label htmlFor="monto" className="form-label-styled">Monto en (USD)</label>
                  <div className="input-group">
                    <span className="input-group-addon">$</span>
                    <input id="monto" name="Costo_Unitario" type="number" placeholder="0" value={formData.Costo_Unitario === 0 ? "" : formData.Costo_Unitario} onChange={handleChange} required className={`form-input input-group-field ${inputClass('Costo_Unitario')}`} min="0.01" step="0.01" />
                  </div>
                  <p className="form-error">{errors.Costo_Unitario || " "}</p>
                </div>

                {/* Botón Aceptar */}
                <div className="button-container">
                  <button type="submit" className="submit-button">
                    ACEPTAR
                  </button>
                </div>
              </div> {/* Fin Columna Derecha */}
              
            </div> {/* **** FIN DE CORRECCIÓN ESTRUCTURAL **** */}

            {/* Mensaje General (fuera del layout de columnas) */}
            {message && <p className="form-message">{message}</p>}
          </form>
        </div> {/* Fin form-container */}
      </div> {/* Fin form-wrapper */}
    </div> 
  );
}