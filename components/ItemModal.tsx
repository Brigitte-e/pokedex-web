"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchItem, capitalize } from "@/lib/pokeapi";
import { t } from "@/lib/i18n";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { LazyImage } from "./LazyImage";

interface ItemModalProps {
  itemName: string;
  onClose: () => void;
}

export function ItemModal({ itemName, onClose }: ItemModalProps) {
  const { data } = useQuery({
    queryKey: ["item", itemName],
    queryFn: () => fetchItem(itemName),
  });

  const description = data
    ? (data.effect_entries.find((e) => e.language.name === "en")?.short_effect ??
       data.effect_entries[0]?.short_effect ??
       t("common.noDescription"))
    : undefined;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          {data ? (
            <div className="flex items-start gap-3">
              {data.sprites.default && (
                <LazyImage
                  src={data.sprites.default}
                  alt={data.name}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              )}
              <div>
                <DialogTitle>{capitalize(data.name)}</DialogTitle>
                <span className="text-xs text-muted-foreground">
                  {capitalize(data.category.name)}
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
                { label: t("itemModal.cost"), value: data.cost > 0 ? `₽${data.cost.toLocaleString()}` : t("common.empty") },
                { label: t("itemModal.category"), value: capitalize(data.category.name) },
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
