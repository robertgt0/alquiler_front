'use client';

import { useEffect, useState } from 'react';

export type SkillDisplay = {
  id: string;
  name: string;
  general: string;
  personal?: string;
  source: 'personal' | 'general';
};

type Props = {
  initialSkills: SkillDisplay[];
};

export default function FixerSkillsList({ initialSkills }: Props) {
  const [skills, setSkills] = useState<SkillDisplay[]>(initialSkills);

  useEffect(() => {
    setSkills(initialSkills);
  }, [initialSkills]);

  useEffect(() => {
    function handleUpdate(event: Event) {
      const detail = (event as CustomEvent<{ skills: SkillDisplay[] }>).detail;
      if (detail?.skills) {
        setSkills(detail.skills);
      }
    }
    window.addEventListener('fixer-skills-updated', handleUpdate as EventListener);
    return () => window.removeEventListener('fixer-skills-updated', handleUpdate as EventListener);
  }, []);

  if (!skills.length) {
    return (
      <div className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-500">
        Sin habilidades registradas.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {skills.map((skill) => {
        const badgeLabel = skill.personal ? 'Descripción personalizada' : 'Descripción general';
        const badgeClass = skill.personal
          ? 'bg-purple-100 text-purple-700 border border-purple-200'
          : 'bg-slate-200 text-slate-700 border border-slate-300';
        return (
          <div key={`${skill.id}-${skill.name}`} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{skill.name}</p>
                <p className="mt-2 text-sm text-slate-600">{skill.personal ?? skill.general}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>{badgeLabel}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
