import { Suspense } from "react";
import { LoadingState } from "@/components/LoadingState";
import { ItemList } from "./features/ItemList";
import { PageHeader } from "@/components/PageHeader";
import { fetchItemList } from "@/app/api/items";
import { t } from "@/lib/i18n";

export default async function ItemsPage() {
  const { count } = await fetchItemList(0, 1);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <PageHeader
        title={t("pages.items.title")}
        subtitle={t("pages.items.subtitle", { count: count?.toLocaleString() ?? 0 })}
      />
      <Suspense fallback={<LoadingState variant="item-list" />}>
        <ItemList />
      </Suspense>
    </main>
  );
}
