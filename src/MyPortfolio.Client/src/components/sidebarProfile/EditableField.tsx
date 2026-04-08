"use client";

type EditableFieldProps = {
  value: string;
  isEditMode: boolean;
  onChange: (val: string) => void;
  placeholder?: string;
};

export default function EditableField({ value, isEditMode, onChange, placeholder }: EditableFieldProps) {
  return isEditMode ? (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="border rounded px-2 py-1 w-full"
    />
  ) : (
    <p>{value}</p>
  );
}