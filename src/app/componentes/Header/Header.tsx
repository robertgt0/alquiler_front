'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export default function Header() {
  // Ahora, esta variable controlará SOLO la visibilidad de los botones inferiores.
  const [areButtonsVisible, setAreButtonsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    const handleScroll = () => {
      // Solo aplicar la lógica si ya estamos en el cliente y en pantalla móvil
      if (isMounted.current && window.innerWidth < 640) {
        if (window.scrollY > lastScrollY.current) {
          // Scrolling hacia abajo: Ocultar botones
          setAreButtonsVisible(false);
        } else {
          // Scrolling hacia arriba: Mostrar botones
          setAreButtonsVisible(true);
        }
        lastScrollY.current = window.scrollY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  return (
    <>
      {/* ---------------------------------------------------- */}
      {/* HEADER PARA DESKTOP / TABLET (No requiere cambios) */}
      {/* ---------------------------------------------------- */}
      <header className="hidden sm:flex items-center justify-between p-4 bg-[#EEF7FF] shadow-md fixed top-0 left-0 w-full z-10">
        <div className="flex items-center">
          <Link href="/">
              <Image
                src="/header_img/logo2.jpg"
                alt="Servineo Logo"
                width={40}
                height={40}
              />
          </Link>
          <span className="ml-2 text-xl font-bold text-[#11255A]">Servineo</span>
        </div>

        {/* Barra de búsqueda (Desktop) */}
        <div className="flex-grow mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
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

        {/* Botones de acción y usuario (Desktop) */}
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 font-semibold text-white bg-[#2a87ff] rounded-md hover:bg-[#52ABFF]">
            Ser Fixer
          </button>
          <svg
              className="w-8 h-8 text-[#1140BC] cursor-pointer"
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
            <button className="px-4 py-2 font-semibold text-[#2a87ff] border border-[#2a87ff] rounded-md hover:bg-[#EEF7FF]">
              Iniciar Sesión
            </button>
          </Link>
          <Link href="/register">
            <button className="px-4 py-2 font-semibold text-white bg-[#2a87ff] rounded-md hover:bg-[#52ABFF]">
              Registrarse
            </button>
          </Link>
        </div>
      </header>

      {/* ---------------------------------------------------- */}
      {/* HEADER MÓVIL SUPERIOR (Logo + Buscador - SIEMPRE FIJO ARRIBA) */}
      {/* ---------------------------------------------------- */}
      <header
        className="sm:hidden fixed top-0 left-0 w-full p-4 bg-[#EEF7FF] shadow-md z-10"
      >
        <div className="flex flex-col items-center space-y-3">
          {/* Logo y Nombre */}
          <div className="flex items-center justify-start w-full px-2">
            <Link href="/">
              <Image
                src="/header_img/logo1.jpg"
                alt="Servineo Logo"
                width={30}
                height={30}
              />
            </Link>
            <span className="ml-2 text-lg font-bold text-[#11255A]">Servineo</span>
          </div>

          {/* Barra de búsqueda */}
          <div className="w-full px-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full px-4 py-2 pl-10 border border-[#D8ECFF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2a87ff] bg-white text-[#11255A] text-sm"
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
        </div>
      </header>
      
      {/* ---------------------------------------------------- */}
      {/* FOOTER MÓVIL (Botones de Sesión - FIJO ABAJO y OCULTABLE) */}
      {/* ---------------------------------------------------- */}
      <footer
        className={`
          sm:hidden fixed bottom-0 left-0 w-full p-4 bg-[#EEF7FF] shadow-md z-20 // z-20 para estar encima del header superior
          transform transition-transform duration-300 ease-in-out
          ${areButtonsVisible ? 'translate-y-0' : 'translate-y-full'} // Animación abajo para ocultar/mostrar
        `}
      >
        <div className="flex w-full space-x-2">
          <Link href="/login" className="flex-1">
            <button className="px-4 py-2 font-semibold text-[#2a87ff] border border-[#2a87ff] rounded-md hover:bg-[#EEF7FF] w-full text-sm">
              Iniciar Sesión
            </button>
          </Link>
          <Link href="/register" className="flex-1">
            <button className="px-4 py-2 font-semibold text-white bg-[#2a87ff] rounded-md hover:bg-[#52ABFF] w-full text-sm">
              Registrarse
            </button>
          </Link>
        </div>
      </footer>
    </>
  );
}