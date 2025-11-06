// src/components/OffersBadge.tsx
'use client';

interface OffersBadgeProps {
  count: number;
  onClick?: () => void;
}

export default function OffersBadge({ count, onClick }: OffersBadgeProps) {
  if (count === 0) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-30 bg-red-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-red-600 transition-all hover:scale-110 animate-pulse"
    >
      <div className="flex flex-col items-center">
        <span className="text-xs font-bold">Nuevas</span>
        <span className="text-2xl font-bold">{count}</span>
      </div>
    </button>
  );
}