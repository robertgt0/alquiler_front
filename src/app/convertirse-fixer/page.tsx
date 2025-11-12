"use client";

import { useEffect, useMemo, useState } from "react";
import type { CategoryDTO } from "@/lib/api/categories";
import { getFixer } from "@/lib/api/fixer";
import type { PaymentState } from "@/types/payment";
import { getCategories as fetchCategories } from "@/lib/api/categories";
import StepIdentity from "./steps/StepIdentity";
import StepLocation from "./steps/StepLocation";
import StepCategories from "./steps/StepCategories";
import StepPayment from "./steps/StepPayment";
import StepTermsView from "./steps/StepTermsView";
import { STORAGE_KEYS, loadFromStorage, removeFromStorage } from "./storage";

const DEFAULT_USER_ID = "demo-user-001";
const DEFAULT_PAYMENT_STATE: PaymentState = { methods: [] };

type FixerLocation = { lat: number; lng: number; address?: string };

export default function ConvertirseFixerPage() {
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);
  const [fixerId, setFixerId] = useState<string | null>(null);
  const [ci, setCi] = useState("");
  const [location, setLocation] = useState<FixerLocation | null>(null);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [payment, setPayment] = useState<PaymentState>(DEFAULT_PAYMENT_STATE);
  const [finished, setFinished] = useState(false);
  const [loadingFixer, setLoadingFixer] = useState(false);

  // Cargar datos almacenados en cliente
  useEffect(() => {
    const storedFixerId = loadFromStorage<string | null>(STORAGE_KEYS.fixerId, null);
    const storedCI = loadFromStorage<string | null>(STORAGE_KEYS.ci, null);
    const storedLocation = loadFromStorage<FixerLocation | null>(STORAGE_KEYS.location, null);
    const storedCategories = loadFromStorage<CategoryDTO[]>(STORAGE_KEYS.categories, []);
    const storedPayment = loadFromStorage<PaymentState | null>(STORAGE_KEYS.payment, null);

    if (storedFixerId) setFixerId(storedFixerId);
    if (storedCI) setCi(storedCI);
    if (storedLocation) setLocation(storedLocation);
    if (storedCategories.length) setCategories(storedCategories);
    if (storedPayment) setPayment(storedPayment);

    setReady(true);
  }, []);

  // Si hay fixerId, sincronizar con backend para obtener estado real
  useEffect(() => {
    if (!fixerId) return;
    let cancelled = false;
    (async () => {
      try {
        setLoadingFixer(true);
        const response = await getFixer(fixerId);
        if (cancelled) return;
        const data = response.data;
        if (data.ci) setCi(data.ci);
        if (data.location) setLocation({ lat: data.location.lat, lng: data.location.lng, address: data.location.address });
        if (Array.isArray(data.categories) && data.categories.length) {
          try {
            const all = await fetchCategories();
            const mapped = all.filter((item) => data.categories?.includes(item.id));
            if (!cancelled) setCategories(mapped);
          } catch (err) {
            console.warn("No se pudieron obtener categorias", err);
          }
        }
        if (Array.isArray(data.paymentMethods)) {
          setPayment((prev) => ({
            methods: data.paymentMethods,
            card: data.paymentAccounts?.card ?? prev.card ?? null,
            qr: data.paymentAccounts?.qr ?? prev.qr ?? null,
          }));
        }
        if (data.termsAccepted) {
          Object.values(STORAGE_KEYS).forEach((key) => removeFromStorage(key));
          setFinished(true);
        }
      } catch (err) {
        console.warn("No se pudo sincronizar el fixer almacenado", err);
        removeFromStorage(STORAGE_KEYS.fixerId);
        setFixerId(null);
      } finally {
        if (!cancelled) setLoadingFixer(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fixerId]);

  const resumeStep = useMemo(() => {
    if (finished) return 5;
    if (payment.methods.length) return 4;
    if (categories.length) return 3;
    if (location) return 2;
    if (ci) return 1;
    return 0;
  }, [finished, payment.methods.length, categories.length, location, ci]);

  useEffect(() => {
    if (ready) setStep(resumeStep);
  }, [ready, resumeStep]);

  if (!ready || loadingFixer) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="rounded-2xl bg-white px-6 py-4 text-sm text-slate-500 shadow">Cargando flujo…</div>
      </div>
    );
  }

  if (finished) {
    return (
      <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 rounded-3xl bg-white p-10 text-center shadow-lg">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl text-white">✓</div>
        <h1 className="text-3xl font-semibold text-slate-900">¡Listo! Ya eres Fixer</h1>
        <p className="max-w-md text-sm text-slate-500">Tu perfil quedo configurado con exito. Ahora puedes publicar tus ofertas y comenzar a recibir solicitudes.</p>
        <a
          href="/offers"
          className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          Ir a mis ofertas
        </a>
      </section>
    );
  }

  switch (step) {
    case 0:
      return (
        <StepIdentity
          fixerId={fixerId}
          userId={DEFAULT_USER_ID}
          initialCI={ci}
          onComplete={({ fixerId: newId, ci: newCI }) => {
            setFixerId(newId);
            setCi(newCI);
            setStep(1);
          }}
        />
      );
    case 1:
      if (!fixerId) return null;
      return (
        <StepLocation
          fixerId={fixerId}
          initialLocation={location}
          onBack={() => setStep(0)}
          onComplete={(loc) => {
            setLocation(loc);
            setStep(2);
          }}
        />
      );
    case 2:
      if (!fixerId) return null;
      return (
        <StepCategories
          fixerId={fixerId}
          selected={categories}
          onBack={() => setStep(1)}
          onComplete={(list) => {
            setCategories(list);
            setStep(3);
          }}
        />
      );
    case 3:
      if (!fixerId) return null;
      return (
        <StepPayment
          fixerId={fixerId}
          state={payment}
          onBack={() => setStep(2)}
          onComplete={(nextState) => {
            setPayment(nextState);
            setStep(4);
          }}
        />
      );
    case 4:
      if (!fixerId) return null;
      return (
        <StepTermsView
          fixerId={fixerId}
          summary={{ ci, categories, payment }}
          onBack={() => setStep(3)}
          onFinish={() => {
            Object.values(STORAGE_KEYS).forEach((key) => removeFromStorage(key));
            setFinished(true);
          }}
        />
      );
    default:
      return null;
  }
}
