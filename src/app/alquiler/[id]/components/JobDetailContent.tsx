'use client';

import React from 'react';
import Link from 'next/link';
import ProfileHeader from './ProfileHeader';
import ServicesList from './ServicesList';
import PortfolioGrid from './PortfolioGrid';
import ReviewsList from './ReviewsList';
import BackToResults from './BackToResults';
import { Usuario } from '../types/usuario.types';

interface JobDetailContentProps {
  usuario: Usuario;
  postedDate: string;
  SERVER_ORIGIN: string;
  promedio?: number;
}

export default function JobDetailContent({
  usuario,
  postedDate,
  SERVER_ORIGIN,
  promedio,
}: JobDetailContentProps) {
  const avatar = usuario.portfolio?.[0]?.imagen;

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: 'linear-gradient(135deg, #e5e7eb 0%, #bfc5d2 100%)' }}
    >
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <BackToResults className="mb-4 inline-flex items-center px-6 py-3 text-base font-semibold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Volver a las ofertas
        </BackToResults>

        <ProfileHeader
          nombre={usuario.nombre}
          servicios={usuario.servicios}
          activo={usuario.activo}
          fecha_registro={usuario.fecha_registro}
          avatarUrl={
            avatar && String(avatar).startsWith('http')
              ? String(avatar)
              : avatar
              ? `${SERVER_ORIGIN}${avatar}`
              : '/images/portfolio/placeholder.jpg'
          }
          rating={promedio ? Number(promedio.toFixed(1)) : undefined}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Descripción */}
            <div
              className="bg-white rounded-lg shadow p-6 border"
              style={{ borderColor: '#1769ff' }}
            >
              <h2 className="font-medium text-lg mb-2 text-blue-600">
                Sobre el Profesional
              </h2>
              <p className="leading-relaxed text-gray-700">
                {usuario.descripcion ||
                  'Sin descripción. Este profesional no ha añadido una descripción todavía.'}
              </p>
            </div>

            <ServicesList servicios={usuario.servicios} />

            <PortfolioGrid portfolio={usuario.portfolio} serverOrigin={SERVER_ORIGIN} />

            <ReviewsList
              calificaciones={usuario.calificaciones}
              nombreUsuario={usuario.nombre}
            />
          </div>

          <div className="space-y-6">
            {/* Sidebar: contacto / botones */}
            <div
              className="bg-white rounded-lg shadow p-6 border"
              style={{ borderColor: '#1769ff' }}
            >
              <h3 className="text-lg font-medium mb-3">Contactar</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-3 rounded">
                  Solicitar Presupuesto
                </button>
                <button className="w-full border border-blue-600 text-blue-600 py-3 rounded">
                  WhatsApp
                </button>
                <button className="w-full border border-blue-600 text-blue-600 py-3 rounded">
                  Videollamada
                </button>
              </div>
            </div>

            <div
              className="bg-white rounded-lg shadow p-6 border"
              style={{ borderColor: '#1769ff' }}
            >
              <h4 className="text-sm text-gray-500">Ubicación</h4>
              <div className="mt-2 font-medium">
                {usuario.ciudad?.nombre || 'Sin ubicación'}
              </div>
              <div className="mt-4 text-sm text-gray-500">
                Registrado desde {postedDate}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
