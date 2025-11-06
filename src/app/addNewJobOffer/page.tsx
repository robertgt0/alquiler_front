'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getOfferById, createOffer, updateOffer } from '@/app/offers/services/offersService';
import { getCategories, type CategoryDTO } from '@/lib/api/categories';

const PLACEHOLDER_CATEGORY = '';
const MAX_DESCRIPTION_LENGTH = 100;
const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_MIME = ['image/jpeg', 'image/png'];

function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AddOrEditOfferPage() {
  const router = useRouter();
  const search = useSearchParams();
  const editId = search.get('edit');

  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>(PLACEHOLDER_CATEGORY);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<{ file: File; preview: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(Boolean(editId));
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewUrlsRef = useRef<Set<string>>(new Set());

  const initialSnapshot = useRef<{ description: string; category: string; existingImages: string[] }>({
    description: '',
    category: PLACEHOLDER_CATEGORY,
    existingImages: [],
  });

  const isEdit = useMemo(() => Boolean(editId), [editId]);

  // Fetch categories
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await getCategories();
        if (cancelled) return;
        const ordered = [...list].sort((a, b) => a.name.localeCompare(b.name));
        setCategories(ordered);
      } catch (error) {
        if (cancelled) return;
        setFeedback({ type: 'error', message: 'No se pudieron cargar las categorias.' });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // If editing, preload data
  useEffect(() => {
    if (!isEdit || !editId) return;
    let active = true;
    (async () => {
      try {
        setInitialLoading(true);
        const offer = await getOfferById(editId);
        if (!active) return;
        if (!offer) {
          setFeedback({ type: 'error', message: 'No se encontro la oferta para editar.' });
          setInitialLoading(false);
          return;
        }
        setDescription(offer.description ?? '');
        setCategory(offer.category ?? PLACEHOLDER_CATEGORY);
        const existing = Array.isArray(offer.images) ? offer.images : [];
        setExistingImages(existing);
        initialSnapshot.current = {
          description: offer.description ?? '',
          category: offer.category ?? PLACEHOLDER_CATEGORY,
          existingImages: existing,
        };
      } catch (error) {
        if (!active) return;
        setFeedback({ type: 'error', message: 'No se pudo cargar la oferta para editar.' });
      } finally {
        if (active) setInitialLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [isEdit, editId]);

  const totalImages = existingImages.length + newImages.length;
  const isFormValid =
    description.trim().length > 0 &&
    description.trim().length <= MAX_DESCRIPTION_LENGTH &&
    category !== PLACEHOLDER_CATEGORY &&
    totalImages <= MAX_IMAGES;

  const isDirty = useMemo(() => {
    if (description.trim() !== initialSnapshot.current.description.trim()) return true;
    if (category !== initialSnapshot.current.category) return true;
    if (newImages.length > 0) return true;
    if (existingImages.length !== initialSnapshot.current.existingImages.length) return true;
    return false;
  }, [description, category, newImages.length, existingImages.length]);

  const allowRouteChangeRef = useRef(false);
  const pendingNavigationRef = useRef<(() => void) | null>(null);
  const isDirtyRef = useRef(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const historyBlockInsertedRef = useRef(false);

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      previewUrlsRef.current.clear();
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirtyRef.current || allowRouteChangeRef.current) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    isDirtyRef.current = isDirty;
    if (isDirty && !historyBlockInsertedRef.current) {
      window.history.pushState({ addNewOffer: true }, '', window.location.href);
      historyBlockInsertedRef.current = true;
    }
    if (!isDirty) {
      historyBlockInsertedRef.current = false;
      pendingNavigationRef.current = null;
    }
  }, [isDirty]);

  useEffect(() => {

    const handlePopState = () => {
      if (!isDirtyRef.current || allowRouteChangeRef.current) {
        allowRouteChangeRef.current = false;
        return;
      }
      window.history.pushState({ addNewOffer: true }, '', window.location.href);
      historyBlockInsertedRef.current = true;
      pendingNavigationRef.current = () => {
        allowRouteChangeRef.current = true;
        window.history.back();
      };
      setShowExitModal(true);
    };

    const handleDocumentClick = (event: MouseEvent) => {
      if (!isDirtyRef.current || allowRouteChangeRef.current || showExitModal) return;
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest('a');
      if (!anchor) return;
      if (anchor.target === '_blank' || anchor.hasAttribute('download')) return;
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      const url = new URL(anchor.href);
      if (url.origin !== window.location.origin) return;
      event.preventDefault();
      pendingNavigationRef.current = () => {
        allowRouteChangeRef.current = true;
        router.push(url.pathname + url.search + url.hash);
      };
      setShowExitModal(true);
    };

    window.addEventListener('popstate', handlePopState);
    document.addEventListener('click', handleDocumentClick);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [router, showExitModal]);

  function resetFileInput() {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  const clearNewImages = () => {
    setNewImages((prev) => {
      prev.forEach(({ preview }) => {
        URL.revokeObjectURL(preview);
        previewUrlsRef.current.delete(preview);
      });
      previewUrlsRef.current.clear();
      return [];
    });
  };

  const handleConfirmExit = () => {
    setShowExitModal(false);
    const action = pendingNavigationRef.current;
    pendingNavigationRef.current = null;
    historyBlockInsertedRef.current = false;
    if (action) {
      action();
    } else {
      allowRouteChangeRef.current = true;
      router.back();
    }
  };

  const handleCancelExit = () => {
    setShowExitModal(false);
    pendingNavigationRef.current = null;
  };

  function handleFilesSelected(list: FileList | null) {
    if (!list?.length) return;
    setFeedback(null);

    const availableSlots = MAX_IMAGES - (existingImages.length + newImages.length);
    if (availableSlots <= 0) {
      setFeedback({ type: 'error', message: `Solo puedes adjuntar ${MAX_IMAGES} imagenes por oferta.` });
      resetFileInput();
      return;
    }

    const files = Array.from(list).slice(0, availableSlots);
    const accepted: { file: File; preview: string }[] = [];
    const rejected: string[] = [];

    files.forEach((file) => {
      if (!ACCEPTED_MIME.includes(file.type)) {
        rejected.push(`${file.name}: formato no permitido`);
        return;
      }
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        rejected.push(`${file.name}: excede 5 MB`);
        return;
      }
      const preview = URL.createObjectURL(file);
      previewUrlsRef.current.add(preview);
      accepted.push({ file, preview });
    });

    if (rejected.length) {
      setFeedback({
        type: 'error',
        message: `Algunas imagenes no se cargaron: ${rejected.join(', ')}`,
      });
    }

    if (accepted.length) {
      setNewImages((prev) => [...prev, ...accepted]);
    }

    resetFileInput();
  }

  function handleRemoveNewImage(index: number) {
    setNewImages((prev) => {
      const next = [...prev];
      const [removed] = next.splice(index, 1);
      if (removed) {
        URL.revokeObjectURL(removed.preview);
        previewUrlsRef.current.delete(removed.preview);
      }
      return next;
    });
    setFeedback((prev) => (prev?.type === 'error' ? null : prev));
  }

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      previewUrlsRef.current.clear();
    };
  }, []);

  async function handleSubmit() {
    const trimmedDescription = description.trim();
    if (!trimmedDescription) {
      setFeedback({ type: 'error', message: 'La descripcion es obligatoria.' });
      return;
    }
    if (category === PLACEHOLDER_CATEGORY) {
      setFeedback({ type: 'error', message: 'Selecciona una categoria.' });
      return;
    }
    if (totalImages > MAX_IMAGES) {
      setFeedback({ type: 'error', message: `Puedes subir hasta ${MAX_IMAGES} imagenes.` });
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const newImagePayload = await Promise.all(newImages.map(({ file }) => fileToDataURL(file)));
      const images = isEdit ? [...existingImages, ...newImagePayload] : newImagePayload;

      if (isEdit && editId) {
        await updateOffer(editId, {
          title: trimmedDescription.slice(0, 40) || 'Oferta',
          description: trimmedDescription,
          category,
          images,
        });
        setFeedback({ type: 'success', message: 'Edicion realizada con exito.' });
        setExistingImages(images);
        initialSnapshot.current = {
          description: trimmedDescription,
          category,
          existingImages: images,
        };
        clearNewImages();
        resetFileInput();
        allowRouteChangeRef.current = true;
        historyBlockInsertedRef.current = false;
        setTimeout(() => {
          router.push(`/offers/${editId}?status=edited`);
        }, 2500);
      } else {
        await createOffer({
          title: trimmedDescription.slice(0, 40) || 'Oferta',
          description: trimmedDescription,
          category,
          images,
          contact: { whatsapp: '555-000-0000' },
        });
        setFeedback({ type: 'success', message: 'Oferta creada exitosamente.' });
        setDescription('');
        setCategory(PLACEHOLDER_CATEGORY);
        setExistingImages([]);
        clearNewImages();
        resetFileInput();
        initialSnapshot.current = {
          description: '',
          category: PLACEHOLDER_CATEGORY,
          existingImages: [],
        };
        allowRouteChangeRef.current = true;
        historyBlockInsertedRef.current = false;
        setTimeout(() => {
          router.push('/offers?status=created');
        }, 2500);
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        message: isEdit ? 'Error al guardar los cambios.' : 'Error al crear la oferta.',
      });
    } finally {
      setLoading(false);
    }
  }

  if (initialLoading) {
    return <main className="p-6 text-sm text-slate-600">Cargando...</main>;
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="flex items-center justify-between border-b border-slate-200 px-10 py-4">
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 rounded-sm bg-slate-900" />
          <span className="text-lg font-semibold text-slate-900">Servineo</span>
        </div>
      </header>

      <section className="flex justify-center px-4 py-10">
        <form className="w-full max-w-3xl space-y-8">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              {isEdit ? 'Editar oferta de servicio' : 'Crear nueva oferta de servicio'}
            </h1>
          </div>

          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900">Descripcion</label>
              <input
                type="text"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                maxLength={MAX_DESCRIPTION_LENGTH}
                placeholder="Describe tu servicio en 100 caracteres o menos."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <div className="text-right text-xs text-slate-500">
                {description.length}/{MAX_DESCRIPTION_LENGTH}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900">Categoria</label>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value={PLACEHOLDER_CATEGORY}>Seleccionar categoria</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <p className="text-base font-semibold text-slate-900">Adjuntar imagenes</p>
            <p className="text-sm text-slate-500">
              Sube imagenes para una mejor descripcion de tu servicio (JPG o PNG, max 5MB).
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mx-auto inline-flex items-center rounded-xl bg-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
            >
              Subir imagen
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png"
              multiple
              className="hidden"
              onChange={(event) => handleFilesSelected(event.target.files)}
            />
            <p className="text-xs text-slate-400">
              Puedes adjuntar hasta {MAX_IMAGES} imagenes. Actualmente: {totalImages}
            </p>
          </div>

          {(existingImages.length > 0 || newImages.length > 0) && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <h2 className="text-sm font-semibold text-slate-900">Imagenes seleccionadas</h2>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {existingImages.map((src, index) => (
                  <li key={`existing-${index}`} className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                    <img src={src} alt={`Imagen existente ${index + 1}`} className="h-40 w-full object-cover" />
                    <div className="px-3 py-2 text-xs text-slate-500">Imagen existente #{index + 1}</div>
                  </li>
                ))}
                {newImages.map(({ file, preview }, index) => (
                  <li key={`new-${index}`} className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                    <img src={preview} alt={file.name} className="h-40 w-full object-cover" />
                    <div className="flex items-center justify-between px-3 py-2 text-xs text-slate-600">
                      <span className="truncate pr-2">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveNewImage(index)}
                        className="font-semibold text-red-500 hover:text-red-600"
                      >
                        Quitar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {feedback && (
            <div
              className={`rounded-xl px-4 py-3 text-sm ${
                feedback.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
              }`}
            >
              {feedback.message}
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (!isDirty) {
                  allowRouteChangeRef.current = true;
                  router.back();
                  return;
                }
                pendingNavigationRef.current = () => {
                  allowRouteChangeRef.current = true;
                  router.back();
                };
                setShowExitModal(true);
              }}
              className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid || loading}
              className={`rounded-xl px-6 py-2 text-sm font-semibold text-white ${
                !isFormValid || loading
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? (isEdit ? 'Guardando...' : 'Creando...') : isEdit ? 'Guardar cambios' : 'Crear oferta de servicio'}
            </button>
          </div>
        </form>
      </section>

      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-slate-900">Esta seguro de salir?</h2>
            <p className="mt-2 text-sm text-slate-600">
              Tienes cambios sin guardar y se perderan si sales de esta pagina.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelExit}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmExit}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
