import Link from 'next/link';
import Head from 'next/head';

export default function PorQueElegirnos() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>¿Por Qué Elegir SERVINEO? - Ventajas y Comparativas</title>
        <meta name="description" content="Descubre por qué SERVINEO es la mejor opción para comprar y vender servicios locales" />
      </Head>


  {/* Hero Section */}
  <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-12">
    <div className="container mx-auto px-4">
      <div className="flex items-center">
        {/* Logo a la izquierda - circular */}
        <div className="flex-shrink-0 mr-6 md:mr-8">
          <img 
            src="/logo-servineo.jpg" 
            alt="SERVINEO Logo"
            className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-full border-2 border-white shadow-lg"
          />
        </div>
        
        {/* Texto centrado */}
        <div className="flex-1 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            ¿Por Qué Elegir SERVINEO?
          </h1>
          <p className="text-lg md:text-xl">
            La plataforma líder para servicios locales en tu comunidad
          </p>
        </div>
        
        {/* Espacio vacío para balancear el logo izquierdo */}
        <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0"></div>
      </div>
    </div>
  </section>





      {/* Banner 1 - Enfoque Local */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <img 
                src="/beneficio2.jpeg" 
                alt="Comunidad Local"
                className="rounded-lg shadow-lg w-full h-64 object-cover"
              />
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                1. Enfoque 100% Local
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                Todos los servicios en SERVINEO están respaldados por nuestra garantía de satisfacción, lo que significa que si no estás conforme con el resultado, lo resolvemos sin costo adicional. Cada trabajo está cubierto por nuestra póliza de garantía y contarás con soporte post-servicio para cualquier asistencia que necesites después de finalizado el trabajo. Tu dinero está protegido hasta que apruebes completamente el servicio, y solo trabajamos con profesionales responsables y comprometidos con la excelencia para asegurar tu inversión.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>✓ Profesionales verificados en tu área</li>
                <li>✓ Precios adaptados a tu mercado local</li>
                <li>✓ Comunicación en tu idioma y horario</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

     
    </div>
  );
}