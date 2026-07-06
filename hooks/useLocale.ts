"use client";

import { useParams } from "next/navigation";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/constants";

export function useLocale(): Locale {
  const lang = useParams<{ lang?: string }>()?.lang;
  return (LOCALES as readonly string[]).includes(lang ?? "")
    ? (lang as Locale)
    : DEFAULT_LOCALE;
}
