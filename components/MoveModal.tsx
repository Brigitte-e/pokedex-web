"use client";

import { useQuery } from "@tanstack/react-query";
import { DEFAULT_TYPE_COLOR, TYPE_COLORS } from "@/lib/constants";
import { fetchMove, capitalize } from "@/lib/pokeapi";
import { t } from "@/lib/i18n";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface MoveModalProps {
  moveName: string;
  onClose: () => void;
}

export function MoveModal({ moveName, onClose }: MoveModalProps) {
  const { data, isError } = useQuery({
    queryKey: ["move", moveName],
    queryFn: () => fetchMove(moveName),
  });

  const typeColor = data ? (TYPE_COLORS[data.type.name] ?? DEFAULT_TYPE_COLOR) : undefined;
  const description = data
    ? (data.effect_entries.find((e) => e.language.name === "en")?.short_effect ??
       data.effect_entries[0]?.short_effect ??
       t("common.noDescription"))
    : undefined;

  if (isError) {
    return (
      <Dialog open onOpenChange={(open) => !open && onClose()}>
        <DialogContent>
          <p className="py-6 text-center text-sm text-destructive">
            {t("common.errorDefault")}
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          {data ? (
            <div className="flex items-center gap-3">
              <DialogTitle>{capitalize(data.name)}</DialogTitle>
              <span
                className="rounded-full px-3 py-0.5 text-xs font-semibold text-white"
                style={{ backgroundColor: typeColor }}
              >
                {capitalize(data.type.name)}
              </span>
              <span className="rounded-full px-3 py-0.5 text-xs font-semibold bg-muted text-muted-foreground">
                {capitalize(data.damage_class.name)}
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
                { label: t("moveModal.power"), value: data.power ?? t("common.empty") },
                { label: t("moveModal.accuracy"), value: data.accuracy != null ? `${data.accuracy}%` : t("common.empty") },
                { label: t("moveModal.pp"), value: data.pp },
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
