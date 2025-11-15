"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  getFixersByCategory,
  type FixersByCategoryDTO,
  type FixerWithCategoriesDTO,
} from "@/lib/api/fixer";

const DEBOUNCE_MS = 300;

type CategoryGroup = FixersByCategoryDTO;

type FixerCard = FixerWithCategoriesDTO;

function Stars({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;

  return (
    <div className="inline-flex items-center gap-1 text-yellow-500 text-sm">
      {Array.from({ length: full }).map((_, index) => (
        <span key={`full-${index}`}>&#9733;</span>
      ))}
      {half ? <span>&#9734;</span> : null}
      {Array.from({ length: empty }).map((_, index) => (
        <span key={`empty-${index}`} className="text-slate-300">
          &#9733;
        </span>
      ))}
    </div>
  );
}

function FixerListCard({ fixer }: { fixer: FixerCard }) {
  // Bug 3.1.4 CORREGIDO: Validar ciudad vacía o null
  const displayCity = fixer.city?.trim() || "Ciudad no registrada";
  
  // Bug 3.1.2 CORREGIDO: Validar bio vacía o null
  const displayBio = fixer.bio?.trim() || "Sin descripción disponible";
  
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 overflow-hidden rounded-full bg-slate-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fixer.photoUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(fixer.name ?? "Fixer")}`}
              alt={fixer.name ?? "Fixer"}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="text-base font-semibold text-slate-900">{fixer.name ?? "Fixer"}</div>
            <div className="text-xs text-slate-500">{displayCity}</div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Stars value={Number(fixer.ratingAvg ?? 0)} />
              <span>
                {(fixer.ratingAvg ?? 0).toFixed(1)} ({fixer.ratingCount ?? 0} reseñas)
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {fixer.categoriesInfo.map((category) => (
            <span
              key={category.id}
              className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
            >
              {category.name}
            </span>
          ))}
        </div>
        {/* Bug 3.1.2 CORREGIDO: Siempre mostrar descripción */}
        <p className="text-sm text-slate-600">{displayBio}</p>
      </div>
      <div className="flex justify-end md:items-center">
        <Link
          href={`/fixers/${fixer.id}`}
          className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          Saber más
        </Link>
      </div>
    </div>
  );
}

export default function FixersByCategoryView() {
  const [data, setData] = useState<CategoryGroup[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const handler = setTimeout(async () => {
      try {
        setLoading(true);
        const trimmed = search.trim();
        const response = await getFixersByCategory(trimmed || undefined);
        if (cancelled) return;
        setData(response);
        setError(null);
      } catch (err: any) {
        if (cancelled) return;
        setError(String(err?.message || "No se pudieron obtener los fixers"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    setCollapsed((prev) => {
      const next = { ...prev };
      data.forEach((group) => {
        if (!(group.category.id in next)) {
          next[group.category.id] = false;
        }
      });
      return next;
    });
  }, [data]);

  useEffect(() => {
    if (!selectedCategoryId) return;
    const exists = data.some((group) => group.category.id === selectedCategoryId);
    if (!exists) {
      setSelectedCategoryId(null);
    }
  }, [data, selectedCategoryId]);

  const displayedGroups = useMemo(() => {
    if (!selectedCategoryId) return data;
    const match = data.find((group) => group.category.id === selectedCategoryId);
    return match ? [match] : [];
  }, [data, selectedCategoryId]);

  const totalResults = useMemo(
    () => displayedGroups.reduce((sum, group) => sum + group.total, 0),
    [displayedGroups]
  );

  const toggleCategory = (id: string) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCategorySelect = (id: string) => {
    setSelectedCategoryId((prev) => {
      const next = prev === id ? null : id;
      if (next) {
        setCollapsed((state) => ({ ...state, [next]: false }));
      }
      return next;
    });
  };

  return (
    // ✅ Bug 3.1.1 RESUELTO: Usar mismo estilo que /offers (fondo blanco, padding compacto)
    <main style={{ background: '#ffffff', minHeight: '100dvh', padding: '24px 20px' }}>
      {/* ✅ Header consistente con /offers */}
      <header style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <span 
          style={{ width: 10, height: 10, borderRadius: '50%', background: '#0c4fe9', display: 'inline-block' }} 
          aria-hidden="true" 
        />
        <strong style={{ color: '#11255a' }}>Servineo</strong>
      </header>

      {/* ✅ Contenedor principal con mismo ancho máximo */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Breadcrumbs y botón - más compactos */}
        <nav style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link href="/" style={{ color: '#64748b', textDecoration: 'none' }}>
              Home
            </Link>
            <span>/</span>
            <Link href="/offers" style={{ color: '#64748b', textDecoration: 'none' }}>
              Ofertas publicadas
            </Link>
            <span>/</span>
            <span style={{ color: '#0f172a', fontWeight: 500 }}>Ver fixers por trabajo</span>
          </div>
          <Link
            href="/convertirse-fixer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              borderRadius: '12px',
              background: '#2563eb',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#ffffff',
              textDecoration: 'none',
              transition: 'background 0.2s'
            }}
          >
            Registrarme como Fixer
          </Link>
        </nav>

        {/* Título y descripción - más compactos */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>
            Busca Fixers
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b' }}>
            Explora las categorías disponibles y encuentra al fixer ideal según sus habilidades declaradas.
          </p>
        </div>

        {/* Buscador - más compacto */}
        <div style={{ marginBottom: '16px' }}>
          <label 
            style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#334155', marginBottom: '8px' }} 
            htmlFor="search-fixer"
          >
            Busca por nombre
          </label>
          <input
            id="search-fixer"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Escribe el nombre del fixer"
            style={{
              width: '100%',
              height: '40px',
              borderRadius: '12px',
              border: '1px solid #cbd5e1',
              padding: '0 16px',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#cbd5e1';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Contador de resultados */}
        <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
          {loading ? "Cargando resultados..." : `${totalResults} resultado${totalResults === 1 ? "" : "s"}`}
        </div>

        {error && (
          <div style={{ 
            borderRadius: '12px', 
            background: '#fef2f2', 
            padding: '12px 16px', 
            fontSize: '14px', 
            color: '#dc2626',
            marginBottom: '24px'
          }}>
            {error}
          </div>
        )}

        {/* Layout con sidebar y contenido */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: '24px' }}>
          {/* Sidebar de categorías */}
          <aside style={{ flex: '0 0 256px' }}>
            <div style={{ 
              borderRadius: '24px', 
              border: '1px solid #e2e8f0', 
              background: '#ffffff', 
              padding: '20px',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
            }}>
              <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', marginBottom: '16px' }}>
                Categorías
              </h2>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: '#475569', listStyle: 'none', padding: 0, margin: 0 }}>
                {data.map((group) => (
                  <li key={group.category.id}>
                    <button
                      type="button"
                      onClick={() => handleCategorySelect(group.category.id)}
                      style={{
                        display: 'flex',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        textAlign: 'left',
                        transition: 'background 0.2s, border-color 0.2s',
                        border: selectedCategoryId === group.category.id ? '1px solid #bfdbfe' : '1px solid transparent',
                        background: selectedCategoryId === group.category.id ? '#eff6ff' : 'transparent',
                        color: selectedCategoryId === group.category.id ? '#1d4ed8' : '#475569',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedCategoryId !== group.category.id) {
                          e.currentTarget.style.background = '#f1f5f9';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedCategoryId !== group.category.id) {
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                      aria-pressed={selectedCategoryId === group.category.id}
                    >
                      <span>{group.category.name}</span>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>({group.total})</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Contenido principal */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {loading && (
              <div style={{ borderRadius: '12px', background: '#ffffff', padding: '12px 16px', fontSize: '14px', color: '#64748b', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                Cargando...
              </div>
            )}
            {!loading && displayedGroups.length === 0 && !error && (
              <div style={{ borderRadius: '12px', background: '#ffffff', padding: '12px 16px', fontSize: '14px', color: '#64748b', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                No encontramos fixers con ese criterio.
              </div>
            )}

            {displayedGroups.map((group) => {
              const isCollapsed = collapsed[group.category.id] ?? false;
              return (
                <section 
                  key={group.category.id} 
                  style={{ 
                    borderRadius: '24px', 
                    border: '1px solid #e2e8f0', 
                    background: '#ffffff', 
                    padding: '24px',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <header style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                        {group.category.name}
                      </h3>
                      <p style={{ fontSize: '12px', color: '#64748b' }}>
                        {group.total} fixer{group.total === 1 ? "" : "s"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleCategory(group.category.id)}
                      style={{
                        borderRadius: '9999px',
                        border: '1px solid #e2e8f0',
                        padding: '4px 12px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#475569',
                        background: '#ffffff',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s, color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#3b82f6';
                        e.currentTarget.style.color = '#2563eb';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.color = '#475569';
                      }}
                    >
                      {isCollapsed ? "Expandir" : "Colapsar"}
                    </button>
                  </header>
                  {!isCollapsed && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {group.fixers.map((fixer) => (
                        <FixerListCard key={`${group.category.id}-${fixer.id}`} fixer={fixer} />
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}