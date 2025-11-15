// modules/GestorMetodos.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { GestorMetodosProps, ModosInterfaz, MetodoAutenticacion } from '../interfaces/types';
import MetodoActivoPanel from '../components/MetodoActivoPanel';
import MetodosDisponiblesList from '../components/MetodosDisponiblesList';
import ModalContrasena from '../components/ModalContrasena';
import { useRouter } from 'next/navigation';
import { eliminarAutenticacion, agregarAutenticacion } from '@/app/teamsys/services/UserService';

// === Toast flotante de éxito / error ===
type ToastKind = 'success' | 'error';

interface StatusToastProps {
  kind: ToastKind;
  text: string;
  onClose: () => void;
}

const StatusToast: React.FC<StatusToastProps> = ({ kind, text, onClose }) => {
  const isSuccess = kind === 'success';
  const emoji = isSuccess ? '✅' : '❌';

  // Efecto: cerrar automáticamente a los 2s
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/30 backdrop-blur-[2px]"
      onClick={(e) => e.stopPropagation()} // evita que haga click en padres
    >
      <div
        className={`
          w-full max-w-md rounded-2xl shadow-xl border px-6 py-5
          bg-white flex flex-col items-center gap-3 animate-fade-in
          ${isSuccess ? 'border-blue-300' : 'border-red-300'}
        `}
        onClick={(e) => e.stopPropagation()} // evita burbuja
      >
        <div
          className={`
            w-14 h-14 rounded-full flex items-center justify-center text-3xl
            ${isSuccess ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}
          `}
        >
          {emoji}
        </div>

        <h3
          className={`
            text-lg font-semibold text-center
            ${isSuccess ? 'text-blue-800' : 'text-red-800'}
          `}
        >
          {isSuccess ? '¡Operación exitosa!' : 'No se pudo completar la acción'}
        </h3>

        <p className="text-sm text-center text-slate-600">
          {text}
        </p>
      </div>
    </div>
  );
};


export default function GestorMetodos({
  metodos,
  metodosActivos,
  cargando,
  activarMetodo,
  eliminarMetodo,
  recargarMetodos
}: GestorMetodosProps & { recargarMetodos?: () => void }) {
  const [modos, setModos] = useState<ModosInterfaz>({
    modoSeleccion: false,
    modoEliminar: false,
    metodosSeleccionados: [],
    metodosAEliminar: []
  });
  const router = useRouter();
  const [modalContrasenaAbierto, setModalContrasenaAbierto] = useState(false);
  const [metodoSeleccionadoParaContrasena, setMetodoSeleccionadoParaContrasena] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [mensajeOk, setMensajeOk] = useState<string | null>(null);

  const limpiarError = () => setError(null);
  const limpiarMensajeOk = () => setMensajeOk(null);

  // ===== Helpers sin any =====
  const isRecord = (v: unknown): v is Record<string, unknown> =>
    typeof v === 'object' && v !== null;

  const getStr = (obj: unknown, key: string): string | null =>
    isRecord(obj) && typeof obj[key] === 'string' ? String(obj[key]) : null;

  // ====== UI: modos ======
  const activarModoSeleccion = () => {
    limpiarError();
    limpiarMensajeOk();
    setModos({
      modoSeleccion: true,
      modoEliminar: false,
      metodosSeleccionados: [],
      metodosAEliminar: []
    });
  };

  const activarModoEliminar = () => {
    limpiarError();
    limpiarMensajeOk();
    setModos({
      modoEliminar: true,
      modoSeleccion: false,
      metodosAEliminar: [],
      metodosSeleccionados: []
    });
  };

  const desactivarModos = () => {
    limpiarError();
    setModos({
      modoSeleccion: false,
      modoEliminar: false,
      metodosSeleccionados: [],
      metodosAEliminar: []
    });
  };

  const toggleSeleccionMetodo = (metodoId: string) => {
    limpiarError();
    if (!modos.modoSeleccion) return;

    const metodo = metodos.find(m => m.id === metodoId);
    if (metodo?.activo) {
      return;
    }

    if (modos.metodosSeleccionados.includes(metodoId)) {
      setModos(prev => ({ ...prev, metodosSeleccionados: [] }));
    } else {
      setModos(prev => ({ ...prev, metodosSeleccionados: [metodoId] }));
    }
  };

  const toggleSeleccionEliminar = (metodoId: string) => {
    limpiarError();

    const metodo = metodos.find(m => m.id === metodoId);
    if (metodo?.esMetodoRegistro) {
      setError('No se puede eliminar el método de autenticación con el que te registraste');
      return;
    }

    const esUnicoMetodoActivo = metodosActivos.length === 1;
    if (esUnicoMetodoActivo) {
      setError('No se puede eliminar el único método activo');
      return;
    }

    if (modos.metodosAEliminar.includes(metodoId)) {
      setModos(prev => ({
        ...prev,
        metodosAEliminar: prev.metodosAEliminar.filter(id => id !== metodoId)
      }));
    } else {
      setModos(prev => ({
        ...prev,
        metodosAEliminar: [...prev.metodosAEliminar, metodoId]
      }));
    }
  };

  const activarMetodosSeleccionados = async () => {
    if (modos.metodosSeleccionados.length === 0) {
      setError('Por favor selecciona un método para activar');
      return;
    }

    const metodoId = modos.metodosSeleccionados[0];

    try {
      limpiarError();
      limpiarMensajeOk();

      const metodo = metodos.find(m => m.id === metodoId);
      if (metodo?.activo) {
        return;
      }

      if (metodoId === 'correo') {
        const googleEstaActivo = metodosActivos.some(m => m.id === 'google');
        if (!googleEstaActivo) {
          setError('Primero debe activar Google para tener el correo electrónico');
          return;
        }
        setMetodoSeleccionadoParaContrasena(metodoId);
        setModalContrasenaAbierto(true);
      } else if (metodoId === 'google') {
        activarMetodoGoogle();
      } else {
        await activarMetodo(metodoId);
        setMensajeOk('Método activado exitosamente');
        if (recargarMetodos) await recargarMetodos();
        desactivarModos();
      }
    } catch (err) {
      setError(`Error al activar método: ${err}`);
    }
  };
const activarMetodoGoogle = (): void => {
  if (typeof window === 'undefined') return;

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    setError('Falta NEXT_PUBLIC_GOOGLE_CLIENT_ID');
    return;
  }

  const returnTo =
    window.location.pathname +
    window.location.search +
    window.location.hash;

  const origin = (() => {
    const base = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '');
    return base || window.location.origin;
  })();

  const redirectUri = `${origin}/auth/google/callback`;

  const state = btoa(
    JSON.stringify({ returnTo, flow: 'link-google' as const })
  );

  const params = new URLSearchParams({
    client_id: String(clientId),
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
    state,
  });

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  const width = 500;
  const height = 600;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;
  const features = `width=${width},height=${height},left=${left},top=${top}`;

  // 🔹 Intentar abrir popup
  const popup = window.open(googleAuthUrl, '_blank', features);

  if (!popup) {
    setError(
      'No se pudo abrir la ventana de Google. ' +
        'Verifica que tu navegador permita ventanas emergentes (pop-ups) para este sitio.'
    );
    return;
  }

  // Limpiamos mensajes previos
  limpiarError();
  limpiarMensajeOk();

  type Flow = 'link-google' | 'signup';
  type SuccessMsg = {
    type: 'google-auth-success';
    email?: string;
    returnTo?: string;
    flow?: Flow;
  };
  type ErrorMsg = {
    type: 'google-auth-error';
    message?: string;
  };
  type Payload = SuccessMsg | ErrorMsg;

  const onMessage = async (ev: MessageEvent) => {
    if (ev.origin !== origin) return;
    const payload = ev.data as unknown;
    if (!payload || typeof payload !== 'object') return;

    const p = payload as Payload;

    // Siempre intentamos desconectar el listener y cerrar el popup
    window.removeEventListener('message', onMessage);
    try {
      if (popup && !popup.closed) {
        popup.close();
      }
    } catch {
      // ignoramos errores al cerrar el popup
    }

    if (p.type === 'google-auth-success') {
      const email = typeof p.email === 'string' ? p.email : undefined;

      try {
        const userDataString = sessionStorage.getItem('userData');
        if (!userDataString) throw new Error('No hay userData en sessionStorage');

        interface StoredUser {
          _id?: string;
          id?: string;
          email?: string;
          correo?: string;
        }
        const userData: StoredUser = JSON.parse(userDataString);

        const userId = userData._id ?? userData.id;
        const emailActual = userData.email ?? userData.correo;

        if (!userId) throw new Error('No se pudo obtener el id del usuario actual');
        if (!email) throw new Error('No llegó el email desde Google');
        if (!emailActual) throw new Error('El usuario actual no tiene email en sessionStorage');

        if (email.toLowerCase() !== emailActual.toLowerCase()) {
          throw new Error('El correo de Google no coincide con el del usuario actual');
        }

        // Por si había algún error viejo
        limpiarError();

        const resp = await agregarAutenticacion(userId, 'google', email);
        if (!resp || resp.success !== true) {
          const msg =
            resp && typeof resp.message === 'string'
              ? resp.message
              : 'No se pudo vincular el método Google';
          throw new Error(msg);
        }

        setMensajeOk('Método Google activado exitosamente');

        if (recargarMetodos) await recargarMetodos();

        // Limpiamos modos / selección (solo interno del gestor)
        desactivarModos();
      } catch (e) {
        const msg =
          e instanceof Error ? e.message : 'Error al vincular Google';
        limpiarMensajeOk();
        setError(msg);
      }
    }

    if (p.type === 'google-auth-error') {
      limpiarMensajeOk();
      setError(p.message || 'Error en la autenticación con Google');
    }
  };

  window.addEventListener('message', onMessage);
};


  const manejarConfirmacionContrasena = async (contrasena: string) => {
    try {
      limpiarError();
      limpiarMensajeOk();

      const userDataString = sessionStorage.getItem('userData');
      if (!userDataString) {
        throw new Error('No se encontraron datos de usuario en sessionStorage');
      }

      const userData = JSON.parse(userDataString) as unknown;
      const userId = getStr(userData, '_id') ?? getStr(userData, 'id');
      if (!userId) {
        throw new Error('No se pudo obtener el id del usuario desde sessionStorage');
      }

      const resp = await agregarAutenticacion(userId, 'local', contrasena);
      if (!resp.success) throw new Error(resp.message);
      setMensajeOk('Método de correo y contraseña activado exitosamente');

      if (recargarMetodos) await recargarMetodos();
      setModalContrasenaAbierto(false);
      setMetodoSeleccionadoParaContrasena(null);
      desactivarModos();
    } catch (err) {
      console.error('Error en manejarConfirmacionContrasena:', err);
      setError(
        `Error al configurar contraseña: ${
          err instanceof Error ? err.message : 'Error desconocido'
        }`
      );
    }
  };

  const eliminarMetodosSeleccionados = async () => {
    try {
      limpiarError();
      limpiarMensajeOk();

      const metodosAEliminarConInfo = modos.metodosAEliminar
        .map(id => metodos.find(m => m.id === id))
        .filter(Boolean) as MetodoAutenticacion[];

      const contieneMetodoRegistro = metodosAEliminarConInfo.some(m => m.esMetodoRegistro);
      if (contieneMetodoRegistro) {
        setError('No se puede eliminar el método de autenticación con el que te registraste');
        return;
      }

      const metodosRestantes = metodosActivos.length - modos.metodosAEliminar.length;
      if (metodosRestantes < 1) {
        setError('Debe quedar al menos un método de autenticación activo');
        return;
      }

      const userDataString = sessionStorage.getItem('userData');
      if (!userDataString) {
        throw new Error('No se encontraron datos de usuario en sessionStorage');
      }

      const userData = JSON.parse(userDataString) as unknown;
      const userId = getStr(userData, '_id') ?? getStr(userData, 'id');
      if (!userId) {
        throw new Error('No se pudo obtener el id del usuario desde sessionStorage');
      }

      for (const id of modos.metodosAEliminar) {
        let provider = id;
        if (provider === 'correo') provider = 'local';
        await eliminarAutenticacion(userId, provider);
      }

      setMensajeOk('Método de autenticación eliminado exitosamente');
      if (recargarMetodos) await recargarMetodos();
      desactivarModos();
    } catch (err) {
      setError(`Error al eliminar métodos: ${err}`);
    }
  };

  const metodosDisponibles: MetodoAutenticacion[] = [
    {
      id: 'correo',
      nombre: 'Correo/Contraseña',
      tipo: 'correo',
      icono: '📧',
      color: 'blue',
      activo: metodos.some(m => m.id === 'correo' && m.activo),
      esMetodoRegistro: metodos.find(m => m.id === 'correo')?.esMetodoRegistro || false
    },
    {
      id: 'google',
      nombre: 'Google',
      tipo: 'google',
      icono: '🔐',
      color: 'red',
      activo: metodos.some(m => m.id === 'google' && m.activo),
      esMetodoRegistro: metodos.find(m => m.id === 'google')?.esMetodoRegistro || false
    }
  ];

  const metodosDisponiblesFiltrados = metodosDisponibles;

  /*if (cargando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando métodos de autenticación...</p>
        </div>
      </div>
    );
  }*/

  return (
  <>
    {(mensajeOk || error) && (
      <StatusToast
        kind={mensajeOk ? 'success' : 'error'}
        text={mensajeOk ?? error ?? ''}
        onClose={() => {
          limpiarMensajeOk();
          limpiarError();
        }}
      />
    )}

    <div className="relative">
      {/* Overlay de carga sólo sobre esta sección */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <MetodoActivoPanel
          metodosActivos={metodosActivos}
          modos={modos}
          metodos={metodos}
          onToggleEliminar={toggleSeleccionEliminar}
          onActivarModoSeleccion={activarModoSeleccion}
          onActivarModoEliminar={activarModoEliminar}
          onDesactivarModos={desactivarModos}
          onEliminarMetodos={eliminarMetodosSeleccionados}
        />
        <MetodosDisponiblesList
  metodosDisponibles={metodosDisponiblesFiltrados}
  metodosActivos={metodosActivos}
  modos={modos}
  cargandoGoogle={false}  
  onToggleSeleccion={toggleSeleccionMetodo}
  onDesactivarModos={desactivarModos}
  onActivarMetodos={activarMetodosSeleccionados}
/>

      </div>
    </div>

    <ModalContrasena
      isOpen={modalContrasenaAbierto}
      onClose={() => {
        setModalContrasenaAbierto(false);
        setMetodoSeleccionadoParaContrasena(null);
        //desactivarModos();
      }}
      onConfirm={manejarConfirmacionContrasena}
    />
  </>
);

}
