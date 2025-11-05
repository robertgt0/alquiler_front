//src/app/components/guiaUsuarios/giausuariosNuevos.tsx
'use client';

import { useState } from 'react';

// --- Iconos SVG ---
// Estos son los iconos que se usan en la guía.
// (Icono de flecha para los botones)
const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path
      fillRule="evenodd"
      d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.28a.75.75 0 011.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
      clipRule="evenodd"
    />
  </svg>
);

// (Icono para la sección "Intro")
const HomeHammerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-16 h-16 text-gray-400"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 21V10.5c0-1.242 1.008-2.25 2.25-2.25h1.5c1.242 0 2.25 1.008 2.25 2.25V21m-9 0h9M6 21H3.75v-6H6v6zM18 21h2.25v-6H18v6z"
    />
    {/* Simulación del martillo */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12l-6-6M12 15l-3-3"
      strokeWidth={2.5}
    />
  </svg>
);

// (Icono para la sección "Cliente" - Buscar)
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-12 h-12 text-gray-400"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
    />
  </svg>
);

// (Icono para la sección "Cliente" - Revisar)
const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-12 h-12 text-gray-400"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.31h5.513c.498 0 .703.656.336.94l-4.204 3.055a.563.563 0 00-.19.505l1.503 4.879a.562.562 0 01-.822.62l-4.444-3.232a.563.563 0 00-.65 0l-4.444 3.232a.562.562 0 01-.822-.62l1.503-4.879a.563.563 0 00-.19-.505l-4.204-3.055a.563.563 0 01.336-.94h5.513a.563.563 0 00.475-.31l2.125-5.111z"
    />
  </svg>
);

// (Icono para la sección "Cliente" - Contactar)
const ChatIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-12 h-12 text-gray-400"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-3.86 8.25-8.625 8.25a9.065 9.065 0 01-4.25-1.125c.917.398 1.909.625 2.959.625 5.25 0 9.375-3.09 9.375-7.125S17.25 4.875 12 4.875c-1.05 0-2.042.227-2.959.625a9.065 9.065 0 01-4.25-1.125C3.86 3.75 0 7.444 0 12c0 4.034 3.033 7.377 7.006 7.901a.75.75 0 11.23 1.48C3.04 20.36 0 16.59 0 12z"
    />
  </svg>
);

/**
 * Componente: Guía de Introducción (¿Qué es SERVİNEO?)
 */
const IntroGuide = ({ setVista }: { setVista: (vista: string) => void }) => {
  return (
    <div className="bg-blue-600 text-white p-8 md:p-12 rounded-lg max-w-4xl mx-auto shadow-xl">
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Columna de Texto */}
        <div className="md:w-2/3">
          <h3 className="text-2xl font-semibold text-center mb-4">¿Qué es SERVİNEO?</h3>
          <p className="text-blue-100 mb-8 text-center">
            SERVİNEO es la plataforma que conecta a personas que necesitan
            servicios con profesionales calificados (Fixers) en Cochabamba,
            Bolivia. Desde reparaciones del hogar hasta servicios
            especializados, todo en un solo lugar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setVista('cliente')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-200 transition-colors w-full sm:w-auto text-sm"
            >
              Soy Cliente <ArrowRightIcon />
            </button>
            <button
              onClick={() => setVista('fixer')}
              className="flex items-center justify-center gap-2 px-6 py-3 border border-blue-400 text-white font-medium rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto text-sm"
            >
              Quiero ser Fixer <ArrowRightIcon />
            </button>
          </div>
        </div>

        {/* Columna de Icono */}
        <div className="md:w-1/3 flex flex-col items-center justify-center text-center p-4">
          <div className="bg-blue-700 rounded-full p-8 mb-4">
            <HomeHammerIcon />
          </div>
          <span className="text-lg font-medium text-blue-100">
            Tu plataforma de servicios
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * Componente: Guía para Clientes
 */
const ClienteGuide = ({ setVista }: { setVista: (vista: string) => void }) => {
  const steps = [
    {
      title: 'Busca el Servicio que Necesitas',
      description:
        'Utiliza nuestra barra de búsqueda o explora las categorías disponibles. También puedes buscar fixers cerca usando el mapa interactivo.',
      details: ['Búsqueda inteligente en tiempo real'],
      icon: <SearchIcon />,
      iconLabel: 'Encuentra el servicio perfecto',
    },
    {
      title: 'Revisa Perfiles y Calificaciones',
      description:
        'Examina los perfiles de los Fixers disponibles. Puedes ver sus calificaciones, reseñas, trabajos anteriores y tarifas para tomar la mejor decisión en servicios disponibles.',
      details: ['Servicios disponibles'],
      icon: <StarIcon />,
      iconLabel: 'Revisa perfiles y calificaciones',
    },
    {
      title: 'Contacta y Contrata',
      description:
        'Haz clic en "Contratar" para enviar tu solicitud. Describe los detalles, coordina horarios y confirma el servicio. ¡Es así de simple!',
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
            {/* Columna de Imagen/Icono */}
            <div className="w-full md:w-1/2 bg-blue-600 rounded-lg p-8 h-64 flex flex-col items-center justify-center text-center">
              {step.icon}
              <p className="text-white mt-4 text-sm">{step.iconLabel}</p>
            </div>
            {/* Columna de Texto */}
            <div className="w-full md:w-1/2 p-4">
              <span className="inline-block bg-blue-600 text-white rounded-full w-8 h-8 items-center justify-center font-medium mb-4 text-sm">
                {index + 1}
              </span>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-700 mb-4 text-sm">{step.description}</p>
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
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <button
          onClick={() => setVista('intro')}
          className="px-6 py-2 bg-white text-gray-900 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors font-medium text-sm"
        >
          ← Volver
        </button>
      </div>
    </div>
  );
};

/**
 * Componente: Guía para Fixers (Placeholder)
 */
const FixerGuide = ({ setVista }: { setVista: (vista: string) => void }) => {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-2xl font-semibold text-center mb-2">
        Para Fixers: Cómo unirte a Servineo
      </h2>
      <p className="text-gray-600 text-center mb-8 text-sm">
        ¡Próximamente! Estamos preparando la guía para que puedas registrarte
        como Fixer.
      </p>
      <button
        onClick={() => setVista('intro')}
        className="px-6 py-2 bg-white text-gray-900 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors font-medium text-sm"
      >
        ← Volver
      </button>
    </div>
  );
};

/**
 * Componente Principal: GiaUsuariosNuevos
 */
export default function GiaUsuariosNuevos() {
  const [vista, setVista] = useState('intro'); // 'intro', 'cliente', 'fixer'

  return (
    <div className="p-4 md:p-8 bg-white">
      {/* Encabezado General (visible en todas las vistas) */}
      <header className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl font-semibold text-center text-gray-900 mb-2">
          Guía de Usuario SERVİNEO
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-center text-sm">
          Aprende cómo funciona nuestra plataforma paso a paso. Ya sea que
          busques contratar un servicio o convertirte en un Fixer profesional.
        </p>
      </header>

      {/* Contenido Principal que cambia según el estado 'vista' */}
      <main>
        {vista === 'intro' && <IntroGuide setVista={setVista} />}
        {vista === 'cliente' && <ClienteGuide setVista={setVista} />}
        {vista === 'fixer' && <FixerGuide setVista={setVista} />}
      </main>
    </div>
  );
}