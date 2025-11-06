'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { LatLng } from './leafletPick';
import StatusPanel from './statusPanel';
import { actualizarUbicacionBack } from '@/app/teamsys/services/UserService';
const LeafletPick = dynamic(() => import('./leafletPick'), { ssr: false });

export default function ActualizarUbicacion({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave?: (coords: LatLng) => Promise<void> | void; // ← puede ser async
}) {
  const [loading, setLoading] = React.useState(false);
  const [coords, setCoords] = React.useState<LatLng | null>(null);
  const [msg, setMsg] = React.useState<{ type: 'ok' | 'err' | null; text: string }>({ type: null, text: '' });
  const [done, setDone] = React.useState<null | { ok: boolean; text: string }>(null);

  const pedirUbicacion = () => {
    if (!('geolocation' in navigator)) {
      setMsg({ type: 'err', text: 'Tu navegador no permite geolocalización.' });
      return;
    }
    setLoading(true);
    setMsg({ type: null, text: '' });

    // Nota: navigator.permissions es opcional. getCurrentPosition es quien dispara el prompt real.
    const ejecutar = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCoords(c);
          setMsg({ type: 'ok', text: 'Ubicación detectada. Puedes ajustar el pin si deseas.' });
          setLoading(false);
        },
        (err) => {
          // Mensajes más útiles según el error
          const mapa: Record<number, string> = {
            1: 'Permiso denegado. Actívalo en los permisos del navegador para este sitio.',
            2: 'No se pudo determinar la ubicación (posición no disponible).',
            3: 'La solicitud de ubicación expiró (timeout).',
          };
          setMsg({ type: 'err', text: mapa[err.code] || 'No se pudo obtener la ubicación.' });
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    };

    // Si la Permissions API está disponible, damos feedback más claro
    if ((navigator as any).permissions?.query) {
      (navigator as any).permissions
        .query({ name: 'geolocation' as PermissionName })
        .then((status: PermissionStatus) => {
          if (status.state === 'denied') {
            setMsg({
              type: 'err',
              text: 'Permiso de ubicación denegado. Ve a los permisos del sitio y habilítalo.',
            });
            setLoading(false);
          } else {
            // 'prompt' o 'granted' → ejecuta y que el browser pida permiso si corresponde
            ejecutar();
          }
        })
        .catch(() => ejecutar());
    } else {
      ejecutar();
    }
  };

 const confirmar = async () => {
  if (!coords) {
    setMsg({ type: 'err', text: 'Primero selecciona la ubicación en el mapa.' });
    return;
  }

  setLoading(true);
  setMsg({ type: null, text: '' });

  try {
    // Llama al backend
    const user=sessionStorage.getItem("userData")
    const userId= user ? JSON.parse(user)._id : null;

    if (!userId) {
      throw new Error('Usuario no identificado.');
    }
    const res = await actualizarUbicacionBack(userId, coords.lat.toString(), coords.lng.toString());

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody?.message || 'Error en la actualización');
    }


    // Le avisamos al padre si pasó onSave
    await onSave?.(coords);

    setMsg({ type: 'ok', text: 'Ubicación actualizada correctamente ✅' });
    setDone({ ok: true, text: 'Ubicación actualizada exitosamente.' });
  } catch (e: any) {
    setMsg({ type: 'err', text: e?.message || 'Error al actualizar la ubicación ❌' });
    setDone({ ok: false, text: e?.message || 'Error al actualizar la ubicación.' });
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <div className="fixed inset-0 bg-white/90 backdrop-blur-[2px] flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-3xl border border-gray-300 shadow-xl w-full max-w-xl p-6 text-center">
          <h2 className="text-blue-600 font-semibold text-lg mb-3">Actualizar ubicación</h2>
          <p className="text-gray-800 mb-4">Haz clic en el mapa para colocar el pin. O usa “Detectar ubicación”.</p>

          {msg.type && (
            <p className={`mb-3 text-sm ${msg.type === 'ok' ? 'text-green-600' : 'text-red-600'}`}>
              {msg.text}
            </p>
          )}

          <LeafletPick value={coords || undefined} onChange={setCoords as (c: LatLng) => void} />

          <div className="mt-3 text-sm text-gray-700">
            {coords ? (
              <>
                <span className="font-semibold">Lat:</span> {coords.lat} &nbsp;|&nbsp;
                <span className="font-semibold">Lng:</span> {coords.lng}
              </>
            ) : (
              <span className="text-gray-500">Sin seleccionar</span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full mt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-2xl hover:bg-gray-400 transition-colors disabled:opacity-60"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={pedirUbicacion}
              disabled={loading}
              className="flex-1 bg-blue-500 text-white py-2 rounded-2xl hover:bg-blue-600 transition-colors disabled:opacity-60"
            >
              {loading ? 'Detectando…' : 'Detectar ubicación'}
            </button>

            <button
              type="button"
              onClick={confirmar}
              disabled={!coords}
              className="flex-1 bg-green-500 text-white py-2 rounded-2xl hover:bg-green-600 transition-colors disabled:opacity-60"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>

      {done && (
        <StatusPanel
          ok={done.ok}
          text={done.text}
          onClose={() => {
            setDone(null);
            onClose();
          }}
        />
      )}
    </>
  );
}
