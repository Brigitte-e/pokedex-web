"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronDown, X, Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_TYPE_COLOR, TYPE_COLORS, TYPE_FILTER_PAGE_SIZE } from "@/lib/constants";
import { capitalize } from "@/lib/pokeapi";
import { t } from "@/lib/i18n";

interface TypeOption {
  name: string;
}

interface TypeMultiSelectProps {
  types: TypeOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function TypeMultiSelect({ types, selected, onChange }: TypeMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(TYPE_FILTER_PAGE_SIZE);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const uid = useId();
  const listboxId = `${uid}-listbox`;

  // O(1) lookup instead of O(n) selected.includes on every render
  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const filtered = useMemo(
    () => types.filter((type) => type.name.toLowerCase().includes(search.toLowerCase())),
    [types, search]
  );
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  useEffect(() => {
    if (open) {
      searchRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
        setVisibleCount(TYPE_FILTER_PAGE_SIZE);
        setFocusedIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  function handleScroll() {
    const el = listRef.current;
    if (!el || !hasMore) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40) {
      setVisibleCount((c) => c + TYPE_FILTER_PAGE_SIZE);
    }
  }

  function toggle(name: string) {
    onChange(
      selectedSet.has(name)
        ? selected.filter((s) => s !== name)
        : [...selected, name]
    );
  }

  function clearAll() {
    onChange([]);
  }

  function updateSearch(value: string) {
    setSearch(value);
    setVisibleCount(TYPE_FILTER_PAGE_SIZE);
    setFocusedIndex(-1);
  }

  function handleTriggerKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((o) => {
        if (o) {
          setSearch("");
          setVisibleCount(TYPE_FILTER_PAGE_SIZE);
          setFocusedIndex(-1);
        }
        return !o;
      });
    } else if (e.key === "Escape") {
      setOpen(false);
      setSearch("");
      setVisibleCount(TYPE_FILTER_PAGE_SIZE);
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
      moveFocus(Math.min(focusedIndex + 1, visible.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      moveFocus(Math.max(focusedIndex - 1, 0));
    } else if ((e.key === "Enter" || e.key === " ") && focusedIndex >= 0) {
      e.preventDefault();
      const item = visible[focusedIndex];
      if (item) toggle(item.name);
    } else if (e.key === "Escape") {
      setOpen(false);
      setSearch("");
      setVisibleCount(TYPE_FILTER_PAGE_SIZE);
      setFocusedIndex(-1);
    }
  }

  const focusedOptionId = focusedIndex >= 0 ? `${uid}-option-${focusedIndex}` : undefined;

  const label =
    selected.length === 0
      ? t("typeFilter.filterByType")
      : selected.length === 1
        ? capitalize(selected[0])
        : t("typeFilter.typesSelected", { count: selected.length });

  return (
    <div ref={containerRef} className="relative w-64">
      {/* Trigger */}
      <div
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-activedescendant={focusedOptionId}
        tabIndex={0}
        onClick={() => setOpen((o) => {
          if (o) {
            setSearch("");
            setVisibleCount(TYPE_FILTER_PAGE_SIZE);
            setFocusedIndex(-1);
          }
          return !o;
        })}
        onKeyDown={handleTriggerKeyDown}
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
              aria-label={t("typeFilter.clearAll")}
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
              onChange={(e) => updateSearch(e.target.value)}
              placeholder={t("typeFilter.searchPlaceholder")}
              aria-label={t("typeFilter.searchPlaceholder")}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {search && (
              <button onClick={() => updateSearch("")} className="text-muted-foreground hover:text-foreground" aria-label={t("typeFilter.clearSearch")}>
                <X size={12} />
              </button>
            )}
          </div>

          {/* List */}
          <ul
            id={listboxId}
            ref={listRef}
            onScroll={handleScroll}
            onKeyDown={handleListKeyDown}
            role="listbox"
            aria-multiselectable="true"
            tabIndex={-1}
            className="max-h-56 overflow-y-auto py-1 outline-none"
          >
            {visible.length === 0 && (
              <li className="px-3 py-2 text-xs text-muted-foreground">{t("typeFilter.noTypesFound")}</li>
            )}
            {visible.map((type, index) => {
              const isSelected = selectedSet.has(type.name);
              const isFocused = index === focusedIndex;
              const color = TYPE_COLORS[type.name] ?? DEFAULT_TYPE_COLOR;
              return (
                <li
                  id={`${uid}-option-${index}`}
                  key={type.name}
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={-1}
                  onClick={() => toggle(type.name)}
                  onMouseEnter={() => setFocusedIndex(index)}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 px-3 py-2 text-sm select-none",
                    isFocused ? "bg-muted/70" : "hover:bg-muted/50"
                  )}
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
                {t("typeFilter.scrollForMore")}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

function TypeBadge({ name, onRemove }: { name: string; onRemove: () => void }) {
  const color = TYPE_COLORS[name] ?? DEFAULT_TYPE_COLOR;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold uppercase text-white"
      style={{ backgroundColor: color }}
    >
      {name}
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="opacity-70 hover:opacity-100"
        aria-label={t("typeFilter.removeType", { name })}
      >
        <X size={10} />
      </button>
    </span>
  );
}
