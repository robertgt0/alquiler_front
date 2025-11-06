import React from 'react';

import { Servicio } from '../types/usuario.types';

const ServicesList = ({ servicios }: { servicios?: Servicio[] }) => {
  return (
    <div className="mt-6 bg-white rounded-xl shadow p-6 border" style={{ borderColor: '#1769ff' }}>
      <h3 className="text-blue-600 font-semibold mb-4">Servicios Ofrecidos y Precios</h3>
      <div className="space-y-4">
        {(servicios || []).map((s, i) => (
          <div key={i} className="flex flex-col p-4 bg-white border rounded-lg hover:shadow-md transition-shadow" style={{ borderColor: '#1769ff' }}>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4M8 3v4"/></svg>
                </span>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-900 text-lg">
                    {s.nombre}
                  </span>
                  <span className="text-gray-600 text-sm mt-2">
                    {s.descripcion}
                  </span>
                </div>
              </div>
              <span className="text-blue-800 font-bold text-lg whitespace-nowrap ml-4">
                Bs. {Number(s.precio_personalizado ?? s.precio).toLocaleString('es-BO')}
              </span>
            </div>
          </div>
        ))}
        {(servicios || []).length === 0 && (
          <div className="text-gray-600">No hay servicios registrados.</div>
        )}
      </div>
    </div>
  );
};

export default ServicesList;
