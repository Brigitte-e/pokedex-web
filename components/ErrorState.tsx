import { t } from "@/lib/i18n";

export interface ErrorStateProps {
  message?: string;
}

export function ErrorState({ message = t("common.errorDefault") }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 px-5 py-4 text-sm text-destructive"
    >
      <span className="text-lg">⚠</span>
      {message}
    </div>
  );
}
