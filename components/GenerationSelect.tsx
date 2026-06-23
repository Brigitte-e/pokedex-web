"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface GenerationOption {
  name: string;
}

interface GenerationSelectProps {
  generations: GenerationOption[];
  selected: string | null;
  onChange: (generation: string | null) => void;
}

export function formatGenerationLabel(name: string): string {
  const suffix = name.replace("generation-", "").toUpperCase();
  return `Generation ${suffix}`;
}

export function GenerationSelect({ generations, selected, onChange }: GenerationSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const label = selected ? formatGenerationLabel(selected) : "Filter by generation";

  return (
    <div ref={containerRef} className="relative w-56">
      <div
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        tabIndex={0}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => e.key === "Enter" && setOpen((o) => !o)}
        className={cn(
          "flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium transition-colors hover:border-pk-yellow/50",
          open && "border-pk-yellow/50",
        )}
      >
        <span className={cn("truncate", !selected && "text-muted-foreground")}>{label}</span>
        <ChevronDown
          size={16}
          className={cn("shrink-0 text-muted-foreground transition-transform", open && "rotate-180")}
        />
      </div>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-xl border border-border bg-card shadow-xl shadow-black/40">
          <ul role="listbox" className="max-h-56 overflow-y-auto py-1">
            <li
              role="option"
              aria-selected={!selected}
              onClick={() => {
                onChange(null);
                setOpen(false);
              }}
              className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-muted/50 select-none"
            >
              <span className="flex-1 text-muted-foreground">All generations</span>
              {!selected && <Check size={14} className="shrink-0 text-pk-yellow" />}
            </li>
            {generations.map((gen) => {
              const isSelected = selected === gen.name;
              return (
                <li
                  key={gen.name}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(gen.name);
                    setOpen(false);
                  }}
                  className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-muted/50 select-none"
                >
                  <span className="flex-1">{formatGenerationLabel(gen.name)}</span>
                  {isSelected && <Check size={14} className="shrink-0 text-pk-yellow" />}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
