// src/app/components/guiaUsuarios/ClienteManual.tsx

import { SearchIcon, StarIcon, ChatIcon } from './ManualIcons';

interface ClienteManualProps {
  setVista: (vista: string) => void;
}

export const ClienteManual = ({ setVista }: ClienteManualProps) => {
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
      description: 'Examina los perfiles de los Fixers disponibles. Puedes ver sus calificaciones, reseñas, trabajos anteriores y tarifas para tomar la mejor decisión.',
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
        <h2 className="text-2xl font-bold text-white mb-2">
          Para Clientes: Cómo Contratar un Servicio
        </h2>
        <p className="text-gray-300 text-center">
          Sigue estos simples pasos para encontrar y contratar al Fixer perfecto.
        </p>
      </div>

      <div className="space-y-8">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col md:flex-row items-center gap-8 group">
            {/* CAMBIO: Contenedor de la tarjeta ahora es blanco con sombra */}
            <div className={`w-full md:w-1/2 p-8 bg-white rounded-xl shadow-lg transform transition-transform duration-300 md:group-hover:scale-105 ${
                index % 2 === 0 ? 'md:order-1' : 'md:order-2'
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                {/* CAMBIO: Icono dentro de un círculo azul */}
                <div className="flex-shrink-0 bg-blue-100 text-blue-600 rounded-full p-3">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
              </div>
              <p className="text-gray-600 mb-4 text-sm">{step.description}</p>
              {step.details.length > 0 && (
                <ul className="list-none space-y-2">
                  {step.details.map((detail, i) => (
                    <li key={i} className="flex items-center text-gray-600 text-sm">
                      <span className="text-green-500 mr-2">✔</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* CAMBIO: Texto simple con número de paso */}
             <div className={`w-full md:w-1/2 p-4 text-center ${
                index % 2 === 0 ? 'md:order-2' : 'md:order-1'
              }`}
            >
              <span className="text-5xl font-bold text-blue-500 opacity-20">
                0{index + 1}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <button
          onClick={() => setVista('intro')}
          className="px-6 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 transition-all duration-300 font-semibold text-sm hover:scale-105 shadow-md"
        >
          ← Volver
        </button>
      </div>
    </div>
  );
};