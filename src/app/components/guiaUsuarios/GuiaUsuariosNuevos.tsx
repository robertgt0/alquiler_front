// src/app/components/guiaUsuarios/GuiaUsuariosNuevos.tsx

'use client';
import { useState } from 'react';
import { IntroGuide } from './IntroGuide';
import { ClienteGuide } from './ClienteGuide';
import { FixerGuide } from './FixerGuide';

export default function GuiaUsuariosNuevos() {
  const [vista, setVista] = useState('intro'); // 'intro', 'cliente', 'fixer'

  return (
    <div className="p-4 md:p-8 bg-white">
      <header className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl font-semibold text-center text-gray-900 mb-2">
          Guía de Usuario SERVİNEO
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-center text-sm">
          Aprende cómo funciona nuestra plataforma paso a paso. Ya sea que
          busques contratar un servicio o convertirte en un Fixer profesional.
        </p>
      </header>

      <main>
        {vista === 'intro' && <IntroGuide setVista={setVista} />}
        {vista === 'cliente' && <ClienteGuide setVista={setVista} />}
        {vista === 'fixer' && <FixerGuide setVista={setVista} />}
      </main>
    </div>
  );
}
