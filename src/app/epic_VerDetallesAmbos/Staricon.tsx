// src/app/epic_VerDetallesAmbos/components/StarIcon.tsx
'use client';

// Un componente simple para el ícono de la estrella
// 'filled' determina si se muestra la estrella llena (amarilla) o vacía (gris)
export function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="36"
      height="36"
      className={`
        ${filled ? 'text-yellow-400' : 'text-gray-300'}
        transition-colors duration-150
      `}
      fill="currentColor"
    >
      <path d="M12 17.27l-5.18 2.73 1-5.77-4.2-3.83 5.8-.84L12 4.6l2.58 5.66 5.8.84-4.2 3.83 1 5.77z" />
    </svg>
  );
}