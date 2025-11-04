"use client";    
import React, { useState, useEffect } from "react";

const RecargaQR: React.FC = () => {
  const [saldo] = useState<number>(12730.5);
  const [monto, setMonto] = useState<number | string>("");
  const [nombre, setNombre] = useState<string>("");
  const [tipoDoc, setTipoDoc] = useState<string>("CI");
  const [nit, setNit] = useState<string>("");
  const [telefono, setTelefono] = useState<string>("");
  const [correo, setCorreo] = useState<string>("");
  const [detalle, setDetalle] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    let valid = true;
    const montoNum = Number(monto);

    if (!monto || isNaN(montoNum) || montoNum <= 0 || montoNum > 3000) valid = false;
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
    if (!isFormValid) return;
    alert("Recarga realizada con éxito!");
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
            <input
              type="text"
              className={`w-full border-b border-gray-400 focus:outline-none px-2 py-1 ${monto ? "text-black" : "text-[#7B7979]"}`}
              value={monto ? `${monto} BS` : ""}
              onChange={handleMontoChange}
              placeholder="500 BS"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#11255A" }}>Nombre</label>
            <input
              type="text"
              className={`w-full border-b border-gray-400 focus:outline-none px-2 py-1 ${nombre ? "text-black" : "text-[#7B7979]"}`}
              value={nombre}
              onChange={(e) => {
                const val = e.target.value;
                if (/^[a-zA-Z\s]*$/.test(val) && val.length <= 40) setNombre(val);
              }}
              placeholder="Cesar"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#11255A" }}>NIT/CI Factura</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                className={`flex-1 border-b border-gray-400 focus:outline-none px-2 py-1 ${nit ? "text-black" : "text-[#7B7979]"}`}
                value={nit}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*$/.test(val) && val.length <= 8) setNit(val);
                }}
                placeholder="12345678"
              />
              <select
                value={tipoDoc}
                onChange={(e) => setTipoDoc(e.target.value)}
                className="px-3 py-1 bg-blue-800 text-white rounded-md focus:outline-none"
              >
                <option value="CI">CI</option>
                <option value="NIT">NIT</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#11255A" }}>Nro. teléfono</label>
            <input
              type="text"
              className={`w-full border-b border-gray-400 focus:outline-none px-2 py-1 ${telefono ? "text-black" : "text-[#7B7979]"}`}
              value={telefono}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d*$/.test(val) && val.length <= 8) setTelefono(val);
              }}
              placeholder="78667764"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1" style={{ color: "#11255A" }}>Correo electrónico</label>
            <input
              type="email"
              className={`w-full border-b border-gray-400 focus:outline-none px-2 py-1 ${correo ? "text-black" : "text-[#7B7979]"}`}
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="Daniel@gmail.com"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1" style={{ color: "#11255A" }}>Detalle de Recarga</label>
            <textarea
              className={`w-full border-b border-gray-400 focus:outline-none resize-none px-2 py-1 ${detalle ? "text-black" : "text-[#7B7979]"}`}
              rows={2}
              value={detalle}
              onChange={(e) => {
                if (e.target.value.length <= 40) setDetalle(e.target.value);
              }}
              placeholder="Detalle de Recarga..."
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
