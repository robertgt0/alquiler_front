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
  rating?: number;
  onViewDetails?: () => void;
}

const formatSalary = (salary?: string) => {
  if (!salary) return 'Bs —';
  try {
    return salary.replace('$', 'Bs ');
  } catch (e) {
    return `Bs ${salary}`;
  }
};

const formatLocation = (location?: string) => {
  if (!location) return 'Ubicación no especificada';
  const parts = location.split(',').map((p) => p.trim()).filter(Boolean);
  if (parts.length === 1) return parts[0];
  // asumir formato 'Ciudad, Departamento' -> mostrar 'Departamento-Ciudad'
  const city = parts[0];
  const department = parts.slice(1).join(', ');
  return `${department}-${city}`;
};

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`h-5 w-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const JobCard: React.FC<JobCardProps> = ({
  title,
  company,
  service,
  location,
  postedDate,
  salaryRange,
  employmentType,
  employmentTypeColor,
  rating = 0,
  onViewDetails
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48 bg-gradient-to-r from-blue-400 to-blue-600">
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-2xl font-bold">{company}</h2>
          <p className="text-lg opacity-90">{title}</p>
        </div>
      </div>

      <div className="p-6">
        {/* Estado y Calificación */}
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            employmentType === "Disponible" 
              ? "bg-green-50 text-green-600" 
              : "bg-red-50 text-red-600"
          }`}>
            {employmentType}
          </span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`h-5 w-5 ${star <= Math.round(rating) ? 'text-yellow-300' : 'text-gray-200'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-2 text-sm text-gray-500">
              {rating ? `(${Number(rating).toFixed(1)})` : '(Sin calificaciones)'}
            </span>
          </div>
        </div>

        {/* Ubicación */}
        <div className="flex items-center mb-4 text-gray-600">
          <svg className="h-5 w-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{formatLocation(location)}</span>
        </div>

        {/* Servicios y Precio */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Servicios:</h3>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">{service}</span>
            <span className="font-medium text-blue-600">
                          <span className="font-medium text-blue-500">{formatSalary(salaryRange)}</span>
            </span>
          </div>
        </div>

        {/* Botón */}
        <button
          onClick={onViewDetails}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          Ver Detalles
        </button>

        {/* Fecha de registro */}
        <div className="mt-4 text-xs text-gray-500 flex items-center justify-end">
          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Registrado: {postedDate}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
