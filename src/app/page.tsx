"use client";

import FormularioRegistro from "./teamsys/modules/FormularioRegistro";
import { RegistrationForm } from "./teamsys/components/RegistrationForm";

export default function Page() {
  return (
    
    <main className="flex flex-col items-center justify-center min-h-screen gap-10 bg-gray-100 p-10">
      {/* Formulario para subir imagen y aceptar términos */}
      <FormularioRegistro />

      {/* Formulario de registro de usuario */}
      <RegistrationForm />
    </main>
  );
}
