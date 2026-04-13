"use client";

import clsx from "clsx";

type EditableFieldProps = {
  value: string;
  isEditMode: boolean;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
};

export default function EditableField({ value, isEditMode, onChange, placeholder, className }: EditableFieldProps) {
  return isEditMode ? (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={clsx("border rounded px-2 py-1 w-full", className)}
    />
  ) : (
    <p className={className}>{value}</p>
  );
}