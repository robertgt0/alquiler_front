// src/components/NewOffersNotification.tsx
'use client';

import { useState, useEffect } from 'react';
import { Bell, X, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface NewOffersNotificationProps {
  count: number;
  onDismiss: () => void;
  onViewOffers: () => void;
}

export default function NewOffersNotification({
  count,
  onDismiss,
  onViewOffers,
}: NewOffersNotificationProps) {
  const [show, setShow] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (count > 0) {
      setShow(true);
    }
  }, [count]);

  if (!show || count === 0) return null;

  const handleView = () => {
    setShow(false);
    onViewOffers();
    router.push('/agenda'); // Redirige a la página de ofertas
  };

  const handleDismiss = () => {
    setShow(false);
    onDismiss();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
        onClick={handleDismiss}
      />

      {/* Notificación */}
      <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 duration-300">
        <div className="bg-white rounded-xl shadow-2xl border-2 border-blue-500 p-6 max-w-md">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Bell className="w-6 h-6 text-blue-600 animate-bounce" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  ¡Nuevas ofertas disponibles!
                </h3>
                <p className="text-sm text-gray-600">
                  {count} {count === 1 ? 'oferta nueva' : 'ofertas nuevas'}
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <p className="text-gray-700 mb-4">
            Se {count === 1 ? 'ha publicado' : 'han publicado'}{' '}
            <span className="font-semibold text-blue-600">{count}</span> nueva
            {count === 1 ? '' : 's'} oferta{count === 1 ? '' : 's'} de trabajo
            en los últimos 15 minutos.
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleView}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 font-medium"
            >
              Ver ofertas
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}