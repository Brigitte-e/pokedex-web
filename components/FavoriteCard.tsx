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
import { useTranslation } from "@/hooks/useTranslation";

interface Props {
  id: number;
  name: string;
  displayName?: string;
  onRemove: () => void;
}

const FavoriteCard = ({ id, name, displayName, onRemove }: Props) => {
  const { t, locale } = useTranslation();
  const [open, setOpen] = useState(false);
  const removeLabel = t("favorites.remove");

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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{removeLabel}</DialogTitle>
            <DialogDescription>{t("favorites.confirmRemove")}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <DialogClose asChild>
              <button className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors">
                {t("favorites.confirmRemoveCancel")}
              </button>
            </DialogClose>
            <button
              onClick={handleConfirm}
              className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors"
            >
              {t("favorites.confirmRemoveConfirm")}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { FavoriteCard };
