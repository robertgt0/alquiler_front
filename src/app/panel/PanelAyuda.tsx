'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

const COLORS = {
  base: '#11255a',
  accent: '#52abff',
  soft: '#b9ddff',
  panelBg: '#0f1f51',
};

type FAQ = { q: string; a: string };

const faqsCliente: FAQ[] = [
  { q: '¿Cómo busco un servicio?', a: 'Usa el buscador o explora categorías; también puedes usar el mapa en la página principal.' },
  { q: '¿Cómo contrato a un fixer?', a: 'Entra al perfil del fixer y pulsa “Contratar”. Describe tu necesidad y confirma.' },
  { q: '¿Cómo se calculan las calificaciones?', a: 'Son un promedio de reseñas de clientes visibles en el perfil del fixer.' },
];

const faqsFixer: FAQ[] = [
  { q: '¿Cómo me registro como fixer?', a: 'Desde el menú elige “Ser Fixer”, completa tus datos y valida tu cuenta.' },
  { q: '¿Cómo recibo solicitudes?', a: 'Los clientes te encuentran por categoría y área. Te notificamos cuando llega una solicitud.' },
  { q: '¿Cómo mejoro mi visibilidad?', a: 'Completa tu perfil, responde rápido y cuida tus calificaciones.' },
];

const categorias = [
  { id: 'guia', label: 'Guía de usuario' },
  { id: 'cliente', label: 'Ayuda para clientes' },
  { id: 'fixer', label: 'Ayuda para fixers' },
  { id: 'cuenta', label: 'Cuenta y seguridad' },
  { id: 'pagos', label: 'Pagos y facturación' },
];

export default function PanelAyuda() {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<'guia' | 'cliente' | 'fixer' | 'cuenta' | 'pagos'>('guia');
  const [open, setOpen] = useState<{ [k: string]: boolean }>({});

  const faqsFiltradas = useMemo(() => {
    const pool =
      cat === 'cliente' ? faqsCliente :
      cat === 'fixer'   ? faqsFixer   :
      [...faqsCliente, ...faqsFixer];

    if (!query.trim()) return pool;
    const q = query.toLowerCase();
    return pool.filter(({ q: title, a }) =>
      title.toLowerCase().includes(q) || a.toLowerCase().includes(q)
    );
  }, [cat, query]);

  return (
    <div className="min-h-screen w-full flex flex-col" style={{ backgroundColor: COLORS.base }}>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-white font-semibold text-xl">Centro de ayuda</span>
              <span className="text-sm px-2 py-0.5 rounded-full" style={{ backgroundColor: COLORS.accent, color: '#05122e' }}>
                Servineo
              </span>
            </div>
            <div className="relative w-full sm:ml-auto sm:w-[520px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" color={COLORS.soft} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Busca temas: contratar, ser fixer, pagos…"
                className="w-full rounded-lg pl-10 pr-10 py-2 text-sm outline-none"
                style={{
                  backgroundColor: COLORS.panelBg,
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              />
              {!!query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/10"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="w-4 h-4" color={COLORS.soft} />
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
          <aside className="md:col-span-4 lg:col-span-3">
            <nav className="space-y-1">
              {categorias.map((c) => {
                const active = c.id === cat;
                return (
                  <button
                    key={c.id}
                    onClick={() => setCat(c.id as typeof cat)}
                    className="w-full text-left px-3 py-2 rounded-md transition-colors"
                    style={{
                      backgroundColor: active ? COLORS.panelBg : 'transparent',
                      color: active ? '#ffffff' : COLORS.soft,
                      border: active ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
                    }}
                  >
                    {c.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main */}
          <main className="md:col-span-8 lg:col-span-9 space-y-6">
            <section className="rounded-xl p-5" style={{ backgroundColor: COLORS.panelBg, border: '1px solid rgba(255,255,255,0.08)' }}>
              <h2 className="text-white text-lg font-semibold mb-1">
                {cat === 'guia' ? 'Guía rápida de Servineo' :
                 cat === 'cliente' ? 'Ayuda para clientes' :
                 cat === 'fixer' ? 'Ayuda para fixers' :
                 cat === 'pagos' ? 'Pagos y facturación' : 'Cuenta y seguridad'}
              </h2>
              <p className="text-sm" style={{ color: COLORS.soft }}>
                Encuentra respuestas y aprende a usar la plataforma paso a paso.
              </p>
            </section>

            {/* Vista: Guía rápida (intro integrada) */}
            {cat === 'guia' && (
              <section className="rounded-xl overflow-hidden bg-white">
                <div className="p-6 md:p-10">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3 text-center">¿Qué es Servineo?</h3>
                  <p className="text-gray-600 text-center max-w-2xl mx-auto mb-8">
                    Conectamos a personas que necesitan servicios con profesionales calificados (Fixers).
                    Explora cómo usar la plataforma según tu rol.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => setCat('cliente')}
                      className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Soy cliente
                    </button>
                    <button
                      onClick={() => setCat('fixer')}
                      className="px-6 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                    >
                      Soy fixer
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* Vistas: Cliente / Fixer (FAQs) */}
            {cat !== 'guia' && (
              <section
                className="rounded-xl p-4 md:p-6 space-y-3"
                style={{ backgroundColor: COLORS.panelBg, border: '1px solid rgba(255,255,255,0.08)' }}
              >
                {(faqsFiltradas.length ? faqsFiltradas : [{
                  q: 'No hay resultados para tu búsqueda',
                  a: 'Intenta con otras palabras o cambia de categoría.',
                }]).map(({ q, a }, idx) => {
                  const id = `${q}-${idx}`;
                  const isOpen = !!open[id];
                  return (
                    <div key={id} className="rounded-lg overflow-hidden" style={{ backgroundColor: '#0c1a45' }}>
                      <button
                        className="w-full flex items-center justify-between px-4 py-3 text-left"
                        onClick={() => setOpen((o) => ({ ...o, [id]: !isOpen }))}
                      >
                        <span className="text-white text-sm md:text-base">{q}</span>
                        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} color={COLORS.soft} />
                      </button>
                      {isOpen && <div className="px-4 pb-4 text-sm" style={{ color: COLORS.soft }}>{a}</div>}
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
