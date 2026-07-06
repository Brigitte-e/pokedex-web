"use client";

import { MultiSelect } from "@/components/MultiSelect";
import { useTypeFilterOptions } from "@/app/[lang]/pokemon/hooks/useTypeFilterQuery";
import { useLocale } from "@/hooks/useLocale";

interface Props {
  selected: string[];
  onChange: (types: string[]) => void;
}

const TypeFilter = ({ selected, onChange }: Props) => {
  const locale = useLocale();
  const { options, isError } = useTypeFilterOptions(locale);

  // On error keep the control mounted with the current selection so the user can still clear active filters.
  return (
    <MultiSelect
      types={isError ? [] : options}
      selected={selected}
      onChange={onChange}
    />
  );
};

export { TypeFilter };
