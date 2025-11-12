// src/app/components/guiaUsuarios/IntroGuide.tsx

import { ArrowRightIcon, HomeHammerIcon } from './GuiaIcons';

interface IntroGuideProps {
  setVista: (vista: string) => void;
}

export const IntroGuide = ({ setVista }: IntroGuideProps) => {
  return (
    <div className="group bg-blue-600 text-white p-8 md:p-12 rounded-lg max-w-4xl mx-auto shadow-xl transition-shadow duration-300 ease-in-out hover:shadow-2xl">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="md:w-2/3">
          <h3 className="text-2xl font-semibold text-center mb-4">
            ¿Qué es SERVİNEO?
          </h3>
          <p className="text-blue-100 mb-8 text-center">
            SERVİNEO es la plataforma que conecta a personas que necesitan
            servicios con profesionales calificados (Fixers) en Cochabamba,
            Bolivia. Desde reparaciones del hogar hasta servicios
            especializados, todo en un solo lugar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setVista('cliente')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-200 transition-all duration-300 ease-in-out w-full sm:w-auto text-sm hover:scale-105 hover:shadow-md"
            >
              Soy Cliente <ArrowRightIcon />
            </button>
            <button
              onClick={() => setVista('fixer')}
              className="flex items-center justify-center gap-2 px-6 py-3 border border-blue-400 text-white font-medium rounded-md hover:bg-blue-700 transition-all duration-300 ease-in-out w-full sm:w-auto text-sm hover:scale-105 hover:shadow-md"
            >
              Quiero ser Fixer <ArrowRightIcon />
            </button>
          </div>
        </div>

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