type StepProgressProps = {
  current: number;
  total?: number;
};

export default function StepProgress({ current, total = 5 }: StepProgressProps) {
  const ratio = Math.min(total, Math.max(0, current)) / total;
  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs font-medium text-slate-500">
        <span>
          Paso {current} de {total}
        </span>
      </div>
      <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
        <div
          className="h-2 rounded-full bg-blue-600 transition-all"
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
    </div>
  );
}

