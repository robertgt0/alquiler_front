'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import Icono from './Icono';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Header() {
  const [isClient, setIsClient] = useState(false);
  const [areButtonsVisible, setAreButtonsVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<{ nombre: string; fotoPerfil: string } | null>(null);
  const lastScrollY = useRef(0);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);

    // Verificar si hay un token de sesión y datos de usuario al cargar el componente
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const storedUserData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
    
    if (token && storedUserData) {
      setIsLoggedIn(true);
      try {
        const user = JSON.parse(storedUserData);
        setUserData({
          nombre: user.nombre || user.name || 'Usuario',
          fotoPerfil: user.fotoPerfil || user.picture || '/default-avatar.png'
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUserData({
          nombre: 'Usuario',
          fotoPerfil: '/default-avatar.png'
        });
      }
    }

    const handleScroll = () => {
      if (window.innerWidth < 640) {
        setAreButtonsVisible(window.scrollY <= lastScrollY.current || window.scrollY === 0);
        lastScrollY.current = window.scrollY;
      }
    };

    // Escuchar evento de login exitoso
    const handleLoginExitoso = () => {
      setIsLoggedIn(true);
      const storedUserData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
      if (storedUserData) {
        try {
          const user = JSON.parse(storedUserData);
          setUserData({
            nombre: user.nombre || user.name || 'Usuario',
            fotoPerfil: user.fotoPerfil || user.picture || '/default-avatar.png'
          });
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    };

    // Escuchar evento de logout
    const handleLogoutEvent = () => {
      setIsLoggedIn(false);
      setUserData(null);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('login-exitoso', handleLoginExitoso);
    window.addEventListener('logout-exitoso', handleLogoutEvent);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('login-exitoso', handleLoginExitoso);
      window.removeEventListener('logout-exitoso', handleLogoutEvent);
    };
  }, []);

  // Ocultar barra de búsqueda en login y registro
  const shouldShowSearchBar = !['/login', '/registro'].includes(pathname);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      router.push('/404');
    }
  };

  const handleLogout = () => {
    // Limpiar almacenamiento local
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('userData');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('refreshToken');
    
    // Actualizar estado
    setIsLoggedIn(false);
    setUserData(null);
    
    // Disparar evento de logout
    const eventLogout = new CustomEvent("logout-exitoso");
    window.dispatchEvent(eventLogout);
    
    // Redirigir a home
    router.push('/');
  };

  if (!isClient) return null;

  return (
    <>
      {/* HEADER DESKTOP / TABLET */}
      <header className="hidden sm:flex items-center justify-between p-4 bg-[#EEF7FF] shadow-md fixed top-0 left-0 w-full z-50">
        {/* LOGO */}
        <div className="flex items-center">
          <Link href="/">
            <Icono size={40} />
          </Link>
          <span className="ml-2 text-xl font-bold text-[#11255A]">Servineo</span>
        </div>

        {/* BARRA DE BÚSQUEDA - Solo mostrar si no estamos en login/registro */}
        {shouldShowSearchBar && (
          <div className="grow mx-8">
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
        )}

        {/* Si estamos en login/registro, centrar los elementos */}
        {!shouldShowSearchBar && <div className="grow"></div>}

        {/* ELEMENTOS DEL HEADER */}
        <div className="flex items-center space-x-4">
          {!isLoggedIn ? (
            <>
              <Link href="/ser-fixer">
                <button className="px-4 py-2 font-semibold text-[#ffffff] bg-[#2a87ff] rounded-md hover:bg-[#1a347a] transition-colors">
                  Ser Fixer
                </button>
              </Link>

              <Link href="/login">
                <button className="px-4 py-2 font-semibold text-[#2a87ff] border border-[#2a87ff] rounded-md hover:bg-[#EEF7FF] transition-colors">
                  Iniciar Sesión
                </button>
              </Link>

              <Link href="/registro">
                <button className="px-4 py-2 font-semibold text-white bg-[#2a87ff] rounded-md hover:bg-[#52ABFF] transition-colors">
                  Registrarse
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/ser-fixer">
                <button className="px-4 py-2 font-semibold text-[#ffffff] bg-[#2a87ff] rounded-md hover:bg-[#1a347a] transition-colors">
                  Ser Fixer
                </button>
              </Link>
              
              {/* USUARIO LOGUEADO - Mostrar nombre y foto */}
              <div className="flex items-center space-x-3">
                <span className="font-semibold text-[#11255A]">
                  {userData?.nombre || 'Usuario'}
                </span>
                <div className="relative group">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#2a87ff]">
                    {/* ✅ CORRECCIÓN: Usar next/image */}
                    <Image
                      src={userData?.fotoPerfil || '/default-avatar.png'}
                      alt="Foto de perfil"
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Si la imagen falla al cargar, usar un ícono por defecto
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiMyYTg3ZmYiLz4KPHBhdGggZD0iTTIwIDIyQzIyLjIwOTEgMjIgMjQgMjAuMjA5MSAyNCAxOEMyNCAxNS43OTA5IDIyLjIwOTEgMTQgMjAgMTRDMTcuNzkwOSAxNCAxNiAxNS43OTA5IDE2IDE4QzE2IDIwLjIwOTEgMTcuNzkwOSAyMiAyMCAyMloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yMCAyNEMxNS41ODIyIDI0IDEyIDI2LjY4MjIgMTIgMzBWMzRIMjhWMzBDMjggMjYuNjgyMiAyNC40MTc4IDI0IDIwIDI0WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+';
                      }}
                    />
                  </div>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-200">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                      </svg>
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      {/* HEADER MÓVIL SUPERIOR */}
      <header className="sm:hidden fixed top-0 left-0 w-full p-2 bg-[#EEF7FF] shadow-md z-50">
        <div className="flex items-center space-x-2 w-full">
          <Link href="/">
            <Icono size={28} />
          </Link>
          {/* BARRA DE BÚSQUEDA MÓVIL - Solo mostrar si no estamos en login/registro */}
          {shouldShowSearchBar && (
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
          )}
          {/* Si estamos en login/registro, ocupar el espacio restante */}
          {!shouldShowSearchBar && <div className="flex-1"></div>}
        </div>
      </header>

      {/* FOOTER MÓVIL INFERIOR */}
      <footer
        className={`sm:hidden fixed bottom-0 left-0 w-full px-3 py-2 bg-[#EEF7FF] shadow-md z-50 
        transform transition-transform duration-300 ease-in-out
        ${areButtonsVisible ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="flex flex-col items-center space-y-1">
          <span className="text-[#11255A] font-bold text-sm">Servineo</span>

          {!isLoggedIn ? (
            <div className="flex w-full space-x-1">
              <Link href="/login" className="flex-1">
                <button className="w-full px-2 py-1.5 font-semibold text-[#2a87ff] border border-[#2a87ff] rounded-md hover:bg-[#EEF7FF] text-xs">
                  Iniciar Sesión
                </button>
              </Link>

              <Link href="/registro" className="flex-1">
                <button className="w-full px-2 py-1.5 font-semibold text-white bg-[#2a87ff] rounded-md hover:bg-[#52ABFF] text-xs">
                  Registrarse
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-1 w-full">
              <Link href="/ser-fixer" className="flex-1">
                <button className="w-full px-2 py-1.5 text-xs font-semibold text-white bg-[#2a87ff] rounded-md hover:bg-[#1a347a]">
                  Ser Fixer
                </button>
              </Link>
              
              {/* USUARIO LOGUEADO MÓVIL */}
              <div className="flex items-center space-x-1 flex-1 justify-end">
                <span className="text-[#11255A] text-xs font-semibold truncate max-w-20">
                  {userData?.nombre || 'Usuario'}
                </span>
                <div className="relative group">
                  <div className="w-6 h-6 rounded-full overflow-hidden border border-[#2a87ff]">
                    {/* ✅ CORRECCIÓN: Usar next/image */}
                    <Image
                      src={userData?.fotoPerfil || '/default-avatar.png'}
                      alt="Foto de perfil"
                      width={24}
                      height={24}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9IiMyYTg3ZmYiLz4KPHBhdGggZD0iTTEyIDE0QzEzLjY1NjkgMTQgMTUgMTIuNjU2OSAxNSAxMUMxNSA5LjM0MzE1IDEzLjY1NjkgOCAxMiA4QzEwLjM0MzEgOCA5IDkuMzQzMTUgOSAxMUM5IDEyLjY1NjkgMTAuMzQzMSAxNCAxMiAxNFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xMiAxNkM5LjM0MzE1IDE2IDcgMTcuNzg5MyA3IDIwVjIySDE3VjIwQzE3IDE3Ljc4OTMgMTQuNjU2OSAxNiAxMiAxNloiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPg==';
                      }}
                    />
                  </div>
                  <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-200">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 flex items-center space-x-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                      </svg>
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </footer>

      {/* Espacio para el header fijo */}
      <div className="h-16 sm:h-0"></div>
    </>
  );
}