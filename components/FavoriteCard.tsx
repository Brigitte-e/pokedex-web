"use client";

import { useState } from "react";
import { CharacterCard } from "@/components/CharacterCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import type { Locale } from "@/lib/constants";

interface FavoriteCardProps {
  id: number;
  name: string;
  displayName?: string;
  locale: Locale;
  onRemove: () => void;
  removeLabel?: string;
  confirmRemove?: string;
  confirmRemoveCancel?: string;
  confirmRemoveConfirm?: string;
}

export function FavoriteCard({
  id,
  name,
  displayName,
  locale,
  onRemove,
  removeLabel = "Remove from favorites",
  confirmRemove = "Do you really want to remove this pokemon from favorites?",
  confirmRemoveCancel = "Cancel",
  confirmRemoveConfirm = "Remove",
}: FavoriteCardProps) {
  const [open, setOpen] = useState(false);

  function handleConfirm() {
    setOpen(false);
    onRemove();
  }

  return (
    <div className="relative group/fav">
      <CharacterCard id={id} name={name} displayName={displayName} locale={locale} />
      <button
        onClick={() => setOpen(true)}
        className="absolute top-2 right-2 rounded-full bg-background/80 p-1 text-xs text-muted-foreground opacity-0 group-hover/fav:opacity-100 hover:text-destructive transition-all"
        aria-label={removeLabel}
      >
        ✕
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent closeLabel={confirmRemoveCancel}>
          <DialogHeader>
            <DialogTitle>{removeLabel}</DialogTitle>
            <DialogDescription>{confirmRemove}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <DialogClose asChild>
              <button className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors">
                {confirmRemoveCancel}
              </button>
            </DialogClose>
            <button
              onClick={handleConfirm}
              className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors"
            >
              {confirmRemoveConfirm}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
