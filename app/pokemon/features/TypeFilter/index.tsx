"use client";

import { TypeMultiSelect } from "@/components/TypeMultiSelect";
import { useTypeListQuery } from "../../hooks/useTypeFilterQuery";

interface Props {
  selected: string[];
  onChange: (types: string[]) => void;
}

export function TypeFilter({ selected, onChange }: Props) {
  const { data: types = [], isError } = useTypeListQuery();

  // On error keep the control mounted so the user can still clear active filters.
  // Pass an empty list — TypeMultiSelect shows "No types found" but stays interactive.
  return (
    <TypeMultiSelect
      types={isError ? [] : types}
      selected={isError ? [] : selected}
      onChange={isError ? () => {} : onChange}
    />
  );
}
