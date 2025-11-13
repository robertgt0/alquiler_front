// src/app/perfil_proveedor_provisional/perfilProveedorProvisional.tsx


import Link from 'next/link';
// Ya no necesitamos la interfaz de props

// No recibe props, por lo que no necesita el tipo React.FC<Props>
const ProveedorPerfilProvisional = () => {
  // Definimos la ruta de navegación internamente, ya que no es una prop.
  const RUTA_CALIFICACIONES = '/vendedor_ratings';

  return (
    <div className="p-6 bg-white max-w-lg mx-auto shadow-lg rounded-xl">
      {/* Título Principal (Texto Fijo de la Imagen) */}
      <h1 className="text-3xl font-extrabold text-blue-700 uppercase tracking-wider mb-4">
        PERFIL DEL PROVEEDOR
      </h1>

      {/* Subtítulo (Texto Fijo de la Imagen) */}
      <p className="text-xl text-gray-800 mb-8">
        Información del proveedor
      </p>

      {/* Botón de Navegación (Ruta y Texto Fijo) */}
      <Link href={RUTA_CALIFICACIONES} passHref legacyBehavior={false}>
        <div className="w-full">
          <button
            className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
            aria-label="Ir a Calificaciones del Proveedor"
          >
            Calificaciones del Proveedor
          </button>
        </div>
      </Link>
    </div>
  );
};

export default ProveedorPerfilProvisional;