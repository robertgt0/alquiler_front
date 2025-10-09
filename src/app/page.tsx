import Carousel from './components/Carousel/Carousel';
import Image from "next/image"; // Mantenemos la importación de Next/Image por si la usas en otro lugar

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      
      {/* Header (Ejemplo de barra de navegación usando Tailwind) */}
      <header className="py-4 shadow-lg bg-white dark:bg-gray-800 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
            Alquiler App
          </h1>
          <nav className="space-x-4">
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">Inicio</a>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">Propiedades</a>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">Contacto</a>
          </nav>
        </div>
      </header>
      
      <main className="pt-8 pb-20">
        <div className="max-w-7xl mx-auto">
          
          {/* Título de la Sección del Carrusel */}
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-800 dark:text-gray-100">
            Propiedades Destacadas
          </h2>

          {/* === APLICACIÓN DEL CARRUSEL === */}
          <Carousel /> 
          {/* ============================== */}

          {/* Sección de Contenido Adicional */}
          <section className="mt-12 p-6 mx-4 sm:mx-6 lg:mx-8 bg-white dark:bg-gray-800 rounded-xl shadow-xl">
            <h3 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-gray-100">
              Bienvenido
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              El componente de carrusel ha sido integrado. Asegúrate de que las imágenes (carrusel-img-1.jpg, etc.) están en la carpeta **`public`** de tu proyecto y que la rama **`dev/soft-war_ricardo-carrusel`** contiene el archivo **`Carousel.tsx`** actualizado.
            </p>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-sm bg-gray-100 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">
          Desarrollo en curso.
        </p>
      </footer>
      
    </div>
  );
}
