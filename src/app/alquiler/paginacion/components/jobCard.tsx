"use client";

import React, { useMemo } from 'react';
import { Clock, MapPin, Zap } from 'lucide-react';
import { FaStar } from 'react-icons/fa';

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
  onViewDetails,
}) => {
  const horarios = ["Mañana", "Tarde", "Noche"];
  const zonas = ["Sur", "Central", "Norte", "Oeste", "Este"];
  const experiencias = ["1 año", "2 años", "3 años", "4 años", "5 años"];

  const obtenerAleatorio = (lista: string[]): string => 
    lista[Math.floor(Math.random() * lista.length)];

  const horarioAleatorio = useMemo(() => obtenerAleatorio(horarios), []);
  const zonaAleatoria = useMemo(() => obtenerAleatorio(zonas), []);
  const experienciaAleatoria = useMemo(() => obtenerAleatorio(experiencias), []);

  return (
    <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
      {/* Encabezado azul con título y empresa */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
        <h2 className="text-2xl font-bold mb-1">{title}</h2>
        <p className="text-blue-100 text-sm mb-2">{company}</p>
        <p className="text-blue-100 text-sm">{service}</p>
      </div>

      {/* Contenido principal */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Estado y calificación */}
        <div className="flex items-center justify-between mb-4">
          <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
            employmentType === 'Disponible' 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {employmentType}
          </span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`h-5 w-5 ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'}`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">
              ({rating.toFixed(1)})
            </span>
          </div>
        </div>

        {/* Ubicación */}
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="mr-2 text-blue-600" size={20} />
          <span>{location}, Bolivia</span>
        </div>

        {/* Grid de 3 campos: Horario, Zona, Experiencia */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col items-center">
            <Clock className="text-blue-600 mb-2" size={24} />
            <p className="font-semibold text-sm text-blue-700 mb-1">Horario</p>
            <p className="text-xs text-gray-600">{horarioAleatorio}</p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex flex-col items-center">
            <MapPin className="text-purple-600 mb-2" size={24} />
            <p className="font-semibold text-sm text-purple-700 mb-1">Zona</p>
            <p className="text-xs text-gray-600">{zonaAleatoria}</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex flex-col items-center">
            <Zap className="text-green-600 mb-2" size={24} />
            <p className="font-semibold text-sm text-green-700 mb-1">Experiencia</p>
            <p className="text-xs text-gray-600">{experienciaAleatoria}</p>
          </div>
        </div>

        {/* Servicios */}
        {service && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Servicios:</h3>
            <p className="text-gray-700 text-sm">{service}</p>
          </div>
        )}

        {/* Fecha y precio */}
        <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
          <span>⏱️ Registrado: {postedDate}</span>
          <span className="text-blue-600 font-semibold">{salaryRange ? `Bs ${salaryRange}` : 'Sin especificar'}</span>
        </div>

        {/* Botón Ver Detalles */}
        <button
          onClick={onViewDetails}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 mt-auto"
        >
          Ver Detalles
        </button>
      </div>
    </div>
  );
};

export default JobCard;
