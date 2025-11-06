'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CerrarSesiones } from "./cerrarSesiones";
import CambiarTelefono from "./cambiarTelefono";

export default function SimpleProfileMenu() {
  const [showCerrarSesionMessage, setShowCerrarSesionMessage] = useState(false);
  const [showCambiarTelefono, setShowCambiarTelefono] = useState(false);
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
    </div>
  );
}