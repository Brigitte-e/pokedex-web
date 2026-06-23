"use client";

import { GenerationSelect } from "@/components/GenerationSelect";
import { useGenerationListQuery } from "../../hooks/useGenerationFilterQuery";

interface Props {
  selected: string | null;
  onChange: (generation: string | null) => void;
}

export function GenerationFilter({ selected, onChange }: Props) {
  const { data: generations = [] } = useGenerationListQuery();

  return (
    <GenerationSelect generations={generations} selected={selected} onChange={onChange} />
  );
}
