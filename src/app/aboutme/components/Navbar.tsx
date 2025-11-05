export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-sm bg-gray-900" />
          <span className="font-semibold">Servineo</span>
        </div>

        <ul className="hidden md:flex items-center gap-8 text-sm text-gray-600">
          <li><a href="#" className="hover:text-gray-900">Encontrar Fixers</a></li>
          <li><a href="#" className="hover:text-gray-900">Convertirse en Fixer</a></li>
          <li><a href="#" className="hover:text-gray-900">Ayuda</a></li>
        </ul>

        <button className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border">
          <span className="sr-only">Abrir menú</span> ☰
        </button>
      </nav>
    </header>
  );
}
