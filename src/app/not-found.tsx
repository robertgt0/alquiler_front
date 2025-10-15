export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-6 py-16 text-center">
      <h1 className="text-3xl font-bold">Página en construcción</h1>
      <p className="mt-3 text-gray-600">
        Aún no está disponible esta sección. (Error 404)
      </p>
      <a
        href="/"
        className="mt-6 inline-block rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Volver al inicio
      </a>
    </main>
  );
}
