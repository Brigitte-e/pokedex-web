import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { parsePageParam } from "@/lib/utils/parsePageParam";
import { MOVE_LIST_PAGE_SIZE } from "@/lib/constants";
import { fetchMoveList } from "@/lib/api/moves";
import { MoveList } from "./features/move-list";

export default async function MovesPage({
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<RawSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const { page: initialPage = 1 } = parsePageParam(resolvedSearchParams);
  const offset = (initialPage - 1) * MOVE_LIST_PAGE_SIZE;
  const list = await fetchMoveList(offset, MOVE_LIST_PAGE_SIZE);

  return (
    <PageContainer>
      <PageHeader
        titleKey="pages.moves.title"
        subtitleKey="pages.moves.subtitle"
        subtitleParams={{ count: list.count }}
      />
      <MoveList
        list={list}
        initialPage={initialPage}
      />
    </PageContainer>
  );
}
