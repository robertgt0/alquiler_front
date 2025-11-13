'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, HelpCircle, BookOpen, X } from 'lucide-react';

export default function HelpButton() {
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleWhatsApp = () => {
    window.open('https://wa.me/59160379823?text=Hola%20necesito%20ayuda', '_blank');
    setIsMenuOpen(false);
  };

  const handleFAQ = () => {
    window.location.href = '/preguntas-frecuentes';
    setIsMenuOpen(false);
  };

  const handleHelpCenter = () => {
    window.location.href = '/centro-de-ayuda';
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className="fixed z-[100] bottom-20 right-6 md:bottom-24 md:right-8" ref={menuRef}>
      {isMenuOpen && (
        <div className="absolute bottom-full right-0 mb-3 bg-white rounded-2xl shadow-2xl overflow-hidden w-64">
          <div className="bg-gradient-to-r from-[#2a87ff] to-[#1366fd] px-4 py-3 flex items-center justify-between">
            <h3 className="text-white font-semibold text-sm">Como podemos ayudarte</h3>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
              aria-label="Cerrar menu"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="py-2">
            <button
              onClick={handleWhatsApp}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-50 transition-colors text-left group"
            >
              <div className="bg-green-500 p-2 rounded-full group-hover:scale-110 transition-transform">
                <MessageCircle className="text-white" size={20} strokeWidth={2.5} />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">WhatsApp</p>
                <p className="text-xs text-gray-500">Chat directo con soporte</p>
              </div>
            </button>

            <button
              onClick={handleFAQ}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-50 transition-colors text-left group"
            >
              <div className="bg-orange-500 p-2 rounded-full group-hover:scale-110 transition-transform">
                <HelpCircle className="text-white" size={20} strokeWidth={2.5} />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">Preguntas Frecuentes</p>
                <p className="text-xs text-gray-500">Encuentra respuestas rapidas</p>
              </div>
            </button>

            <button
              onClick={handleHelpCenter}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-50 transition-colors text-left group"
            >
              <div className="bg-blue-500 p-2 rounded-full group-hover:scale-110 transition-transform">
                <BookOpen className="text-white" size={20} strokeWidth={2.5} />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">Centro de Ayuda</p>
                <p className="text-xs text-gray-500">Guias y tutoriales</p>
              </div>
            </button>
          </div>
        </div>
      )}

      <button 
        onClick={toggleMenu}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Necesitas ayuda"
        className="group relative flex items-center gap-3 bg-gradient-to-r from-[#2a87ff] to-[#1366fd] hover:from-[#1366fd] hover:to-[#0d4db8] text-white transition-all duration-300 ease-in-out rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
        
        <div className="relative flex items-center gap-3 px-4 py-3 md:px-5 md:py-3.5">
          <div className="flex items-center justify-center transition-transform duration-300">
            <MessageCircle 
              className="text-white drop-shadow-md" 
              size={24} 
              strokeWidth={2.5} 
              fill="currentColor"
            />
          </div>
          
          <span className="hidden sm:inline-block font-semibold text-sm md:text-base tracking-wide drop-shadow-sm">
            Necesitas ayuda
          </span>
        </div>

        <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#52abff] rounded-full border-2 border-white animate-pulse" />
      </button>

      {isHovered && !isMenuOpen && (
        <div className="sm:hidden absolute bottom-full right-0 mb-2 bg-[#0d1b3d] text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
          Necesitas ayuda
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#0d1b3d]" />
        </div>
      )}
    </div>
  );
}
