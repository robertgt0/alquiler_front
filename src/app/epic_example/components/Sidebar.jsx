"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; 
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const router = useRouter(); 
  const handleNavigate = (path) => {
    router.push(path);
    setOpen(false);
  };

  return (
    <>
      {/* Botón hamburguesa */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 focus:outline-none"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Fondo semi-transparente tipo vidrio */}
        {open && (
             <div
             onClick={() => setOpen(false)}
         className="fixed inset-0 z-40 backdrop-blur-sm bg-white/20 transition-opacity"
                ></div>
        )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl transform transition-transform z-50
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Encabezado con usuario */}
        <div className="p-6 border-b border-gray-200 flex items-center space-x-3">
          <div className="bg-purple-500 text-white rounded-full h-12 w-12 flex items-center justify-center">
            <User size={28} />
          </div>
          <div>
            <p className="text-lg font-semibold">Juan Pérez</p>
            <p className="text-sm text-gray-500">Usuario</p>
          </div>
        </div>

        {/* Opciones del menú */}
        <nav className="p-6 flex flex-col space-y-4">
          <button
            onClick={() => handleNavigate("/epic_example/citas-agendadas")} 
            className="text-left text-gray-700 hover:text-purple-600 font-medium"
          >
            Mis Citas
          </button>
        </nav>

        {/* Botón de Logout al fondo */}
        <div className="absolute bottom-6 left-0 w-full px-6">
          <button className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </>
  );
}
