
import React from "react";

interface FilterHeaderProps {
  title: string;
  description: string;
}

export function FilterHeader({ title, description }: FilterHeaderProps) {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-montserrat font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">
        {description}
      </p>
    </div>
  );
}
