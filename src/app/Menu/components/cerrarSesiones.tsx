'use client';

import React from 'react';
import StatusPanel from './statusPanel';
import { cerrarSesionesRemotas } from '@/app/teamsys/services/UserService';
import { getSocket } from "@/app/teamsys/realtime/socketClient";

interface CerrarSesionesProps {
  onContinue?: () => void;  // ya no lo usamos, se mantiene por compatibilidad
  onCancel?: () => void;
}

export const CerrarSesiones: React.FC<CerrarSesionesProps> = ({ onCancel }) => {
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<null | { ok: boolean; text: string }>(null);

  const ejecutar = async () => {
    try {
      
    setLoading(true);
    const token=sessionStorage.getItem("authToken")
    if(token==null)throw new Error("no existe accesstoken");
    const socket = getSocket();
    const socketId = socket.id;

    const res = await cerrarSesionesRemotas(token,socketId);
    setLoading(false);

    if (res.ok) {
      setResult({ ok: true, text: 'Sesiones cerradas exitosamente.' });
    } else {
      setResult({ ok: false, text: res.message || 'No se pudieron cerrar las sesiones.' });
    }
    } catch (error) {
      setResult({ ok: false, text: "error en el servidor" })
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-white/90 backdrop-blur-[2px] flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-3xl border border-gray-300 shadow-xl w-full max-w-md p-6 text-center">
          <p className="text-gray-900 font-semibold text-base sm:text-lg mb-6 leading-relaxed">
            Esta acción cerrará tu sesión <br />
            en todos los dispositivos excepto este
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <button
              type="button"
              onClick={ejecutar}
              disabled={loading}
              className="flex-1 bg-blue-500 text-white py-2 rounded-2xl hover:bg-blue-600 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all disabled:opacity-60"
            >
              {loading ? 'Cerrando…' : 'Continuar'}
            </button>

            <button
              type="button"
              onClick={() => onCancel?.()}
              disabled={loading}
              className="flex-1 bg-blue-500 text-white py-2 rounded-2xl hover:bg-blue-600 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all disabled:opacity-60"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>

      {result && (
        <StatusPanel ok={result.ok} text={result.text} onClose={() => setResult(null)} />
      )}
    </>
  );
};