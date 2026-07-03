"use client";

import { useQuery } from "@tanstack/react-query";
import { DEFAULT_TYPE_COLOR, TYPE_COLORS } from "@/lib/constants";
import { capitalize } from "@/lib/pokeapi";
import { fetchMove } from "@/lib/api/moves";
import { fetchType } from "@/lib/api/types";
import { getLocalizedName, getLocalizedDescription } from "@/lib/locale";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { Locale } from "@/lib/constants";

export interface MoveModalLabels {
  power: string;
  accuracy: string;
  pp: string;
  noDescription: string;
  errorDefault: string;
  empty: string;
  close: string;
  damageClassNames?: Record<string, string>;
}

interface MoveModalProps {
  moveName: string;
  onClose: () => void;
  labels: MoveModalLabels;
  locale?: Locale;
}

export function MoveModal({ moveName, onClose, labels, locale = "en" }: MoveModalProps) {
  const { data, isError } = useQuery({
    queryKey: ["move", moveName],
    queryFn: () => fetchMove(moveName),
    staleTime: Infinity,
  });

  const { data: typeData } = useQuery({
    queryKey: ["type", data?.type.name],
    queryFn: () => fetchType(data!.type.name),
    enabled: !!data?.type.name,
    staleTime: Infinity,
  });

  const typeColor = data ? (TYPE_COLORS[data.type.name] ?? DEFAULT_TYPE_COLOR) : undefined;
  const localizedMoveName = data
    ? getLocalizedName(data.names, locale, capitalize(data.name))
    : undefined;
  const localizedTypeName = typeData
    ? getLocalizedName(typeData.names, locale, capitalize(data!.type.name))
    : data
      ? capitalize(data.type.name)
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
            <div className="flex items-center gap-3">
              <DialogTitle>{localizedMoveName ?? capitalize(data.name)}</DialogTitle>
              <span
                className="rounded-full px-3 py-0.5 text-xs font-semibold text-white"
                style={{ backgroundColor: typeColor }}
              >
                {localizedTypeName}
              </span>
              <span className="rounded-full px-3 py-0.5 text-xs font-semibold bg-muted text-muted-foreground">
                {labels.damageClassNames?.[data.damage_class.name] ?? capitalize(data.damage_class.name)}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          )}
        </DialogHeader>

        <div className="min-h-[3rem] mb-5">
          {data ? (
            <DialogDescription>
              {description}
            </DialogDescription>
          ) : (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 h-[62px]">
          {data ? (
            <>
              {[
                { label: labels.power, value: data.power ?? labels.empty },
                { label: labels.accuracy, value: data.accuracy != null ? `${data.accuracy}%` : labels.empty },
                { label: labels.pp, value: data.pp },
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
              <Skeleton className="rounded-xl h-full" />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
