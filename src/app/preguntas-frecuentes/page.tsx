'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    id: 1,
    question: '¿Cómo puedo registrarme en la plataforma?',
    answer: 'Para registrarte, haz clic en el botón "Registrarse" en la parte superior derecha de la página. Completa el formulario con tus datos personales, correo electrónico y contraseña. Recibirás un correo de confirmación para activar tu cuenta.',
    category: 'Cuenta'
  },
  {
    id: 2,
    question: '¿Cómo puedo publicar una oferta de servicio?',
    answer: 'Una vez que hayas iniciado sesión, ve a la sección "Mis Ofertas" y haz clic en "Nueva Oferta". Completa la información del servicio que ofreces, incluyendo descripción, categoría y precio. Puedes agregar imágenes para que tu oferta sea más atractiva.',
    category: 'Servicios'
  },
  {
    id: 3,
    question: '¿Cómo funciona el sistema de pagos?',
    answer: 'Los pagos se realizan de forma segura a través de nuestra plataforma. Aceptamos tarjetas de crédito, débito y transferencias bancarias. El pago se procesa una vez que el servicio ha sido completado y confirmado por ambas partes.',
    category: 'Pagos'
  },
  {
    id: 4,
    question: '¿Qué categorías de servicios están disponibles?',
    answer: 'Ofrecemos múltiples categorías: Plomería, Electricidad, Carpintería, Pintura, Limpieza, Jardinería, Reparaciones, y más. Puedes explorar todas las categorías en la página principal.',
    category: 'Servicios'
  },
  {
    id: 5,
    question: '¿Cómo puedo contactar a un proveedor de servicios?',
    answer: 'En cada oferta de servicio encontrarás un botón de contacto. Puedes comunicarte directamente con el proveedor a través de WhatsApp o mediante el chat interno de la plataforma.',
    category: 'Servicios'
  },
  {
    id: 6,
    question: '¿Puedo cancelar o modificar una solicitud?',
    answer: 'Sí, puedes cancelar o modificar tu solicitud desde tu panel de usuario en la sección "Mis Solicitudes", siempre y cuando el proveedor aún no haya aceptado el trabajo. Si ya fue aceptado, deberás contactar directamente al proveedor.',
    category: 'Solicitudes'
  },
  {
    id: 7,
    question: '¿Cómo funciona la calificación de servicios?',
    answer: 'Después de completar un servicio, tanto el cliente como el proveedor pueden dejar una calificación y comentario. Esto ayuda a construir confianza en la comunidad y permite que otros usuarios tomen decisiones informadas.',
    category: 'Calificaciones'
  },
  {
    id: 8,
    question: '¿Qué debo hacer si tengo un problema con un servicio?',
    answer: 'Si tienes algún inconveniente, primero intenta comunicarte directamente con el proveedor. Si no se resuelve, puedes contactar a nuestro equipo de soporte a través del botón de ayuda o enviando un correo a soporte@servineo.com.',
    category: 'Soporte'
  },
  {
    id: 9,
    question: '¿Los proveedores están verificados?',
    answer: 'Sí, todos nuestros proveedores pasan por un proceso de verificación que incluye validación de identidad y referencias. Además, contamos con un sistema de calificaciones que te ayuda a elegir proveedores confiables.',
    category: 'Seguridad'
  },
  {
    id: 10,
    question: '¿Puedo ser cliente y proveedor al mismo tiempo?',
    answer: 'Sí, puedes tener ambos roles. Solo necesitas completar tu perfil como proveedor en la sección "Convertirse en Fixer" y empezar a publicar tus servicios.',
    category: 'Cuenta'
  },
  {
    id: 11,
    question: '¿Cómo recupero mi contraseña?',
    answer: 'En la página de inicio de sesión, haz clic en "¿Olvidaste tu contraseña?". Ingresa tu correo electrónico y recibirás un enlace para restablecer tu contraseña.',
    category: 'Cuenta'
  },
  {
    id: 12,
    question: '¿Cuáles son las comisiones de la plataforma?',
    answer: 'La plataforma cobra una comisión del 10% sobre el valor del servicio completado. Esta comisión cubre los costos de operación, seguridad y soporte de la plataforma.',
    category: 'Pagos'
  }
];

const categories = ['Todos', 'Cuenta', 'Servicios', 'Pagos', 'Solicitudes', 'Calificaciones', 'Soporte', 'Seguridad'];

export default function PreguntasFrecuentes() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-4">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Flecha de regreso */}
        <div className="mb-4">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Volver al inicio</span>
          </Link>
        </div>

        {/* Título */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
            Preguntas Frecuentes
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Encuentra respuestas rápidas a las preguntas más comunes sobre nuestra plataforma
          </p>
        </div>

        {/* Buscador */}
        <div className="mb-6 sm:mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar preguntas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-base rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        {/* Categorías */}
        <div className="mb-6 sm:mb-8 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 sm:gap-3 px-4 sm:px-0 pb-2 min-w-max sm:min-w-0 sm:justify-center sm:flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 sm:px-5 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap flex-shrink-0 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-[#2a87ff] to-[#1366fd] text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de FAQs */}
        <div className="space-y-4">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-start sm:items-center justify-between text-left hover:bg-gray-50 transition-colors gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <span className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full mb-2">
                      {faq.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 pr-2">
                      {faq.question}
                    </h3>
                  </div>
                  <div className="flex-shrink-0 mt-1 sm:mt-0">
                    {openFAQ === faq.id ? (
                      <ChevronUp className="text-blue-600" size={20} />
                    ) : (
                      <ChevronDown className="text-gray-400" size={20} />
                    )}
                  </div>
                </button>
                {openFAQ === faq.id && (
                  <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-2">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No se encontraron preguntas que coincidan con tu búsqueda.
              </p>
            </div>
          )}
        </div>

        {/* Sección de ayuda adicional */}
        <div className="mt-12 sm:mt-16 bg-gradient-to-r from-[#2a87ff] to-[#1366fd] rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center text-white">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">¿No encontraste lo que buscabas?</h2>
          <p className="mb-5 sm:mb-6 text-sm sm:text-base text-blue-100">
            Nuestro equipo de soporte está listo para ayudarte
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/centro-de-ayuda"
              className="bg-white text-blue-600 px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Ir al Centro de Ayuda
            </Link>
            <button
              onClick={() => window.open('https://wa.me/59160379823?text=Hola%20necesito%20ayuda', '_blank')}
              className="bg-green-500 text-white px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              Contactar por WhatsApp
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
