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
  especialidades?: Array<{ id_especialidad: number; nombre: string; fecha_asignacion?: string }>;
  especialidad?: string;
  onViewDetails?: () => void;
  
}

const formatSalary = (salary: string) => {
  return salary.replace('$', 'Bs ');
};

const formatLocation = (location: string) => {
  const [city, department] = location.split(',');
  return `${department?.trim()}-${city?.trim()}`;
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
  especialidades = [],
  especialidad = '',
  onViewDetails
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 hover:shadow-xl hover:border-blue-300 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
      {/* Borde decorativo sutil */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-blue-700 mb-2 tracking-tight">{title}</h3>
          <p className="text-blue-600 font-semibold text-lg mb-1">{company}</p>
          <p className="text-blue-500 text-base mb-4">{service}</p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${employmentTypeColor}`}>
          {employmentType}
        </span>
      </div>
      
      <div className="flex flex-wrap gap-6 mb-6 text-base text-gray-600">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-medium">{formatLocation(location)}</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="font-medium">{postedDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          <span className="font-semibold text-green-600">{formatSalary(salaryRange)}</span>
        </div>
        <div className="flex items-center gap-2">
          <StarRating rating={rating} />
        </div>
      </div>
      
      <div className="flex justify-end">
        <button 
          onClick={onViewDetails}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 hover:shadow-lg transform hover:scale-105"
        >
          Ver Detalles
        </button>
      </div>
    </div>
  );
};

export default JobCard;
