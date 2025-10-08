//Entorno de prueba para ver el contenido del componete Agendar Cita
//
import AppointmentButton from "../epic_example/components/AgendarCitaButton";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900">
      <h1 className="text-4xl font-bold mb-6">Entorno de prueba para ver el componente de Agendar Cita :O </h1>
      <p className="text-lg mb-4">This is the home screen. Feel free to explore!</p>
      <div className="space-x-4">
        <AppointmentButton /> 
      </div>
    </div>
  );
}