"use client";

import type { Application } from "@/types/application";
import { ActionButton } from "@/components/sam/action-button";
import { useDeleteApplication } from "@/hooks/use-delete-application";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  application: Application;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
};

export function DeleteDialog({
  application,
  open,
  onOpenChange,
  onDeleted,
}: Props) {
  const mutation = useDeleteApplication();

  function remove() {
    mutation.mutate(application.id, {
      onSuccess() {
        onOpenChange(false);
        onDeleted?.();
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border-white/10 bg-[#0d111b] text-white">
        <DialogHeader>
          <DialogTitle className="text-xl">Delete application</DialogTitle>

          <DialogDescription className="text-slate-400">
            Deze actie kan niet ongedaan gemaakt worden.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
          <p className="text-sm text-slate-300">Je staat op het punt om</p>

          <p className="mt-2 text-lg font-bold text-white">
            {application.name}
          </p>

          <p className="mt-2 text-sm text-slate-400">
            permanent te verwijderen.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <ActionButton variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </ActionButton>

          <ActionButton
            variant="danger"
            loading={mutation.isPending}
            onClick={remove}
          >
            Delete
          </ActionButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}