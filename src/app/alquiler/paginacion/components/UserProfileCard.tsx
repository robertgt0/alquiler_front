import React, { useEffect } from 'react';
import { UsuarioResumen } from '../../Feature/Types/filtroType';
import { FaStar } from 'react-icons/fa';
import { MdLocationOn, MdAccessTime } from 'react-icons/md';

interface UserProfileCardProps {
  usuario: UsuarioResumen;
  onContactClick?: () => void;
}

export const UserProfileCard = ({ usuario, onContactClick }: UserProfileCardProps) => {
  // useEffect left intentionally empty for future client-side logic
  useEffect(() => {}, [usuario]);
  const {
    nombre,
    especialidades = [],
    servicios = [],
    ciudad,
    email,
    telefono,
    fecha_registro
  } = usuario;

  // Formatea la fecha de última actualización
  const formatearFecha = (fecha: Date) => {
    return new Date(fecha).toLocaleDateString('es-BO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Formatea el precio para mostrar
  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
      minimumFractionDigits: 0
    }).format(precio);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48 bg-gradient-to-r from-blue-400 to-blue-600">
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-2xl font-bold">{nombre}</h2>
          <p className="text-lg opacity-90">
            {especialidades?.[0]?.nombre || "Área no especificada"}
          </p>
        </div>
      </div>

      <div className="p-6">
        {/* Estado de disponibilidad */}
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            servicios?.some(s => s.disponible) 
              ? "bg-green-50 text-green-600"
              : "bg-red-50 text-red-600"
          }`}>
            {servicios?.some(s => s.disponible) ? "Disponible" : "No Disponible"}
          </span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`h-5 w-5 ${star <= Math.round(usuario.calificacion || 0) ? 'text-yellow-300' : 'text-gray-200'}`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-500">
              {usuario.calificacion ? `(${Number(usuario.calificacion).toFixed(1)})` : '(Sin calificaciones)'}
            </span>
          </div>
        </div>

        {/* Ubicación */}
        {ciudad && (
          <div className="flex items-center mb-4 text-gray-600">
            <MdLocationOn className="mr-2" />
            <span>{ciudad.nombre}</span>
          </div>
        )}

        {/* Especialidades */}
        {especialidades && especialidades.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Especialidades:</h3>
            <div className="flex flex-wrap gap-2">
              {especialidades.map((esp) => (
                <span
                  key={esp.id_especialidad}
                  className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm"
                >
                  {esp.nombre}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Se ha eliminado la sección de Servicios y el botón de contacto por petición */}

        {/* Fecha de registro */}
        {fecha_registro && (
          <div className="mt-4 text-xs text-gray-500 flex items-center justify-end">
            <MdAccessTime className="mr-1" />
            Registrado: {formatearFecha(fecha_registro)}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileCard;