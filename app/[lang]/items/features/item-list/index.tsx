import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { fetchItem } from "@/lib/api/items";
import { ItemListClient } from "./ItemListClient";
import type { ListResponse } from "@/types";

interface Props {
  list: ListResponse;
  initialPage: number;
}

const ItemList = async ({ list, initialPage }: Props) => {
  const queryClient = new QueryClient();
  queryClient.setQueryData(["item-list", initialPage], list);

  await Promise.all(
    list.results.map((item) =>
      fetchItem(item.name)
        .then((data) => queryClient.setQueryData(["item", item.name], data))
        .catch(() => null),
    ),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ItemListClient initialPage={initialPage} />
    </HydrationBoundary>
  );
};

export { ItemList };
