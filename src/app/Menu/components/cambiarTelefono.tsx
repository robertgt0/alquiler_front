'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import ExitoMessageIcon from '../assets/iconos8-exito-50png.jpg';
import { cambiarTelefono } from '@/app/teamsys/services/UserService';


interface CambiarTelefonoProps {
  onClose: () => void;
  userId: string;
}

export default function CambiarTelefono({ onClose, userId }: CambiarTelefonoProps) {
  const [telefonoActual, setTelefonoActual] = useState('');
  const [telefonoNuevo, setTelefonoNuevo] = useState('');
  const [errorActual, setErrorActual] = useState('');
  const [errorNuevo, setErrorNuevo] = useState('');
  const [mostrarExito, setMostrarExito] = useState(false);

   const handleCerrarExito = () => {
    setMostrarExito(false);
    onClose();
  };

  // Función para validar mientras se escribe
  const validarNumero = (numero: string, otroTelefono?: string): string => {
    if (numero.length === 0) {
      return 'El campo es obligatorio.';
    }

    // Mostrar "Número incorrecto" solo si el primer dígito no es 6 o 7
    if (numero.length > 0 && !/^[67]/.test(numero[0])) {
      return 'Número incorrecto.';
    }

    // Validar solo si ya completó 8 dígitos
    if (numero.length === 8 && !/^[67][0-9]{7}$/.test(numero)) {
      return 'Número incorrecto.';
    }

    // Validación de que el teléfono nuevo no sea igual al actual
    if (otroTelefono && numero === otroTelefono) {
      return 'El teléfono nuevo no puede ser igual al actual.';
    }

    return '';
  };

  // Manejo del cambio en los inputs
  const handleChange = (
    value: string,
    setTelefono: React.Dispatch<React.SetStateAction<string>>,
    setError: React.Dispatch<React.SetStateAction<string>>,
    otroTelefono?: string
  ) => {
    const soloNumeros = value.replace(/\D/g, '').slice(0, 8);
    setTelefono(soloNumeros);

    const mensajeError = validarNumero(soloNumeros, otroTelefono);
    setError(mensajeError);
  };

  // Validar al perder el foco (onBlur)
  const handleBlur = (
    numero: string,
    setError: React.Dispatch<React.SetStateAction<string>>,
    otroTelefono?: string
  ) => {
    const mensajeError = validarNumero(numero, otroTelefono);
    setError(mensajeError);
  };

  // Envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errorTelActual = validarNumero(telefonoActual);
    const errorTelNuevo = validarNumero(telefonoNuevo, telefonoActual);

    setErrorActual(errorTelActual);
    setErrorNuevo(errorTelNuevo);

    if (errorTelActual || errorTelNuevo) return;

    try{
    const resp= await cambiarTelefono(telefonoNuevo,userId)

    if (!resp.success) {
     setErrorNuevo(resp.message);
        return;
        }

    setMostrarExito(true);
   

    }catch(error){
      setErrorNuevo("Error en el servidor");

    }
  
  }
  

  return (
    <div className="fixed inset-0 bg-blue-500 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl border border-gray-300 shadow-xl w-full max-w-md p-6 flex flex-col items-center text-center animate-fade-in">
        {!mostrarExito ? (
          <>
            <h2 className="text-blue-600 font-semibold text-lg mb-6">Cambiar teléfono</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
              {/* Teléfono actual */}
              <div className="flex justify-center mb-4">
                <div className="w-full max-w-xs sm:max-w-sm">
                  <input
                    id="telefonoActual"
                    type="tel"
                    inputMode="numeric"
                    value={telefonoActual}
                    onChange={(e) =>
                      handleChange(e.target.value, setTelefonoActual, setErrorActual)
                    }
                    onBlur={() =>
                      handleBlur(telefonoActual, setErrorActual)
                    }
                    className={`w-full px-3 py-2 sm:py-3 text-sm sm:text-base border rounded-2xl shadow-sm
                      focus:outline-none focus:ring-2 focus:border-transparent placeholder-gray-600 text-gray-950
                      ${errorActual ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                    placeholder="Teléfono actual (8 dígitos)"
                    maxLength={8}
                  />
                  {errorActual && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600">{errorActual}</p>
                  )}
                </div>
              </div>

              {/* Teléfono nuevo */}
              <div className="flex justify-center mb-4">
                <div className="w-full max-w-xs sm:max-w-sm">
                  <input
                    id="telefonoNuevo"
                    type="tel"
                    inputMode="numeric"
                    value={telefonoNuevo}
                    onChange={(e) =>
                      handleChange(e.target.value, setTelefonoNuevo, setErrorNuevo, telefonoActual)
                    }
                    onBlur={() =>
                      handleBlur(telefonoNuevo, setErrorNuevo, telefonoActual)
                    }
                    className={`w-full px-3 py-2 sm:py-3 text-sm sm:text-base border rounded-2xl shadow-sm
                      focus:outline-none focus:ring-2 focus:border-transparent placeholder-gray-600 text-gray-950
                      ${errorNuevo ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                    placeholder="Teléfono nuevo (8 dígitos)"
                    maxLength={8}
                  />
                  {errorNuevo && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600">{errorNuevo}</p>
                  )}
                </div>
              </div>

              {/* Botones */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-2xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-200"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={
                    !telefonoActual ||
                    !telefonoNuevo ||
                    !!errorActual ||
                    !!errorNuevo
                  }
                  className={`flex-1 py-2 rounded-2xl transition-colors duration-200 text-white focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                    telefonoActual &&
                    telefonoNuevo &&
                    !errorActual &&
                    !errorNuevo
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  Actualizar
                </button>
              </div>
            </form>
          </>
        ) : (
          // Mensaje de éxito
          <div className="fixed inset-0 bg-white/90 backdrop-blur-[1px] flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-3xl border border-gray-300 shadow-lg w-full max-w-md p-6 flex flex-col items-center text-center animate-fade-in">
              <Image
                src={ExitoMessageIcon}
                alt="Éxito"
                width={50}
                height={50}
                className="mb-3"
              />
              <p className="text-gray-900 font-semibold text-base sm:text-lg mb-6 leading-relaxed">
                ¡Teléfono actualizado con éxito!
              </p>
              <button
                onClick={handleCerrarExito}
                className="bg-blue-500 text-white py-2 px-6 rounded-2xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-200"
              >
                Aceptar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
