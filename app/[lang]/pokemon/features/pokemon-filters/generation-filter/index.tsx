"use client";

import { Select } from "@/components/Select";
import { useGenerationListQuery } from "@/app/[lang]/pokemon/hooks/useGenerationFilterQuery";

interface Props {
  selected: string | null;
  onChange: (generation: string | null) => void;
}

const GenerationFilter = ({ selected, onChange }: Props) => {
  const { data: generations = [], isError } = useGenerationListQuery();

  // On error keep the control mounted with the current selection so the user can still clear an active filter.
  // Pass an empty list — Select renders just the "All generations" option.
  return (
    <Select
      generations={isError ? [] : generations}
      selected={selected}
      onChange={onChange}
    />
  );
};

export { GenerationFilter };
