// app/trabajos-publicados/page.tsx
import Link from "next/link";

export default function TrabajosPublicadosPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold mb-3">Trabajos publicados</h1>
      <p className="text-gray-600 mb-8">
        Aquí ves anuncios o listados de trabajos. (Contenido de ejemplo)
      </p>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Explorar fixers</h2>
        <p className="text-gray-600 mb-4">
          ¿Quieres ver todos los fixers agrupados por trabajo?
        </p>
        <Link
          href="/fixers-por-trabajo"
          className="inline-flex items-center rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-black"
        >
          Ver fixers por trabajo →
        </Link>
      </div>
    </main>
  );
}
