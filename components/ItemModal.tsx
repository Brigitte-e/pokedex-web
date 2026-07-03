"use client";

import { useQuery } from "@tanstack/react-query";
import { capitalize } from "@/lib/pokeapi";
import { fetchItem } from "@/lib/api/items";
import { fetchItemCategory } from "@/lib/api/categories";
import { getLocalizedName, getLocalizedDescription } from "@/lib/locale";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { LazyImage } from "./LazyImage";
import type { Locale } from "@/lib/constants";

export interface ItemModalLabels {
  cost: string;
  category: string;
  noDescription: string;
  errorDefault: string;
  empty: string;
  close: string;
}

interface ItemModalProps {
  itemName: string;
  onClose: () => void;
  labels: ItemModalLabels;
  locale?: Locale;
}

export function ItemModal({ itemName, onClose, labels, locale = "en" }: ItemModalProps) {
  const { data, isError } = useQuery({
    queryKey: ["item", itemName],
    queryFn: () => fetchItem(itemName),
    staleTime: Infinity,
  });

  const { data: categoryData } = useQuery({
    queryKey: ["item-category", data?.category.name],
    queryFn: () => fetchItemCategory(data!.category.name),
    enabled: !!data?.category.name,
    staleTime: Infinity,
  });

  const localizedItemName = data
    ? getLocalizedName(data.names, locale, capitalize(data.name))
    : undefined;
  const localizedCategoryName = categoryData
    ? getLocalizedName(categoryData.names, locale, capitalize(data!.category.name))
    : data
      ? capitalize(data.category.name)
      : undefined;
  const description = data
    ? (getLocalizedDescription(data.effect_entries, data.flavor_text_entries, locale) ??
      labels.noDescription)
    : undefined;

  if (isError) {
    return (
      <Dialog open onOpenChange={(open) => !open && onClose()}>
        <DialogContent closeLabel={labels.close}>
          <p className="py-6 text-center text-sm text-destructive">
            {labels.errorDefault}
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent closeLabel={labels.close}>
        <DialogHeader>
          {data ? (
            <div className="flex items-start gap-3">
              <LazyImage
                src={data.sprites.default}
                alt={localizedItemName ?? data.name}
                width={40}
                height={40}
                className="object-contain"
              />
              <div>
                <DialogTitle>{localizedItemName ?? capitalize(data.name)}</DialogTitle>
                <span className="text-xs text-muted-foreground">
                  {localizedCategoryName}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          )}
        </DialogHeader>

        <div className="min-h-[3rem] mb-5">
          {data ? (
            <DialogDescription>{description}</DialogDescription>
          ) : (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 h-[62px]">
          {data ? (
            <>
              {[
                { label: labels.cost, value: data.cost > 0 ? `₽${data.cost.toLocaleString()}` : labels.empty },
                { label: labels.category, value: localizedCategoryName ?? labels.empty },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl bg-muted/50 px-3 py-2 text-center">
                  <div className="text-xs text-muted-foreground mb-1">{label}</div>
                  <div className="text-sm font-semibold text-foreground">{value}</div>
                </div>
              ))}
            </>
          ) : (
            <>
              <Skeleton className="rounded-xl h-full" />
              <Skeleton className="rounded-xl h-full" />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
