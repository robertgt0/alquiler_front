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

  if (cargando) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
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