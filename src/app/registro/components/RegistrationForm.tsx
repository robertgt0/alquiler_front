'use client';
import React, { useState } from 'react';
import { useRegistrationForm } from '../hooks/useRegistrationForm';
import { useGoogleAuth } from '../../google/hooks/useGoogleAuth';
import { GoogleButton } from '../../google/components/GoogleButton';
import AppleIcon from '../assets/icons8-apple-50.png';
import { useRouter } from "next/navigation";
import { checkEmailExists } from '../../teamsys/services/checkEmailExists';
import { EmailExistsMessage } from './emailExistsMessage';
import Link from 'next/link';
import Image from 'next/image';

export const RegistrationForm: React.FC = () => {
  const router = useRouter();
  const {
    datosFormulario,
    errores,
    tocados,
    manejarCambio,
    manejarBlur,
  } = useRegistrationForm();

  const { isLoading: googleLoading, error: googleError, handleGoogleAuth } = useGoogleAuth();

  const handleGoogleClick = async () => {
    // Para registro, usar tipo "register" específicamente
    await handleGoogleAuth('register');
  };

  const formularioValido =
    Object.keys(errores).length === 0 &&
    Object.values(datosFormulario).every((v) => v.trim() !== "");

  const [showEmailMessage, setShowEmailMessage] = useState(false);

  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md lg:max-w-2xl bg-white rounded-3xl shadow-md p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-500">Crear cuenta</h2>
        </div>

        {/* Mostrar errores de Google */}
        {googleError && (
          <div className="w-full max-w-xs sm:max-w-sm mx-auto mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{googleError}</p>
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()} className="space-y-3 sm:space-y-4">
          
          {/* Nombre */}
          <div className="flex justify-center">
            <div className="w-full max-w-xs sm:max-w-sm">
              <input
                id="nombre"
                name="nombre"
                type="text"
                value={datosFormulario.nombre}
                onChange={(e) => manejarCambio('nombre', e.target.value)}
                onKeyPress={(e) => {
                  if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                onBlur={() => manejarBlur('nombre')}
                className={`w-full px-3 py-2 sm:py-3 text-sm sm:text-base border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:border-transparent placeholder-gray-600 text-gray-950 ${
                  errores.nombre && tocados.nombre 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Nombre(s)"
              />
              {errores.nombre && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{errores.nombre}</p>
              )}
            </div>
          </div>

          {/* Apellido */}
          <div className="flex justify-center">
            <div className="w-full max-w-xs sm:max-w-sm">
              <input
                id="apellido"
                name="apellido"
                type="text"
                value={datosFormulario.apellido}
                onChange={(e) => manejarCambio('apellido', e.target.value)}
                onKeyPress={(e) => {
                  if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                onBlur={() => manejarBlur('apellido')}
                className={`w-full px-3 py-2 sm:py-3 text-sm sm:text-base border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:border-transparent placeholder-gray-600 text-gray-950 ${
                  errores.apellido && tocados.apellido
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Apellidos"
              />
              {errores.apellido && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{errores.apellido}</p>
              )}
            </div>
          </div>

          {/* Teléfono */}
          <div className="flex justify-center">
            <div className="w-full max-w-xs sm:max-w-sm">
              <input
                id="telefono"
                name="telefono"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]{8}"
                title="celular fuera de rango"
                value={datosFormulario.telefono}
                onChange={(e) => {
                  const soloNumeros = e.target.value.replace(/\D/g, '').slice(0, 8);
                  manejarCambio('telefono', soloNumeros);
                }}
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                onBlur={() => manejarBlur('telefono')}
                className={`w-full px-3 py-2 sm:py-3 text-sm sm:text-base border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:border-transparent placeholder-gray-600 text-gray-950 ${
                  errores.telefono && tocados.telefono 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Teléfono (8 dígitos)"
                maxLength={8}
              />
              {errores.telefono && tocados.telefono && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{errores.telefono}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex justify-center">
            <div className="w-full max-w-xs sm:max-w-sm">
              <input
                id="email"
                name="email"
                type="email"
                value={datosFormulario.email}
                onChange={(e) => manejarCambio('email', e.target.value)}
                onBlur={() => manejarBlur('email')}
                className={`w-full px-3 py-2 sm:py-3 text-sm sm:text-base border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:border-transparent placeholder-gray-600 text-gray-950 ${
                  errores.email && tocados.email 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Correo electrónico"
              />
              {errores.email && tocados.email && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{errores.email}</p>
              )}
            </div>
          </div>

          {/* Contraseña */}
          <div className="flex justify-center">
            <div className="w-full max-w-xs sm:max-w-sm">
              <input
                id="password"
                name="password"
                type="password"
                value={datosFormulario.contraseña}
                onChange={(e) => manejarCambio('contraseña', e.target.value)}
                onBlur={() => manejarBlur('contraseña')}
                className={`w-full px-3 py-2 sm:py-3 text-sm sm:text-base border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:border-transparent placeholder-gray-600 text-gray-950 ${
                  errores.contraseña && tocados.contraseña
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Contraseña"
              />
              {errores.contraseña && tocados.contraseña && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{errores.contraseña}</p>
              )}
            </div>
          </div>

          {/* Confirmar Contraseña */}
          <div className="flex justify-center">
            <div className="w-full max-w-xs sm:max-w-sm">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={datosFormulario.confirmarContraseña}
                onChange={(e) => manejarCambio('confirmarContraseña', e.target.value)}
                onBlur={() => manejarBlur('confirmarContraseña')}
                className={`w-full px-3 py-2 sm:py-3 text-sm sm:text-base border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:border-transparent placeholder-gray-600 text-gray-950 ${
                  errores.confirmarContraseña && tocados.confirmarContraseña 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Confirma contraseña"
              />
              {errores.confirmarContraseña && tocados.confirmarContraseña && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{errores.confirmarContraseña}</p>
              )}
            </div>
          </div>

          {/* ¿Ya tienes una cuenta? */}
          <div className="flex justify-center items-center gap-2 mt-3 sm:mt-4">
            <p className="text-xs sm:text-sm text-gray-600">¿Ya tienes una cuenta?</p>
            <Link href="/login" className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-500">
              Iniciar sesión
            </Link>
          </div>

          {/* Botón de Google */}
          <div className="flex justify-center">
            <div className="w-full max-w-xs sm:max-w-sm">
              <GoogleButton 
                onClick={handleGoogleClick}
                isLoading={googleLoading}
                type="register"
              />
            </div>
          </div>

          {/* Botón de registrarse con Apple */}
          <div className="flex justify-center">
            <button
              type="button"
              className="w-full max-w-xs sm:max-w-sm bg-white text-black py-2 sm:py-3 px-4 border border-gray-300 rounded-2xl hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors duration-200 flex items-center justify-center gap-3 text-xs sm:text-sm"
            >
              {/* ✅ CORRECCIÓN: Usar next/image */}
              <Image
                src={AppleIcon.src}
                alt="Registrarse con Apple"
                width={16}
                height={16}
                className="w-4 h-4 sm:w-5 sm:h-5"
              />
              Registrarse con Apple
            </button>
          </div>

          {/* Botón de continuar */}
          <div className="flex justify-center">
            <button
              type="submit"
              onClick={async (e) => {
                e.preventDefault();
                if (formularioValido) {
                  const correoExiste = await checkEmailExists(datosFormulario.email);
                  if (correoExiste) {
                    setShowEmailMessage(true);
                    return;
                  }
                  sessionStorage.setItem("datosUsuarioParcial", JSON.stringify(datosFormulario));
                  router.push("/ImagenLocalizacion");
                }
              }}
              disabled={!formularioValido}
              className={`w-full max-w-xs sm:max-w-sm py-2 sm:py-3 px-4 rounded-2xl border border-gray-300 flex items-center justify-center gap-3 transition-colors duration-200 text-sm sm:text-base ${
                formularioValido
                  ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Continuar
            </button>
          </div>

          {/* Texto de campos obligatorios */}
          <div className="flex justify-center items-center gap-2 mt-3 sm:mt-4">
            <p className="text-xs sm:text-sm text-gray-600">Rellene los campos obligatoriamente*</p>
          </div>
        </form>
      </div>
      
      {/* Mostrar el mensaje si el true */}
      {showEmailMessage && (
        <EmailExistsMessage onClose={() => setShowEmailMessage(false)} />
      )}
    </div>
  );
};