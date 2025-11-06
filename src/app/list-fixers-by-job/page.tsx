"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

/**
 * HU02 – Listar fixers por trabajo
 * - Búsqueda por nombre (?q=) contra el backend
 * - Sidebar de categorías con filtro (incluye "Todas")
 * - Acordeones expand/collapse (todas abiertas por defecto)
 * - Navbar superior, breadcrumb y contador
 */

type Fixer = {
  id: string;
  name: string;
  city?: string;
  rating?: number;
  reviewsCount?: number;
  avatar?: string | null;
  skills?: string[];
  summary?: string;
};

type JobWithFixers = { jobId: string; jobName: string; fixers: Fixer[] };

export default function ListFixersByJobPage() {
  const [data, setData] = useState<JobWithFixers[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [activeJob, setActiveJob] = useState<string | null>(null);
  const [filterJobId, setFilterJobId] = useState<string | null>(null);

  // Fetch a /api/jobs-with-fixers (usa rewrites → puerto 5000)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const url = q
          ? `/api/jobs-with-fixers?q=${encodeURIComponent(q)}`
          : `/api/jobs-with-fixers`;
        const res = await fetch(url, { cache: "no-store" });
        const json: JobWithFixers[] = await res.json();
        if (!mounted) return;
        setData(Array.isArray(json) ? json : []);
        if (Object.keys(open).length === 0) {
          const allOpen = Object.fromEntries(json.map((j) => [j.jobId, true]));
          setOpen(allOpen); // todas abiertas por defecto
          setActiveJob(json[0]?.jobId ?? null);
        }
      } catch (e) {
        console.error("fetch jobs-with-fixers error:", e);
        setData([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  // Datos según filtro de categoría
  const jobsToRender = useMemo(
    () => (filterJobId ? data.filter((j) => j.jobId === filterJobId) : data),
    [data, filterJobId]
  );

  // Contador total (considerando filtro)
  const totalResults = useMemo(
    () => jobsToRender.reduce((acc, j) => acc + j.fixers.length, 0),
    [jobsToRender]
  );

  if (loading) return <Skeleton />;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-4">
      <TopNav />

      {/* Header + búsqueda + breadcrumb + contador */}
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold">Busca fixers</h1>
        <input
          aria-label="Buscar fixer por nombre"
          className="w-full border rounded-xl px-4 py-2"
          placeholder="Buscar fixer por nombre…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="flex items-center justify-between text-sm text-gray-500">
          <nav className="flex items-center gap-1">
            <Link href="/">Home</Link>
            <span>›</span>
            <Link href="/ver-ofertas">Ofertas publicadas</Link>
            <span>›</span>
            <span className="text-gray-700 font-medium">Fixers por trabajo</span>
          </nav>
          <span>({totalResults} resultados)</span>
        </div>
      </div>

      {/* Layout 2 columnas */}
      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar categorías (con filtro) */}
        <aside className="col-span-12 md:col-span-3 md:sticky md:top-4 h-fit">
          <div className="border rounded-2xl p-4">
            <h2 className="text-sm font-semibold mb-3">Categorías</h2>
            <ul className="space-y-1">
              {/* Opción: Todas */}
              <li>
                <button
                  className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-left ${
                    !filterJobId ? "bg-gray-100" : "hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    setFilterJobId(null);
                    setActiveJob(null);
                  }}
                >
                  <span className="text-sm">Todas</span>
                  <span className="text-xs text-gray-500">
                    (
                    {data.reduce(
                      (a, j) => a + (Array.isArray(j.fixers) ? j.fixers.length : 0),
                      0
                    )}
                    )
                  </span>
                </button>
              </li>

              {/* Categorías individuales */}
              {data.map((j) => {
                const count = j.fixers?.length || 0;
                const active = filterJobId === j.jobId;
                return (
                  <li key={j.jobId}>
                    <button
                      className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-left ${
                        active ? "bg-gray-100" : "hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        setFilterJobId(j.jobId);
                        setActiveJob(j.jobId);
                        setOpen((prev) => ({ ...prev, [j.jobId]: true }));
                        document.getElementById(`sec-${j.jobId}`)?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }}
                    >
                      <span className="text-sm">{j.jobName}</span>
                      <span className="text-xs text-gray-500">({count})</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Secciones de resultados */}
        <main className="col-span-12 md:col-span-9 space-y-5">
          {jobsToRender.map((job) => {
            const matches = job.fixers?.length || 0;
            if (matches === 0) return null;
            const isOpen = !!open[job.jobId];
            const isActive = activeJob === job.jobId;

            return (
              <section
                id={`sec-${job.jobId}`}
                key={job.jobId}
                className={`border rounded-2xl ${isActive ? "ring-1 ring-gray-200" : ""}`}
              >
                <header
                  className="flex items-center justify-between px-4 py-3 cursor-pointer"
                  onClick={() => setOpen((p) => ({ ...p, [job.jobId]: !p[job.jobId] }))}
                >
                  <h3 className="font-medium">
                    {job.jobName}
                    {q && <span className="text-sm text-gray-500"> ({matches})</span>}
                  </h3>
                  <span className="text-sm">{isOpen ? "−" : "+"}</span>
                </header>

                {isOpen && (
                  <ul className="divide-y">
                    {job.fixers.map((f) => (
                      <li key={String(f.id)} className="px-4 py-4">
                        <FixerCard f={f} />
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </main>
      </div>
    </div>
  );
}

/* ====== Componentes auxiliares ====== */

function TopNav() {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 bg-black rounded-sm inline-block" />
        <span className="font-semibold">Servineo</span>
      </div>
      <nav className="text-sm text-gray-600 flex items-center gap-6">
        <Link className="hover:underline" href="/ver-ofertas">
          Encontrar Fixers
        </Link>
        <Link className="hover:underline" href="/convertirse-fixer">
          Convertirse en fixer
        </Link>
        <Link className="hover:underline" href="/ayuda">
          Ayuda
        </Link>
      </nav>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="max-w-6xl mx-auto p-6 animate-pulse">
      <div className="h-5 w-48 bg-gray-200 rounded mb-3" />
      <div className="h-10 w-full bg-gray-200 rounded mb-6" />
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-3">
          <div className="h-64 w-full bg-gray-200 rounded" />
        </div>
        <div className="col-span-12 md:col-span-9 space-y-4">
          <div className="h-28 w-full bg-gray-200 rounded" />
          <div className="h-28 w-full bg-gray-200 rounded" />
          <div className="h-28 w-full bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

function FixerCard({ f }: { f: Fixer }) {
  return (
    <div className="flex items-start gap-4">
      <Avatar src={f.avatar} alt={f.name} />
      <div className="flex-1 space-y-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-medium">{f.name}</div>
            <div className="text-xs text-gray-500">{f.city ? `📍 ${f.city}` : null}</div>
            <div className="text-xs text-gray-600 flex items-center gap-1">
              {typeof f.rating === "number" ? <>⭐ {f.rating}</> : null}
              {typeof f.reviewsCount === "number" ? (
                <span>({f.reviewsCount} reseñas)</span>
              ) : null}
            </div>
          </div>
          <Link
            href={`/about_fixer/${f.id}`}
            className="shrink-0 rounded-full px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
          >
            Saber más
          </Link>
        </div>

        {Array.isArray(f.skills) && f.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {f.skills.map((s, i) => (
              <span
                key={`${String(s)}-${i}`}
                className="text-xs px-2 py-1 rounded-full bg-blue-50 border border-blue-200"
              >
                {String(s)}
              </span>
            ))}
          </div>
        )}

        {f.summary && <p className="text-sm text-gray-700 pt-1">{f.summary}</p>}
      </div>
    </div>
  );
}

function Avatar({ src, alt }: { src?: string | null; alt: string }) {
  return (
    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
      {/* <img> simple para evitar config extra de next/image */}
      {src ? <img src={src} alt={alt} /> : null}
    </div>
  );
}
