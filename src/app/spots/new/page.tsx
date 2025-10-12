// src/app/spots/new/page.tsx

import LocationForm from '@/components/LocationForm';

export default function NewSpotPage() {
  return (
    <main className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Registrar Nuevo Spot de Windsurf
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <LocationForm />
      </div>
    </main>
  );
}
