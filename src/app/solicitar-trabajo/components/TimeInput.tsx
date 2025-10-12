interface TimeInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function TimeInput({ label, value, onChange }: TimeInputProps) {
  return (
    <div>
      <label className="text-gray-700 text-sm Poppins">{label}</label>
      <input
        type="time"
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 
                   focus:ring-2 focus:ring-blue-600 
                   text-black bg-white appearance-none"
        required
      />
    </div>
  );
}
