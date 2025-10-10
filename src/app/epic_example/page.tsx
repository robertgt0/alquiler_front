//Entorno de prueba para ver el contenido del componete Agendar Cita
//
import AppointmentButton from "../epic_example/components/AgendarCitaButton";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900">
      <h1 className="text-4xl font-bold mb-6">Entorno de prueba para ver el componente de Agendar Cita :O </h1>
      
      <div className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Consultoría en Marketing Digital</h3>
          <p className="mt-2 text-gray-600">
            María Rodríguez - Especialista en Marketing Digital <br />
            <br />Sesión de consultoría personalizada para optimizar tu estrategia digital. Incluye análisis de redes sociales, SEO y campañas publicitarias.
          </p>
          <h2><br/> $75/hora      ⭐⭐⭐⭐⭐(4.9)</h2>
        </div>
        {/* Botón para abrir el componente de agendar cita */}
        <div className="flex justify-end space-x-4" >
          <AppointmentButton /> 
        </div>
      </div>
    </div>
  );
}