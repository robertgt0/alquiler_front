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

  const name = data?.name ?? "Juan Perez";
  const city = data?.city ?? "Cochabamba";
  const jobsCount = Number(data?.jobsCount ?? 45);
  const rating = Number(data?.ratingAvg ?? 4.4);
  const memberSince = data?.memberSince ?? data?.createdAt ?? new Date(2019, 7, 28).toISOString();
  const methods: string[] = Array.isArray(data?.paymentMethods) ? data.paymentMethods : ["cash", "qr", "card"];
  const bio = data?.bio ?? "Soy una persona responsable y eficiente que trabaja tanto en obras grandes como pequenas.";
  const phone = data?.whatsapp ?? "+59170123456";
  const photoUrl =
    data?.photoUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=E5E7EB&color=111827&size=128`;

  const defaultSkills = ["Carpinteria", "Albanil", "Plomero"];
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
          general: (skill?.description ?? "").trim() || "Sin descripcion disponible.",
          personal: personal || undefined,
          source: personal ? "personal" : "general",
        };
      })
    : categoriesInfo.length
    ? categoriesInfo.map((category: any) => ({
        id: category?.id ?? "",
        name: category?.name ?? "Oficio",
        general: (category?.description ?? "").trim() || "Sin descripcion disponible.",
        personal: undefined,
        source: "general" as const,
      }))
    : rawCategories.map((name: string, index: number) => ({
        id: `${index}`,
        name,
        general: "Descripcion no disponible.",
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
            <div className="text-slate-900">{skillTags.length ? skillTags.join(", ") : "Sin informacion"}</div>
          </div>

          <div className="rounded-xl border border-slate-200 p-4 md:col-span-3">
            <div className="mb-1 text-sm text-slate-500">Metodos de pago</div>
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

          <div className="rounded-xl border border-slate-200 p-4 md:col-span-3">
            <div className="mb-2 text-sm text-slate-500">Sobre mi</div>
            <div className="rounded-lg bg-slate-50 p-4 text-slate-800">{bio}</div>
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
            <span>Enviar WhatsApp</span>
          </a>
        ) : (
          <button className="cursor-not-allowed rounded-full bg-slate-300 px-5 py-3 text-white opacity-70" disabled>
            WhatsApp no disponible
          </button>
        )}
      </div>

      <FixerOwnerActions
        fixerId={id}
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
