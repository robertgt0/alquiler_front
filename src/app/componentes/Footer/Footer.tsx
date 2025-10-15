'use client';

// LÍNEA CORREGIDA: useState está dentro de las llaves {}
import React, { useState } from 'react'; 
import Image from 'next/image';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import Modal from './../reutilizables/Modal';

// Contenido para cada modal
const modalContents = {
  privacy: {
    title: 'Política de Privacidad',
    content: (
      <>
        <p>En **Servineo**, valoramos la privacidad de nuestros usuarios. Esta política explica cómo recopilamos, usamos y protegemos tu información personal:</p>
        <p><strong>Datos recopilados:</strong> nombre, correo electrónico, teléfono y datos necesarios para prestar el servicio.</p>
        <p><strong>Uso de la información:</strong> solo utilizamos tus datos para gestionar solicitudes, brindar soporte y mejorar nuestros servicios.</p>
        <p><strong>Protección:</strong> aplicamos medidas técnicas y organizativas para resguardar tu información.</p>
        <p><strong>Derechos del usuario:</strong> puedes acceder, rectificar o eliminar tus datos personales escribiéndonos a <a href="mailto:servineo@gmail.com" className="text-blue-600 hover:underline">nuestro correo de contacto</a>.</p>
      </>
    )
  },
  terms: {
    title: 'Términos de Uso (Acuerdo de Usuario)',
    content: (
      <>
        <p>Al usar este sitio web, aceptas los siguientes términos:</p>
        <p>El contenido y los servicios ofrecidos están destinados exclusivamente a fines legales.</p>
        <p>Está prohibido el uso indebido del sitio que pueda dañar, interrumpir o afectar su correcto funcionamiento.</p>
        <p>Nos reservamos el derecho de modificar los servicios o condiciones en cualquier momento, notificando a los usuarios mediante este sitio.</p>
        <p>El usuario es responsable de la veracidad de la información proporcionada.</p>
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
      </>
    )
  },
  howItWorks: {
    title: '¿Cómo Funciona?',
    content: (
      <div className="space-y-3">
        <p>Servineo es una plataforma en línea dedicada a la contratación y oferta de servicios profesionales. Nuestro objetivo es crear un espacio confiable para clientes y fixers.</p>
        <div>
          <h4 className="font-semibold">Para los clientes:</h4>
          <ul className="list-disc list-inside pl-2">
            <li>Buscar el servicio que necesitan de forma rápida y sencilla.</li>
            <li>Explorar perfiles de fixers con información relevante.</li>
            <li>Consultar calificaciones en estrellas (1 a 5) de otros usuarios.</li>
            <li>Contratar al profesional que mejor se adapte a sus necesidades.</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Para los fixers:</h4>
          <ul className="list-disc list-inside pl-2">
            <li>Ofrecer sus servicios en un espacio digital accesible.</li>
            <li>Construir una reputación sólida con calificaciones y reseñas.</li>
            <li>Llegar a más clientes y ampliar sus oportunidades.</li>
          </ul>
        </div>
        <p>De esta manera, Servineo no solo conecta a clientes con profesionales, sino que también impulsa la confianza, la calidad y el crecimiento dentro del mercado de servicios.</p>
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
      <footer className="bg-[#11255a] text-[#d8ecff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="border-t border-[#1140bc] mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                
                <div className="space-y-4">
                    <div className="flex items-center justify-center md:justify-start">
                        <Image 
                          src="/logo-servineo.jpg"
                          alt="Logo de Servineo"
                          width={50}
                          height={50}
                          className="mr-3"
                        />
                        <h3 className="text-2xl font-bold">Servineo</h3>
                    </div>
                    <p className="text-[#b9ddff]">La plataforma líder que conecta clientes con proveedores de servicios profesionales. Encuentra el fixer perfecto para tu proyecto.</p>
                </div>

                <div className="space-y-4">
                    <h4 className="text-xl font-semibold">Enlaces Rápidos</h4>
                    <nav className="flex flex-col space-y-2">
                        <a href="/trabajos-recientes" className="hover:text-[#52abff] transition-colors">Trabajos recientes</a>
                        <a href="/mapa" className="hover:text-[#52abff] transition-colors">Mapa</a>
                        <a href="/servicios" className="hover:text-[#52abff] transition-colors">Lista de servicios</a>
                        {/* 
                          AQUÍ ESTÁ LA CORRECCIÓN:
                          Se cambió "text-left" por "text-center md:text-left" 
                          para que esté centrado en móviles y alineado a la izquierda en pantallas grandes.
                        */}
                        <button onClick={() => setActiveModal('howItWorks')} className="hover:text-[#52abff] transition-colors text-center md:text-left">¿Cómo funciona?</button>
                    </nav>
                </div>
                <div className="space-y-4">
                    <h4 className="text-xl font-semibold">Soporte</h4>
                    <ul className="space-y-3">
                        <li className="flex items-center justify-center md:justify-start"><FaPhone className="mr-3 text-[#52abff]" /><span>+591 73782241</span></li>
                        <li className="flex items-center justify-center md:justify-start"><FaEnvelope className="mr-3 text-[#52abff]" /><span>servineo@gmail.com</span></li>
                        <li className="flex items-center justify-center md:justify-start"><FaMapMarkerAlt className="mr-3 text-[#52abff]" /><span>Cochabamba, Cercado</span></li>
                    </ul>
                </div>
            </div>
          
          <div className="border-t border-[#1140bc] mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-[#89c9ff]">&copy; {new Date().getFullYear()} Servineo. Todos los derechos reservados.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={() => setActiveModal('privacy')} className="text-sm hover:text-[#52abff] transition-colors border border-[#1140bc] px-3 py-1 rounded-md">Política de privacidad</button>
              <button onClick={() => setActiveModal('terms')} className="text-sm hover:text-[#52abff] transition-colors border border-[#1140bc] px-3 py-1 rounded-md">Términos de uso</button>
              <button onClick={() => setActiveModal('cookies')} className="text-sm hover:text-[#52abff] transition-colors border border-[#1140bc] px-3 py-1 rounded-md">Política de cookies</button>
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