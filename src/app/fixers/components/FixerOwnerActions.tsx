'use client';

import { useEffect, useMemo, useState } from 'react';
import { updateCategories } from '@/lib/api/fixer';
import { useClientSession } from '@/lib/auth/useSession';
import type { SkillDisplay } from './FixerSkillsList';

type Props = {
  fixerId: string;
  skills: SkillDisplay[];
};

const CUSTOM_MIN = 10;
const CUSTOM_MAX = 800;

export default function FixerOwnerActions({ fixerId, skills }: Props) {
  const { user } = useClientSession();
  const isOwner = user?.fixerId === fixerId;
  const [open, setOpen] = useState(false);
  const [baseSkills, setBaseSkills] = useState<SkillDisplay[]>(skills);
  const [drafts, setDrafts] = useState(() => skills.map((skill) => ({ ...skill, personal: skill.personal ?? '' })));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setBaseSkills(skills);
    setDrafts(skills.map((skill) => ({ ...skill, personal: skill.personal ?? '' })));
    setErrors({});
    setStatus(null);
  }, [skills]);

  const anyChanges = useMemo(() => {
    return drafts.some((draft, index) => {
      const original = skills[index];
      const originalText = (original?.personal ?? '').trim();
      return (draft.personal ?? '').trim() !== originalText;
    });
  }, [drafts, skills]);

  if (!isOwner) return null;

  async function handleSave() {
    const validation: Record<string, string> = {};
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
    if (Object.keys(validation).length) {
      setStatus({ type: 'error', message: 'Corrige las descripciones marcadas antes de guardar.' });
      return;
    }

    try {
      setSaving(true);
      setStatus(null);
      await updateCategories(fixerId, {
        categories: drafts.map((skill) => skill.id),
        skills: payload,
      });
      const normalizedDrafts = drafts.map((skill) => {
        const text = (skill.personal ?? '').trim();
        return {
          ...skill,
          personal: text || undefined,
          source: text ? 'personal' : 'general',
        };
      });
      setBaseSkills(normalizedDrafts);
      setDrafts(normalizedDrafts);
      setStatus({ type: 'success', message: 'Descripciones actualizadas correctamente.' });
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
          <p className="text-sm font-semibold text-slate-900">Gestiona tus descripciones personales</p>
          <p className="text-xs text-slate-500">
            Estas descripciones reemplazan la general solo en tu perfil. Los requesters verán tu estilo propio.
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
        <div className="mt-6 space-y-4">
          {skills.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
              Aún no registraste oficios. Agrega tipos de trabajo desde el flujo de “Convertirse en Fixer” para
              personalizarlos aquí.
            </p>
          ) : (
            <>
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

              {status && (
                <p
                  className={`rounded-xl px-3 py-2 text-sm ${
                    status.type === 'success'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-600'
                  }`}
                >
                  {status.message}
                </p>
              )}

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                onClick={() => {
                  setDrafts(baseSkills.map((skill) => ({ ...skill, personal: skill.personal ?? '' })));
                  setErrors({});
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
            </>
          )}
        </div>
      )}
    </section>
  );
}
