'use client';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        {/* Izquierda: logo + nombre */}
        <Link href="/" className="flex items-center gap-2">
          {/* Ícono simple */}
          <span className="grid h-8 w-8 place-items-center rounded-md bg-gray-900 text-white">
            ▦
          </span>
          <span className="text-[18px] font-semibold tracking-tight text-gray-900">
            Servineo
          </span>
        </Link>

        {/* Derecha: menú */}
        <nav className="hidden gap-6 text-sm text-gray-700 md:flex">
          <Link href="/fixers" className="hover:text-gray-900">
            Encontrar Fixers
          </Link>
          <Link href="/fixer" className="hover:text-gray-900">
            Fixer
          </Link>
          <Link
            href="/mis-ofertas"
            className="font-medium text-gray-900 hover:opacity-90"
          >
            Mis Ofertas
          </Link>
          <Link href="/ayuda" className="hover:text-gray-900">
            Ayuda
          </Link>
        </nav>
      </div>
    </header>
  );
}
