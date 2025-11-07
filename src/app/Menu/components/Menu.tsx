'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CerrarSesiones } from "./cerrarSesiones";
import CambiarTelefono from "./cambiarTelefono";
import PaginaMetodosAutenticacion from "../../metodosAutenticacion/metodosAuten/pagina";


export default function SimpleProfileMenu() {
  const [showCerrarSesionMessage, setShowCerrarSesionMessage] = useState(false);
  const [showCambiarTelefono, setShowCambiarTelefono] = useState(false);
  const [showMetodosAutenticacion, setShowMetodosAutenticacion] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [user, setUser] = useState<{
    id: string;
    nombre: string;
    correo: string;
    fotoPerfil: string;
    telefono: string;
  } | null>(null)

  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    sessionStorage.removeItem("userData");

    const eventLogout = new CustomEvent("logout-exitoso");
    window.dispatchEvent(eventLogout);

    router.push("/");
  };

  const handleContinue = () => setShowCerrarSesionMessage(false);
  const handleCancel = () => setShowCerrarSesionMessage(false);
  const handleCerrarSesionesClick = () => setShowCerrarSesionMessage(true);
  const handleCambiarTelefonoClick = () => setShowCambiarTelefono(true);
  const handleCerrarCambiarTelefono = () => setShowCambiarTelefono(false);
  const handleMetodosAutenticacionClick = () => setShowMetodosAutenticacion(true);
  const handleCerrarMetodosAutenticacion = () => setShowMetodosAutenticacion(false);
  const toggleSubMenu = () => setShowSubMenu(prev => !prev);

  useEffect(() => {
    // Obtener usuario desde localStorage
    const storedUser = sessionStorage.getItem("userData");
    if (!storedUser) return;

    try {
      const parsed = JSON.parse(storedUser);

    setUser({
      id: parsed._id || parsed.id,
      nombre:
        parsed.nombre ||
        `${parsed.firstName ?? ""} ${parsed.lastName ?? ""}`.trim() ||
        "Usuario",
      correo: parsed.correo || parsed.email || "correo@desconocido.com",
      fotoPerfil: parsed.fotoPerfil || "/images/default-profile.jpg",
      telefono: parsed.telefono ||""
    });
  } catch (error) {
    console.error("Error al leer userData del localStorage:", error);
  }
  }, []);

  return (
    <div className="relative w-full min-w-[220px] sm:min-w-[260px] lg:min-w-[300px] max-w-sm bg-white rounded-3xl shadow-lg border border-gray-200 p-5 sm:p-6 lg:p-6">

      {/* Datos del usuario */}
      <div className="flex items-center mb-4">
        <Image
          src={user?.fotoPerfil || "/images/default-profile.jpg"}
          alt="Foto de perfil"
          width={50}
          height={50}
          className="rounded-full object-cover border border-gray-300"
          unoptimized
          onError={(e) => {
            // fallback si la URL remota falla
            (e.currentTarget).src = "/images/default-profile.jpg";
          }}
        />
        <div className="ml-3 truncate">
          <p className="font-semibold text-gray-800 text-base sm:text-base">
            {user?.nombre || "Cargando..."}
          </p>
          <p className="text-sm sm:text-sm text-gray-600">
            {user?.correo || "Cargando..."}
          </p>
        </div>
      </div>

      <hr className="border-gray-300 mb-3" />

      {/* Botón Configuración */}
      <button
        onClick={toggleSubMenu}
        className="text-base sm:text-base font-semibold text-gray-800 hover:bg-gray-100 rounded-2xl px-4 py-3 w-full text-left transition duration-150"
      >
        Configuración
      </button>

      {/* Submenú */}
      {showSubMenu && (
  <div className="flex flex-col space-y-3 pl-4 mt-3 border-l-2 border-gray-200
                  max-h-[60vh] sm:max-h-[50vh] md:max-h-[40vh] overflow-y-auto">
    <button className="text-base sm:text-base font-semibold text-gray-800 hover:bg-gray-100 rounded-2xl px-4 py-3 text-left">
      Cambiar contraseña
    </button>
    <button
      onClick={handleCambiarTelefonoClick}
      className="text-base sm:text-base font-semibold text-gray-800 hover:bg-gray-100 rounded-2xl px-4 py-3 text-left"
    >
      Cambiar teléfono
    </button>
    <button className="text-base sm:text-base font-semibold text-gray-800 hover:bg-gray-100 rounded-2xl px-4 py-3 text-left">
      Métodos de autenticación
    </button>
    <button className="text-base sm:text-base font-semibold text-gray-800 hover:bg-gray-100 rounded-2xl px-4 py-3 text-left">
      Seguridad
    </button>
    <button
      onClick={handleCerrarSesionesClick}
      className="text-base sm:text-base font-semibold text-gray-800 hover:bg-gray-100 rounded-2xl px-4 py-3 text-left mt-2"
    >
      Cerrar sesiones
    </button>
  </div>
)}


      {/* Botón Cerrar sesión fuera del submenú */}
      <button
        onClick={handleLogout}
        className="text-base sm:text-base font-semibold text-gray-800 hover:bg-gray-100 rounded-2xl px-4 py-3 text-left mt-3"
      >
        Cerrar sesión
      </button>

      {/* Modales */}
      {showCerrarSesionMessage && (
        <CerrarSesiones onContinue={handleContinue} onCancel={handleCancel} />
      )}
      {showCambiarTelefono && (
        <CambiarTelefono onClose={handleCerrarCambiarTelefono} 
        userId={user?.id || ""}
        telefonoActual={user?.telefono || ""} />
      )}
      {showMetodosAutenticacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Métodos de Autenticación
              </h2>
              <button
                onClick={handleCerrarMetodosAutenticacion}
                className="text-gray-500 hover:text-gray-700 text-2xl font-semibold"
              >
                ×
              </button>
            </div>

            {/* Content - Usando directamente el componente de página */}
            <div className="p-4">
              <PaginaMetodosAutenticacion />
            </div>

            {/* Footer */}
            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={handleCerrarMetodosAutenticacion}
                className="px-6 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition duration-200 font-semibold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}