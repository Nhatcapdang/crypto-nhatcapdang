import React from 'react';

type Props = Readonly<{
  children: React.ReactNode;
  label: React.ReactNode;
}>;

export function FeaturePanel({ children, label }: Props) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">{label}</span>
      <span className="w-full">{children}</span>
    </div>
  );
}
