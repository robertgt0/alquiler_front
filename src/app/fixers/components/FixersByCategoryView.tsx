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
            <div className="text-xs text-slate-500">{fixer.city ?? "Ciudad no registrada"}</div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Stars value={Number(fixer.ratingAvg ?? 0)} />
              <span>
                {(fixer.ratingAvg ?? 0).toFixed(1)} ({fixer.ratingCount ?? 0} resenas)
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
        {fixer.bio && <p className="text-sm text-slate-600">{fixer.bio}</p>}
      </div>
      <div className="flex justify-end md:items-center">
        <Link
          href={`/fixers/${fixer.id}`}
          className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          Saber mas
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

  const totalResults = useMemo(() => data.reduce((sum, group) => sum + group.total, 0), [data]);

  const toggleCategory = (id: string) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-8">
        <nav className="flex flex-wrap items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-slate-800">
              Home
            </Link>
            <span>/</span>
            <Link href="/offers" className="hover:text-slate-800">
              Ofertas publicadas
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">Ver fixers por trabajo</span>
          </div>
          <Link
            href="/convertirse-fixer"
            className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Registrarme como Fixer
          </Link>
        </nav>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold text-slate-900">Busca Fixers</h1>
          <p className="text-sm text-slate-500">
            Explora las categorias disponibles y encuentra al fixer ideal segun sus habilidades declaradas.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="search-fixer">
            Busca por nombre
          </label>
          <input
            id="search-fixer"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Escribe el nombre del fixer"
            className="h-11 rounded-xl border border-slate-300 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div className="text-sm text-slate-500">
          {loading ? "Cargando resultados..." : `${totalResults} resultado${totalResults === 1 ? "" : "s"}`}
        </div>
        {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
      </header>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 pb-10 md:flex-row">
        <aside className="md:w-64">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">Categoras</h2>
            <ul className="mt-4 flex flex-col gap-2 text-sm text-slate-600">
              {data.map((group) => (
                <li key={group.category.id}>
                  <button
                    type="button"
                    onClick={() => toggleCategory(group.category.id)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition hover:bg-slate-100"
                  >
                    <span>{group.category.name}</span>
                    <span className="text-xs text-slate-500">({group.total})</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="flex-1 space-y-4">
          {loading && (
            <div className="rounded-xl bg-white px-4 py-3 text-sm text-slate-500 shadow">Cargando...</div>
          )}
          {!loading && data.length === 0 && !error && (
            <div className="rounded-xl bg-white px-4 py-3 text-sm text-slate-500 shadow">
              No encontramos fixers con ese criterio.
            </div>
          )}

          {data.map((group) => {
            const isCollapsed = collapsed[group.category.id] ?? false;
            return (
              <section key={group.category.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <header className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{group.category.name}</h3>
                    <p className="text-xs text-slate-500">{group.total} fixer{group.total === 1 ? "" : "s"}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleCategory(group.category.id)}
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-blue-500 hover:text-blue-600"
                  >
                    {isCollapsed ? "Expandir" : "Colapsar"}
                  </button>
                </header>
                {!isCollapsed && (
                  <div className="space-y-4">
                    {group.fixers.map((fixer) => (
                      <FixerListCard key={`${group.category.id}-${fixer.id}`} fixer={fixer} />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </section>
    </main>
  );
}





