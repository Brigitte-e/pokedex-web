import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { fetchMove } from "@/lib/api/moves";
import { MoveListClient } from "./MoveListClient";
import type { ListResponse } from "@/types";

interface Props {
  list: ListResponse;
  initialPage: number;
}

const MoveList = async ({ list, initialPage }: Props) => {
  const queryClient = new QueryClient();
  queryClient.setQueryData(["move-list", initialPage], list);

  await Promise.all(
    list.results.map((m) =>
      fetchMove(m.name)
        .then((move) => queryClient.setQueryData(["move", m.name], move))
        .catch(() => null),
    ),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MoveListClient initialPage={initialPage} />
    </HydrationBoundary>
  );
};

export { MoveList };
