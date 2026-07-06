"use client";

import type { ReactNode } from "react";

type AdminFormFieldProps = {
  label: string;
  children: ReactNode;
  className?: string;
};

export function AdminFormField({
  label,
  children,
  className = "",
}: AdminFormFieldProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-[var(--cyber-text)] mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
