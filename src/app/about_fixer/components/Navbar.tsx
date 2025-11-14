export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 shadow-sm">
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-sm bg-gray-900 dark:bg-gray-200" />
          <span className="font-semibold text-gray-900 dark:text-gray-100">Servineo</span>
        </div>

        <ul className="hidden md:flex items-center gap-8 text-sm text-gray-600 dark:text-gray-300">
          <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Encontrar Fixers</a></li>
          <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Convertirse en Fixer</a></li>
          <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Ayuda</a></li>
        </ul>

        <button className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 dark:border-gray-600">
          <span className="sr-only">Abrir menú</span> ☰
        </button>
      </nav>
    </header>
  );
}