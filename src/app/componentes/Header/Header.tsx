import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-[#EEF7FF] shadow-md"> {/* Fondo del header: 50 */}
      <div className="flex items-center">
        {/* Logo */}
        <Link href="/">
            <Image
              src="/header_img/logo1.jpg"
              alt="Servineo Logo"
              width={40}
              height={40}
            />
        </Link>
        <span className="ml-2 text-xl font-bold text-[#11255A]">Servineo</span> {/* Color del texto del logo: 950 para contraste */}
      </div>

      {/* Barra de búsqueda */}
      <div className="flex-grow mx-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-4 py-2 pl-10 border border-[#D8ECFF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2a87ff] bg-white text-[#11255A]" // Borde: 100, Focus: 500, Fondo: blanco, Texto: 950
          />
          <svg
            className="absolute w-5 h-5 text-[#89C9FF] left-3 top-1/2 transform -translate-y-1/2" // Icono de búsqueda: 300
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
      </div>

      {/* Botones de acción y usuario */}
      <div className="flex items-center space-x-4">
        <button className="px-4 py-2 font-semibold text-white bg-[#2a87ff] rounded-md hover:bg-[#52ABFF]"> {/* Ser Fixer: Fondo 500, Hover 400 */}
          Ser Fixer
        </button>
        <svg
            className="w-8 h-8 text-[#1140BC] cursor-pointer" // Icono de usuario: 800
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            ></path>
        </svg>
        <Link href="/login">
          <button className="px-4 py-2 font-semibold text-[#2a87ff] border border-[#2a87ff] rounded-md hover:bg-[#EEF7FF]"> {/* Iniciar Sesión: Texto y Borde 500, Hover 50 */}
            Iniciar Sesión
          </button>
        </Link>
        <Link href="/register">
          <button className="px-4 py-2 font-semibold text-white bg-[#2a87ff] rounded-md hover:bg-[#52ABFF]"> {/* Registrarse: Fondo 500, Hover 400 */}
            Registrarse
          </button>
        </Link>
      </div>
    </header>
  );
}
