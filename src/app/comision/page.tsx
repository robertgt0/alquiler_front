
"use client";
import { useState, useEffect, useMemo } from "react";

// --- 1. CONSTANTE DE COMISIÓN ---
const TASA_COMISION = 0.05; // 5%

// --- 2. INTERFACES DEL BACKEND ---
interface ITrabajo {
  _id: string;
  descripcion: string;
  estado: 'pendiente' | 'completado' | 'pagado'; // Ahora incluye 'pendiente'
  monto_a_pagar: number;
  fecha_creacion: string;
  fixer_id: string;
}

// (La interfaz de Billetera ya no es necesaria en el frontend)

// --- 3. INTERFACES DEL MODAL (Sin cambios) ---
type ModalView = 'closed' | 'options' | 'confirm_cash';

// --- 4. COMPONENTE SIDEBAR (Sin cambios) ---
function Sidebar() {
  return (
    <aside className="w-full md:w-64 lg:w-72 bg-white p-6 shadow-lg md:shadow-none md:border-r md:border-gray-200 flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-blue-600 text-white font-bold rounded-lg p-3 flex items-center justify-center h-12 w-12">
          FX
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">FIXER</h2>
          <p className="text-sm text-gray-500">Panel</p>
        </div>
      </div>

      {/* Navegación */}
      <nav className="space-y-3">
        <a
          href="#"
          className="flex items-center space-x-3 p-3 rounded-lg bg-blue-100 text-blue-700 font-semibold"
        >
          <span>Trabajos Activos</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 font-medium"
        >
          <span>Historial de Trabajos</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 font-medium"
        >
          <span>Mi Billetera</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 font-medium"
        >
          <span>Configuración</span>
        </a>
      </nav>
    </aside>
  );
}

// --- 5. COMPONENTE TARJETA DE TRABAJO (¡MODIFICADO!) ---
interface TrabajoCardProps {
  trabajo: ITrabajo;
  onClick: (trabajo: ITrabajo) => void;
}

function TrabajoCard({ trabajo, onClick }: TrabajoCardProps) {
  const comision = trabajo.monto_a_pagar * TASA_COMISION;
  const fecha = new Date(trabajo.fecha_creacion).toLocaleString("es-ES", {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
  });
  
  // ⬇️ La lógica de clic se mantiene: solo 'completado' es clicable
  const isClickable = trabajo.estado === 'completado';

  // ⬇️ Función de ayuda para los estilos del botón de estado
  const getStatusStyle = (estado: ITrabajo['estado']) => {
    switch (estado) {
      case 'completado':
        return { text: 'Completado', class: 'bg-blue-600 text-white' };
      case 'pagado':
        return { text: 'Pagado', class: 'bg-green-100 text-green-700' };
      case 'pendiente':
        return { text: 'Pendiente', class: 'bg-yellow-100 text-yellow-700' };
      default:
        return { text: estado, class: 'bg-gray-100 text-gray-700' };
    }
  }
  const status = getStatusStyle(trabajo.estado);

  return (
    <li
      className={`bg-blue-50 border border-blue-200 rounded-xl shadow-sm p-5 flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0 
        ${isClickable ? 'cursor-pointer hover:bg-blue-100 transition-colors' : 'cursor-default opacity-70'}`} // ⬇️ Estilo de clic/opacidad
      onClick={() => isClickable && onClick(trabajo)} // ⬇️ Solo llama a onClick si es clicable
    >
      {/* Detalles del Trabajo (sin cambios) */}
      <div className="flex-grow">
        <h3 className="font-bold text-lg text-gray-800">Nombre del cliente</h3>
        <p className="text-sm text-gray-600 mt-1">
          Tipo de servicio: {trabajo.descripcion}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Fecha programada: {fecha}
        </p>
        <div className="text-sm font-medium text-gray-700 mt-2">
          <span>Monto: <span className="font-bold">Bs {trabajo.monto_a_pagar.toFixed(2)}</span></span>
          <span className="mx-2">·</span>
          <span>Comisión: <span className="font-bold text-red-600">Bs {comision.toFixed(2)}</span></span>
        </div>
      </div>
      
      {/* Botón de Estado (Actualizado) */}
      <div className="flex-shrink-0">
        <span
          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${status.class}`} // ⬇️ Usa la clase de estado
        >
          {status.text} {/* ⬇️ Usa el texto de estado */}
        </span>
      </div>
    </li>
  );
}

// --- 6. COMPONENTE MODAL (Sin cambios) ---
interface ModalProps {
  view: 'options' | 'confirm_cash';
  setView: (view: ModalView) => void;
  onConfirm: () => Promise<void>;
  isConfirming: boolean;
  error: string | null;
}

function CompletadoModal({ view, setView, onConfirm, isConfirming, error }: ModalProps) {
  // ... (El JSX de este componente es idéntico al anterior, no necesita cambios)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30">
      <div
        className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full m-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* VISTA 1: OPCIONES DE PAGO */}
        {view === 'options' && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Método de Pago</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              {/* Opción 1: QR */}
              <button className="w-full flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150 ease-in-out">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5h3v3H5V5zm0 8h3v3H5v-3zm8-8h3v3h-3V5zm0 8h3v3h-3v-3zm-4 4h.01M9 9h.01M15 9h.01M9 15h.01M15 15h.01"></path></svg>
                <span className="font-semibold text-lg">QR</span>
              </button>
              {/* Opción 2: Tarjeta */}
              <button className="w-full flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150 ease-in-out">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7-4h12a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4a2 2 0 012-2z"></path></svg>
                <span className="font-semibold text-lg">Tarjeta</span>
              </button>
              {/* Opción 3: Efectivo */}
              <button
                className="w-full flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150 ease-in-out"
                onClick={() => setView('confirm_cash')}
              >
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                <span className="font-semibold text-lg">Efectivo</span>
              </button>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setView('closed')}
                className="py-2 px-5 rounded-lg font-semibold text-white bg-gray-500 hover:bg-gray-600 transition duration-300"
              >
                Cerrar
              </button>
            </div>
          </>
        )}

        {/* VISTA 2: CONFIRMACIÓN DE PAGO EN EFECTIVO */}
        {view === 'confirm_cash' && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Confirmar Pago</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p className="text-lg">¿Está seguro que desea marcar este trabajo como pagado en efectivo?</p>
              <p className="text-sm text-gray-500">El sistema descontará la comisión (5%) de su billetera y marcará el trabajo como "Pagado".</p>
            </div>
            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                <strong>Error:</strong> {error}
              </div>
            )}
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setView('options')}
                className="py-2 px-5 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition duration-300"
                disabled={isConfirming}
              >
                No, volver
              </button>
              <button
                onClick={onConfirm}
                className="py-2 px-5 rounded-lg font-semibold text-white bg-green-500 hover:bg-green-600 transition duration-300 disabled:opacity-50"
                disabled={isConfirming}
              >
                {isConfirming ? 'Procesando...' : 'Sí, confirmar'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// --- 7. COMPONENTE DE PÁGINA PRINCIPAL (¡MODIFICADO!) ---
export default function FixerJobsPage() {
  // --- Estados (Sin cambios) ---
  const [usuario, setUsuario] = useState("");
  const [trabajos, setTrabajos] = useState<ITrabajo[]>([]);
  const [loading, setLoading] = useState(false); 
  const [message, setMessage] = useState("Busca un usuario para ver sus trabajos.");

  // Estados del Modal (Sin cambios)
  const [modalView, setModalView] = useState<ModalView>('closed');
  const [selectedTrabajo, setSelectedTrabajo] = useState<ITrabajo | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // --- Carga de Datos (Sin cambios) ---
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) {
      setMessage("Por favor, ingrese un usuario.");
      return;
    }

    setLoading(true);
    setMessage("Buscando trabajos...");
    setTrabajos([]); 
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    try {
      const trabajosRes = await fetch(`${API_URL}/bitCrew/trabajos/${usuario}`);

      if (!trabajosRes.ok) {
        const errData = await trabajosRes.json();
        throw new Error(errData.message || 'No se pudieron cargar los trabajos');
      }
      
      const trabajosData = await trabajosRes.json();
      
      if (Array.isArray(trabajosData) && trabajosData.length > 0) {
        setTrabajos(trabajosData);
        setMessage(""); // Limpiar mensaje si hay resultados
      } else {
        setTrabajos([]);
        setMessage(`No se encontraron trabajos para el usuario "${usuario}".`);
      }

    } catch (err: any) {
      console.error("Error en fetch:", err);
      setMessage(err.message || "Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  // --- Lógica del Modal (Sin cambios) ---
  const handleTrabajoClick = (trabajo: ITrabajo) => {
    // ⬇️ Esta es la lógica clave que pediste
    if (trabajo.estado === 'completado') {
      setSelectedTrabajo(trabajo);
      setModalError(null);
      setModalView('options');
    }
    // Si el estado es 'pendiente' o 'pagado', no hace nada.
  };

  const handleConfirmCashPayment = async () => {
    if (!selectedTrabajo) {
      setModalError("No hay un trabajo seleccionado.");
      return;
    }

    setIsConfirming(true);
    setModalError(null);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    try {
      const response = await fetch(`${API_URL}/bitCrew/trabajos/${selectedTrabajo._id}/pagar-efectivo`, {
        method: 'PUT',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en el servidor');
      }

      // Actualizar la lista de trabajos en el frontend
      setTrabajos(prevTrabajos =>
        prevTrabajos.map(t =>
          t._id === selectedTrabajo._id
            ? { ...t, estado: 'pagado' } // Actualiza el estado localmente
            : t
        )
      );
      
      // Cerrar el modal
      setModalView('closed');
      setSelectedTrabajo(null);

    } catch (err: any) {
      console.error("Error al confirmar pago:", err);
      setModalError(err.message);
    } finally {
      setIsConfirming(false);
    }
  };

  // --- ⬇️ SE ELIMINÓ EL useMemo 'trabajosCompletados' ---
  // const trabajosCompletados = useMemo(() => ... );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      
      {/* Sidebar (Columna Izquierda) */}
      <Sidebar />

      {/* Contenido Principal (Columna Derecha) */}
      <main className="flex-1 p-6 md:p-10">
        
        {/* Título y Formulario de Búsqueda (Sin cambios) */}
        <h1 className="text-3xl font-bold text-gray-900">Trabajos</h1>
        <p className="mt-2 text-gray-600">
          Busca un fixer por su nombre de usuario para ver sus trabajos.
        </p>

        <form onSubmit={handleSearchSubmit} className="mt-6 flex items-end space-x-4 bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex-grow">
            <label htmlFor="usuario" className="block text-sm font-medium text-gray-700">
              Usuario del Fixer
            </label>
            <input
              type="text"
              id="usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Escribe el usuario (ej. tmolina)"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50 h-11" // h-11 para alinear
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </form>
        {/* --- FIN DEL FORMULARIO --- */}


        {/* ⬇️ --- Lista de Trabajos (¡MODIFICADA!) --- ⬇️ */}
        <div className="mt-8">
          
          {loading && (
            <p className="text-gray-500">Cargando trabajos...</p>
          )}

          {!loading && message && (
            <p className="text-gray-500">{message}</p>
          )}

          {/* Ahora renderiza basado en 'trabajos' en lugar de 'trabajosCompletados' 
          */}
          {!loading && !message && (
            <>
              {trabajos.length === 0 ? ( // ⬅️ CAMBIADO
                // Este mensaje solo aparece si la búsqueda fue exitosa pero no devolvió nada
                <p className="text-gray-500">Este usuario no tiene ningún trabajo registrado.</p> 
              ) : (
                <ul className="space-y-4">
                  {trabajos.map(trabajo => ( // ⬅️ CAMBIADO
                    <TrabajoCard
                      key={trabajo._id}
                      trabajo={trabajo}
                      onClick={handleTrabajoClick}
                    />
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </main>

      {/* Modal (renderizado condicional) */}
      {modalView !== 'closed' && (
        <CompletadoModal
          view={modalView as 'options' | 'confirm_cash'}
          setView={setModalView}
          onConfirm={handleConfirmCashPayment}
          isConfirming={isConfirming}
          error={modalError}
        />
      )}
    </div>
  );
}
