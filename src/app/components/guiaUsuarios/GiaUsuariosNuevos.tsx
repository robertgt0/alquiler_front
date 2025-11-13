// src/app/components/guiaUsuarios/ManualUsuariosNuevos.tsx

'use client';
import { useState } from 'react';
import { IntroGuide } from './IntroManual';
import { ClienteManual } from './ClienteManual';
import { FixerGuide } from './FixerManual';

export default function ManualUsuariosNuevos() {
  const [vista, setVista] = useState('intro'); // 'intro', 'cliente', 'fixer'

  return (
    // CAMBIO: Fondo azul oscuro, padding y un ID para el anclaje del scroll
    <div id="manual-de-usuario" className="p-4 md:p-12 bg-gray-900"> 
      <header className="text-center mb-8 md:mb-12">
        {/* CAMBIO: Texto en color blanco para que contraste con el fondo */}
        <h1 className="text-3xl font-semibold text-center text-white mb-2">
          Manual de Usuario SERVİNEO
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-center text-sm">
          Aprende cómo funciona nuestra plataforma paso a paso. Ya sea que
          busques contratar un servicio o convertirte en un Fixer profesional.
        </p>
      </header>

      <main>
        {vista === 'intro' && <IntroGuide setVista={setVista} />}
        {vista === 'cliente' && <ClienteManual setVista={setVista} />}
        {vista === 'fixer' && <FixerGuide setVista={setVista} />}
      </main>
    </div>
  );
}