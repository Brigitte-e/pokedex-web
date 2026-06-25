"use client";

import { GenerationSelect } from "@/components/GenerationSelect";
import { useGenerationListQuery } from "../../hooks/useGenerationFilterQuery";

interface Props {
  selected: string | null;
  onChange: (generation: string | null) => void;
}

export function GenerationFilter({ selected, onChange }: Props) {
  const { data: generations = [], isError } = useGenerationListQuery();

  // On error keep the control mounted so the user can still clear an active filter.
  // Pass an empty list — GenerationSelect renders just the "All generations" option.
  return (
    <GenerationSelect
      generations={isError ? [] : generations}
      selected={isError ? null : selected}
      onChange={isError ? () => {} : onChange}
    />
  );
}
