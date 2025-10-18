interface TimeInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: string;
  max?: string;
  step?: number;
  disabled?: boolean;
}

export default function TimeInput({
  label, value, onChange, min, max, step = 1800, disabled
}: TimeInputProps) {
  return (
    <div>
      <label className="text-gray-700 text-sm Poppins">{label}</label>
      <input
        type="time"
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className="w-full border border-gray-300 rounded-lg px-3 mt-1
                   h-12 sm:h-11 text-base sm:text-[15px]
                   focus:ring-2 focus:ring-blue-600 outline-none
                   text-black bg-white appearance-none disabled:opacity-70"
        required
      />
    </div>
  );
}
