// src/app/components/ayuda/PanelAyuda.tsx

'use client';
import { useMemo, useState } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import Link from 'next/link';

const faqs = [
    { id: 'gen-1', cat: 'general', q: '¿Qué es Servineo?', a: 'Servineo es una plataforma que conecta clientes con proveedores de servicios (Fixers) en Cochabamba, Bolivia.' },
    { id: 'gen-2', cat: 'general', q: '¿Cómo me registro?', a: 'Puedes registrarte como cliente o como fixer usando tu correo electrónico o tu cuenta de Google.' },
    { id: 'cliente-1', cat: 'cliente', q: '¿Cómo contrato un servicio?', a: 'Busca el servicio que necesitas, revisa los perfiles de los fixers, y haz clic en "Contratar" para enviar tu solicitud.' },
    { id: 'cliente-2', cat: 'cliente', q: '¿Es seguro pagar a través de la plataforma?', a: 'Sí, utilizamos pasarelas de pago seguras para proteger tu información financiera.' },
    { id: 'fixer-1', cat: 'fixer', q: '¿Cómo me convierto en Fixer?', a: 'Completa el formulario "Convertirse en Fixer", valida tu identidad y configura tu perfil para empezar a recibir solicitudes.' },
    { id: 'fixer-2', cat: 'fixer', q: '¿Qué comisiones cobra Servineo?', a: 'Servineo cobra una pequeña comisión por cada trabajo completado a través de la plataforma. Esta comisión nos ayuda a mantener y mejorar el servicio.' },
    { id: 'pagos-1', cat: 'pagos', q: '¿Qué métodos de pago se aceptan?', a: 'Aceptamos pagos con tarjeta de crédito/débito, transferencias QR y, en algunos casos, efectivo, dependiendo de lo que el Fixer acepte.' },
    { id: 'seguridad-1', cat: 'seguridad', q: '¿Cómo se verifican los Fixers?', a: 'Los Fixers pasan por un proceso de verificación de identidad para garantizar la confianza y seguridad en la plataforma.' },
    { id: 'guia-1', cat: 'guia', q: '¿Dónde encuentro el manual de usuario?', a: <p>Puedes acceder al manual de usuario completo haciendo clic aquí: <Link href="/manual-de-usuario" className="text-blue-600 underline">Ver Manual</Link></p> },
];

const categorias = [
    { id: 'todos', label: 'Todas las preguntas' },
    { id: 'general', label: 'General' },
    { id: 'cliente', label: 'Para Clientes' },
    { id: 'fixer', label: 'Para Fixers' },
    { id: 'pagos', label: 'Pagos y Facturación' },
    { id: 'seguridad', label: 'Seguridad y Confianza' },
    { id: 'guia', label: 'Guía Rápida' },
];

export default function PanelAyuda() {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<string>('todos');
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const faqsFiltradas = useMemo(() => {
    const lowerQuery = query.toLowerCase();
    return faqs.filter(faq => {
      const enCategoria = cat === 'todos' || faq.cat === cat;
      const coincideBusqueda =
        !lowerQuery ||
        faq.q.toLowerCase().includes(lowerQuery) ||
        (typeof faq.a === 'string' && faq.a.toLowerCase().includes(lowerQuery));
      return enCategoria && coincideBusqueda;
    });
  }, [query, cat]);

  const categoriaActual = categorias.find(c => c.id === cat) ?? categorias[0];

  return (
    // CAMBIO: Fondo principal a un gris claro.
    <div className="min-h-screen w-full flex flex-col bg-gray-100">
      {/* Header */}
      {/* CAMBIO: Header con fondo blanco y colores de texto de la marca. */}
      <header className="sticky top-0 z-40 border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-gray-800 font-semibold text-xl">Centro de ayuda</span>
              <span className="text-sm px-2 py-0.5 rounded-full bg-blue-600 text-white font-medium">
                Servineo
              </span>
            </div>
            {/* CAMBIO: Buscador con estilo claro. */}
            <div className="relative w-full sm:ml-auto sm:w-[520px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Busca temas: contratar, ser fixer, pagos…"
                className="w-full rounded-lg pl-10 pr-10 py-2 text-sm text-gray-800 outline-none bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              {!!query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-200"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Sidebar */}
          {/* CAMBIO: Sidebar con tema claro. */}
          <aside className="md:col-span-4 lg:col-span-3">
            <nav className="space-y-1">
              {categorias.map((c) => {
                const active = c.id === cat;
                return (
                  <button
                    key={c.id}
                    onClick={() => setCat(c.id as typeof cat)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors font-medium ${
                      active
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main */}
          <main className="md:col-span-8 lg:col-span-9 space-y-6">
            {/* CAMBIO: Tarjeta de cabecera con tema claro. */}
            <section className="rounded-xl p-5 bg-white border border-gray-200">
              <h2 className="text-gray-800 text-lg font-semibold mb-1">
                {categoriaActual.label}
              </h2>
              <p className="text-sm text-gray-600">
                Encuentra respuestas y aprende a usar la plataforma paso a paso.
              </p>
            </section>

            {/* Guía rápida: Ya usa un estilo similar, solo se asegura la consistencia. */}
            {cat === 'guia' && (
              <section className="rounded-xl overflow-hidden bg-white border border-gray-200">
                <div className="p-6">
                  <h3 className="font-semibold text-lg text-gray-800 mb-3">Guía de Usuario de Servineo</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    ¿Prefieres una guía más detallada? Visita nuestro manual de usuario completo para aprender todo sobre Servineo.
                  </p>
                  <Link href="/manual-de-usuario">
                    <button
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm shadow-md transform transition-transform duration-300 ease-in-out hover:scale-105"
                    >
                      Ir al Manual de Usuario
                    </button>
                  </Link>
                </div>
              </section>
            )}

            {/* FAQs */}
            {cat !== 'guia' && (
              // CAMBIO: Contenedor de FAQs y acordeones con tema claro.
              <section className="rounded-xl bg-white border border-gray-200 p-4 md:p-6 space-y-3">
                {(faqsFiltradas.length ? faqsFiltradas : [{ q: '...', a: '...' }]).map(({ q, a }, idx) => {
                  const id = `${q}-${idx}`;
                  const isOpen = !!open[id];
                  return (
                    <div key={id} className="rounded-lg overflow-hidden bg-gray-50 border border-gray-200">
                      <button
                        className="w-full flex items-center justify-between px-4 py-3 text-left"
                        onClick={() => setOpen((o) => ({ ...o, [id]: !isOpen }))}
                      >
                        <span className="text-gray-800 text-sm md:text-base font-medium">{q}</span>
                        <ChevronDown className={`w-5 h-5 transition-transform text-gray-500 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && <div className="px-4 pb-4 text-sm text-gray-600">{a}</div>}
                    </div>
                  );
                })}
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}