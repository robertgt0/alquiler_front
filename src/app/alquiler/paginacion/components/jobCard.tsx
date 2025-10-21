'use client';

import React from 'react';

interface JobCardProps {
  title: string;
  company: string;
  service: string;
  location: string;
  postedDate: string;
  salaryRange: string;
  employmentType: string;
  employmentTypeColor: string;
  especialidades?: Array<{ id_especialidad: number; nombre: string; fecha_asignacion?: string }>;
  especialidad?: string;
  onViewDetails?: () => void;
}

const JobCard: React.FC<JobCardProps> = ({
  title,
  company,
  service,
  location,
  postedDate,
  salaryRange,
  employmentType,
  employmentTypeColor,
  especialidades = [],
  especialidad = '',
  onViewDetails
}) => {
  // Función para obtener las especialidades a mostrar
  const getEspecialidadesToShow = () => {
    if (especialidades && especialidades.length > 0) {
      return especialidades.map(e => e.nombre);
    }
    if (especialidad) {
      return especialidad.split(',').map(e => e.trim()).filter(e => e);
    }
    return [];
  };

  const especialidadesToShow = getEspecialidadesToShow();

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 group">
      <div className="flex gap-6">
        {/* Contenido principal */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-1">{title}</h3>
              <p className="text-blue-600 font-semibold mb-1">{company}</p>
              <p className="text-gray-600 text-sm mb-3">{service}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${employmentTypeColor}`}>
              {employmentType}
            </span>
          </div>

          <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{postedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <span className="font-semibold text-green-600">{salaryRange}</span>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onViewDetails}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 text-sm"
            >
              Ver Detalles
            </button>
          </div>
        </div>

        {/* Sección de especialidades - SIEMPRE VISIBLE */}
        <div className="w-48 border-l border-gray-200 pl-4">
          <div className="sticky top-4">
            <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-1">
              <svg className="h-4 w-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Especialidades
            </h4>
            <div className="space-y-1">
              {especialidadesToShow.length > 0 ? (
                <>
                  {especialidadesToShow.slice(0, 3).map((especialidad, index) => (
                    <span
                      key={index}
                      className="inline-block bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs font-medium border border-purple-200"
                    >
                      {especialidad}
                    </span>
                  ))}
                  {especialidadesToShow.length > 3 && (
                    <span className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                      +{especialidadesToShow.length - 3} más
                    </span>
                  )}
                </>
              ) : (
                <span className="text-gray-400 text-xs">Sin especialidades</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;