'use client';

import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';

export default function HelpButton() {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    window.open('https://wa.me/59160379823?text=Hola%20necesito%20ayuda', '_blank');
  };

  return (
  // Moved up to avoid covering footer buttons / social icons
  <div className="fixed z-50 bottom-20 right-6 md:bottom-24 md:right-8">
      <button 
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="¿Necesitas ayuda? Contáctanos por WhatsApp"
        className="group relative flex items-center gap-3 bg-gradient-to-r from-[#2a87ff] to-[#1366fd] hover:from-[#1366fd] hover:to-[#0d4db8] text-white transition-all duration-300 ease-in-out rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
        
        <div className="relative flex items-center gap-3 px-4 py-3 md:px-5 md:py-3.5">
          <div className={`flex items-center justify-center transition-transform duration-300 ${isHovered ? 'rotate-12 scale-110' : ''}`}>
            <MessageCircle 
              className="text-white drop-shadow-md" 
              size={24} 
              strokeWidth={2.5} 
              fill="currentColor"
            />
          </div>
          
          <span className="hidden sm:inline-block font-semibold text-sm md:text-base tracking-wide drop-shadow-sm">
            ¿Necesitas ayuda?
          </span>
        </div>

        <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#52abff] rounded-full border-2 border-white animate-pulse" />
      </button>

      {isHovered && (
        <div className="sm:hidden absolute bottom-full right-0 mb-2 bg-[#0d1b3d] text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap animate-fade-in">
          ¿Necesitas ayuda?
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#0d1b3d]" />
        </div>
      )}
    </div>
  );
}