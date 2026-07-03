import { LOCALE_COOKIE } from "@/lib/constants";
import type { Locale } from "@/lib/constants";

/** Remember the choice so the proxy picks this locale for future bare-path visits. */
export function setLocaleCookie(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=31536000;samesite=lax`;
}
