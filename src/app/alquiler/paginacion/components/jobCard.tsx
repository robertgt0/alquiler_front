"use client";

import React, { useMemo } from 'react';
import { Clock, MapPin, Zap } from 'lucide-react';

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
    <div className="border rounded-2xl p-5 shadow-md bg-white space-y-4">
      <div className="flex flex-col">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{company}</p>
        <p className="text-sm text-gray-400">{service}</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-3">
        <div className="bg-blue-50 border rounded-xl p-3 flex flex-col items-center">
          <Clock className="text-blue-600 mb-1" size={20} />
          <p className="font-semibold text-sm text-blue-700">Horario</p>
          <p className="text-xs text-gray-600 text-center">{horarioAleatorio}</p>
        </div>

        <div className="bg-purple-50 border rounded-xl p-3 flex flex-col items-center">
          <MapPin className="text-purple-600 mb-1" size={20} />
          <p className="font-semibold text-sm text-purple-700">Zona</p>
          <p className="text-xs text-gray-600 text-center">{zonaAleatoria}</p>
        </div>

        <div className="bg-green-50 border rounded-xl p-3 flex flex-col items-center">
          <Zap className="text-green-600 mb-1" size={20} />
          <p className="font-semibold text-sm text-green-700">Experiencia</p>
          <p className="text-xs text-gray-600 text-center">{experienciaAleatoria}</p>
        </div>
      </div>

      <div className="flex justify-between text-sm text-gray-500 mt-3">
        <span>{location}</span>
        <span>{postedDate}</span>
      </div>

      <div className="flex justify-between items-center mt-2">
        <span className="text-green-700 font-semibold">
          {salaryRange ? `Bs ${salaryRange}` : "Salario no especificado"}
        </span>
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full bg-${employmentTypeColor}-100 text-${employmentTypeColor}-800`}
        >
          {employmentType}
        </span>
      </div>
    </div>
  );
};

export default JobCard;
