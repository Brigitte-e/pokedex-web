import en from "@/messages/en.json";

type Params = Record<string, string | number>;

function getMessage(obj: Record<string, unknown>, path: string): string {
  const value = path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);

  return typeof value === "string" ? value : path;
}

export function t(key: string, params?: Params): string {
  let message = getMessage(en, key);

  if (params) {
    for (const [name, value] of Object.entries(params)) {
      message = message.replaceAll(`{${name}}`, String(value));
    }
  }

  return message;
}

export function formatGenerationLabel(name: string): string {
  const suffix = name.replace("generation-", "").toUpperCase();
  return t("generationFilter.generation", { suffix });
}
