"use client";

import React, { FC, useEffect } from 'react';
import { UsuarioResumen } from '../../Feature/Types/filtroType';
import { FaStar } from 'react-icons/fa';
import { MdLocationOn, MdAccessTime } from 'react-icons/md';

interface UserProfileCardProps {
  usuario: UsuarioResumen;
  onContactClick?: () => void;
}

const UserProfileCard: FC<UserProfileCardProps> = ({ usuario, onContactClick }) => {
  useEffect(() => {}, [usuario]);

  const {
    nombre,
    especialidades = [],
    ciudad,
    fecha_registro
  } = usuario;

  const formatearFecha = (fecha?: string | Date) => {
    if (!fecha) return '';
    const d = typeof fecha === 'string' ? new Date(fecha) : fecha;
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(d);
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <div className="flex flex-row w-full">
        {/* Sección izquierda: fondo azul, nombre y área */}
        <div className="w-1/3 min-w-[220px] bg-gradient-to-r from-blue-600 to-blue-500 p-6 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-white mb-2 leading-tight">{nombre}</h2>
          <p className="text-white text-lg mb-4">{especialidades?.[0]?.nombre || 'Área no especificada'}</p>
          {ciudad && (
            <div className="flex items-center text-white/90 mb-2">
              <MdLocationOn className="mr-2" size={20} />
              <span className="text-base">{ciudad.nombre}</span>
            </div>
          )}
        </div>

        {/* Sección derecha: detalles y botón */}
        <div className="w-2/3 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span
              className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                usuario.activo
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}
            >
              {usuario.activo ? 'Disponible' : 'No disponible'}
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`h-5 w-5 ${star <= Math.round(usuario.calificacion || 0) ? 'text-yellow-400' : 'text-gray-200'}`}
                />
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {usuario.calificacion ? `(${Number(usuario.calificacion).toFixed(1)})` : '(Sin calificaciones)'}
              </span>
            </div>
          </div>

          {especialidades && especialidades.length > 0 && (
            <div className="mb-2">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Especialidades:</h3>
              <div className="flex flex-wrap gap-2">
                {especialidades.map((esp) => (
                  <span key={esp.id_especialidad} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                    {esp.nombre}
                  </span>
                ))}
              </div>
            </div>
          )}

          {usuario.servicios && usuario.servicios.length > 0 && (
            <div className="mb-2">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Servicios:</h3>
              <div className="bg-gray-50 rounded px-3 py-2 text-gray-700 text-sm flex justify-between items-center">
                <span>{usuario.servicios.map(s => s.nombre).join(', ')}</span>
                <span className="text-blue-600 font-semibold">Bs —</span>
              </div>
            </div>
          )}

          <div className="flex items-center text-xs text-gray-500 mb-2">
            <MdAccessTime className="mr-1" />
            Registrado: {formatearFecha(fecha_registro)}
          </div>

          {/* Botón de acción */}
          {onContactClick && (
            <button
              onClick={onContactClick}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-sm mt-4"
            >
              Ver Detalles
            </button>
          )}
        </div>
      </div>
  </div>
  );
};

export default UserProfileCard;
// Also export named for compatibility with any named imports remaining in the codebase
export { UserProfileCard };