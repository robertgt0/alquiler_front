import { getFixer } from "@/lib/api/fixer";
import Link from "next/link";
import FixerOwnerActions from "../components/FixerOwnerActions";
import FixerSkillsList from "../components/FixerSkillsList";

type PageProps = { params: Promise<{ id: string }> };

function formatDate(iso?: string) {
  if (!iso) return "N/D";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "N/D";
  return d.toLocaleDateString();
}

function calculateTimeSince(iso?: string) {
  if (!iso) return "N/D";
  const startDate = new Date(iso);
  if (Number.isNaN(startDate.getTime())) return "N/D";

  const now = new Date();
  const diffTime = Math.abs(now.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let years = now.getFullYear() - startDate.getFullYear();
  let months = now.getMonth() - startDate.getMonth();
  let days = now.getDate() - startDate.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  if (years > 0) {
    return `Hace ${years} año${years > 1 ? "s" : ""}, ${months} mes${months > 1 ? "es" : ""} y ${days} día${days > 1 ? "s" : ""}`;
  }
  if (months > 0) {
    return `Hace ${months} mes${months > 1 ? "es" : ""} y ${days} día${days > 1 ? "s" : ""}`;
  }
  if (diffDays > 1) {
    return `Hace ${diffDays} días`;
  }
  if (diffDays === 1) {
    return `Hace 1 día`;
  }
  return "Hoy";
}

function Stars({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <div className="inline-flex items-center gap-1 text-yellow-500">
      {Array.from({ length: full }).map((_, i) => (
        <span key={`full-${i}`}>&#9733;</span>
      ))}
      {half ? <span>&#9734;</span> : null}
      {Array.from({ length: empty }).map((_, i) => (
        <span key={`empty-${i}`} className="text-slate-300">&#9733;</span>
      ))}
    </div>
  );
}

function whatsappLink(phone?: string, msg?: string) {
  if (!phone) return null;
  const digits = phone.replace(/[^\d]/g, "");
  const text = encodeURIComponent(msg ?? "Hola, vi tu perfil en Servineo y me interesa contactarte.");
  return `https://wa.me/${digits}?text=${text}`;
}

export default async function FixerDetailPage({ params }: PageProps) {
  const { id } = await params;
  let data: any = null;
  try {
    const res = await getFixer(id);
    data = res?.data ?? null;
  } catch {
    // backend no disponible, usamos placeholders
  }

  const name = data?.name ?? "Juan Pérez";
  const city = data?.city ?? "Cochabamba";
  const jobsCount = Number(data?.jobsCount ?? 45);
  const rating = Number(data?.ratingAvg ?? 4.4);
  const memberSince = data?.memberSince ?? data?.createdAt ?? new Date(2019, 7, 28).toISOString();
  const methods: string[] = Array.isArray(data?.paymentMethods) ? data.paymentMethods : ["cash", "qr", "card"];
  
  // ✅ Bug 1.1.1 RESUELTO: Mostrar bio real o mensaje específico del fixer
  const bio = data?.bio?.trim() || null;
  const hasBio = bio !== null && bio.length > 0;
  
  const phone = data?.whatsapp ?? "+59170123456";
  const photoUrl =
    data?.photoUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=E5E7EB&color=111827&size=128`;

  const defaultSkills = ["Carpintería", "Albañil", "Plomero"];
  const skillsInfo = Array.isArray(data?.skillsInfo) ? data.skillsInfo : [];
  const categoriesInfo = Array.isArray(data?.categoriesInfo) ? data.categoriesInfo : [];
  const rawCategories = Array.isArray(data?.categories) && data.categories.length ? data.categories : defaultSkills;

type SkillDisplay = {
  id: string;
  name: string;
  general: string;
  personal?: string;
  source: "personal" | "general";
};

  const skillsDetails: SkillDisplay[] = skillsInfo.length
    ? skillsInfo.map((skill: any) => {
        const personal = (skill?.customDescription ?? "").trim();
        return {
          id: skill?.category?.id ?? skill?.categoryId ?? skill?.id ?? "",
          name: skill?.category?.name ?? skill?.name ?? "Oficio",
          general: (skill?.description ?? "").trim() || "Sin descripción disponible.",
          personal: personal || undefined,
          source: personal ? "personal" : "general",
        };
      })
    : categoriesInfo.length
    ? categoriesInfo.map((category: any) => ({
        id: category?.id ?? "",
        name: category?.name ?? "Oficio",
        general: (category?.description ?? "").trim() || "Sin descripción disponible.",
        personal: undefined,
        source: "general" as const,
      }))
    : rawCategories.map((name: string, index: number) => ({
        id: `${index}`,
        name,
        general: "Descripción no disponible.",
        personal: undefined,
        source: "general" as const,
      }));

  const skillTags = Array.from(new Set(skillsDetails.map((item) => item.name)));

  const wa = whatsappLink(phone);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <nav className="mb-6 text-sm text-slate-500">
        <Link href="/" className="hover:text-slate-800">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/convertirse-fixer" className="hover:text-slate-800">
          Convertirse en Fixer
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900">Sobre el Fixer</span>
      </nav>

      <div className="grid grid-cols-1 gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-[160px_1fr]">
        <div className="flex flex-col items-center gap-4">
          <img
            src={photoUrl}
            alt={`Foto de ${name}`}
            className="h-36 w-36 rounded-full object-cover ring-1 ring-slate-200"
          />
          <div className="text-center">
            <div className="text-xl font-semibold text-slate-900">{name}</div>
            <div className="text-slate-500">{city}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="text-sm text-slate-500">Trabajos registrados</div>
            <div className="text-2xl font-semibold text-slate-900">{jobsCount}</div>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="text-sm text-slate-500">Calificación</div>
            <div className="flex items-center gap-2">
              <Stars value={rating} />
              <span className="text-slate-700">{rating.toFixed(1)}</span>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="text-sm text-slate-500">En servicio desde</div>
            <div className="text-slate-900">{calculateTimeSince(memberSince)}</div>
          </div>

          <div className="rounded-xl border border-slate-200 p-4 md:col-span-3">
            <div className="mb-1 text-sm text-slate-500">Rubros</div>
            <div className="text-slate-900">{skillTags.length ? skillTags.join(", ") : "Sin información"}</div>
          </div>

          <div className="rounded-xl border border-slate-200 p-4 md:col-span-3">
            <div className="mb-1 text-sm text-slate-500">Métodos de pago</div>
            <div className="text-slate-900">
              {methods.length
                ? methods.map((m) => (
                    <span
                      key={m}
                      className="mr-2 inline-block rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                    >
                      {m === "cash" ? "Efectivo" : m === "qr" ? "QR" : "Tarjeta"}
                    </span>
                  ))
                : "N/D"}
            </div>
          </div>

          {/* ✅ Bug 1.1.1 RESUELTO: Mostrar bio real o mensaje personalizado */}
          <div className="rounded-xl border border-slate-200 p-4 md:col-span-3">
            <div className="mb-2 text-sm text-slate-500">Sobre mí</div>
            {hasBio ? (
              <div className="rounded-lg bg-slate-50 p-4 text-slate-800">{bio}</div>
            ) : (
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-amber-800 text-sm">
                <p className="font-medium mb-1">Este fixer aún no ha agregado una descripción personal.</p>
                <p className="text-xs text-amber-700">
                  Si eres el propietario de este perfil, puedes agregar información sobre ti en la sección de edición.
                </p>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 p-4 md:col-span-3">
            <div className="mb-2 text-sm text-slate-500">Mis habilidades</div>
            <FixerSkillsList initialSkills={skillsDetails} />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        {wa ? (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 font-medium text-white shadow hover:brightness-95"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#25D366]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.027-.967-.27-.099-.466-.148-.663.15-.198.297-.762.966-.934 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.173.198-.297.298-.495.099-.198.05-.371-.025-.52-.075-.149-.663-1.602-.909-2.198-.24-.576-.484-.498-.663-.508-.173-.009-.371-.011-.57-.011-.198 0-.52.074-.792.371-.272.297-1.042 1.016-1.042 2.479 0 1.462 1.067 2.875 1.216 3.074.149.198 2.105 3.215 5.102 4.505.714.308 1.27.493 1.704.63.716.228 1.367.196 1.883.119.574-.085 1.758-.718 2.006-1.413.248-.695.248-1.29.173-1.413-.074-.123-.272-.198-.57-.347z" />
                <path d="M12.004 2c-5.514 0-9.999 4.486-9.999 10 0 1.767.465 3.498 1.349 5.032L2 22l5.115-1.349c1.486.811 3.154 1.239 4.889 1.239 5.514 0 10-4.486 10-10S17.518 2 12.004 2zm0 18.182c-1.57 0-3.117-.411-4.48-1.188l-.321-.183-3.034.8.808-2.958-.209-.304c-.798-1.165-1.22-2.523-1.22-3.967 0-3.875 3.148-7.023 7.023-7.023 3.874 0 7.022 3.148 7.022 7.023s-3.148 7.8-7.022 7.8z" />
              </svg>
            </span>
            <span>Enviar WhatsApp</span>
          </a>
        ) : (
          <button className="cursor-not-allowed rounded-full bg-slate-300 px-5 py-3 text-white opacity-70" disabled>
            WhatsApp no disponible
          </button>
        )}
      </div>

      {/* ✅ Bug 1.1.1 RESUELTO: Componente de edición para el propietario */}
      <FixerOwnerActions
        fixerId={id}
        currentBio={bio}
        skills={skillsDetails.map((skill) => ({
          id: skill.id,
          name: skill.name,
          general: skill.general,
          personal: skill.personal,
          source: skill.source,
        }))}
      />
    </div>
  );
}