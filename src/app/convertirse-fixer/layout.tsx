export default function ConvertirseFixerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f5f6fb]">
      <header className="w-full bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Izquierda: logo/nombre */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-black" />
            <span className="font-semibold">Servineo</span>
          </div>

          {/* Derecha: enlaces mock */}
          <nav className="text-sm text-gray-600 flex items-center gap-8">
            <a href="#" className="hover:text-black">Encontrar Fixers</a>
            <a href="/convertirse-fixer" className="text-black font-medium">Convertirse en Fixer</a>
            <a href="#" className="hover:text-black">Ayuda</a>
          </nav>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
