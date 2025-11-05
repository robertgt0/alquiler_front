"use client";

import Link from 'next/link';

export default function SerFixerPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-2xl p-8 rounded shadow text-center">
        <h1 className="text-3xl font-bold mb-4">Conviértete en Fixer</h1>
        <p className="mb-6">¿Quieres ofrecer tus servicios en Servineo? Aquí podrás registrar tu perfil como fixer y empezar a recibir solicitudes.</p>
        <Link href="/registro" className="inline-block px-6 py-3 bg-[#2a87ff] text-white rounded-md hover:bg-[#52abff]">Crear cuenta</Link>
      </div>
    </main>
  );
}
