"use client";

import { TypeMultiSelect } from "@/components/TypeMultiSelect";
import { useTypeListQuery } from "../../hooks/useTypeFilterQuery";

interface Props {
  selected: string[];
  onChange: (types: string[]) => void;
}

export function TypeFilter({ selected, onChange }: Props) {
  const { data: types = [] } = useTypeListQuery();

  return (
    <TypeMultiSelect types={types} selected={selected} onChange={onChange} />
  );
}
