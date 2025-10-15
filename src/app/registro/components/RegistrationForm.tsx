'use client';
import React, { useState } from 'react';
import { useRegistrationForm } from '../hooks/useRegistrationForm';
import { usoGoogleAuth }  from '../../google/hooks/usoGoogleAuth';
import { GoogleButton } from '../../google/components/GoogleButton';
import googleIcon from '../assets/icons8-google-48.png';
import AppleIcon from '../assets/icons8-apple-50.png';
import { useRouter } from "next/navigation";

export const RegistrationForm: React.FC = () => {
  const router = useRouter();
  const {
    datosFormulario,
    errores,
    tocados,
    manejarCambio,
    manejarBlur,
    validarFormulario
  } = useRegistrationForm();

  const { isLoading: googleLoading, error: googleError, handleGoogleAuth } = usoGoogleAuth();

  const handleGoogleClick = async () => {
    await handleGoogleAuth();
  };
//  Nueva lógica para habilitar/deshabilitar el botón
const formularioValido =
  Object.keys(errores).length === 0 &&
  Object.values(datosFormulario).every((v) => v.trim() !== "");

  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">{/* contenedor azul */}
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-md p-6"> {/* contenedor blanco dond eesta el formulario*/}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-blue-500">Crear cuenta</h2>
        </div>


        {/* Mostrar errores de Google */}
        {googleError && (
          <div className="w-120 mx-auto mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{googleError}</p>
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          

          {/* Nombre */}
          <div className="flex justify-center">
            <div className="w-120">
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                value={datosFormulario.nombre}
                onChange={(e) => manejarCambio('nombre', e.target.value)}
                onBlur={() => manejarBlur('nombre')}
                className={`w-120 px-3 py-2 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:border-transparent  ${
                  errores.nombre && tocados.nombre 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300'
                }`}
                placeholder="Nombre(s)"
              />
              {/* Mostrar error SIEMPRE que exista */}
                  {errores.nombre && (
                  <p className="mt-1 text-sm text-red-600">{errores.nombre}</p>
                )}
            </div>
          </div>
            {/*apellido*/}
          <div className="flex justify-center">
            <div className="w-120">
              <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">  
              </label>
              <input
                id="apellido"
                name="apellido"
                type="text"
                value={datosFormulario.apellido}
                onChange={(e) => manejarCambio('apellido', e.target.value)}
                onBlur={() => manejarBlur('apellido')}
                className={`w-120 px-3 py-2 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:border-transparent mx-auto block ${
                  errores.apellido && tocados.apellido 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Apellidos"
              />
              {errores.apellido && (
              <p className="mt-1 text-sm text-red-600">{errores.apellido}</p>
              )}
            </div>
          </div>

          {/* Teléfono */}
          <div className="flex justify-center">
            <div className="w-120">
              <input
                id="telefono"
                name="telefono"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]{8}"
                title="El teléfono debe contener exactamente 8 dígitos"
                value={datosFormulario.telefono}
                onChange={(e) => {
                  // Permitir solo números y limitar a 8 dígitos
                  const soloNumeros = e.target.value.replace(/\D/g, '').slice(0, 8);
                  manejarCambio('telefono', soloNumeros);
                }}
                onKeyPress={(e) => {
                  // Prevenir caracteres no numéricos
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                onBlur={() => manejarBlur('telefono')}
                className={`w-120 px-3 py-2 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:border-transparent mx-auto block ${
                  errores.telefono && tocados.telefono 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Teléfono (8 dígitos)"
                maxLength={8}
              />
              {errores.telefono && tocados.telefono && (
                <p className="mt-1 text-sm text-red-600">{errores.telefono}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex justify-center">
            <div className="w-120">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={datosFormulario.email}
              onChange={(e) => manejarCambio('email', e.target.value)}
              onBlur={() => manejarBlur('email')}
              className={`w-120 px-3 py-2 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:border-transparent mx-auto block ${
                errores.email && tocados.email 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Correo electronico"
            />
            {errores.email && tocados.email && (
              <p className="mt-1 text-sm text-red-600">{errores.email}</p>
            )}
          </div>
        </div>
          {/* Contraseña */}
          <div className="flex justify-center">
            <div className="w-120">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={datosFormulario.contraseña}
              onChange={(e) => manejarCambio('contraseña', e.target.value)}
              onBlur={() => manejarBlur('contraseña')}
              className={`w-120 px-3 py-2 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:border-transparent mx-auto block ${
                errores.contraseña && tocados.contraseña 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Contraseña"
            />
            {errores.contraseña && tocados.contraseña && (
              <p className="mt-1 text-sm text-red-600">{errores.contraseña}</p>
            )}
          </div>
        </div>
          {/* Confirmar Contraseña */}
          <div className="flex justify-center">
            <div className="w-120">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={datosFormulario.confirmarContraseña}
              onChange={(e) => manejarCambio('confirmarContraseña', e.target.value)}
              onBlur={() => manejarBlur('confirmarContraseña')}
              className={`w-120 px-3 py-2  border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:border-transparent mx-auto block ${
                errores.confirmarContraseña && tocados.confirmarContraseña 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Confirma contraseña"
            />
            {errores.confirmarContraseña && tocados.confirmarContraseña && (
              <p className="mt-1 text-sm text-red-600">{errores.confirmarContraseña}</p>
            )}
          </div>
        </div>
        {/*parrafo de ¡ya tienes una cuenta?*/}
          <div className="flex justify-center items-center gap-2 mt-4">
            <p className = "text-sm text-gray-600">¿Ya tienes una cuenta?</p>
            <a href="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">Iniciar sesión</a>
          </div>      
        
          {/* Botón de Google */}
          <GoogleButton 
            onClick={handleGoogleClick}
            isLoading={googleLoading}
            type="register"
          />

          {/*boton de registrarse con apple*/} 

          <button
            type="button"
            className="w-120 mx-auto bg-white text-black py-2 px-4 border border-gray-300 rounded-2xl hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors duration-200 flex items-center justify-center gap-3"
          >
          <img src={AppleIcon.src}
            alt="Registrarse con Apple" 
            className="w-5 h-5"
          />
            Registrarse con Apple
          </button>
          

          {/*boton de continuar*/} 

          <button
  type="submit"
  onClick={(e) => {
    e.preventDefault();
    if (formularioValido) {
  // Guardar los datos temporalmente
  sessionStorage.setItem("datosUsuarioParcial", JSON.stringify(datosFormulario));

  // Redirigir sin mostrar nada en la URL
  router.push("/ImagenLocalizacion");
  }


  }}
  disabled={!formularioValido}
  className={`w-64 mx-auto py-2 px-4 rounded-2xl border border-gray-300 flex items-center justify-center gap-3 transition-colors duration-200
    ${
      formularioValido
        ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }`}
>
  Continuar
</button>


          {/*parrafo de ¡ya tienes una cuenta?*/}
          
          <div className="flex justify-center items-center gap-2 mt-4">
            <p className = "text-sm text-gray-600">Rellene los campos obligatioramente*</p>
          </div>
        </form>
      </div>
    </div>
  );
};

