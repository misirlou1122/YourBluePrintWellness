import type { ChangeEvent } from "react";

interface BaseFieldProps {
  label: string;
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
}

interface FormFieldProps extends BaseFieldProps {
  type?: "text" | "number" | "date" | "time" | "datetime-local";
}

interface TextAreaFieldProps extends BaseFieldProps {
  rows?: number;
}

interface SelectFieldProps extends BaseFieldProps {
  options: string[];
}

const inputClass =
  "min-h-12 rounded-2xl border border-white/10 bg-midnight/55 px-4 text-sm text-white outline-none placeholder:text-periwinkle/45 focus:border-ice/60 focus:ring-2 focus:ring-ice/20";

export function FormField({ label, value, placeholder, onChange, type = "text", className = "" }: FormFieldProps) {
  return (
    <label className={`grid gap-1 text-sm text-periwinkle/85 ${className}`}>
      <span>{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder ?? `${label}...`}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange?.(event.target.value)}
        className={inputClass}
      />
    </label>
  );
}

export function TextAreaField({ label, value, placeholder, onChange, rows = 4, className = "" }: TextAreaFieldProps) {
  return (
    <label className={`grid gap-1 text-sm text-periwinkle/85 ${className}`}>
      <span>{label}</span>
      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder ?? `${label}...`}
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => onChange?.(event.target.value)}
        className={`${inputClass} min-h-28 resize-none py-3 leading-6`}
      />
    </label>
  );
}

export function SelectField({ label, value, options, onChange, className = "" }: SelectFieldProps) {
  return (
    <label className={`grid gap-1 text-sm text-periwinkle/85 ${className}`}>
      <span>{label}</span>
      <select
        value={value}
        onChange={(event: ChangeEvent<HTMLSelectElement>) => onChange?.(event.target.value)}
        className={inputClass}
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-midnight text-white">
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
