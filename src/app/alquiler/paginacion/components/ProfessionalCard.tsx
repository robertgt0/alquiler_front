import React from 'react';
import { UsuarioResumen } from '../../Feature/Types/filtroType';
import { FaStar, FaWhatsapp, FaVideo, FaUserMd } from 'react-icons/fa';
import { MdLocationOn, MdAccessTime } from 'react-icons/md';

interface UserProfileCardProps {
  usuario: UsuarioResumen;
  onContactClick?: () => void;
}

export const ProfessionalCard = ({ usuario, onContactClick }: UserProfileCardProps) => {
  const {
    nombre,
    especialidades = [],
    servicios = [],
    ciudad,
    fecha_registro,
    email,
    telefono
  } = usuario;

  // Formatear la fecha
  const formatearFecha = (fecha: Date) => {
    return new Date(fecha).toLocaleDateString('es-BO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Formatear el precio
  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
      minimumFractionDigits: 0
    }).format(precio);
  };

  // Área principal (primera especialidad)
  const areaPrincipal = especialidades?.[0]?.nombre || "Área no especificada";

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48 bg-gradient-to-r from-blue-500 to-blue-700">
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-2xl font-bold">{nombre}</h2>
          <p className="text-lg opacity-90">{areaPrincipal}</p>
        </div>
      </div>

      <div className="p-6">
        {/* Estado y Calificación */}
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            {servicios.some(s => s.disponible) ? "Disponible" : "No Disponible"}
          </span>
          <div className="flex items-center">
            <FaStar className="text-yellow-400" />
            <span className="ml-1 font-medium">4.5</span>
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
        {especialidades.length > 0 && (
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

        {/* Servicios y Precios */}
        {servicios.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Servicios:</h3>
            <ul className="space-y-2">
              {servicios.filter(s => s.disponible).map((servicio) => (
                <li key={servicio.id_servicio} className="flex justify-between items-center">
                  <span className="text-gray-600">{servicio.nombre}</span>
                  <span className="font-medium text-blue-600">
                    {formatearPrecio(servicio.precio)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Medios de contacto */}
        <div className="flex gap-3 mb-4">
          {telefono && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-50 text-green-700">
              <FaWhatsapp className="mr-1" /> WhatsApp
            </span>
          )}
          {email && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700">
              <FaVideo className="mr-1" /> Video
            </span>
          )}
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-50 text-purple-700">
            <FaUserMd className="mr-1" /> Presencial
          </span>
        </div>

        {/* Botón de contacto */}
        <button
          onClick={onContactClick}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          Contactar Profesional
        </button>

        {/* Última actualización */}
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

export default ProfessionalCard;