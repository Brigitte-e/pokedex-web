"use client";

import { useState } from "react";
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
  onClear: () => void | Promise<void>;
}

const ClearFavoritesButton = ({ onClear }: Props) => {
  const { t } = useTranslation();
  const label = t("favorites.clearAll");
  const [open, setOpen] = useState(false);

  function handleConfirm() {
    setOpen(false);
    void onClear();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-8 text-xs text-muted-foreground hover:text-destructive transition-colors"
      >
        {label}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{label}</DialogTitle>
            <DialogDescription>{t("favorites.confirmClearAll")}</DialogDescription>
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
              {t("favorites.confirmClearAllConfirm")}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export { ClearFavoritesButton };
