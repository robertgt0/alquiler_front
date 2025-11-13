'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
// 👈 CORRECCIÓN 1: Eliminamos 'type Offer' porque no se usaba.
import { getOfferById, createOffer, updateOffer } from '@/app/offers/services/offersService';

function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function AddNewJobOfferForm() {
  const router = useRouter();
  const search = useSearchParams(); 
  const editId = search.get('edit'); 

  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('Seleccionar categoría');
  const [imagen, setImagen] = useState<File | null>(null);
  const [imagenesExistentes, setImagenesExistentes] = useState<string[]>([]); 
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [cargandoInicial, setCargandoInicial] = useState(!!editId);

  const esEdicion = useMemo(() => Boolean(editId), [editId]);

  useEffect(() => {
    let ok = true;
    (async () => {
      if (!esEdicion) return;
      try {
        setCargandoInicial(true);
        const offer = await getOfferById(String(editId));
        if (!ok) return;
        if (!offer) {
          setMensaje('No se encontró la oferta a editar.');
          setCargandoInicial(false);
          return;
        }
        setDescripcion(offer.description || offer.title || '');
        setCategoria(offer.category || 'Seleccionar categoría');
        setImagenesExistentes(Array.isArray(offer.images) ? offer.images : []);
      // 👈 CORRECCIÓN 2: Cambiamos 'catch (e)' por 'catch (_e)'
      //    para indicarle a ESLint que sabemos que la variable no se usa.
      } catch { 
        if (!ok) return;
        setMensaje('No se pudo cargar la oferta para editar.');
      } finally {
        if (ok) setCargandoInicial(false);
      }
    })();
    return () => { ok = false; };
  }, [esEdicion, editId]);

  async function onSubmit() {
    if (!descripcion || categoria === 'Seleccionar categoría') {
      setMensaje('Por favor completa descripción y categoría');
      return;
    }

    setCargando(true);
    setMensaje('');

    try {
      // 👈 CORRECCIÓN 3: Cambiamos 'let' por 'const' porque la variable no se reasigna.
      const images: string[] = imagen ? [await fileToDataURL(imagen)] : imagenesExistentes;

      if (esEdicion) {
        // EDITAR
        await updateOffer(String(editId), {
          title: descripcion.slice(0, 40) || 'Oferta',
          description: descripcion,
          category: categoria,
          images,
        });

        setMensaje('Oferta editada correctamente ✅');
        router.push(`/offers/${editId}`);
      } else {
        // CREAR
        await createOffer({
          title: descripcion.slice(0, 40) || 'Oferta',
          description: descripcion,
          category: categoria,
          images,
          contact: { whatsapp: '555-000-000' }, 
        });

        setMensaje('Oferta creada exitosamente ✅');
        setDescripcion('');
        setCategoria('Seleccionar categoría');
        setImagen(null);
        setImagenesExistentes([]);
        const fileInput = document.getElementById('input-imagen') as HTMLInputElement | null;
        if (fileInput) fileInput.value = '';
        router.push('/offers');
      }
    } catch (e) {
      console.error(e);
      setMensaje(esEdicion ? 'Error al editar la oferta ❌' : 'Error al crear la oferta ❌');
    } finally {
      setCargando(false);
    }
  }

  if (cargandoInicial) {
    return <main className="p-6">Cargando…</main>;
  }

  return (
    <main className="flex flex-col bg-white w-full min-h-screen">
      <header className="flex justify-between items-center px-10 py-3 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="w-4 h-4 bg-gray-900 rounded-sm" />
          <h1 className="text-lg font-bold text-gray-900">Servineo</h1>
        </div>
      </header>

      <section className="flex justify-center p-5">
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col w-[960px] space-y-6">
          {/* DESCRIPCIÓN */}
          <div className="p-4 max-w-[480px]">
            <label className="block mb-2 text-gray-900 font-medium">Descripción</label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe tu servicio en 100 caracteres o menos."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              maxLength={100}
              required
            />
            <div className="text-right text-xs text-gray-500 mt-1">{descripcion.length}/100</div>
          </div>

          {/* CATEGORÍA */}
          <div className="p-4 max-w-[480px]">
            <label className="block mb-2 text-gray-900 font-medium">Categoría</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option>Seleccionar categoría</option>
              <option>Plomería</option>
              <option>Electricidad</option>
              <option>Carpintería</option>
              <option>Pintura</option>
            </select>
          </div>

          {/* IMAGEN */}
          <div className="p-4 max-w-[480px]">
            <label className="block mb-2 text-gray-900 font-medium">
              {esEdicion ? 'Imagen (opcional — si subes, reemplaza)' : 'Imagen (opcional)'}
            </label>
            {esEdicion && imagenesExistentes?.length > 0 && (
              <div className="mb-2 text-sm text-gray-600">
                Actualmente: {imagenesExistentes.length} imagen(es) cargada(s).
              </div>
            )}
            <input
              id="input-imagen"
              type="file"
              accept="image/*"
              onChange={(e) => setImagen(e.target.files ? e.target.files[0] : null)}
              className="w-full"
            />
          </div>

          {/* MENSAJE */}
          {mensaje && <p className="text-sm text-red-500">{mensaje}</p>}

          {/* BOTONES */}
          <div className="flex justify-between p-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-100 text-gray-900 font-bold rounded-lg px-6 py-2 hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onSubmit}
              disabled={cargando}
              className="bg-blue-600 text-white font-bold rounded-lg px-6 py-2 hover:bg-blue-700"
            >
              {cargando ? (esEdicion ? 'Guardando...' : 'Creando...') : (esEdicion ? 'Guardar cambios' : 'Crear oferta de servicio')}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

// El Wrapper (El ÚNICO export default)
export default function AddNewJobOfferPage() {
  return (
    <Suspense fallback={<main className="p-6">Cargando...</main>}>
      <AddNewJobOfferForm />
    </Suspense>
  );
}