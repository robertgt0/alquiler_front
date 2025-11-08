"use client";    
import React, { useState, useEffect } from "react";

const RecargaQR: React.FC = () => {
  //para selector CI/NIT
  const [tipoDocumento, setTipoDocumento] = useState("CI");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [mensajeError, setMensajeError] = useState("");

  const [saldo] = useState<number>(12730.5);
  const [monto, setMonto] = useState<number | string>("");
  const [montoError, setMontoError] = useState<string>(""); //estado para manejar el error
  const [nombre, setNombre] = useState<string>("");
  //const [tipoDoc, setTipoDoc] = useState<string>("CI");
  const [nit, setNit] = useState<string>("");
  const [telefono, setTelefono] = useState<string>("");
  //const [correo, setCorreo] = useState<string>("");
  const [detalle, setDetalle] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [correo, setCorreo] = useState("");
  const [correoError, setCorreoError] = useState("");

    type ErroresType = {
    monto?: string;
    nombre?: string;
    documento?: string;
    telefono?: string;
    correo?: string;
    detalle?: string;
  };

  const [errores, setErrores] = useState<ErroresType>({});

  useEffect(() => {
    let valid = true;
    const montoNum = Number(monto);

    if (!monto) {
      valid = false;
      setMontoError("El monto es obligatorio");
    } else if (isNaN(montoNum) || montoNum <= 0 || montoNum > 3000) {
      valid = false;
      setMontoError("Monto inválido (1 - 3000 BS)");
    } else {
      setMontoError("");
    }
    
    if (!nombre || !/^[a-zA-Z\s]+$/.test(nombre) || nombre.length > 40) valid = false;
    if (!nit || !/^\d{1,8}$/.test(nit)) valid = false;
    if (!telefono || telefono.length < 1) valid = false;
    if (!detalle || detalle.length < 1 || detalle.length > 40) valid = false;

    setIsFormValid(valid);
  }, [monto, nombre, nit, telefono, detalle]);

  const handleMontoClick = (valor: number) => setMonto(valor);

  const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && Number(value) <= 3000) setMonto(value);
    else if (value === "") setMonto("");
  };

  
  const handleConfirmar = () => {
    const nuevosErrores: ErroresType = {};
    let valido = true;

    const montoNum = typeof monto === "string" && monto !== "" ? Number(monto) : (typeof monto === "number" ? monto : NaN);

    if (!monto || isNaN(montoNum) || montoNum <= 0) {
      nuevosErrores.monto = "El monto es obligatorio";
      valido = false;
    }
    if (!nombre) {
      nuevosErrores.nombre = "El nombre es obligatorio";
      valido = false;
    }
    if (!numeroDocumento) {
      nuevosErrores.documento = `El ${tipoDocumento} es obligatorio`;
      valido = false;
    }
    if (!telefono) {
      nuevosErrores.telefono = "El teléfono es obligatorio";
      valido = false;
    }
    if (!correo) {
      nuevosErrores.correo = "El correo es obligatorio";
      valido = false;
    }
    if (!detalle) {
      nuevosErrores.detalle = "El detalle de recarga es obligatorio";
      valido = false;
    }

    setErrores(nuevosErrores);

    if (!valido) return;

    alert("Recarga realizada con éxito!");
  };


  const validarDocumento = (valor: string) => {
    // Solo permitir números
    if (!/^\d*$/.test(valor)) return;

    // Validar longitud según tipo
    if (tipoDocumento === "CI") {
      if (valor.length <= 7) {
        setNumeroDocumento(valor);
        setMensajeError("");
      } else {
        setMensajeError("El CI debe tener 7 dígitos");
      }
    } else if (tipoDocumento === "NIT") {
      if (valor.length <= 12) {
        setNumeroDocumento(valor);
        setMensajeError("");
      } else {
        setMensajeError("El NIT debe tener 12 dígitos");
      }
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-6">
      <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 w-full max-w-2xl border border-gray-100">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6" style={{ color: "#11255A" }}>
          Recarga por QR
        </h1>

        {/* Saldo */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
          <button className="px-6 py-2 bg-gradient-to-r from-blue-800 to-blue-600 text-white rounded-lg w-full sm:w-auto">
            Saldo
          </button>
          <div className="px-6 py-2 bg-blue-200 text-blue-900 font-semibold rounded-lg w-full sm:w-auto text-center">
            Bs. {saldo.toLocaleString("es-BO", { minimumFractionDigits: 2 })}
          </div>
        </div>

        {/* Botones de montos */}
        <div className="flex justify-center flex-wrap gap-3 mb-8">
          {[10, 20, 50, 100, 200, 300].map((valor) => (
            <button
              key={valor}
              className="px-4 sm:px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 flex-1 sm:flex-none text-center"
              onClick={() => handleMontoClick(valor)}
            >
              {valor} BS
            </button>
          ))}
        </div>

        {/* Formulario */}
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#11255A" }}>Monto</label>
            <div className="relative">
              <input
                type="text"
                className={`w-full border border-gray-300 rounded-md bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 py-2 text-black placeholder-gray-400`}
                value={monto}
                onChange={handleMontoChange}
                placeholder="ingresar monto"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-700 font-semibold">
                BS
              </span>
            </div>
            {montoError && <span className="text-red-500 text-sm">{montoError}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#11255A" }}>Nombre</label>
            <input
              type="text"
              className={`w-full border border-gray-300 rounded-md bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 py-2 text-black placeholder-gray-400`}
              value={nombre}
              onChange={(e) => {
                const val = e.target.value;
                if (/^[a-zA-Z\s]*$/.test(val) && val.length <= 40) setNombre(val);
              }}
              placeholder="ingresar nombre"
            />
          </div>

          <div className="space-y-2 mt-4">
            <label className="block text-sm font-medium mb-1" style={{ color: "#11255A" }}>
              Tipo de documento
            </label>

            <select
              value={tipoDocumento}
              onChange={(e) => {
                setTipoDocumento(e.target.value);
                setNumeroDocumento("");
                setMensajeError("");
              }}
              className="w-full border border-gray-300 rounded-md bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 py-2 text-black"
            >
              <option value="CI">CI</option>
              <option value="NIT">NIT</option>
            </select>

            <input
              type="text"
              placeholder={`Ingrese su ${tipoDocumento}`}
              value={numeroDocumento}
              onChange={(e) => validarDocumento(e.target.value)}
              className="w-full border border-gray-300 rounded-md bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 py-2 text-black placeholder-gray-400"
            />

            {mensajeError && (
              <p className="text-red-500 text-sm mt-1">{mensajeError}</p>
            )}
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "#11255A" }}
            >
              Nro. teléfono
            </label>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 font-semibold">
                +591
              </span>
              <input
                type="text"
                className={`w-full border border-gray-300 rounded-md bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 pl-16 pr-3 py-2 text-black placeholder-gray-400`}
                value={telefono}
                onChange={(e) => {
                  const val = e.target.value;
                  // Solo números y máximo 8 dígitos
                  if (/^\d*$/.test(val) && val.length <= 8) setTelefono(val);
                }}
                placeholder="ingresar nro telf."
              />
            </div>
          </div>


          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1" style={{ color: "#11255A" }}>Correo electrónico</label>
            <input
              type="text"
              className={`w-full border border-gray-300 rounded-md bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 py-2 text-black placeholder-gray-400`}
              value={correo}
              onChange={(e) => {
                const val = e.target.value;
                // Solo permite letras, números, arroba, punto y guion bajo
                if (/^[a-zA-Z0-9@._]*$/.test(val)) {
                  setCorreo(val);

                  if (/@{2,}/.test(val)) {
                    setCorreoError("Correo no válido: demasiadas arrobas (@).");
                   } else if (
                     val.length > 0 &&
                     !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
                   ) {
                     setCorreoError("Correo no válido: formato incorrecto.");
                   } else {
                     setCorreoError("");
                   }

                }
              }}
              placeholder="ingresar correo"
            />
            {correoError && (
              <p className="text-red-500 text-sm mt-1">{correoError}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1" style={{ color: "#11255A" }}>Detalle de Recarga</label>
            <textarea
              className={`w-full border border-gray-300 rounded-md bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 py-2 text-black placeholder-gray-400`}
              rows={2}
              value={detalle}
              onChange={(e) => {
                if (e.target.value.length <= 40) setDetalle(e.target.value);
              }}
              placeholder="ingresar detalle de recarga..."
            ></textarea>
          </div>
        </form>

        <div className="mt-8 text-center">
          <button
            type="button"
            disabled={!isFormValid}
            onClick={handleConfirmar}
            className={`px-8 py-2 w-full sm:w-auto rounded-lg ${isFormValid ? "bg-blue-800 text-white hover:bg-blue-900" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecargaQR;
