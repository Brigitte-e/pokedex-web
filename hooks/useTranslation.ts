"use client";

import { useMemo } from "react";
import { getMessages, t } from "@/lib/i18n/core";
import { useLocale } from "@/hooks/useLocale";

export function useTranslation() {
  const locale = useLocale();
  return useMemo(() => {
    const dict = getMessages(locale);
    return {
      locale,
      t: (key: string, params?: Record<string, string | number>) => t(dict, key, params),
    };
  }, [locale]);
}
