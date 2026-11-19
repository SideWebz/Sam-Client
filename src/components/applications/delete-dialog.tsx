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
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg">Delete application</DialogTitle>

          <DialogDescription>
            Deze actie kan niet ongedaan gemaakt worden.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-muted-foreground">Je staat op het punt om</p>

          <p className="mt-2 break-words text-base font-semibold text-foreground">
            {application.name}
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            permanent te verwijderen.
          </p>
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
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