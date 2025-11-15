'use client';

import { useEffect, useMemo, useState } from 'react';
import { updateCategories } from '@/lib/api/fixer';
import { useClientSession } from '@/lib/auth/useSession';
import type { SkillDisplay } from './FixerSkillsList';

type Props = {
  fixerId: string;
  currentBio: string | null; // ✅ Nuevo prop
  skills: SkillDisplay[];
};

const CUSTOM_MIN = 10;
const CUSTOM_MAX = 800;
const BIO_MIN = 20; // ✅ Mínimo para bio
const BIO_MAX = 500; // ✅ Máximo para bio

export default function FixerOwnerActions({ fixerId, currentBio, skills }: Props) {
  const { user } = useClientSession();
  const isOwner = user?.fixerId === fixerId;
  const [open, setOpen] = useState(false);
  
  // ✅ Estado para la bio
  const [baseBio, setBaseBio] = useState(currentBio ?? '');
  const [bioDraft, setBioDraft] = useState(currentBio ?? '');
  const [bioError, setBioError] = useState<string | null>(null);
  
  const [baseSkills, setBaseSkills] = useState<SkillDisplay[]>(skills);
  const [drafts, setDrafts] = useState(() => skills.map((skill) => ({ ...skill, personal: skill.personal ?? '' })));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setBaseBio(currentBio ?? '');
    setBioDraft(currentBio ?? '');
    setBaseSkills(skills);
    setDrafts(skills.map((skill) => ({ ...skill, personal: skill.personal ?? '' })));
    setErrors({});
    setBioError(null);
    setStatus(null);
  }, [currentBio, skills]);

  // ✅ Detectar cambios en bio o skills
  const anyChanges = useMemo(() => {
    const bioChanged = bioDraft.trim() !== baseBio.trim();
    const skillsChanged = drafts.some((draft, index) => {
      const original = skills[index];
      const originalText = (original?.personal ?? '').trim();
      return (draft.personal ?? '').trim() !== originalText;
    });
    return bioChanged || skillsChanged;
  }, [bioDraft, baseBio, drafts, skills]);

  if (!isOwner) return null;

  // ✅ Validación y guardado
  async function handleSave() {
    const validation: Record<string, string> = {};
    let bioValidation: string | null = null;

    // Validar bio
    const bioText = bioDraft.trim();
    if (bioText.length > 0) {
      if (bioText.length < BIO_MIN) {
        bioValidation = `El "Sobre mí" debe tener al menos ${BIO_MIN} caracteres.`;
      } else if (bioText.length > BIO_MAX) {
        bioValidation = `El "Sobre mí" no puede exceder ${BIO_MAX} caracteres.`;
      }
    }

    // Validar skills
    const payload = drafts
      .map((skill) => {
        const text = (skill.personal ?? '').trim();
        if (!text) return null;
        if (text.length < CUSTOM_MIN) {
          validation[skill.id] = `Mínimo ${CUSTOM_MIN} caracteres.`;
          return null;
        }
        if (text.length > CUSTOM_MAX) {
          validation[skill.id] = `Máximo ${CUSTOM_MAX} caracteres.`;
          return null;
        }
        return { categoryId: skill.id, customDescription: text };
      })
      .filter((entry): entry is { categoryId: string; customDescription: string } => entry !== null);

    setErrors(validation);
    setBioError(bioValidation);

    if (Object.keys(validation).length || bioValidation) {
      setStatus({ type: 'error', message: 'Corrige los errores antes de guardar.' });
      return;
    }

    try {
      setSaving(true);
      setStatus(null);
      
      // ✅ Actualizar bio y skills
      await updateCategories(fixerId, {
        bio: bioText || undefined, // ✅ Incluir bio en el payload
        categories: drafts.map((skill) => skill.id),
        skills: payload,
      });

      const normalizedDrafts: SkillDisplay[] = drafts.map((skill) => {
        const text = (skill.personal ?? '').trim();
        return {
          ...skill,
          personal: text || undefined,
          source: (text ? 'personal' : 'general') as SkillDisplay['source'],
        };
      });

      setBaseBio(bioText);
      setBaseSkills(normalizedDrafts);
      setDrafts(normalizedDrafts.map((skill) => ({ ...skill, personal: skill.personal ?? '' })));
      setStatus({ type: 'success', message: '✅ Perfil actualizado correctamente.' });
      
      window.dispatchEvent(new CustomEvent('fixer-skills-updated', { detail: { skills: normalizedDrafts } }));
    } catch (error: any) {
      setStatus({
        type: 'error',
        message: String(error?.message || 'No se pudieron guardar los cambios.'),
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">Gestiona tu perfil de Fixer</p>
          <p className="text-xs text-slate-500">
            Edita tu biografía y descripciones personales. Esto es lo que verán los requesters.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="rounded-full border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
        >
          {open ? 'Cerrar editor' : 'Editar mi perfil de Fixer'}
        </button>
      </div>

      {open && (
        <div className="mt-6 space-y-6">
          {/* ✅ SECCIÓN SOBRE MÍ */}
          <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5">
            <div className="mb-3">
              <h3 className="text-base font-semibold text-slate-900">Sobre mí</h3>
              <p className="text-xs text-slate-600">
                Cuéntale a los clientes quién eres, tu experiencia y por qué deberían contratarte.
              </p>
            </div>

            <textarea
              id="bio-editor"
              value={bioDraft}
              onChange={(e) => {
                setBioDraft(e.target.value);
                setBioError(null);
              }}
              maxLength={BIO_MAX}
              placeholder="Ejemplo: Soy un profesional con 10 años de experiencia en construcción. Me especializo en trabajos de alta calidad y siempre cumplo con los plazos acordados..."
              rows={5}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            
            <div className="mt-2 flex items-center justify-between text-xs">
              {bioError ? (
                <p className="text-red-600 font-medium">{bioError}</p>
              ) : (
                <p className="text-slate-500">
                  {bioDraft.trim().length > 0 
                    ? `Mínimo ${BIO_MIN} caracteres. Opcional.`
                    : 'Deja vacío para mostrar mensaje por defecto.'
                  }
                </p>
              )}
              <p className={`font-medium ${bioDraft.length > BIO_MAX * 0.9 ? 'text-orange-600' : 'text-slate-500'}`}>
                {bioDraft.length}/{BIO_MAX}
              </p>
            </div>
          </div>

          {/* ✅ SECCIÓN HABILIDADES */}
          <div>
            <h3 className="mb-3 text-base font-semibold text-slate-900">Mis habilidades personalizadas</h3>
            {skills.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                Aún no registraste oficios. Agrega tipos de trabajo desde el flujo de "Convertirse en Fixer" para
                personalizarlos aquí.
              </p>
            ) : (
              <div className="space-y-4">
                {drafts.map((skill) => {
                  const message = errors[skill.id] ?? null;
                  return (
                    <div key={skill.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex flex-col gap-1">
                        <p className="text-base font-semibold text-slate-900">{skill.name}</p>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Descripción general</p>
                        <p className="text-sm text-slate-600">{skill.general || 'Sin descripción general registrada.'}</p>
                      </div>

                      <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor={`personal-${skill.id}`}>
                        Mi descripción personal
                      </label>
                      <textarea
                        id={`personal-${skill.id}`}
                        value={skill.personal ?? ''}
                        onChange={(event) =>
                          setDrafts((prev) =>
                            prev.map((item) => (item.id === skill.id ? { ...item, personal: event.target.value } : item))
                          )
                        }
                        maxLength={CUSTOM_MAX}
                        placeholder="Describe tu experiencia o estilo de trabajo en este oficio (opcional)"
                        rows={4}
                        className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                      <div className="mt-2 text-xs">
                        {message ? (
                          <p className="text-red-600">{message}</p>
                        ) : (
                          <p className="text-slate-500">
                            Mínimo {CUSTOM_MIN} caracteres si la defines. Déjala vacía para usar la descripción general.
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ✅ MENSAJES DE ESTADO */}
          {status && (
            <p
              className={`rounded-xl px-3 py-2 text-sm font-medium ${
                status.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-600 border border-red-200'
              }`}
            >
              {status.message}
            </p>
          )}

          {/* ✅ BOTONES DE ACCIÓN */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setBioDraft(baseBio);
                setDrafts(baseSkills.map((skill) => ({ ...skill, personal: skill.personal ?? '' })));
                setErrors({});
                setBioError(null);
                setStatus(null);
              }}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-500 hover:text-blue-600"
            >
              Restablecer
            </button>
            <button
              type="button"
              disabled={saving || !anyChanges}
              onClick={handleSave}
              className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
