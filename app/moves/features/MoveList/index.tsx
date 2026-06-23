import { fetchMoveList } from "@/app/api/moves";
import { MoveListClient } from "./MoveListClient";
import { PAGE_SIZE, type MoveListInitialData } from "../../hooks/useMoveListQuery";

export async function MoveList() {
  const data = await fetchMoveList(0, PAGE_SIZE);

  const initialData: MoveListInitialData = {
    pages: [data],
    pageParams: [1],
  };

  return <MoveListClient initialData={initialData} />;
}
