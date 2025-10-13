"use client";
import FormularioRegistro from "./teamsys/modules/FormularioRegistro";
import { RegistrationForm } from "./teamsys/components/RegistrationForm";

export default function Page() {
  return (
    <main className="flex flex-col justify-center items-center min-h-screen bg-gray-100 gap-10">
      <FormularioRegistro />
      <RegistrationForm />
    </main>
  );
}