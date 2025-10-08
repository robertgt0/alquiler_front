'use client';

import React, { useState, useMemo } from 'react';
import { 
  MagnifyingGlassIcon, 
  BellIcon, 
  UserIcon,
  MapPinIcon,
  CalendarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

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

export default function BusquedaPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Datos completos de trabajos (más de 10 para probar paginación)
  const allJobs = [
    {
      title: "Especialista en SEO",
      company: "Digital Growth Bolivia",
      service: "Servicio: Posicionamiento Web",
      location: "Quillacollo, Cochabamba",
      postedDate: "Publicado hace 3 días",
      salaryRange: "Bs 9,000 - Bs 14,000",
      employmentType: "Medio Tiempo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Project Manager",
      company: "Agile Solutions Bolivia",
      service: "Servicio: Gestión de Proyectos",
      location: "Cochabamba, Bolivia",
      postedDate: "Publicado hace 1 día",
      salaryRange: "Bs 18,000 - Bs 26,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Desarrollador Frontend",
      company: "TechBolivia Solutions",
      service: "Servicio: Desarrollo Web",
      location: "La Paz, Bolivia",
      postedDate: "Publicado hace 2 días",
      salaryRange: "Bs 12,000 - Bs 18,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Diseñador UX/UI",
      company: "Creative Studio Bolivia",
      service: "Servicio: Diseño Digital",
      location: "Santa Cruz, Bolivia",
      postedDate: "Publicado hace 4 días",
      salaryRange: "Bs 8,000 - Bs 15,000",
      employmentType: "Medio Tiempo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Analista de Datos",
      company: "Data Insights Bolivia",
      service: "Servicio: Análisis de Datos",
      location: "Cochabamba, Bolivia",
      postedDate: "Publicado hace 5 días",
      salaryRange: "Bs 10,000 - Bs 16,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Marketing Digital",
      company: "Growth Marketing Bolivia",
      service: "Servicio: Marketing Online",
      location: "La Paz, Bolivia",
      postedDate: "Publicado hace 6 días",
      salaryRange: "Bs 7,000 - Bs 12,000",
      employmentType: "Medio Tiempo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Desarrollador Backend",
      company: "Backend Solutions Bolivia",
      service: "Servicio: Desarrollo de APIs",
      location: "Santa Cruz, Bolivia",
      postedDate: "Publicado hace 7 días",
      salaryRange: "Bs 14,000 - Bs 22,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Community Manager",
      company: "Social Media Bolivia",
      service: "Servicio: Gestión de Redes",
      location: "Cochabamba, Bolivia",
      postedDate: "Publicado hace 8 días",
      salaryRange: "Bs 6,000 - Bs 10,000",
      employmentType: "Medio Tiempo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "DevOps Engineer",
      company: "Cloud Infrastructure Bolivia",
      service: "Servicio: Infraestructura Cloud",
      location: "La Paz, Bolivia",
      postedDate: "Publicado hace 9 días",
      salaryRange: "Bs 16,000 - Bs 25,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Copywriter",
      company: "Content Creation Bolivia",
      service: "Servicio: Redacción de Contenidos",
      location: "Santa Cruz, Bolivia",
      postedDate: "Publicado hace 10 días",
      salaryRange: "Bs 5,000 - Bs 9,000",
      employmentType: "Medio Tiempo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "QA Tester",
      company: "Quality Assurance Bolivia",
      service: "Servicio: Testing de Software",
      location: "Cochabamba, Bolivia",
      postedDate: "Publicado hace 11 días",
      salaryRange: "Bs 8,000 - Bs 13,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Product Manager",
      company: "Product Strategy Bolivia",
      service: "Servicio: Gestión de Productos",
      location: "La Paz, Bolivia",
      postedDate: "Publicado hace 12 días",
      salaryRange: "Bs 20,000 - Bs 30,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Sales Representative",
      company: "Sales Force Bolivia",
      service: "Servicio: Ventas B2B",
      location: "Santa Cruz, Bolivia",
      postedDate: "Publicado hace 13 días",
      salaryRange: "Bs 9,000 - Bs 15,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Mobile Developer",
      company: "Mobile Apps Bolivia",
      service: "Servicio: Desarrollo Móvil",
      location: "Cochabamba, Bolivia",
      postedDate: "Publicado hace 14 días",
      salaryRange: "Bs 13,000 - Bs 20,000",
      employmentType: "Tiempo Completo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    },
    {
      title: "Graphic Designer",
      company: "Visual Design Bolivia",
      service: "Servicio: Diseño Gráfico",
      location: "La Paz, Bolivia",
      postedDate: "Publicado hace 15 días",
      salaryRange: "Bs 7,000 - Bs 12,000",
      employmentType: "Medio Tiempo",
      employmentTypeColor: "bg-blue-100 text-blue-800"
    }
  ];

  // Cálculos de paginación
  const totalItems = allJobs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Obtener trabajos de la página actual
  const currentJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allJobs.slice(startIndex, endIndex);
  }, [currentPage, itemsPerPage]);

  // Función para cambiar de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Función para ir a la siguiente página
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Función para ir a la página anterior
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600">TrabajosBolivia</h1>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">Ofertas</a>
              <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">Empresas</a>
              <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">Freelancers</a>
            </nav>
            
            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                <MagnifyingGlassIcon className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                <BellIcon className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                <UserIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Información de paginación */}
        <div className="mb-6 text-sm text-gray-600">
          Mostrando {currentJobs.length} de {totalItems} trabajos (Página {currentPage} de {totalPages})
        </div>
        
        <div className="space-y-6">
          {currentJobs.map((job, index) => (
            <JobCard
              key={`${job.title}-${job.company}-${index}`}
              title={job.title}
              company={job.company}
              service={job.service}
              location={job.location}
              postedDate={job.postedDate}
              salaryRange={job.salaryRange}
              employmentType={job.employmentType}
              employmentTypeColor={job.employmentTypeColor}
            />
          ))}
        </div>
        
        {/* Pagination */}
        <div className="flex justify-center items-center mt-12 space-x-2">
          {/* Botón Anterior */}
          <button 
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`w-10 h-10 rounded-md font-medium transition-colors ${
              currentPage === 1 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            &lt;
          </button>
          
          {/* Números de página */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button 
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-10 h-10 rounded-md font-medium transition-colors ${
                page === currentPage
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              {page}
            </button>
          ))}
          
          {/* Botón Siguiente */}
          <button 
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`w-10 h-10 rounded-md font-medium transition-colors ${
              currentPage === totalPages 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            &gt;
          </button>
        </div>
        
        {/* Información adicional de paginación */}
        <div className="mt-4 text-center text-sm text-gray-500">
          {currentJobs.length === itemsPerPage ? (
            <span>Mostrando {itemsPerPage} trabajos por página</span>
          ) : (
            <span>Última página: {currentJobs.length} trabajos</span>
          )}
        </div>
      </main>
    </div>
  );
}
