import { Suspense } from "react";
import { LoadingState } from "@/components/LoadingState";
import { MoveList } from "./features/MoveList";
import { PageHeader } from "@/components/PageHeader";
import { fetchMoveList } from "@/app/api/moves";
import { t } from "@/lib/i18n";

export default async function MovesPage() {
  const { count } = await fetchMoveList(0, 1);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <PageHeader
        title={t("pages.moves.title")}
        subtitle={t("pages.moves.subtitle", { count: count?.toLocaleString() ?? 0 })}
      />
      <Suspense fallback={<LoadingState variant="move-list" />}>
        <MoveList />
      </Suspense>
    </main>
  );
}
