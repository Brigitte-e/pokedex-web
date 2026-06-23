import { Suspense } from "react";
import { LoadingState } from "@/components/LoadingState";
import { ItemList } from "./features/ItemList";
import { PageHeader } from "@/components/PageHeader";
import { fetchItemList } from "@/app/api/items";

export default async function ItemsPage() {
  const { count } = await fetchItemList(0, 1);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <PageHeader title="Items" subtitle={`${count?.toLocaleString() ?? 0} items total`} />
      <Suspense fallback={<LoadingState variant="item-list" />}>
        <ItemList />
      </Suspense>
    </main>
  );
}
