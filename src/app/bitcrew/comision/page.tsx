"use client";
import { useState } from "react";
import Link from "next/link";

// --- 1. CONSTANTE DE COMISIÓN ---
const TASA_COMISION = 0.05; // 5%

// --- 2. INTERFACES DEL BACKEND ---
interface ITrabajo {
  _id: string;
  descripcion: string;
  estado: 'pendiente' | 'completado' | 'pagado';
  monto_a_pagar: number;
  fecha_creacion: string;
  fixer_id: string;
}

// --- 3. INTERFACES DEL MODAL ---
type ModalView = 'closed' | 'options' | 'confirm_cash';

// --- 4. COMPONENTE HEADER (NAVBAR) ---
function NavBar() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 text-white font-bold rounded-lg p-2 flex items-center justify-center h-10 w-10">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Servineo</h1>
          </div>

          {/* Buscador */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 absolute right-3 top-2.5 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
          </div>

          {/* Botones */}
          <div className="flex items-center space-x-3">
            <Link
              href="/bitcrew/comision"
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Ser Fixer
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

// --- 5. COMPONENTE SIDEBAR ---
function Sidebar({ usuario }: { usuario: string }) {
  const hasUser = !!usuario;

  return (
    <aside className="w-full md:w-64 lg:w-72 bg-white p-6 shadow-lg md:shadow-none md:border-r md:border-gray-200 flex-shrink-0">
      {/* Logo del Panel */}
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
        <Link
          href="/bitcrew/comision"
          className="flex items-center space-x-3 p-3 rounded-lg bg-blue-100 text-blue-700 font-semibold"
        >
          <span>Trabajos Activos</span>
        </Link>
        
        {/* Historial */}
        {!hasUser ? (
           <span className="flex items-center space-x-3 p-3 rounded-lg text-gray-400 bg-gray-50 cursor-not-allowed">
             <span>Historial de Trabajos</span>
           </span>
        ) : (
          <Link
            href={`/bitcrew/historial?usuario=${usuario}`}
            className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 font-medium"
          >
            <span>Historial de Trabajos</span>
          </Link>
        )}

        {/* Billetera */}
        {!hasUser ? (
           <span className="flex items-center space-x-3 p-3 rounded-lg text-gray-400 bg-gray-50 cursor-not-allowed" title="Debe buscar un usuario primero">
             <span>Mi Billetera</span>
           </span>
        ) : (
          <Link
            href={`/bitcrew/wallet?usuario=${usuario}`}
            className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 font-medium"
          >
            <span>Mi Billetera</span>
          </Link>
        )}

        <Link
          href="#"
          className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 font-medium"
        >
          <span>Configuración</span>
        </Link>
      </nav>
    </aside>
  );
}

// --- 6. COMPONENTE TARJETA DE TRABAJO ---
interface TrabajoCardProps {
  trabajo: ITrabajo;
  onClick: (trabajo: ITrabajo) => void;
}

function TrabajoCard({ trabajo, onClick }: TrabajoCardProps) {
  const comision = trabajo.monto_a_pagar * TASA_COMISION;
  const fecha = new Date(trabajo.fecha_creacion).toLocaleString("es-ES", {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
  });
  
  const isClickable = trabajo.estado === 'completado';

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
        ${isClickable ? 'cursor-pointer hover:bg-blue-100 transition-colors' : 'cursor-default opacity-70'}`}
      onClick={() => isClickable && onClick(trabajo)}
    >
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
      
      <div className="flex-shrink-0">
        <span
          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${status.class}`}
        >
          {status.text}
        </span>
      </div>
    </li>
  );
}

// --- 7. COMPONENTE MODAL ---
interface ModalProps {
  view: 'options' | 'confirm_cash';
  setView: (view: ModalView) => void;
  onConfirm: () => Promise<void>;
  isConfirming: boolean;
  error: string | null;
}

function CompletadoModal({ view, setView, onConfirm, isConfirming, error }: ModalProps) {
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
              <button className="w-full flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150 ease-in-out">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5h3v3H5V5zm0 8h3v3H5v-3zm8-8h3v3h-3V5zm0 8h3v3h-3v-3zm-4 4h.01M9 9h.01M15 9h.01M9 15h.01M15 15h.01"></path></svg>
                <span className="font-semibold text-lg">QR</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150 ease-in-out">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7-4h12a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4a2 2 0 012-2z"></path></svg>
                <span className="font-semibold text-lg">Tarjeta</span>
              </button>
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
            {/* ✅ SOLUCIÓN BUG 2: Mostrar error específico con formato mejorado */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-lg">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">No se puede procesar el pago</p>
                    <p className="text-sm mt-1 whitespace-pre-line">{error}</p>
                  </div>
                </div>
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

// --- 8. COMPONENTE DE PÁGINA PRINCIPAL ---
export default function FixerJobsPage() {
  // --- Estados ---
  const [usuario, setUsuario] = useState("");
  const [trabajos, setTrabajos] = useState<ITrabajo[]>([]);
  const [loading, setLoading] = useState(false); 
  const [message, setMessage] = useState("Busca un usuario para ver sus trabajos.");

  // Estados del Modal
  const [modalView, setModalView] = useState<ModalView>('closed');
  const [selectedTrabajo, setSelectedTrabajo] = useState<ITrabajo | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // --- Carga de Datos ---
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
        setMessage(""); 
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

  // --- Lógica del Modal ---
  const handleTrabajoClick = (trabajo: ITrabajo) => {
    if (trabajo.estado === 'completado') {
      setSelectedTrabajo(trabajo);
      setModalError(null);
      setModalView('options');
    }
  };

  // ✅ SOLUCIÓN BUG 2: Función actualizada con manejo específico de errores
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
        // ✅ SOLUCIÓN: Manejo específico del error de saldo insuficiente
        if (data.errorCode === 'SALDO_INSUFICIENTE') {
          // Mensaje mejorado para el usuario
          throw new Error(
            `${data.message}\n\nPor favor recarga tu billetera para continuar con el cobro.`
          );
        }
        
        // Otros errores de validación
        throw new Error(data.message || 'Error al procesar el pago');
      }

      // ✅ Pago exitoso
      setTrabajos(prevTrabajos =>
        prevTrabajos.map(t =>
          t._id === selectedTrabajo._id
            ? { ...t, estado: 'pagado' }
            : t
        )
      );
      
      setModalView('closed');
      setSelectedTrabajo(null);

    } catch (err: any) {
      console.error("Error al confirmar pago:", err);
      setModalError(err.message);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ HEADER CON SERVINEO */}
      <NavBar />

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex flex-col md:flex-row">
        
        {/* Sidebar */}
        <Sidebar usuario={usuario} />

        {/* Área de trabajo */}
        <main className="flex-1 p-6 md:p-10">
          
          {/* Título */}
          <h1 className="text-3xl font-bold text-gray-900">Trabajos</h1>
          <p className="mt-2 text-gray-600">
            Busca un fixer por su nombre de usuario para ver sus trabajos.
          </p>

          {/* Formulario de Búsqueda */}
          <form onSubmit={handleSearchSubmit} className="mt-6 bg-white p-6 rounded-lg shadow-sm border">
            <div className="space-y-4">
              <div>
                <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 mb-2">
                  Usuario del Fixer
                </label>
                <input
                  type="text"
                  id="usuario"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  placeholder="Escribe el usuario (ej. tmolina)"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {loading ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              Busca un usuario para ver sus trabajos.
            </p>
          </form>

          {/* Lista de Trabajos */}
          <div className="mt-8">
            
            {loading && (
              <p className="text-gray-500">Cargando trabajos...</p>
            )}

            {!loading && message && (
              <p className="text-gray-500">{message}</p>
            )}

            {!loading && !message && (
              <>
                {trabajos.length === 0 ? (
                  <p className="text-gray-500">Este usuario no tiene ningún trabajo registrado.</p> 
                ) : (
                  <ul className="space-y-4">
                    {trabajos.map(trabajo => (
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
      </div>

      {/* Modal */}
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