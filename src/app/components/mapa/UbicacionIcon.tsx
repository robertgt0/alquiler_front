// components/UbicacionIcon.tsx
import React from "react";

export default function UbicacionIcon({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Ubicación"
      className="relative w-[40px] h-[40px] rounded-full bg-gradient-to-b from-[#1d6dfd] to-[#0e4cb8] border-[3px] border-white flex items-center justify-center shadow-[0_4px_8px_rgba(0,0,0,0.3)] hover:scale-110 transition-transform"
    >
      <div className="absolute inset-0 rounded-full bg-white scale-[0.8] flex items-center justify-center shadow-inner">
        <svg
          width="20"
          height="20"
          fill="#1d6dfd"
          viewBox="0 0 24 24"
        >
          <path d="M22.7 19.3l-5.4-5.4c.9-1.4 1.4-3 1.4-4.9 0-5-4-9-9-9S.7 4 0 9c0 5 4 9 9 9 1.8 0 3.5-.5 4.9-1.4l5.4 5.4c.4.4 1 .4 1.4 0l1-1c.5-.4.5-1 .1-1.4zM9 15c-3.3 0-6-2.7-6-6S5.7 3 9 3s6 2.7 6 6-2.7 6-6 6z"/>
        </svg>
      </div>
    </button>
  );
}
