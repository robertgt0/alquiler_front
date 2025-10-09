import Image from "next/image";
import AgendarCitaButton from "./epic_example/components/AgendarCitaButton";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {/* Texto de bienvenida */}
        <h1 className="text-3xl font-bold text-center sm:text-left">
          ¡SERVICIOS :v PRUEBA!
        </h1>

        {/* Botón para agendar cita */}
        <div className="mt-4">
          <AgendarCitaButton />
        </div>
      </main>
    </div>
  );
}
