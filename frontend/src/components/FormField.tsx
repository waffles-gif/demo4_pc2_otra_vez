interface Props {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

// input con label y error para no repetir en login y register
function FormField({ label, type = "text", value, onChange, error }: Props) {
  return (
    <div className="mb-4">
      <label className="block mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded w-full p-2"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}

export default FormField;
