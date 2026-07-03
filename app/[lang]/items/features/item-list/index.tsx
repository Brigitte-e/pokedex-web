import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { fetchItem } from "@/lib/api/items";
import { DEFAULT_LOCALE } from "@/lib/constants";
import { ItemListClient } from "./ItemListClient";
import type { ItemModalLabels } from "@/components/ItemModal";
import type { ListResponse } from "@/types";
import type { Locale } from "@/lib/constants";

interface ListLabels {
  previous: string;
  next: string;
  pageOfTotalPattern: string;
  pagination: string;
  loading: string;
  errorDefault: string;
}

interface Props {
  list: ListResponse;
  initialPage: number;
  itemModalLabels: ItemModalLabels;
  listLabels: ListLabels;
  locale?: Locale;
}

export async function ItemList({ list, initialPage, itemModalLabels, listLabels, locale = DEFAULT_LOCALE }: Props) {
  const queryClient = new QueryClient();
  queryClient.setQueryData(["item-list", initialPage], list);

  // Item details are only needed up front for localized display names; for the
  // default locale the capitalized slug suffices and the modal fetches on demand.
  if (locale !== DEFAULT_LOCALE) {
    await Promise.all(
      list.results.map((item) =>
        fetchItem(item.name)
          .then((data) => queryClient.setQueryData(["item", item.name], data))
          .catch(() => null)
      )
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ItemListClient itemModalLabels={itemModalLabels} listLabels={listLabels} locale={locale} />
    </HydrationBoundary>
  );
}
