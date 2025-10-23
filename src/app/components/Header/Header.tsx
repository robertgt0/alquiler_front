// components/Header/Header.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import Icono from './Icono';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isClient, setIsClient] = useState(false);
  const [areButtonsVisible, setAreButtonsVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const lastScrollY = useRef(0);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);

    const handleScroll = () => {
      if (window.innerWidth < 640) {
        setAreButtonsVisible(window.scrollY <= lastScrollY.current || window.scrollY === 0);
        lastScrollY.current = window.scrollY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 🔹 Manejo de búsqueda: al presionar Enter → Error 404
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      router.push('/404');
    }
  };

  // 🔹 Simulación de iniciar sesión + pedir ubicación + notificar login
  const handleLogin = () => {
    setIsLoggedIn(true);

    // ✅ Emitir evento para geolocalización
    const eventGeo = new CustomEvent("solicitar-geolocalizacion");
    window.dispatchEvent(eventGeo);
    
    // ✅ NUEVO: Emitir evento para notificar login exitoso al MapaWrapper
    const eventLogin = new CustomEvent("login-exitoso");
    window.dispatchEvent(eventLogin);
  };

  if (!isClient) return null;

  return (
    <>
      {/* ========================= */}
      {/* HEADER DESKTOP / TABLET */}
      {/* ========================= */}
      <header className="hidden sm:flex items-center justify-between p-4 bg-[#EEF7FF] shadow-md fixed top-0 left-0 w-full z-10">
        {/* 🔹 LOGO */}
        <div className="flex items-center">
          <Link href="/">
            <Icono size={40} />
          </Link>
          <span className="ml-2 text-xl font-bold text-[#11255A]">Servineo</span>
        </div>

        {/* 🔹 BARRA DE BÚSQUEDA */}
        <div className="flex-grow mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar"
              onKeyDown={handleSearch}
              className="w-full px-4 py-2 pl-10 border border-[#D8ECFF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2a87ff] bg-white text-[#11255A]"
            />
            <svg
              className="absolute w-5 h-5 text-[#89C9FF] left-3 top-1/2 transform -translate-y-1/2"
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

        {/* 🔹 ELEMENTOS DEL HEADER (CAMBIAN SI SE INICIA SESIÓN) */}
        <div className="flex items-center space-x-4">
          {!isLoggedIn ? (
            <>
              <Link href="/ser-fixer">
                <button className="px-4 py-2 font-semibold text-[#ffffff] bg-[#2a87ff] rounded-md hover:bg-[#1a347a]">
                  Ser Fixer
                </button>
              </Link>

              <button
                onClick={handleLogin}
                className="px-4 py-2 font-semibold text-[#2a87ff] border border-[#2a87ff] rounded-md hover:bg-[#EEF7FF]"
              >
                Iniciar Sesión
              </button>

              <Link href="/register">
                <button className="px-4 py-2 font-semibold text-white bg-[#2a87ff] rounded-md hover:bg-[#52ABFF]">
                  Registrarse
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/ser-fixer">
                <button className="px-4 py-2 font-semibold text-[#ffffff] bg-[#2a87ff] rounded-md hover:bg-[#1a347a]">
                  Ser Fixer
                </button>
              </Link>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-[#11255A]">Nombre de Usuario</span>
                <svg
                  className="w-8 h-8 text-[#2a87ff]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              </div>
            </>
          )}
        </div>
      </header>

      {/* ========================= */}
      {/* HEADER MÓVIL SUPERIOR */}
      {/* ========================= */}
      <header className="sm:hidden fixed top-0 left-0 w-full p-2 bg-[#EEF7FF] shadow-md z-10">
        <div className="flex items-center space-x-2 w-full">
          <Link href="/">
            <Icono size={28} />
          </Link>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Buscar"
              onKeyDown={handleSearch}
              className="w-full px-3 py-1.5 pl-9 border border-[#D8ECFF] rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-[#2a87ff] bg-white text-[#11255A]"
            />
            <svg
              className="absolute w-4 h-4 text-[#89C9FF] left-2.5 top-1/2 transform -translate-y-1/2"
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
      </header>

      {/* ========================= */}
      {/* FOOTER MÓVIL INFERIOR */}
      {/* ========================= */}
      <footer
        className={`sm:hidden fixed bottom-0 left-0 w-full px-3 py-2 bg-[#EEF7FF] shadow-md z-20 
        transform transition-transform duration-300 ease-in-out
        ${areButtonsVisible ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="flex flex-col items-center space-y-1">
          <span className="text-[#11255A] font-bold text-sm">Servineo</span>

          {!isLoggedIn ? (
            <div className="flex w-full space-x-1">
              <button
                onClick={handleLogin}
                className="flex-1 px-2 py-1.5 font-semibold text-[#2a87ff] border border-[#2a87ff] rounded-md hover:bg-[#EEF7FF] w-full text-xs"
              >
                Iniciar Sesión
              </button>

              <Link href="/register" className="flex-1">
                <button className="px-2 py-1.5 font-semibold text-white bg-[#2a87ff] rounded-md hover:bg-[#52ABFF] w-full text-xs">
                  Registrarse
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <Link href="/ser-fixer">
                <button className="px-2 py-1 text-xs font-semibold text-white bg-[#2a87ff] rounded-md hover:bg-[#1a347a]">
                  Ser Fixer
                </button>
              </Link>
              <span className="text-[#11255A] text-xs font-semibold">Nombre de Usuario</span>
              <svg
                className="w-5 h-5 text-[#2a87ff]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            </div>
          )}
        </div>
      </footer>
    </>
  );
}