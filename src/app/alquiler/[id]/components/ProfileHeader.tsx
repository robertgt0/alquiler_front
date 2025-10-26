import React from 'react';

type Props = {
  nombre?: string;
  servicios?: any[];
  activo?: boolean;
  fecha_registro?: string;
  avatarUrl?: string;
  rating?: number | string;
};

const ProfileHeader = ({ nombre, servicios, activo, fecha_registro, avatarUrl, rating }: Props) => {
  const postedDate = fecha_registro ? new Date(fecha_registro).toLocaleDateString() : '';

  // Avatar: si no hay imagen, mostrar iniciales
  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
  <div className="bg-white rounded-xl shadow p-6 border" style={{ borderColor: '#1769ff' }}>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-blue-500 flex items-center justify-center bg-blue-50 text-blue-600 text-4xl font-bold select-none">
          {avatarUrl ? (
            <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <span>{getInitials(nombre)}</span>
          )}
        </div>
        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-300">{nombre || 'Sin nombre'}</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1 text-base">{(servicios && servicios.length > 0 && servicios[0].nombre) || 'Servicios'}</p>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 sm:mt-0">Registrado: {postedDate}</div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{activo ? 'Disponible' : 'No disponible'}</span>
            <span className="flex items-center gap-1 text-yellow-500 font-semibold">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg>
              {rating ?? '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
