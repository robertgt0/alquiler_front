// /metodosAuten/pagina.tsx
'use client';

import React from 'react';
import { useAuthState } from '../hooks/useAuthState';
import GestorMetodos from '../modules/GestorMetodos';
import LoadingState from '../components/LoadingState';

export default function PaginaMetodosAutenticacion() {
  const {
    metodos,
    metodosActivos,
    cargando,
    activarMetodo,
    eliminarMetodo,
    recargarMetodos,
    error
  } = useAuthState();

  return (
  <div className="relative min-h-screen bg-gray-50 py-8">
    {/* Overlay de carga para toda la página */}
    {cargando && (
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-40">
        <LoadingState />
      </div>
    )}

    <div className="max-w-6xl mx-auto px-4 relative z-50">
      {/* Título Principal */}
      <div className="grid justify-items-start mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Métodos de Autenticación
        </h1>
        <div className="w-full h-1 bg-gray-400"></div>
      </div>

      <GestorMetodos
        metodos={metodos}
        metodosActivos={metodosActivos}
        cargando={cargando}
        activarMetodo={activarMetodo}
        eliminarMetodo={eliminarMetodo}
        recargarMetodos={recargarMetodos}
      />
    </div>
  </div>
);

}