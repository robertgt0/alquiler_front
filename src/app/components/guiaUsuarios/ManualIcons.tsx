// src/app/components/guiaUsuarios/GuiaIcons.tsx

// Sin cambios, hereda el color del texto del botón.
export const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.28a.75.75 0 011.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
    </svg>
);

// CAMBIO: Se quitó 'text-gray-400' para que herede el color del padre (ej. text-blue-500).
export const HomeHammerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 transition-transform duration-300 ease-in-out group-hover:scale-110">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
);
// ... (resto de iconos con el mismo cambio: eliminar text-gray-400)

export const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);
export const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.31h5.513c.498 0 .703.656.336.94l-4.204 3.055a.563.563 0 00-.19.505l1.503 4.879a.562.562 0 01-.822.62l-4.444-3.232a.563.563 0 00-.65 0l-4.444 3.232a.562.562 0 01-.822-.62l1.503-4.879a.563.563 0 00-.19-.505l-4.204-3.055a.563.563 0 01.336-.94h5.513a.563.563 0 00.475-.31l2.125-5.111z" />
    </svg>
);

export const BriefcaseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.075c0 1.313-.863 2.386-1.925 2.386H5.675c-1.062 0-1.925-1.073-1.925-2.386V14.15m12.325 0V11.96c0-1.313-.863-2.386-1.925-2.386h-1.95c-1.062 0-1.925 1.073-1.925 2.386v2.19M9.75 14.15V11.96c0-1.313.863-2.386 1.925-2.386h.008c1.062 0 1.925 1.073 1.925 2.386v2.19" />
    </svg>
);

export const UserPlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.5 21c-2.3 0-4.4-1.343-5.5-3.265z" />
    </svg>
);

export const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-3.86 8.25-8.625 8.25a9.065 9.065 0 01-4.25-1.125c.917.398 1.909.625 2.959.625 5.25 0 9.375-3.09 9.375-7.125S17.25 4.875 12 4.875c-1.05 0-2.042.227-2.959.625a9.065 9.065 0 01-4.25-1.125C3.86 3.75 0 7.444 0 12c0 4.034 3.033 7.377 7.006 7.901a.75.75 0 11.23 1.48C3.04 20.36 0 16.59 0 12z" />
    </svg>
);