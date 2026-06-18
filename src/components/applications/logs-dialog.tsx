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
      <DialogContent className="!max-w-[1100px] overflow-hidden border border-white/10 bg-[#0d111b] p-0 pr-10 text-white">
        <DialogHeader className="border-b border-white/10 px-6 py-5">
          <div className="flex flex-col gap-4 pr-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
                <ScrollText className="size-5" />
              </div>

              <div>
                <DialogTitle>Logs — {application.name}</DialogTitle>
                <p className="mt-1 text-sm text-slate-400">
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

        <div className="p-5 pr-0">
          {isLoading && (
            <div className="rounded-xl border border-white/10 bg-black/40 p-6 text-sm text-slate-400">
              Logs laden...
            </div>
          )}

          {isError && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-200">
              Kon logs niet ophalen.
            </div>
          )}

          {!isLoading && !isError && (
            <pre className="max-h-[65vh] overflow-auto rounded-xl border border-white/10 bg-black p-5 font-mono text-xs leading-6 text-green-400">
              {data?.logs || "Geen logs gevonden."}
            </pre>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}