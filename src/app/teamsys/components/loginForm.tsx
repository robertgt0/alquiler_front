'use client';

import { useLoginForm } from '../hooks/useLoginForm';

import Link from 'next/link';



export const LoginForm: React.FC = () => {
  
  const {
    datosFormulario,
    errores,
    tocados,
    manejarCambio,
    manejarBlur,
    validarFormulario,
  } = useLoginForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validarFormulario()) {
      console.log('Login exitoso:', datosFormulario);
   
  }
};


  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-md p-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-blue-500">Iniciar sesión</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

         {/* Email */}
          <div className="flex justify-center">
            <div className="w-120">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              
            </label>
            <input
              id="email"
              name="email"
              type="text"
              value={datosFormulario.email}
              onChange={(e) => manejarCambio('email', e.target.value)}
              onBlur={() => manejarBlur('email')}
              className={`w-[500px] px-3 py-2 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:border-transparent mx-auto block ${
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
              className={`w-[500px] px-3 py-2 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:border-transparent mx-auto block ${
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
        
          {/* Botón de Iniciar sesión */}
           <div className="mt-8 flex justify-center my 8">
            <button
             type="submit"
              className="w-full max-w-md bg-blue-500 text-white py-2 px-4 border border-gray-300 rounded-2xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-200 flex items-center justify-center gap-3"
              >
              Iniciar sesión
              </button>
             </div>

               {/* Separador visual con “o” */}
            <div className="flex items-center justify-center my-6">
            <span className="text-gray-500 text-sm font-medium">o</span>
            </div>
            
             {/*boton de registrarse con google*/}    

          <button
            type="button"
            className="w-[500px] mx-auto bg-white text-black py-2 px-4 border border-gray-300 rounded-2xl hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors duration-200 flex items-center justify-center gap-3"
          >
          <img 
            src={googleIcon.src}
            alt="Registrarse con Google" 
            className="w-5 h-5"
          />
            Registrarse con Google
          </button>

          {/*boton de registrarse con apple*/} 

          <button
            type="button"
            className="w-[500px] mx-auto bg-white text-black py-2 px-4 border border-gray-300 rounded-2xl hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors duration-200 flex items-center justify-center gap-3"
          >
          <img src={AppleIcon.src}
            alt="Registrarse con Apple" 
            className="w-5 h-5"
          />
            Registrarse con Apple
          </button>


            {/* Enlace para registrarse */}
           <div className="flex justify-center items-center gap-2 mt-4">
           <p className="text-sm text-gray-600">¿Aún no tienes una cuenta?</p>
           <Link href="/register">
           <span className="text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline cursor-pointer">
             Regístrate
            </span>
            </Link>
            </div>
          </form>
      </div>
    </div>
  );
};