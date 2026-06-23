import { Suspense } from "react";
import { LoadingState } from "@/components/LoadingState";
import { TypeGrid } from "./features/TypeGrid";
import { PageHeader } from "@/components/PageHeader";
import { t } from "@/lib/i18n";

export default async function TypesPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <PageHeader title={t("pages.types.title")} subtitle={t("pages.types.subtitle")} />
      <Suspense fallback={<LoadingState variant="type-grid" />}>
        <TypeGrid />
      </Suspense>
    </main>
  );
}
