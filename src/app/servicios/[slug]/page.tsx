// src/app/servicios/[slug]/page.tsx
import { categorias } from "@/app/components/data/categoriasData";
import { notFound } from "next/navigation";
import { AlertTriangle, HelpCircle, X } from "lucide-react";
import Link from "next/link";

interface ServicioPageProps {
  params: {
    slug: string;
  };
}

export default async function ServicioPage({ params }: ServicioPageProps) {
  const { slug } = await params;
  const categoria = categorias.find((c) => c.slug === slug);

  if (!categoria) {
    notFound();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 text-yellow-500">
          <AlertTriangle size={40} />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">
          Acceso Restringido
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Servicio: <span className="font-semibold">{categoria.titulo}</span>
        </p>

        <p className="mt-6 text-gray-700">
          Este contenido está actualmente en desarrollo o requiere permisos
          especiales para acceder. Estamos trabajando para ofrecerte la mejor
          experiencia posible.
        </p>

        <div className="mt-4 rounded-md bg-blue-50 p-3 text-sm text-blue-700">
          <p>
            <strong>Nota:</strong> Esta es una página temporal. El servicio
            estará disponible próximamente.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link href="/" className="flex items-center justify-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">
            Volver
          </Link>
        </div>
        <a href="#" className="mt-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600">
          <HelpCircle size={16} /> ¿Necesitas ayuda? Contáctanos
        </a>
      </div>
    </main>
  );
}