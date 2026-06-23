"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, X, Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { capitalize, TYPE_COLORS } from "@/lib/pokeapi";

interface TypeOption {
  name: string;
}

interface TypeMultiSelectProps {
  types: TypeOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

const PAGE_SIZE = 10;

export function TypeMultiSelect({ types, selected, onChange }: TypeMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = types.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  useEffect(() => {
    setTimeout(() => setVisibleCount(PAGE_SIZE), 0);
  }, [search]);

  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 0);
    } else {
      setTimeout(() => { setSearch(""); setVisibleCount(PAGE_SIZE); }, 0);
    }
  }, [open]);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  function handleScroll() {
    const el = listRef.current;
    if (!el || !hasMore) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40) {
      setVisibleCount((c) => c + PAGE_SIZE);
    }
  }

  function toggle(name: string) {
    onChange(
      selected.includes(name)
        ? selected.filter((s) => s !== name)
        : [...selected, name]
    );
  }

  function clearAll() {
    onChange([]);
  }

  const label =
    selected.length === 0
      ? "Filter by type"
      : selected.length === 1
        ? capitalize(selected[0])
        : `${selected.length} types selected`;

  return (
    <div ref={containerRef} className="relative w-64">
      {/* Trigger */}
      <div
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        tabIndex={0}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => e.key === "Enter" && setOpen((o) => !o)}
        className={cn(
          "flex w-full cursor-pointer items-start justify-between gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium transition-colors hover:border-pk-yellow/50",
          open && "border-pk-yellow/50"
        )}
      >
        <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
          {selected.length === 0 ? (
            <span className="text-muted-foreground">{label}</span>
          ) : (
            <span className="flex flex-wrap gap-1">
              {selected.map((name) => (
                <TypeBadge key={name} name={name} onRemove={() => toggle(name)} />
              ))}
            </span>
          )}
        </span>
        <span className="flex shrink-0 items-center gap-1 mt-0.5">
          {selected.length > 0 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); clearAll(); }}
              className="rounded-full p-0.5 text-muted-foreground hover:text-foreground"
              aria-label="Clear all"
            >
              <X size={14} />
            </button>
          )}
          <ChevronDown
            size={16}
            className={cn(
              "text-muted-foreground transition-transform",
              open && "rotate-180"
            )}
          />
        </span>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-xl border border-border bg-card shadow-xl shadow-black/40">
          {/* Search */}
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Search size={14} className="shrink-0 text-muted-foreground" />
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search types…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground">
                <X size={12} />
              </button>
            )}
          </div>

          {/* List */}
          <ul
            ref={listRef}
            onScroll={handleScroll}
            role="listbox"
            aria-multiselectable="true"
            className="max-h-56 overflow-y-auto py-1"
          >
            {visible.length === 0 && (
              <li className="px-3 py-2 text-xs text-muted-foreground">No types found</li>
            )}
            {visible.map((type) => {
              const isSelected = selected.includes(type.name);
              const color = TYPE_COLORS[type.name] ?? "#888";
              return (
                <li
                  key={type.name}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => toggle(type.name)}
                  className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-muted/50 select-none"
                >
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="flex-1">{capitalize(type.name)}</span>
                  {isSelected && (
                    <Check size={14} className="shrink-0 text-pk-yellow" />
                  )}
                </li>
              );
            })}
            {hasMore && (
              <li className="px-3 py-1 text-center text-xs text-muted-foreground">
                Scroll for more…
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

function TypeBadge({ name, onRemove }: { name: string; onRemove: () => void }) {
  const color = TYPE_COLORS[name] ?? "#888";
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold uppercase text-white"
      style={{ backgroundColor: color }}
    >
      {name}
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="opacity-70 hover:opacity-100"
        aria-label={`Remove ${name}`}
      >
        <X size={10} />
      </button>
    </span>
  );
}
