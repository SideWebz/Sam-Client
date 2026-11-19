"use client";

import { Copy, RefreshCcw, ScrollText } from "lucide-react";
import { toast } from "sonner";

import type { Application } from "@/types/application";
import { useApplicationLogs } from "@/hooks/use-application-logs";
import { ActionButton } from "@/components/sam/action-button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type LogsDialogProps = {
  application: Application;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function LogsDialog({
  application,
  open,
  onOpenChange,
}: LogsDialogProps) {
  const { data, isLoading, isError, refetch, isFetching } = useApplicationLogs(
    application.id,
    open
  );

  async function copyLogs() {
    const logs = data?.logs ?? "";

    if (!logs) {
      toast.error("Geen logs om te kopiëren");
      return;
    }

    await navigator.clipboard.writeText(logs);
    toast.success("Logs gekopieerd");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-4xl">
        <DialogHeader className="border-b px-5 py-4 sm:px-6 sm:py-5">
          <div className="flex flex-col gap-4 pr-10 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <ScrollText className="size-5" />
              </div>

              <div>
                <DialogTitle>Logs — {application.name}</DialogTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Laatste 200 regels
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <ActionButton
                variant="ghost"
                loading={isFetching}
                onClick={() => refetch()}
              >
                <RefreshCcw className="size-4" />
                Refresh
              </ActionButton>

              <ActionButton variant="ghost" onClick={copyLogs}>
                <Copy className="size-4" />
                Copy
              </ActionButton>
            </div>
          </div>
        </DialogHeader>

        <div className="p-4 sm:p-5">
          {isLoading && (
            <div className="rounded-lg bg-muted p-6 text-sm text-muted-foreground">
              Logs laden...
            </div>
          )}

          {isError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">
              Kon logs niet ophalen.
            </div>
          )}

          {!isLoading && !isError && (
            <pre className="max-h-[60dvh] overflow-auto rounded-lg bg-neutral-950 p-4 font-mono text-xs leading-6 text-neutral-200 sm:p-5">
              {data?.logs || "Geen logs gevonden."}
            </pre>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}