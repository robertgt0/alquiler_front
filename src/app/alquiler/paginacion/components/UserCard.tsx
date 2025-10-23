"use client";

import React from "react";
import type { UsuarioResumen } from "../../Feature/Types/filtroType";

interface Props {
  user: UsuarioResumen;
}

const IconServicios = () => (
  <svg className="h-4 w-4 inline mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m2 0a2 2 0 002-2V7a2 2 0 00-2-2h-1.5a2 2 0 01-1.8-1.1L13 1H7a2 2 0 00-2 2v2" />
  </svg>
);

const IconEspecialidad = () => (
  <svg className="h-4 w-4 inline mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" />
  </svg>
);

const IconArea = () => (
  <svg className="h-4 w-4 inline mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
  </svg>
);

const UserCard: React.FC<Props> = ({ user }) => {
  const especialidades = user.especialidades ?? [];
  const serviciosArr = user.servicios ?? [];
  const area = especialidades.length > 0 ? especialidades[0].nombre : "Sin área";
  const especialidadesList = especialidades.length > 0 ? especialidades.map(e => e.nombre) : [];
  const serviciosList = serviciosArr.length > 0 ? serviciosArr.map(s => s.nombre) : [];

  return (
    <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-blue-600 mb-1">{user.nombre}</h3>
          <p className="text-sm text-gray-600">Registrado: {user.fecha_registro ? new Date(user.fecha_registro).toLocaleDateString() : '—'}</p>
        </div>
        <div className="text-sm text-gray-500">{user.ciudad?.nombre ?? 'Sin ciudad'}</div>
      </div>

      <div className="mt-4 space-y-2 text-sm text-gray-700">
        <p>
          <IconArea /> <span className="font-medium text-gray-800">Área:</span>{' '}
          <span className="text-blue-600 font-medium">{area}</span>
        </p>

        <p>
          <IconEspecialidad /> <span className="font-medium text-gray-800">Especialidades:</span>{' '}
          {especialidadesList.length > 0 ? (
            <span className="text-blue-600 font-medium">{especialidadesList.join(', ')}</span>
          ) : (
            <span className="text-gray-500">Sin especialidades</span>
          )}
        </p>

        <p>
          <IconServicios /> <span className="font-medium text-gray-800">Servicios:</span>{' '}
          {serviciosList.length > 0 ? (
            <span className="text-blue-600 font-medium">{serviciosList.join(', ')}</span>
          ) : (
            <span className="text-gray-500">Sin servicios</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default UserCard;
