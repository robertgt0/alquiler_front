'use client';

import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, BookOpen, Headphones, Phone } from 'lucide-react';

export default function HelpButton() {
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
    <div className="fixed z-[100] bottom-20 right-6 flex flex-col items-end gap-3" ref={menuRef}>
      {/* Menú desplegable - solo FAQ y Centro de Ayuda */}
      {isMenuOpen && (
        <div className="bg-white rounded-xl shadow-xl overflow-hidden w-60 animate-in slide-in-from-bottom-5 fade-in duration-200 border border-gray-100">
          <div className="py-1">
            <button
              onClick={handleFAQ}
              className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-orange-50 transition-all text-left group"
            >
              <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-2 rounded-full group-hover:scale-105 transition-transform">
                <HelpCircle className="text-white" size={18} strokeWidth={2.5} />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">Preguntas Frecuentes</p>
                <p className="text-xs text-gray-500">Respuestas rápidas</p>
              </div>
            </button>

            <button
              onClick={handleHelpCenter}
              className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-blue-50 transition-all text-left group"
            >
              <div className="bg-gradient-to-br from-[#2a87ff] to-[#1366fd] p-2 rounded-full group-hover:scale-105 transition-transform">
                <BookOpen className="text-white" size={18} strokeWidth={2.5} />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">Centro de Ayuda</p>
                <p className="text-xs text-gray-500">Guías y tutoriales</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Botón de soporte - azul de la app */}
      <button 
        onClick={toggleMenu}
        aria-label="Soporte"
        className="w-14 h-14 bg-gradient-to-br from-[#2a87ff] to-[#1366fd] hover:from-[#1366fd] hover:to-[#0d4db8] text-white transition-all duration-200 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center"
      >
        <Headphones size={24} strokeWidth={2} />
      </button>

      {/* Botón de WhatsApp */}
      <button 
        onClick={handleWhatsApp}
        aria-label="WhatsApp"
        className="w-14 h-14 bg-gradient-to-br from-[#25D366] to-[#128C7E] hover:from-[#20BA5A] hover:to-[#0F7A6C] text-white transition-all duration-200 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center"
      >
        <Phone size={24} strokeWidth={2} fill="currentColor" />
      </button>
    </div>
  );
}
