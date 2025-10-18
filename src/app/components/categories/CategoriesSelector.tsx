"use client";
import { useEffect, useState } from "react";
import type { Category } from "@/types/fixer";
import { fetchCategories } from "@/lib/api/categories";

export default function CategoriesSelector({
  value, onChange, refreshKey = 0
}: { value: string[]; onChange: (ids: string[]) => void; refreshKey?: number }) {
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchCategories().then(setCats).finally(()=> setLoading(false));
  }, [refreshKey]);

  if (loading) return <p>Cargando categorías...</p>;

  const toggle = (id: string) => {
    const next = value.includes(id) ? value.filter(i => i !== id) : [...value, id];
    onChange(next);
  };

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {cats.map(c => (
        <label key={c.id} className="flex items-center gap-2 cursor-pointer border rounded-lg p-2 hover:bg-gray-50">
          <input type="checkbox" checked={value.includes(c.id)} onChange={() => toggle(c.id)} />
          <span>{c.name}</span>
        </label>
      ))}
    </div>
  );
}
