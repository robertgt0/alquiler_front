"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { CategoryDTO } from "@/lib/api/categories";
import { getFixer } from "@/lib/api/fixer";
import type { PaymentState } from "@/types/payment";
import { getCategories as fetchCategories } from "@/lib/api/categories";
import StepIdentity from "./steps/StepIdentity";
import StepLocation from "./steps/StepLocation";
import StepCategories from "./steps/StepCategories";
import StepPayment from "./steps/StepPayment";
import StepTermsView from "./steps/StepTermsView";
import type { SelectedCategory } from "./steps/types";
import { STORAGE_KEYS, loadFromStorage, removeFromStorage, saveToStorage } from "./storage";

const ENV_USER_ID = process.env.NEXT_PUBLIC_DEFAULT_USER_ID ?? "";
const DEFAULT_PAYMENT_STATE: PaymentState = { methods: [] };
const FLOW_STATE_KEYS = [
  STORAGE_KEYS.fixerId,
  STORAGE_KEYS.ci,
  STORAGE_KEYS.location,
  STORAGE_KEYS.categories,
  STORAGE_KEYS.payment,
] as const;

type FixerLocation = { lat: number; lng: number; address?: string };

export default function ConvertirseFixerPage() {
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);
  const [userId, setUserId] = useState<string>("");
  const [fixerId, setFixerId] = useState<string | null>(null);
  const [ci, setCi] = useState("");
  const [location, setLocation] = useState<FixerLocation | null>(null);
  const [categories, setCategories] = useState<SelectedCategory[]>([]);
  const [payment, setPayment] = useState<PaymentState>(DEFAULT_PAYMENT_STATE);
  const [finished, setFinished] = useState(false);
  const [loadingFixer, setLoadingFixer] = useState(false);

  // Cargar datos almacenados en cliente
  useEffect(() => {
    const storedUserId = loadFromStorage<string | null>(STORAGE_KEYS.userId, ENV_USER_ID || null);
    if (storedUserId) setUserId(storedUserId);

    const storedFixerId = loadFromStorage<string | null>(STORAGE_KEYS.fixerId, null);
    const storedCI = loadFromStorage<string | null>(STORAGE_KEYS.ci, null);
    const storedLocation = loadFromStorage<FixerLocation | null>(STORAGE_KEYS.location, null);
    const storedCategories = loadFromStorage<SelectedCategory[]>(STORAGE_KEYS.categories, []);
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
        if (Array.isArray(data.skillsInfo) && data.skillsInfo.length) {
          const mapped: SelectedCategory[] = data.skillsInfo
            .filter((skill) => Boolean(skill?.category))
            .map((skill) => ({
              ...skill.category,
              customDescription: skill.source === "personal" ? skill.customDescription ?? skill.description : undefined,
            }));
          if (!cancelled) setCategories(mapped);
        } else if (Array.isArray(data.categories) && data.categories.length) {
          try {
            const all = await fetchCategories();
            const selection = all.filter((item) => data.categories?.includes(item.id));
            const customLookup = new Map(
              (Array.isArray(data.skills) ? data.skills : []).map((skill: any) => [
                typeof skill?.categoryId === "string" ? skill.categoryId : "",
                typeof skill?.customDescription === "string" ? skill.customDescription : "",
              ])
            );
            const fallback: SelectedCategory[] = selection.map((item) => ({
              ...item,
              customDescription: (customLookup.get(item.id) || "").trim() || undefined,
            }));
            if (!cancelled) setCategories(fallback);
          } catch (err) {
            console.warn("No se pudieron obtener categorias", err);
          }
        }
        if (Array.isArray(data.paymentMethods)) {
          setPayment((prev) => ({
            methods: data.paymentMethods as PaymentState["methods"],
            card: data.paymentAccounts?.card ?? prev.card ?? null,
            qr: data.paymentAccounts?.qr ?? prev.qr ?? null,
          }));
        }
        if (data.termsAccepted) {
          FLOW_STATE_KEYS.forEach((key) => removeFromStorage(key));
          if (userId) saveToStorage(STORAGE_KEYS.userId, userId);
          setFinished(true);
        }
      } catch (err) {
        console.warn("No se pudo sincronizar el fixer almacenado", err);
        removeFromStorage(STORAGE_KEYS.fixerId);
        setFixerId(null);
        setStep(0);
      } finally {
        if (!cancelled) setLoadingFixer(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fixerId, userId]);

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
        <div className="rounded-2xl bg-white px-6 py-4 text-sm text-slate-500 shadow">Cargando flujo...</div>
      </div>
    );
  }

  if (finished) {
    return (
      <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 rounded-3xl bg-white p-10 text-center shadow-lg">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl text-white">V</div>
        <h1 className="text-3xl font-semibold text-slate-900">Listo! Ya eres Fixer</h1>
        <p className="max-w-md text-sm text-slate-500">Tu perfil quedo configurado con exito. Ahora puedes publicar tus ofertas y comenzar a recibir solicitudes.</p>
        <a
          href="/offers"
          className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          Ir a mis ofertas
        </a>
        {fixerId && (
          <a
            href={`/fixers/${fixerId}`}
            className="rounded-xl border border-blue-600 px-6 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            Ver mi perfil publico
          </a>
        )}
      </section>
    );
  }

  if (!userId) {
    return (
      <section className="mx-auto flex max-w-xl flex-col gap-5 rounded-3xl bg-white p-8 shadow-lg">
        <header className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-slate-900">Selecciona un usuario existente</h1>
          <p className="text-sm text-slate-500">
            Necesitas proporcionar el <strong>ObjectId</strong> de un usuario registrado como requester en la base de datos.
            Puedes copiarlo desde MongoDB Compass y pegarlo aqui para continuar con el flujo.
          </p>
        </header>
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const formData = new FormData(form);
            const value = String(formData.get("userId") ?? "").trim();
            if (!value) return;
            setUserId(value);
            saveToStorage(STORAGE_KEYS.userId, value);
          }}
        >
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700" htmlFor="userId-input">
            ID de usuario (ObjectId)
            <input
              id="userId-input"
              name="userId"
              defaultValue={ENV_USER_ID}
              placeholder="Ej. 66f6bce90506..."
              className="h-11 rounded-xl border border-slate-200 px-4 font-mono text-sm tracking-wide outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <button
            type="submit"
            className="self-end rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Guardar y continuar
          </button>
        </form>
      </section>
    );
  }

  let content: ReactNode = null;

  switch (step) {
    case 0:
      content = (
        <StepIdentity
          fixerId={fixerId}
          userId={userId}
          initialCI={ci}
          onComplete={({ fixerId: newId, ci: newCI }) => {
            setFixerId(newId);
            setCi(newCI);
            setStep(1);
          }}
        />
      );
      break;
    case 1:
      if (fixerId) {
        content = (
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
      }
      break;
    case 2:
      if (fixerId) {
        content = (
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
      }
      break;
    case 3:
      if (fixerId) {
        content = (
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
      }
      break;
    case 4:
      if (fixerId) {
        content = (
          <StepTermsView
            fixerId={fixerId}
            summary={{ ci, categories, payment }}
            onBack={() => setStep(3)}
            onFinish={() => {
              FLOW_STATE_KEYS.forEach((key) => removeFromStorage(key));
              if (userId) saveToStorage(STORAGE_KEYS.userId, userId);
              setFinished(true);
            }}
          />
        );
      }
      break;
    default:
      content = null;
  }

  if (!content) return null;

  const resetFlow = () => {
    setFixerId(null);
    setCi("");
    setLocation(null);
    setCategories([]);
    setPayment({ methods: [] });
    setStep(0);
    setFinished(false);
    FLOW_STATE_KEYS.forEach((key) => removeFromStorage(key));
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <aside className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white px-5 py-4 shadow">
        <div className="text-sm text-slate-600">
          <p className="font-semibold text-slate-900">Usuario seleccionado</p>
          <code className="block break-all rounded bg-slate-100 px-2 py-1 text-xs text-slate-700">{userId}</code>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              removeFromStorage(STORAGE_KEYS.userId);
              resetFlow();
              setUserId("");
            }}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
          >
            Cambiar usuario
          </button>
          {fixerId && (
            <button
              type="button"
              onClick={resetFlow}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
            >
              Reiniciar flujo
            </button>
          )}
        </div>
      </aside>
      {content}
    </div>
  );
}


