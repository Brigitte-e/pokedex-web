import type { Locale } from "@/lib/constants";
import en from "@/messages/en.json";
import es from "@/messages/es.json";
import de from "@/messages/de.json";

export type { Locale };
export type Messages = typeof en;
type Params = Record<string, string | number>;

const messages: Record<Locale, Messages> = { en, es, de };

export function getMessages(locale: Locale): Messages {
  return messages[locale] ?? messages.en;
}

export function t(dict: Messages, key: string, params?: Params): string {
  const value = key.split(".").reduce<unknown>((acc, k) => {
    if (acc && typeof acc === "object" && k in acc) {
      return (acc as Record<string, unknown>)[k];
    }
    return undefined;
  }, dict as unknown as Record<string, unknown>);

  let message = typeof value === "string" ? value : key;

  if (params) {
    for (const [name, val] of Object.entries(params)) {
      message = message.replaceAll(`{${name}}`, String(val));
    }
  }
  return message;
}
