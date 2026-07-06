import "server-only";
import { cache } from "react";
import type { Locale } from "@/lib/constants";
import { getMessages } from "@/lib/i18n/core";

export type { Locale, Messages } from "@/lib/i18n/core";

// Server-only dictionary loader. Used for localized metadata (SEO) where the
// request locale is the only translation source available on the server.
export const getDictionary = cache(async function getDictionary(locale: Locale) {
  return getMessages(locale);
});
