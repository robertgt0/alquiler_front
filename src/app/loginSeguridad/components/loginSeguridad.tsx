'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { verifyTwoFactorLogin } from '@/app/teamsys/services/UserService';
import { desactivar2FA } from '@/app/teamsys/services/UserService';

// Export default directamente al definir el componente
export default function LoginSeguridad() {
const router = useRouter();
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [intentos, setIntentos] = useState(0);
  const [bloqueado, setBloqueado] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(0);

     useEffect(() => {
    let timer: NodeJS.Timeout;
    if (bloqueado && tiempoRestante > 0) {
      timer = setInterval(() => {
        setTiempoRestante((prev) => {
          if (prev <= 1) {
            setBloqueado(false);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [bloqueado, tiempoRestante]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

        if (bloqueado) return;

    if (!/^\d{6}$/.test(codigo)) {
      setError('Código incorrecto. Inténtalo de nuevo.');
      return;
    }

    setIsLoading(true);

    try {
      // Simulación con backend
      const usuarioRaw = sessionStorage.getItem('userData');
if (!usuarioRaw) {
  setError('No existe userData en sesión');
  return;
}
const usuario = JSON.parse(usuarioRaw);
const userId = String(usuario._id || '').trim();
const token = String(codigo || '').trim();

const desactivar= sessionStorage.getItem("desactivar2FA")
let res;
if(desactivar == "true"){
const Token= sessionStorage.getItem("authToken")
       if(Token== null  )
        throw new Error("AcessToken no existente");
       res=await desactivar2FA(token, Token)
       

}else{
console.log('verify-login payload ->', { userId, token }); // 👈 revisa en consola
 res = await verifyTwoFactorLogin(userId, token);
}

      console.log(res)
      if (res.success==true) {

         // para que se guarde la sesion de seguridad
         // sessionStorage.setItem("checkSeguridad", "true");
          
          if(desactivar==null){
                       const eventLogin = new CustomEvent("login-exitoso");
                      window.dispatchEvent(eventLogin);
                       
                      }else{
                        sessionStorage.removeItem("desactivar2FA")
                        sessionStorage.removeItem("checkSeguridad")
                      }
          router.push('/'); 
          return
    // Código correcto, redirige al home
      } else {
        setIntentos(prev => {
        const nuevosIntentos = prev + 1;
        if (nuevosIntentos >= 3) { 
            setBloqueado(true);
            setTiempoRestante(300);
            setError('Has excedido el número de intentos. Inténtalo nuevamente en 5 minutos.');
        } else {
            setError(`Código incorrecto. Te quedan ${3 - nuevosIntentos} intento(s).`);
        }

        return nuevosIntentos;
      });
      }
    } catch (err) {
      console.error('Error al verificar el código:', err);
      setError('Ocurrió un error, inténtalo más tarde.');
    } finally {
      setIsLoading(false);
      setCodigo("");
    }
  };

 // 🔹 Manejar el botón Cancelar
  const handleCancel = () => {
    sessionStorage.clear()
    router.back(); // vuelve a la página anterior
    // o podrías usar: router.push('/Seguridad') si tienes una ruta específica
  };

  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center py-6 px-3 sm:px-6 lg:px-8">
      <div className="w-full max-w-md lg:max-w-2xl bg-white rounded-3xl shadow-md p-4 sm:p-6 lg:p-8">
        
        {/* Título y explicación */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-500">Verifica tu identidad</h2>
          <div className="mt-2 text-sm sm:text-base text-gray-600 space-y-1">
            <p>Accede a tu aplicacion preferida de contraseña</p>
            <p>de un solo uso para obtener un codigo</p>
          </div>
        </div>

        {/* Formulario de ingreso de código */}
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="flex justify-center">
            <div className="w-full max-w-xs sm:max-w-sm">
              <input
                id="codigo"
                name="codigo"
                type="text"
                value={codigo}
                onChange={(e) => { setCodigo(e.target.value); setError(null); }}
                className={`w-full px-3 py-2 sm:py-3 text-sm sm:text-base border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:border-transparent placeholder-gray-600 text-gray-950 text-center ${
                  error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Código de verificación"
                maxLength={6}
              disabled={bloqueado}
              />
              {error && (
                <p className="mt-1 text-xs sm:text-sm text-red-600 text-center" role="alert">{error}</p>
              )}
              {bloqueado && tiempoRestante > 0 && (
                <p className="mt-1 text-xs sm:text-sm text-red-600 text-center">
                  Inténtalo nuevamente en {Math.floor(tiempoRestante / 60)}:{('0' + (tiempoRestante % 60)).slice(-2)} minutos
                </p>
              )}
            </div>
          </div>

         
            {/* Botones: Continuar + Volver */}
<div className="mt-6 sm:mt-8 flex flex-col items-center gap-3">
  <button
    type="submit"
    disabled={isLoading || codigo.length !== 6}
    className={`w-full max-w-xs sm:max-w-sm py-2 sm:py-3 px-4 border rounded-2xl focus:outline-none focus:ring-2 transition-colors duration-200 flex items-center justify-center gap-3 text-sm sm:text-base font-medium ${
      isLoading
        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
        : codigo.length === 6
        ? 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-300'
        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
    }`}
  >
    {isLoading ? 'Verificando...' : 'Continuar'}
  </button>

 {/* Volver (azul) */}
            <button
              type="button"
              onClick={handleCancel}
              className="w-full max-w-xs sm:max-w-sm py-2 sm:py-3 px-4 rounded-2xl text-white bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 transition-colors duration-200 text-sm sm:text-base font-medium"
            >
              Volver
            </button>
</div>

          
        </form>
      </div>
    </div>
  );
}