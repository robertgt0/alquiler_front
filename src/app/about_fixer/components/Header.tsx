"use client";
import React from "react";

export default function Header() {
  return (
    <header className="flex justify-between items-center px-10 py-3 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="w-4 h-4 bg-gray-900 rounded-sm" />
          <h1 className="text-lg font-bold text-gray-900">Servineo</h1>
        </div>

        <nav className="flex gap-9 text-sm font-medium text-gray-900">
          <a href="#" className="hover:text-blue-600">Encontrar Fixers</a>
          <a href="#" className="hover:text-blue-600">Fixer</a>
          <a href="#" className="hover:text-blue-600">Mis Ofertas</a>
          <a href="#" className="hover:text-blue-600">Ayuda</a>
        </nav>
      </header>
  );
}