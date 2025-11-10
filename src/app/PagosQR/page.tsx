"use client";    
import React, { useState, useEffect } from "react";
import axios from "axios";

const RecargaQR: React.FC = () => {

  //para el QR generado
  const [mostrarQR, setMostrarQR] = useState(false);
  const qrRef = React.useRef<HTMLDivElement>(null);

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
  //  if (!nit || !/^\d{1,8}$/.test(nit)) valid = false;
    if (!numeroDocumento || !/^\d+$/.test(numeroDocumento)) valid = false;
    if (!correo || correoError) valid = false;
    if (!telefono || telefono.length < 1) valid = false;
    if (!detalle || detalle.length < 1 || detalle.length > 40) valid = false;

    setIsFormValid(valid);
  }, [monto, nombre, numeroDocumento, telefono, correo, correoError, detalle]);

  const handleMontoClick = (valor: number) => setMonto(valor);

  const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && Number(value) <= 3000) setMonto(value);
    else if (value === "") setMonto("");
  };

  //Para el backend enviarRecarga
  const enviarRecarga = async (): Promise<void> => {
    try {
      const response = await axios.post("http://localhost:5000/api/devcode/recargar", {
        nombre,
        detalle,
        monto,
        correo,
        telefono,
        tipoDocumento,
        numeroDocumento,
      });

      console.log("✅ Respuesta del backend:", response.data);

      if (response.data.success) {
        alert("Recarga registrada correctamente en el backend ✅");
        setMostrarQR(true);
      } else {
        alert("Error: " + response.data.message);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("❌ Error de Axios:", error.response?.data || error.message);
        alert(`Error del servidor: ${error.response?.data?.message || error.message}`);
      } else {
        console.error("❌ Error desconocido:", error);
        alert("Ocurrió un error inesperado al registrar la recarga.");
      }
    }
  };

  const handleConfirmar = async () => {
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
    // Enviar datos al backend
    await enviarRecarga();  
    //alert("Recarga realizada con éxito!");
    setMostrarQR(true);

  };

  const descargarQR = async () => {
    if (!qrRef.current) return;

    try {
      // Esperar a que la imagen del QR esté completamente cargada
      const qrImg = qrRef.current.querySelector('img');
      if (qrImg && !qrImg.complete) {
        await new Promise((resolve) => {
          qrImg.onload = resolve;
        });
      }

      // Crear canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Configurar tamaño (más grande para mejor calidad)
      const scale = 2;
      canvas.width = 384 * scale; // w-96 = 384px
      canvas.height = 550 * scale;
      ctx.scale(scale, scale);

      // Fondo blanco con bordes redondeados
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 384, 550);

      // Título
      ctx.fillStyle = '#11255A';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('QR generado', 192, 40);

      // Línea divisoria
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(35, 60);
      ctx.lineTo(349, 60);
      ctx.stroke();

      // Fondo del QR (azul oscuro)
      ctx.fillStyle = '#11255A';
      const qrX = 92;
      const qrY = 90;
      const qrSize = 200;
      ctx.beginPath();
      ctx.roundRect(qrX, qrY, qrSize, qrSize, 12);
      ctx.fill();

      // Cargar y dibujar imagen QR
      const qrData = `${nombre}-${monto}-${detalle}`;
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qrData)}`;
      
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        // Dibujar QR centrado con padding
        ctx.drawImage(img, qrX + 8, qrY + 8, qrSize - 16, qrSize - 16);

        // Información (alineada a la izquierda)
        ctx.textAlign = 'left';
        ctx.fillStyle = '#374151';
        
        let yPos = 330;
        
        // Monto
        ctx.font = 'bold 16px Arial';
        ctx.fillText('Monto:', 50, yPos);
        ctx.font = '16px Arial';
        ctx.fillText(`${monto} Bs`, 180, yPos);
        
        yPos += 40;
        
        // Nombre
        ctx.font = 'bold 16px Arial';
        ctx.fillText('Nombre a facturar:', 50, yPos);
        ctx.font = '16px Arial';
        yPos += 25;
        const nombreTexto = nombre.length > 30 ? nombre.substring(0, 30) + '...' : nombre;
        ctx.fillText(nombreTexto, 50, yPos);
        
        yPos += 40;
        
        // Detalle
        ctx.font = 'bold 16px Arial';
        ctx.fillText('Detalle de Recarga:', 50, yPos);
        ctx.font = '16px Arial';
        yPos += 25;
        const detalleTexto = detalle.length > 35 ? detalle.substring(0, 35) + '...' : detalle;
        ctx.fillText(detalleTexto, 50, yPos);

        // Descargar
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `QR-Recarga-${nombre.replace(/\s+/g, '-')}-${monto}BS.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
        }, 'image/jpeg', 0.95);
      };

      img.onerror = () => {
        alert('Error al cargar la imagen del QR. Verifica tu conexión a internet.');
      };

      img.src = qrUrl;
      
    } catch (error) {
      console.error('Error al descargar:', error);
      alert('Error al descargar el QR. Por favor, intenta nuevamente.');
    }
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
        <div className="flex flex-col items-center gap-3 mb-8">
          {/* Fila 1 */}
          <div className="flex justify-center gap-3 flex-wrap">
            {[10, 20, 50].map((valor) => (
              <button
                key={valor}
                className="px-4 sm:px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 flex-1 sm:flex-none text-center"
                onClick={() => handleMontoClick(valor)}
              >
                {valor} BS
              </button>
            ))}
          </div>

          {/* Fila 2 */}
          <div className="flex justify-center gap-3 flex-wrap">
            {[100, 200, 300].map((valor) => (
              <button
                key={valor}
                className="px-4 sm:px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 flex-1 sm:flex-none text-center"
                onClick={() => handleMontoClick(valor)}
              >
                {valor} BS
              </button>
            ))}
          </div>
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
            {errores.monto && <p className="text-red-500 text-sm mt-1">{errores.monto}</p>}
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
            {errores.nombre && <p className="text-red-500 text-sm mt-1">{errores.nombre}</p>}
          </div>

          {/* Fila: Tipo de documento y Nro. teléfono */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:gap-6 mt-4">
            {/* Tipo de documento */}
            <div className="flex-1 flex flex-col space-y-2">
              <label className="text-sm font-medium" style={{ color: "#11255A" }}>
                Tipo de documento
              </label>

              <div className="flex items-center gap-2">
                {/* Campo de número de documento */}
                <input
                  type="text"
                  placeholder={`Ingrese su ${tipoDocumento}`}
                  value={numeroDocumento}
                  onChange={(e) => validarDocumento(e.target.value)}
                  className="flex-1 min-w-0 border border-gray-300 rounded-md bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 py-2 text-black placeholder-gray-400"
                />

                {/* Selector CI/NIT */}
                <select
                  value={tipoDocumento}
                  onChange={(e) => {
                    setTipoDocumento(e.target.value);
                    setNumeroDocumento("");
                    setMensajeError("");
                  }}
                  className="w-24 border border-gray-300 rounded-md bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-2 text-black"
                >
                  <option value="CI">CI</option>
                  <option value="NIT">NIT</option>
                </select>
              </div>

              {mensajeError && (
                <p className="text-red-500 text-sm mt-1">{mensajeError}</p>
              )}
              {errores.documento && (
                <p className="text-red-500 text-sm mt-1">{errores.documento}</p>
              )}
            </div>

            {/* Nro. teléfono */}
            <div className="flex-1 flex flex-col space-y-2 mt-4 sm:mt-0">
              <label className="text-sm font-medium" style={{ color: "#11255A" }}>
                Nro. teléfono
              </label>

              <div className="flex items-center border border-gray-300 rounded-md bg-white/70 focus-within:ring-2 focus-within:ring-blue-500">
                <span className="px-3 text-gray-700 whitespace-nowrap">+591</span>
                <input
                  type="text"
                  className="flex-1 px-3 py-2 bg-transparent focus:outline-none text-black placeholder-gray-400"
                  value={telefono}
                  onChange={(e) => {
                    const val = e.target.value;
                    // Solo números y máximo 8 dígitos
                    if (/^\d*$/.test(val) && val.length <= 8) setTelefono(val);
                  }}
                  placeholder="ingresar nro telf."
                />
              </div>

              {errores.telefono && (
                <p className="text-red-500 text-sm mt-1">{errores.telefono}</p>
              )}
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
            {errores.correo && <p className="text-red-500 text-sm mt-1">{errores.correo}</p>}
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
            {errores.detalle && <p className="text-red-500 text-sm mt-1">{errores.detalle}</p>}
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

        {mostrarQR && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div ref={qrRef} className="bg-white rounded-xl shadow-lg p-6 w-96 text-center relative">
              <h2 className="text-xl font-semibold text-[#11255A] mb-4 border-b pb-2">QR generado</h2>

              <div className="flex justify-center mb-4">
                {/* Aquí puedes usar una librería QR real o un placeholder */}
                <div className="bg-[#11255A] p-2 rounded-xl">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${nombre}-${monto}-${detalle}`}
                    alt="QR"
                    className="rounded-lg"
                  />
                </div>
              </div>

              <div className="text-left text-gray-700 space-y-2">
                <p><strong>Monto:</strong> {monto} Bs</p>
                <p><strong>Nombre a facturar:</strong> {nombre}</p>
                <p><strong>Detalle de Recarga:</strong> {detalle}</p>
              </div>

              <div className="mt-6 flex gap-3 justify-center">
                <button
                  onClick={descargarQR}
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                >
                  Descargar
                </button>
                <button
                  onClick={() => setMostrarQR(false)}
                  className="bg-[#11255A] text-white px-6 py-2 rounded-md hover:bg-blue-800"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}        

      </div>
    </div>
  );
};

export default RecargaQR;