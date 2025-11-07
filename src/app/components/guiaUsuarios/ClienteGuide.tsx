// src/app/components/guiaUsuarios/ClienteGuide.tsx

import { SearchIcon, StarIcon, ChatIcon } from './GuiaIcons';

interface ClienteGuideProps {
  setVista: (vista: string) => void;
}

export const ClienteGuide = ({ setVista }: ClienteGuideProps) => {
  const steps = [
    {
      title: 'Busca el Servicio que Necesitas',
      description: 'Utiliza nuestra barra de búsqueda o explora las categorías disponibles. También puedes buscar fixers cerca usando el mapa interactivo.',
      details: ['Búsqueda inteligente en tiempo real'],
      icon: <SearchIcon />,
      iconLabel: 'Encuentra el servicio perfecto',
    },
    {
      title: 'Revisa Perfiles y Calificaciones',
      description: 'Examina los perfiles de los Fixers disponibles. Puedes ver sus calificaciones, reseñas, trabajos anteriores y tarifas para tomar la mejor decisión en servicios disponibles.',
      details: ['Servicios disponibles'],
      icon: <StarIcon />,
      iconLabel: 'Revisa perfiles y calificaciones',
    },
    {
      title: 'Contacta y Contrata',
      description: 'Haz clic en "Contratar" para enviar tu solicitud. Describe los detalles, coordina horarios y confirma el servicio. ¡Es así de simple!',
      details: [],
      icon: <ChatIcon />,
      iconLabel: 'Comunicación segura con tu Fixer',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-center mb-2">
          Para Clientes: Cómo Contratar un Servicio
        </h2>
        <p className="text-gray-600 text-center">
          Sigue estos simples pasos para encontrar y contratar al Fixer perfecto
          para tu necesidad
        </p>
      </div>

      <div className="space-y-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            } items-center gap-8`}
          >
            <div className="group w-full md:w-1/2 bg-blue-600 rounded-lg p-8 h-64 flex flex-col items-center justify-center text-center transition-shadow duration-300 ease-in-out hover:shadow-lg">
              {step.icon}
              <p className="text-white mt-4 text-sm">{step.iconLabel}</p>
            </div>
            <div className="w-full md:w-1/2 p-4">
              <span className="flex bg-blue-600 text-white rounded-full w-8 h-8 items-center justify-center font-medium mb-4 text-sm">
                {index + 1}
              </span>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-700 mb-4 text-sm">{step.description}</p>
              {step.details.length > 0 && (
                <ul className="list-none space-y-2">
                  {step.details.map((detail, i) => (
                    <li
                      key={i}
                      className="flex items-center text-gray-600 text-sm"
                    >
                      <span className="text-green-500 mr-2">✔</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <button
          onClick={() => setVista('intro')}
          className="px-6 py-2 bg-white text-gray-900 border border-gray-300 rounded-md hover:bg-gray-100 transition-all duration-300 ease-in-out font-medium text-sm hover:scale-105 hover:shadow-md"
        >
          ← Volver
        </button>
      </div>
    </div>
  );
};