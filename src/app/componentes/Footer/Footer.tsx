// components/Footer/Footer.tsx
// components/Footer/Footer.tsx

'use client';

import React, { useState } from 'react';
// ELIMINADO: Ya no se usa Image
// import Image from 'next/image';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import Modal from './../reutilizables/Modal';
// AÑADIDO: Importamos tu componente de icono
import Icono from './../Header/Icono';

// Contenido para cada modal (sin cambios)
const modalContents = {
  privacy: {
    title: 'Política de Privacidad',
    content: (
      <>
        <p>En <strong>Servineo</strong>, valoramos la privacidad de nuestros usuarios. Esta política explica cómo recopilamos, usamos y protegemos tu información personal:</p>
        <p><strong>Datos recopilados:</strong> nombre, correo electrónico, teléfono y datos necesarios para prestar el servicio.</p>
        <p><strong>Uso de la información:</strong> solo utilizamos tus datos para gestionar solicitudes, brindar soporte y mejorar nuestros servicios.</p>
        <p><strong>Protección:</strong> aplicamos medidas técnicas y organizativas para resguardar tu información.</p>
        <p><strong>Derechos del usuario:</strong> puedes acceder, rectificar o eliminar tus datos personales escribiéndonos a <a href="mailto:servineo@gmail.com" className="text-blue-600 hover:underline">nuestro correo de contacto</a>.</p>
        <p>Adicionalmente, almacenamos algunos registros de actividad (logs) para mejorar la seguridad y detectar patrones anómalos que puedan indicar fraudes o mal uso de la plataforma.</p>
        <p>Cuando compartes información en tu perfil o en mensajes con otros usuarios, recuerda que parte de esos datos pueden ser visibles a terceros según la configuración de privacidad que hayas seleccionado.</p>
        <p>Podemos compartir datos agregados y anonimizados con socios para análisis estadístico. Nunca compartiremos información personal identificable con terceros sin tu consentimiento explícito, salvo en los casos previstos por la ley.</p>
        <p>Si tienes dudas sobre el tratamiento de tus datos, puedes solicitar un informe o ejercer tus derechos enviando una solicitud a <a href="mailto:servineo@gmail.com" className="text-blue-600 hover:underline">servineo@gmail.com</a>. Responderemos en los plazos legales correspondientes.</p>
        <p>Esta política puede actualizarse periódicamente; te recomendamos revisarla con regularidad para estar al tanto de los cambios.</p>
      </>
    )
  },
  terms: {
    title: 'Términos de Uso (Acuerdo de Usuario)',
    content: (
      <>
        <div className="mb-6 p-3 bg-[#f8fafc] border-l-4 border-[#52abff] rounded-r">
          <p className="text-sm font-medium text-[#11255a]">
            <span className="text-[#52abff]">Última actualización:</span> 22/10/25
          </p>
        </div>
        <p>Al usar este sitio web, aceptas los siguientes términos:</p>
        <p>El contenido y los servicios ofrecidos están destinados exclusivamente a fines legales.</p>
        <p>Está prohibido el uso indebido del sitio que pueda dañar, interrumpir o afectar su correcto funcionamiento.</p>
        <p>Nos reservamos el derecho de modificar los servicios o condiciones en cualquier momento, notificando a los usuarios mediante este sitio.</p>
        <p>El usuario es responsable de la veracidad de la información proporcionada.</p>
        <p>Queda terminantemente prohibido utilizar la plataforma para fines ilícitos, publicar contenido ofensivo o intentar obtener accesos no autorizados a otros usuarios o a los sistemas de Servineo.</p>
        <p>El incumplimiento de estas condiciones puede derivar en la suspensión o eliminación de la cuenta, sin perjuicio de otras acciones legales que procedan.</p>
        <p>En caso de disputas entre usuarios, Servineo actúa únicamente como plataforma de intermediación y podrá facilitar mecanismos de resolución, pero no asume responsabilidad directa por acuerdos privados entre partes.</p>
        <p>Para garantizar una experiencia segura, recomendamos mantener actualizada tu información de contacto y reportar inmediatamente cualquier actividad sospechosa a nuestro equipo de soporte.</p>
  <p>Estos términos pueden ser actualizados; la fecha de &quot;Última actualización&quot; indica la versión vigente.</p>
      </>
    )
  },
  cookies: {
    title: 'Política de Cookies',
    content: (
      <>
        <p>Este sitio utiliza cookies para mejorar la experiencia del usuario:</p>
        <p><strong>Cookies esenciales:</strong> necesarias para el funcionamiento básico del sitio.</p>
        <p><strong>Cookies de análisis:</strong> nos ayudan a entender cómo interactúan los visitantes con la página para mejorarla.</p>
        <p><strong>Cookies de personalización:</strong> permiten recordar tus preferencias.</p>
        <p>Puedes configurar o desactivar las cookies en la configuración de tu navegador.</p>
        <p>Algunas cookies son gestionadas por terceros (por ejemplo, proveedores de analítica). Te recomendamos revisar las políticas de estos servicios si te interesa un control más detallado.</p>
        <p>Si prefieres no aceptar cookies de análisis, puedes cambiar tu configuración en cualquier momento; sin embargo, esto puede limitar algunas funcionalidades o la personalización del contenido.</p>
        <p>Para consultas sobre las cookies que utilizamos o para solicitar su eliminación, contacta a <a href="mailto:servineo@gmail.com" className="text-blue-600 hover:underline">servineo@gmail.com</a>.</p>
        <p>En algunos casos, las cookies nos permiten recordar el estado de tu carrito o guardar progresos en formularios para que no pierdas tu trabajo si cierras la pestaña accidentalmente.</p>
        <p>También utilizamos cookies para experimentar mejoras en la interfaz (A/B testing). Estos experimentos nos ayudan a decidir qué cambios benefician más a los usuarios en términos de usabilidad y rendimiento.</p>
        <p>Si utilizas varios dispositivos, algunas preferencias pueden sincronizarse mediante cookies asociadas a tu cuenta para ofrecer una experiencia coherente entre dispositivos.</p>
        <p>Recuerda que puedes borrar cookies desde la configuración de tu navegador en cualquier momento; sin embargo, eliminar cookies puede implicar volver a iniciar sesión o perder configuraciones personalizadas.</p>
      </>
    )
  },
  howItWorks: {
    title: '¿Cómo Funciona?',
    content: (
      <div className="space-y-3">
        <p>Servineo es una plataforma en línea dedicada a la contratación y oferta de servicios profesionales. Nuestro objetivo es crear un espacio confiable para clientes y fixers.</p>
        <p>En esta plataforma puedes publicar solicitudes de trabajo detallando necesidades, ubicación y presupuesto. Los fixers pueden enviar propuestas y presupuestos, y el cliente elige la mejor opción según calificación, experiencia y precio.</p>
        <div>
          <h4 className="font-semibold">Para los clientes:</h4>
          <ul className="list-disc list-inside pl-2">
            <li>Buscar el servicio que necesitan de forma rápida y sencilla.</li>
            <li>Explorar perfiles de fixers con información relevante.</li>
            <li>Consultar calificaciones en estrellas (1 a 5) de otros usuarios.</li>
            <li>Contratar al profesional que mejor se adapte a sus necesidades.</li>
            <li>Comunicarte directamente con el fixer para coordinar detalles y tiempos.</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Para los fixers:</h4>
          <ul className="list-disc list-inside pl-2">
            <li>Ofrecer sus servicios en un espacio digital accesible.</li>
            <li>Construir una reputación sólida con calificaciones y reseñas.</li>
            <li>Llegar a más clientes y ampliar sus oportunidades.</li>
            <li>Administrar tu disponibilidad y precios desde el panel de control.</li>
          </ul>
        </div>
        <p>Para mantener la calidad del servicio, incentivamos la comunicación clara y la entrega de presupuestos detallados. Si surge un problema, puedes usar el sistema de soporte para mediar y documentar acuerdos.</p>
        <p>Recuerda revisar las políticas de uso y privacidad antes de publicar datos personales o de pago. Servineo facilita la conexión, pero la ejecución del trabajo queda a cargo de las partes involucradas.</p>
        <p>Si deseas, puedes consultar casos de uso y guías prácticas en nuestra sección de ayuda para aprovechar mejor la plataforma.</p>
      </div>
    )
  }
};

const Footer = () => {
  const [activeModal, setActiveModal] = useState<keyof typeof modalContents | null>(null);

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  return (
    <>
  <footer className="bg-[#11255a] text-[#d8ecff]" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="border-t border-[#1140bc] mb-8"></div>
      {/* Grid: stack on small screens, three columns on md+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center md:text-left">
                
        <div className="space-y-4">
          <div className="flex items-center justify-center md:justify-start">
            <div className="mr-3 flex-shrink-0">
              <Icono size={50} />
            </div>
            <h3 className="text-2xl font-bold">Servineo</h3>
          </div>
          <p className="text-[#b9ddff] text-sm sm:text-base">La plataforma líder que conecta clientes con proveedores de servicios profesionales. Encuentra el fixer perfecto para tu proyecto.</p>
        </div>

        <div className="space-y-4">
          <h4 className="text-xl font-semibold">Enlaces Rápidos</h4>
      <nav className="flex flex-col space-y-2 items-center md:items-start">
      <a href="#trabajos-recientes" className="hover:text-[#52abff] transition-colors focus:outline-none focus:ring-2 focus:ring-[#52abff] px-2 py-1 rounded">Trabajos recientes</a>
      <a href="#mapa" className="hover:text-[#52abff] transition-colors focus:outline-none focus:ring-2 focus:ring-[#52abff] px-2 py-1 rounded">Mapa</a>
      <a href="#servicios" className="hover:text-[#52abff] transition-colors focus:outline-none focus:ring-2 focus:ring-[#52abff] px-2 py-1 rounded">Lista de servicios</a>
      <button onClick={() => setActiveModal('howItWorks')} className="hover:text-[#52abff] transition-colors text-center md:text-left focus:outline-none focus:ring-2 focus:ring-[#52abff] px-2 py-1 rounded">¿Cómo funciona?</button>
      </nav>
        </div>
                
        <div className="space-y-4">
          <h4 className="text-xl font-semibold">Soporte</h4>
          <ul className="space-y-3">
            <li className="flex items-center justify-center md:justify-start">
              <a href="https://wa.me/59173782241" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-[#52abff] transition-colors focus:outline-none focus:ring-2 focus:ring-[#52abff] px-2 py-1 rounded">
                <FaPhone className="mr-3 text-[#52abff]" />
                <span className="text-sm">+591 73782241</span>
              </a>
            </li>
            <li className="flex items-center justify-center md:justify-start">
              <a href="mailto:servineo@gmail.com" className="flex items-center hover:text-[#52abff] transition-colors focus:outline-none focus:ring-2 focus:ring-[#52abff] px-2 py-1 rounded">
                <FaEnvelope className="mr-3 text-[#52abff]" />
                <span className="text-sm">servineo@gmail.com</span>
              </a>
            </li>
            <li className="flex items-center justify-center md:justify-start">
              <a href="https://www.google.com/maps/search/?api=1&query=Cochabamba,Cercado" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-[#52abff] transition-colors focus:outline-none focus:ring-2 focus:ring-[#52abff] px-2 py-1 rounded">
                <FaMapMarkerAlt className="mr-3 text-[#52abff]" />
                <span className="text-sm">Cochabamba, Cercado</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
          
      <div className="border-t border-[#1140bc] mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
      <p className="text-sm text-[#89c9ff]">© {new Date().getFullYear()} Servineo. Todos los derechos reservados.</p>
      <div className="flex flex-wrap justify-center gap-4 w-full md:w-auto">
        <button onClick={() => setActiveModal('privacy')} className="w-full md:w-auto text-sm hover:text-[#52abff] transition-colors border border-[#1140bc] px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#52abff]">Política de privacidad</button>
        <button onClick={() => setActiveModal('terms')} className="w-full md:w-auto text-sm hover:text-[#52abff] transition-colors border border-[#1140bc] px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#52abff]">Términos de uso</button>
        <button onClick={() => setActiveModal('cookies')} className="w-full md:w-auto text-sm hover:text-[#52abff] transition-colors border border-[#1140bc] px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#52abff]">Política de cookies</button>
      </div>
      </div>
    </div>
    </footer>

      {activeModal && (
        <Modal
          isOpen={!!activeModal}
          onClose={handleCloseModal}
          title={modalContents[activeModal].title}
        >
          {modalContents[activeModal].content}
        </Modal>
      )}
    </>
  );
};

export default Footer;