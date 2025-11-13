'use client';

import React, { useState } from 'react';
import { BookOpen, Users, Shield, CreditCard, MessageSquare, Settings, ArrowLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Guide {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  articles: Article[];
}

interface Article {
  id: number;
  title: string;
  content: string;
}

const guides: Guide[] = [
  {
    id: 1,
    title: 'Primeros Pasos',
    description: 'Todo lo que necesitas saber para empezar',
    icon: <BookOpen size={24} />,
    articles: [
      {
        id: 1,
        title: 'Cómo crear tu cuenta',
        content: 'Para crear tu cuenta en Servineo, sigue estos pasos:\n\n1. Haz clic en el botón "Registrarse" en la parte superior derecha.\n2. Completa el formulario con tu información personal (nombre, correo electrónico, teléfono).\n3. Crea una contraseña segura (mínimo 8 caracteres).\n4. Acepta los términos y condiciones.\n5. Haz clic en "Registrarse".\n6. Revisa tu correo electrónico y confirma tu cuenta mediante el enlace enviado.\n\n¡Listo! Ya puedes empezar a usar la plataforma.'
      },
      {
        id: 2,
        title: 'Configuración inicial de tu perfil',
        content: 'Configura tu perfil para obtener la mejor experiencia:\n\n1. Ve a "Mi Perfil" en el menú superior.\n2. Sube una foto de perfil (recomendado para generar confianza).\n3. Completa tu información de contacto.\n4. Agrega tu ubicación para encontrar servicios cercanos.\n5. Configura tus preferencias de notificaciones.\n\nUn perfil completo te ayudará a obtener mejores resultados y generar más confianza.'
      },
      {
        id: 3,
        title: 'Navegando por la plataforma',
        content: 'La plataforma está organizada en secciones principales:\n\n• Inicio: Explora servicios destacados y categorías.\n• Ofertas: Busca y filtra servicios por categoría.\n• Mis Solicitudes: Gestiona tus solicitudes de servicio.\n• Mensajes: Comunícate con proveedores.\n• Perfil: Administra tu cuenta y configuración.\n\nUsa la barra de búsqueda para encontrar servicios específicos rápidamente.'
      }
    ]
  },
  {
    id: 2,
    title: 'Para Clientes',
    description: 'Guías para solicitar servicios',
    icon: <Users size={24} />,
    articles: [
      {
        id: 1,
        title: 'Cómo buscar y contratar un servicio',
        content: 'Proceso para contratar un servicio:\n\n1. Busca el servicio que necesitas usando la barra de búsqueda o explora por categorías.\n2. Revisa las ofertas disponibles, lee las descripciones y calificaciones.\n3. Compara precios y perfiles de proveedores.\n4. Haz clic en "Solicitar Servicio" en la oferta que te interese.\n5. Completa los detalles del servicio (fecha, hora, ubicación, descripción).\n6. El proveedor recibirá tu solicitud y podrá aceptarla o proponer cambios.\n7. Una vez aceptada, coordina los detalles finales.\n8. Confirma cuando el servicio esté completado.'
      },
      {
        id: 2,
        title: 'Sistema de calificaciones y reseñas',
        content: 'Cómo funcionan las calificaciones:\n\n• Después de completar un servicio, podrás calificar al proveedor.\n• La calificación va de 1 a 5 estrellas.\n• Puedes dejar un comentario detallado sobre tu experiencia.\n• Las calificaciones son visibles para todos los usuarios.\n• Los proveedores también pueden calificarte como cliente.\n\nConsejos para dejar buenas reseñas:\n- Sé específico sobre lo que te gustó o no.\n- Sé justo y objetivo.\n- Menciona la puntualidad, calidad del trabajo y comunicación.'
      },
      {
        id: 3,
        title: 'Política de cancelaciones',
        content: 'Reglas para cancelar servicios:\n\n• Puedes cancelar sin cargo si el proveedor aún no ha aceptado.\n• Si ya fue aceptado:\n  - Más de 24 horas antes: sin penalización.\n  - Menos de 24 horas: consulta con el proveedor.\n  - No presentarse: puede afectar tu calificación.\n\nPara cancelar:\n1. Ve a "Mis Solicitudes".\n2. Selecciona el servicio.\n3. Haz clic en "Cancelar".\n4. Proporciona una razón (opcional pero recomendado).'
      }
    ]
  },
  {
    id: 3,
    title: 'Para Proveedores',
    description: 'Guías para ofrecer tus servicios',
    icon: <Settings size={24} />,
    articles: [
      {
        id: 1,
        title: 'Cómo convertirte en proveedor (Fixer)',
        content: 'Pasos para convertirte en proveedor:\n\n1. Inicia sesión en tu cuenta.\n2. Haz clic en "Convertirse en Fixer" en el menú.\n3. Completa el formulario con:\n   - Información profesional\n   - Servicios que ofreces\n   - Experiencia y habilidades\n   - Documentación requerida (ID, certificados si aplica)\n4. Espera la verificación (24-48 horas).\n5. Una vez aprobado, podrás empezar a publicar ofertas.\n\nRequisitos:\n- Ser mayor de 18 años.\n- Tener experiencia demostrable.\n- Pasar verificación de identidad.'
      },
      {
        id: 2,
        title: 'Crear ofertas de servicio atractivas',
        content: 'Tips para crear ofertas exitosas:\n\n1. Título claro y descriptivo.\n2. Descripción detallada del servicio:\n   - Qué incluye\n   - Qué no incluye\n   - Tiempo estimado\n3. Fotos de calidad (trabajos anteriores).\n4. Precio competitivo y transparente.\n5. Especifica tu área de cobertura.\n\nEjemplo de buena descripción:\n"Servicio de plomería residencial. Incluye: reparación de fugas, instalación de grifos, destape de cañerías. Cuento con 10 años de experiencia y herramientas profesionales. Presupuesto sin compromiso."'
      },
      {
        id: 3,
        title: 'Gestión de solicitudes y calendario',
        content: 'Administra tus trabajos eficientemente:\n\n• Revisa solicitudes en "Mis Trabajos".\n• Acepta o rechaza solicitudes en 24 horas.\n• Usa el calendario para gestionar tu disponibilidad.\n• Comunícate claramente con los clientes.\n• Actualiza el estado del trabajo:\n  - Pendiente\n  - En progreso\n  - Completado\n\nConsejos:\n- Responde rápido a las solicitudes.\n- Sé puntual.\n- Mantén actualizado tu calendario.\n- Comunica cualquier cambio con anticipación.'
      }
    ]
  },
  {
    id: 4,
    title: 'Pagos y Facturación',
    description: 'Todo sobre transacciones y cobros',
    icon: <CreditCard size={24} />,
    articles: [
      {
        id: 1,
        title: 'Métodos de pago aceptados',
        content: 'Formas de pago disponibles:\n\n1. Tarjetas de crédito y débito:\n   - Visa, Mastercard, American Express\n   - Procesamiento seguro con encriptación\n\n2. Transferencias bancarias:\n   - Transferencia directa a través de la plataforma\n   - Tiempo de procesamiento: 24-48 horas\n\n3. Billeteras digitales:\n   - Integración con principales wallets del país\n\nTodos los pagos están protegidos por nuestro sistema de garantía.'
      },
      {
        id: 2,
        title: 'Sistema de garantía de pagos',
        content: 'Cómo funciona nuestra garantía:\n\nPara clientes:\n• El pago se retiene hasta que confirmes la finalización del servicio.\n• Si no estás satisfecho, puedes solicitar mediación.\n• Reembolso disponible según políticas.\n\nPara proveedores:\n• El pago se libera cuando el cliente confirma.\n• Protección contra cancelaciones injustificadas.\n• Pago garantizado por trabajos completados.\n\nTiempos de liberación:\n- Confirmación manual del cliente: inmediato\n- Sin respuesta del cliente: 7 días automático'
      },
      {
        id: 3,
        title: 'Comisiones y retiros',
        content: 'Estructura de comisiones:\n\n• Clientes: sin comisión adicional.\n• Proveedores: 10% sobre el valor del servicio.\n\nLa comisión incluye:\n- Procesamiento de pagos\n- Soporte técnico\n- Seguro de transacciones\n- Uso de la plataforma\n\nRetiros para proveedores:\n1. Mínimo de retiro: $50\n2. Solicita el retiro en "Mis Ganancias"\n3. Tiempo de procesamiento: 3-5 días hábiles\n4. Se transfiere a tu cuenta bancaria registrada'
      }
    ]
  },
  {
    id: 5,
    title: 'Seguridad',
    description: 'Mantén tu cuenta y datos seguros',
    icon: <Shield size={24} />,
    articles: [
      {
        id: 1,
        title: 'Verificación de identidad',
        content: 'Proceso de verificación:\n\nTodos los proveedores deben verificar su identidad:\n\n1. Sube una foto de tu documento de identidad.\n2. Toma una selfie para verificación facial.\n3. Proporciona referencias (opcional pero recomendado).\n4. Nuestro equipo revisa en 24-48 horas.\n\nBeneficios de estar verificado:\n• Insignia de "Verificado" en tu perfil\n• Mayor confianza de los clientes\n• Prioridad en resultados de búsqueda\n• Acceso a servicios premium\n\nTu información está protegida y se usa solo para verificación.'
      },
      {
        id: 2,
        title: 'Consejos de seguridad',
        content: 'Recomendaciones de seguridad:\n\nPara todos los usuarios:\n• Nunca compartas tu contraseña.\n• Usa autenticación de dos factores.\n• Mantén actualizada tu información de contacto.\n• Reporta actividad sospechosa.\n\nPara clientes:\n• Verifica el perfil del proveedor antes de contratar.\n• Revisa calificaciones y comentarios.\n• Usa solo los canales de pago de la plataforma.\n• No pagues por adelantado fuera de la plataforma.\n\nPara proveedores:\n• Confirma los detalles del servicio antes de aceptar.\n• Documenta el trabajo con fotos.\n• Usa el chat de la plataforma para comunicación.'
      },
      {
        id: 3,
        title: 'Política de privacidad',
        content: 'Protección de tus datos:\n\nNos tomamos muy en serio tu privacidad:\n\n• Solo recopilamos datos necesarios para el servicio.\n• Tu información personal nunca se vende a terceros.\n• Usamos encriptación para proteger tus datos.\n• Cumplimos con todas las regulaciones de protección de datos.\n\nDatos que recopilamos:\n- Información de perfil (nombre, correo, teléfono)\n- Historial de transacciones\n- Ubicación (solo cuando usas servicios de mapa)\n- Información de pago (procesada de forma segura)\n\nTienes derecho a:\n- Acceder a tus datos\n- Solicitar correcciones\n- Eliminar tu cuenta en cualquier momento'
      }
    ]
  },
  {
    id: 6,
    title: 'Soporte',
    description: 'Obtén ayuda cuando la necesites',
    icon: <MessageSquare size={24} />,
    articles: [
      {
        id: 1,
        title: 'Cómo contactar al soporte',
        content: 'Canales de atención disponibles:\n\n1. Chat en vivo:\n   - Horario: Lunes a Viernes 8:00 AM - 8:00 PM\n   - Respuesta promedio: 5 minutos\n\n2. WhatsApp:\n   - Número: +591 60379823\n   - Disponible 24/7 (respuesta en horario laboral)\n\n3. Correo electrónico:\n   - soporte@servineo.com\n   - Tiempo de respuesta: 24 horas\n\n4. Centro de ayuda:\n   - Artículos y guías detalladas\n   - Disponible 24/7\n\nPara una atención más rápida, ten a mano:\n- Tu ID de usuario\n- Descripción del problema\n- Capturas de pantalla si es relevante'
      },
      {
        id: 2,
        title: 'Resolución de disputas',
        content: 'Qué hacer en caso de conflicto:\n\n1. Intenta resolverlo directamente:\n   - Comunícate con la otra parte\n   - Explica el problema claramente\n   - Busca una solución justa\n\n2. Si no se resuelve, contacta a soporte:\n   - Haz clic en "Reportar problema"\n   - Proporciona detalles y evidencia\n   - Nuestro equipo mediará\n\n3. Proceso de mediación:\n   - Revisamos ambas versiones\n   - Solicitamos evidencia adicional si es necesario\n   - Tomamos una decisión en 3-5 días hábiles\n   - La decisión es vinculante\n\nTipos de disputas comunes:\n- Trabajo no completado\n- Calidad del servicio\n- Problemas de pago\n- Cancelaciones'
      },
      {
        id: 3,
        title: 'Reportar problemas técnicos',
        content: 'Cómo reportar bugs o errores:\n\n1. Describe el problema:\n   - ¿Qué estabas haciendo cuando ocurrió?\n   - ¿Qué esperabas que sucediera?\n   - ¿Qué sucedió en su lugar?\n\n2. Información útil:\n   - Navegador y versión\n   - Dispositivo (móvil/desktop)\n   - Sistema operativo\n   - Capturas de pantalla\n\n3. Envía el reporte:\n   - Usa el botón "Reportar problema"\n   - O envía un correo a soporte@servineo.com\n\nNuestro equipo técnico investigará y te mantendrá informado.\n\nProblemas comunes y soluciones:\n- Limpia caché y cookies\n- Actualiza tu navegador\n- Intenta en modo incógnito\n- Verifica tu conexión a internet'
      }
    ]
  }
];

export default function CentroDeAyuda() {
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const handleGuideClick = (guide: Guide) => {
    setSelectedGuide(guide);
    setSelectedArticle(null);
  };

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
  };

  const handleBack = () => {
    if (selectedArticle) {
      setSelectedArticle(null);
    } else {
      setSelectedGuide(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-4">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Flecha de regreso */}
        <div className="mb-4">
          {selectedGuide || selectedArticle ? (
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Volver</span>
            </button>
          ) : (
            <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Volver al inicio</span>
            </Link>
          )}
        </div>
        {!selectedGuide && !selectedArticle && (
          <>
            {/* Título principal */}
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
                Centro de Ayuda
              </h1>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                Guías completas y tutoriales para aprovechar al máximo nuestra plataforma
              </p>
            </div>

            {/* Grid de guías */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {guides.map((guide) => (
                <button
                  key={guide.id}
                  onClick={() => handleGuideClick(guide)}
                  className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all text-left group"
                >
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="bg-blue-100 text-blue-600 p-2.5 sm:p-3 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {guide.icon}
                    </div>
                    <ChevronRight className="text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" size={20} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    {guide.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                    {guide.description}
                  </p>
                  <p className="text-xs sm:text-sm text-blue-600 font-medium">
                    {guide.articles.length} artículos
                  </p>
                </button>
              ))}
            </div>
          </>
        )}

        {selectedGuide && !selectedArticle && (
          <div>
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4">
                <div className="bg-blue-100 text-blue-600 p-3 sm:p-4 rounded-xl">
                  {selectedGuide.icon}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {selectedGuide.title}
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">
                    {selectedGuide.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:gap-4">
              {selectedGuide.articles.map((article) => (
                <button
                  key={article.id}
                  onClick={() => handleArticleClick(article)}
                  className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all text-left group flex items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                  </div>
                  <ChevronRight className="text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" size={20} />
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedArticle && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                {selectedArticle.title}
              </h1>
              <div className="prose prose-sm sm:prose-lg max-w-none">
                {selectedArticle.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 whitespace-pre-line leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sección de contacto */}
        {!selectedArticle && (
          <div className="mt-12 sm:mt-16 bg-gradient-to-r from-[#2a87ff] to-[#1366fd] rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center text-white">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">¿Aún tienes dudas?</h2>
            <p className="mb-5 sm:mb-6 text-sm sm:text-base text-blue-100">
              Nuestro equipo está disponible para ayudarte
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                href="/preguntas-frecuentes"
                className="bg-white text-blue-600 px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Ver Preguntas Frecuentes
              </Link>
              <button
                onClick={() => window.open('https://wa.me/59160379823?text=Hola%20necesito%20ayuda', '_blank')}
                className="bg-green-500 text-white px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                Contactar por WhatsApp
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
