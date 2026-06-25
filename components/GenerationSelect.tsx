"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatGenerationLabel, t } from "@/lib/i18n";

interface GenerationOption {
  name: string;
}

interface GenerationSelectProps {
  generations: GenerationOption[];
  selected: string | null;
  onChange: (generation: string | null) => void;
}

export { formatGenerationLabel };

export function GenerationSelect({ generations, selected, onChange }: GenerationSelectProps) {
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const uid = useId();
  const listboxId = `${uid}-listbox`;

  const allOptions: Array<string | null> = useMemo(
    () => [null, ...generations.map((g) => g.name)],
    [generations],
  );

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setFocusedIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  function selectOption(value: string | null) {
    onChange(value);
    setOpen(false);
    setFocusedIndex(-1);
  }

  function handleTriggerKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((o) => {
        if (o) setFocusedIndex(-1);
        return !o;
      });
    } else if (e.key === "ArrowDown" && !open) {
      e.preventDefault();
      setOpen(true);
      setFocusedIndex(0);
    } else if (e.key === "Escape") {
      setOpen(false);
      setFocusedIndex(-1);
    }
  }

  function moveFocus(next: number) {
    setFocusedIndex(next);
    const items = listRef.current?.querySelectorAll<HTMLElement>('[role="option"]');
    items?.[next]?.scrollIntoView({ block: "nearest" });
  }

  function handleListKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      moveFocus(Math.min(focusedIndex + 1, allOptions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      moveFocus(Math.max(focusedIndex - 1, 0));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < allOptions.length) {
        selectOption(allOptions[focusedIndex] ?? null);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setFocusedIndex(-1);
    }
  }

  const focusedOptionId = focusedIndex >= 0 ? `${uid}-option-${focusedIndex}` : undefined;
  const label = selected ? formatGenerationLabel(selected) : t("generationFilter.filterByGeneration");

  return (
    <div ref={containerRef} className="relative w-56">
      <div
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-activedescendant={focusedOptionId}
        tabIndex={0}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleTriggerKeyDown}
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
          <ul
            id={listboxId}
            ref={listRef}
            role="listbox"
            tabIndex={-1}
            onKeyDown={handleListKeyDown}
            className="max-h-56 overflow-y-auto py-1 outline-none"
          >
            <li
              id={`${uid}-option-0`}
              role="option"
              aria-selected={!selected}
              tabIndex={-1}
              onClick={() => selectOption(null)}
              onMouseEnter={() => setFocusedIndex(0)}
              className={cn(
                "flex cursor-pointer items-center gap-2 px-3 py-2 text-sm select-none",
                focusedIndex === 0 ? "bg-muted/70" : "hover:bg-muted/50"
              )}
            >
              <span className="flex-1 text-muted-foreground">{t("generationFilter.allGenerations")}</span>
              {!selected && <Check size={14} className="shrink-0 text-pk-yellow" />}
            </li>
            {generations.map((gen, idx) => {
              const isSelected = selected === gen.name;
              const itemIndex = idx + 1;
              return (
                <li
                  id={`${uid}-option-${itemIndex}`}
                  key={gen.name}
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={-1}
                  onClick={() => selectOption(gen.name)}
                  onMouseEnter={() => setFocusedIndex(itemIndex)}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 px-3 py-2 text-sm select-none",
                    focusedIndex === itemIndex ? "bg-muted/70" : "hover:bg-muted/50"
                  )}
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
