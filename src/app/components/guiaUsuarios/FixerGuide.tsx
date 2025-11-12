// src/app/components/guiaUsuarios/FixerGuide.tsx

import { UserPlusIcon, BriefcaseIcon, StarIcon } from './GuiaIcons';

interface FixerGuideProps {
  setVista: (vista: string) => void;
}

export const FixerGuide = ({ setVista }: FixerGuideProps) => {
  const steps = [
    {
      title: 'Regístrate como Fixer',
      description: 'Haz clic en "Ser Fixer" y completa tu perfil profesional con tus habilidades, experiencia, certificaciones y tarifas.',
      details: ['Regístrate como Fixer'],
      icon: <UserPlusIcon />,
      iconLabel: 'Regístrate como profesional',
    },
    {
      title: 'Recibe Solicitudes de Trabajo',
      description: 'Los clientes en tu área podrán encontrarte y enviarte solicitudes. Recibirás notificaciones cada vez que alguien esté interesado en contratar tus servicios.',
      details: [],
      icon: <BriefcaseIcon />,
      iconLabel: 'Recibe solicitudes directamente',
    },
    {
      title: 'Completa Trabajos y Gana Reputación',
      description: 'Realiza los trabajos con profesionalismo y calidad. Los clientes te calificarán al finalizar el servicio. Más calificaciones positivas = mayor visibilidad.',
      details: [],
      icon: <StarIcon />,
      iconLabel: 'Construye tu reputación',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-center mb-2">
          Para Fixers: Cómo Ofrecer tus Servicios
        </h2>
        <p className="text-gray-600 text-center text-sm">
          Convierte tu experiencia en ingresos. Únete a nuestra red de
          profesionales calificados
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
            <div className="group w-full md:w-1/2 bg-blue-600 rounded-lg p-7 h-64 flex flex-col items-center justify-center text-center transition-shadow duration-300 ease-in-out hover:shadow-lg">
              {step.icon}
              <p className="text-white mt-4 text-sm">{step.iconLabel}</p>
            </div>
            <div className="w-full md:w-1/2 p-3">
              <span className="flex bg-blue-600 text-white rounded-full w-7 h-7 items-center justify-center font-medium mb-4 text-sm">
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