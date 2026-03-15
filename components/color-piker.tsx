"use client";

import { useState } from "react";
import { badgeColors, BadgeColor } from "@/lib/constants/badge-colors";
import { cn } from "@/lib/utils";

type Props = {
  value?: BadgeColor;
  onChange: (color: BadgeColor) => void;
};

export function BadgeColorPicker({ value = "gray", onChange }: Props) {
  const [open, setOpen] = useState(false);

  const getColorClass = (color: BadgeColor) => {
    if (color === "gray") return "bg-gray-200";
    return `bg-${color}-primary`;
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "h-12 w-12 rounded-full border transition",
          value ? getColorClass(value) : "bg-transparent border-gray-300"
        )}
      />

      {open && (
        <div className="absolute top-0 left-15 grid grid-cols-2 gap-2 bg-white p-4 rounded-primary shadow-md">
          {badgeColors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => {
                onChange(color);
                setOpen(false);
              }}
              className={cn(
                "h-6 w-6 rounded-full cursor-pointer transition",
                getColorClass(color),
                value === color && "scale-125 ring-2 ring-black"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}