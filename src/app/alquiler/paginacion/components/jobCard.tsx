import { JobFrontend } from '../types/job';

interface JobCardProps extends JobFrontend {
  onViewDetails: () => void;
}

export default function JobCard({
  title,
  company,
  service,
  location,
  postedDate,
  salaryRange,
  employmentType,
  employmentTypeColor,
  onViewDetails
}: JobCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="text-lg text-blue-600 font-medium">{company}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${employmentTypeColor}`}>
          {employmentType}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-gray-700">
          <span className="font-medium">Servicio:</span> {service}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">Ubicación:</span> {location}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">Salario:</span> {salaryRange}
        </p>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">{postedDate}</span>
        <button
          onClick={onViewDetails}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Ver Detalles
        </button>
      </div>
    </div>
  );
}