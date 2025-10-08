'use client';

import React from 'react';
import { MapPinIcon, CalendarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

interface JobCardProps {
  title: string;
  company: string;
  service: string;
  location: string;
  postedDate: string;
  salaryRange: string;
  employmentType: string;
  employmentTypeColor: string;
}

const JobCard: React.FC<JobCardProps> = ({
  title,
  company,
  service,
  location,
  postedDate,
  salaryRange,
  employmentType,
  employmentTypeColor
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-blue-600 mb-2">{title}</h3>
          <p className="text-blue-600 font-medium mb-1">{company}</p>
          <p className="text-blue-600 text-sm mb-3">{service}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${employmentTypeColor}`}>
          {employmentType}
        </span>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <MapPinIcon className="h-4 w-4" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-1">
          <CalendarIcon className="h-4 w-4" />
          <span>{postedDate}</span>
        </div>
        <div className="flex items-center gap-1">
          <CurrencyDollarIcon className="h-4 w-4" />
          <span>{salaryRange}</span>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
          Ver Detalles
        </button>
      </div>
    </div>
  );
};

export default JobCard;
