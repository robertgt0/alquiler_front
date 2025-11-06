import ScheduleConfigurator from './components/ScheduleConfigurator'; // Usamos '@' si estás usando el App Router

export default function HomePage() {
  return (
    // Aplica un padding vertical para que el formulario no esté pegado al borde
    <div className="py-10"> 
      <a
        href="../worker"
        className="inline-block px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Volver
      </a>

      <ScheduleConfigurator />
    </div>
  );
}