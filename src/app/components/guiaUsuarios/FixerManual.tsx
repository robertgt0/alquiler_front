// src/app/components/guiaUsuarios/FixerGuide.tsx

import { UserPlusIcon, BriefcaseIcon, StarIcon } from './ManualIcons';

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
        <h2 className="text-2xl font-bold text-white mb-2">
          Para Fixers: Cómo Ofrecer tus Servicios
        </h2>
        <p className="text-gray-300 text-center">
          Convierte tu experiencia en ingresos. Únete a nuestra red de profesionales.
        </p>
      </div>

      <div className="space-y-8">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col md:flex-row items-center gap-8 group">
            <div className={`w-full md:w-1/2 p-8 bg-white rounded-xl shadow-lg transform transition-transform duration-300 md:group-hover:scale-105 ${
                index % 2 === 0 ? 'md:order-1' : 'md:order-2'
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
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