// modules/GestorMetodos.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { GestorMetodosProps, ModosInterfaz, MetodoAutenticacion } from '../interfaces/types';
import MetodoActivoPanel from '../components/MetodoActivoPanel';
import MetodosDisponiblesList from '../components/MetodosDisponiblesList';
import ModalContrasena from '../components/ModalContrasena';
import { useRouter, useSearchParams } from 'next/navigation';
import { eliminarAutenticacion, agregarAutenticacion } from '@/app/teamsys/services/UserService';

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
  const [cargandoGoogle, setCargandoGoogle] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const limpiarError = () => setError(null);

  // ===== Helpers sin any =====
  const isRecord = (v: unknown): v is Record<string, unknown> =>
    typeof v === 'object' && v !== null;

  const getStr = (obj: unknown, key: string): string | null =>
    isRecord(obj) && typeof obj[key] === 'string' ? String(obj[key]) : null;

  // ====== UI: modos ======
  const activarModoSeleccion = () => {
    limpiarError();
    setModos({
      modoSeleccion: true,
      modoEliminar: false,
      metodosSeleccionados: [],
      metodosAEliminar: []
    });
  };

  const activarModoEliminar = () => {
    limpiarError();
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
      setError('Este método ya está activo');
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

      const metodo = metodos.find(m => m.id === metodoId);
      if (metodo?.activo) {
        setError('Este método ya está activo');
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
        activarMetodoGoogle(); // misma ventana
      } else {
        await activarMetodo(metodoId);
        desactivarModos();
      }
    } catch (err) {
      setError(`Error al activar método: ${err}`);
    }
  };

  // ====== Google en la misma ventana ======
  // ====== Google en POPUP (no reemplaza toda la ventana) ======
// ====== Google en POPUP (vincular método; sin guardar tokens) ======
const activarMetodoGoogle = (): void => {
  if (typeof window === "undefined") return;

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    setError("Falta NEXT_PUBLIC_GOOGLE_CLIENT_ID");
    return;
  }

  // Volver a la misma pantalla
  const returnTo = window.location.pathname + window.location.search + window.location.hash;

  // redirect_uri fijo al callback
  const origin = (() => {
    const base = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "");
    return base || window.location.origin;
  })();
  const redirectUri = `${origin}/auth/google/callback`;

  // flow=link-google para que el callback sepa que es vinculación
  const state = btoa(JSON.stringify({ returnTo, flow: "link-google" as const }));

  const params = new URLSearchParams({
    client_id: String(clientId),
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
    state,
  });

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  // Popup centrado
  const width = 500, height = 600;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;
  const features = `width=${width},height=${height},left=${left},top=${top}`;

  const popup = window.open(googleAuthUrl, "google-oauth", features);
  if (!popup) {
    // Fallback si bloquean el popup
    window.location.href = googleAuthUrl;
    return;
  }

  setCargandoGoogle(true);

  // Tipos seguros para el mensaje
  type Flow = "link-google" | "signup";
  type SuccessMsg = {
    type: "google-auth-success";
    email?: string;
    returnTo?: string;
    flow?: Flow;
  };
  type ErrorMsg = {
    type: "google-auth-error";
    message?: string;
  };
  type Payload = SuccessMsg | ErrorMsg;

  const onMessage = async (ev: MessageEvent) => {
    if (ev.origin !== origin) return;
    const payload = ev.data as unknown;

    // Valida estructura básica
    if (!payload || typeof payload !== "object") return;
    const p = payload as Payload;

    if (p.type === "google-auth-success") {
      // Viene solo email desde el callback en flujo link-google
      const email = typeof p.email === "string" ? p.email : undefined;

      try {
        // 1) Usuario actual desde sessionStorage (YA existente en tu app)
        const userDataString = sessionStorage.getItem("userData");
        if (!userDataString) throw new Error("No hay userData en sessionStorage");

        // Tipar mínimamente lo que necesitas
        interface StoredUser {
          _id?: string;
          id?: string;
          email?: string;
          correo?: string;
        }
        const userData: StoredUser = JSON.parse(userDataString);

        const userId = userData._id ?? userData.id;
        const emailActual = userData.email ?? userData.correo;

        if (!userId) throw new Error("No se pudo obtener el id del usuario actual");
        if (!email) throw new Error("No llegó el email desde Google");
        if (!emailActual) throw new Error("El usuario actual no tiene email en sessionStorage");

        // 2) Comparar correos (case-insensitive)
        if (email.toLowerCase() !== emailActual.toLowerCase()) {
          throw new Error("El correo de Google no coincide con el del usuario actual");
        }

        // 3) Vincular método google en backend (tu función usa email en el campo "password" cuando provider !== local)
        const resp = await agregarAutenticacion(userId, "google", email);
        if (!resp || resp.success !== true) {
          const msg = (resp && typeof resp.message === "string") ? resp.message : "No se pudo vincular el método Google";
          throw new Error(msg);
        }

        // 4) Refrescar UI del Gestor
        if (recargarMetodos) await recargarMetodos();
        desactivarModos();
        setCargandoGoogle(false);
        window.removeEventListener("message", onMessage);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Error al vincular Google";
        setCargandoGoogle(false);
        setError(msg);
        window.removeEventListener("message", onMessage);
      }
    }

    if (p.type === "google-auth-error") {
      setCargandoGoogle(false);
      setError(p.message || "Error en la autenticación con Google");
      window.removeEventListener("message", onMessage);
    }
  };

  window.addEventListener("message", onMessage);
};

  // ====== Correo/Contraseña ======
  const manejarConfirmacionContrasena = async (contrasena: string) => {
    try {
      limpiarError();

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

      if (recargarMetodos) await recargarMetodos();
      setModalContrasenaAbierto(false);
      setMetodoSeleccionadoParaContrasena(null);
      desactivarModos();
    } catch (err) {
      console.error('Error en manejarConfirmacionContrasena:', err);
      setError(`Error al configurar contraseña: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    }
  };

  // ====== Eliminar métodos ======
  const eliminarMetodosSeleccionados = async () => {
    try {
      limpiarError();

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

      if (recargarMetodos) await recargarMetodos();
      desactivarModos();
    } catch (err) {
      setError(`Error al eliminar métodos: ${err}`);
    }
  };

  // ====== Catálogo de métodos disponibles ======
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
    },
  ];

  const metodosDisponiblesFiltrados = metodosDisponibles;

  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando métodos de autenticación...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">{error}</p>
          <button
            onClick={limpiarError}
            className="mt-2 text-red-600 hover:text-red-800 text-sm"
          >
            Cerrar
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <MetodoActivoPanel
          metodosActivos={metodosActivos}
          modos={modos}
          metodos={metodos}
          onToggleEliminar={eliminarMetodosSeleccionados.length ? toggleSeleccionEliminar : toggleSeleccionEliminar}
          onActivarModoSeleccion={activarModoSeleccion}
          onActivarModoEliminar={activarModoEliminar}
          onDesactivarModos={desactivarModos}
          onEliminarMetodos={eliminarMetodosSeleccionados}
        />
        <MetodosDisponiblesList
          metodosDisponibles={metodosDisponiblesFiltrados}
          metodosActivos={metodosActivos}
          modos={modos}
          cargandoGoogle={cargandoGoogle}
          onToggleSeleccion={toggleSeleccionMetodo}
          onDesactivarModos={desactivarModos}
          onActivarMetodos={activarMetodosSeleccionados}
        />
      </div>

      <ModalContrasena
        isOpen={modalContrasenaAbierto}
        onClose={() => {
          setModalContrasenaAbierto(false);
          setMetodoSeleccionadoParaContrasena(null);
          desactivarModos();
        }}
        onConfirm={manejarConfirmacionContrasena}
      />
    </>
  );
}