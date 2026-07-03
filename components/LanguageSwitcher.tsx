"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { LOCALES } from "@/lib/constants";
import { setLocaleCookie } from "@/lib/locale-cookie";
import type { Locale } from "@/lib/constants";

interface LanguageSwitcherProps {
  locale: Locale;
}

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  function navigate(lang: Locale) {
    setOpen(false);
    if (lang === locale) return;
    setLocaleCookie(lang);
    const newPath = pathname.replace(
      new RegExp(`^/${locale}(?=/|$)`),
      `/${lang}`,
    );
    router.push(newPath);
  }

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
        className="flex items-center justify-center gap-1 rounded-md border border-border bg-pk-darker px-2.5 py-1 text-xs font-semibold text-foreground transition-colors hover:border-pk-red focus:outline-none focus:ring-2 focus:ring-pk-red"
      >
        {locale.toUpperCase()}
        <svg
          className={cn("h-3 w-3 transition-transform", open && "rotate-180")}
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2 4l4 4 4-4" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Language"
          className="absolute right-0 top-full mt-1.5 min-w-[4rem] overflow-hidden rounded-md border border-border bg-pk-darker shadow-lg shadow-black/40"
        >
          {LOCALES.map((lang) => (
            <li key={lang} role="option" aria-selected={lang === locale}>
              <button
                onClick={() => navigate(lang)}
                className={cn(
                  "w-full px-3 py-1.5 text-left text-xs font-semibold transition-colors",
                  lang === locale
                    ? "bg-pk-red text-white"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {lang.toUpperCase()}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
