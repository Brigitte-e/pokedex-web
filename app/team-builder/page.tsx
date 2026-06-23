import { TeamBuilder } from "./features/TeamBuilder";
import { PageHeader } from "@/components/PageHeader";
import { t } from "@/lib/i18n";

export default function TeamBuilderPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <PageHeader title={t("pages.teamBuilder.title")} subtitle={t("pages.teamBuilder.subtitle")} />
      <TeamBuilder />
    </main>
  );
}
