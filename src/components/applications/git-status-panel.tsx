"use client";

import { useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  GitBranch,
  RefreshCcw,
} from "lucide-react";

import {
  useApplicationGitStatus,
  usePublishApplication,
} from "@/hooks/use-application-git-status";
import type { Application } from "@/types/application";
import { ActionButton } from "@/components/sam/action-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type GitStatusPanelProps = {
  application: Application;
};

export function GitStatusPanel({ application }: GitStatusPanelProps) {
  const [publishOpen, setPublishOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { data, isLoading, isError, refetch, isFetching } =
    useApplicationGitStatus(application.id);
  const publishMutation = usePublishApplication();

  function publishChanges() {
    publishMutation.mutate(
      {
        id: application.id,
        ...(message.trim() ? { message: message.trim() } : {}),
      },
      {
        onSuccess: () => {
          setMessage("");
          setPublishOpen(false);
        },
      }
    );
  }

  const canPublish = Boolean(
    data && (data.ahead > 0 || data.has_local_changes)
  );
  const syncLabel = data
    ? data.behind > 0 && data.ahead > 0
      ? "Uit elkaar gelopen"
      : data.behind > 0
        ? `${data.behind} ${data.behind === 1 ? "commit" : "commits"} achter`
        : data.ahead > 0
          ? `${data.ahead} ${data.ahead === 1 ? "commit" : "commits"} vooruit`
          : data.has_local_changes
            ? "Lokale wijzigingen"
            : data.is_up_to_date
              ? "Bijgewerkt"
              : "Status onbekend"
    : null;
  const syncLabelClass =
    data && data.behind > 0
      ? "bg-amber-500/15 text-amber-300"
      : data && (data.ahead > 0 || data.has_local_changes)
        ? "bg-blue-500/15 text-blue-300"
        : data?.is_up_to_date
          ? "bg-emerald-500/15 text-emerald-300"
          : "bg-white/10 text-slate-300";

  return (
    <>
      <section className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium text-slate-200">
            <GitBranch className="size-4 text-blue-300" />
            Git
          </div>
          <ActionButton
            variant="ghost"
            className="h-8 px-2"
            aria-label={`Git-status vernieuwen voor ${application.name}`}
            loading={isFetching}
            onClick={() => refetch()}
          >
            <RefreshCcw className="size-4" />
          </ActionButton>
        </div>

        {isLoading && (
          <p className="mt-3 text-slate-400">Git-status laden...</p>
        )}

        {isError && (
          <p className="mt-3 text-red-200">
            Git-status niet beschikbaar. Probeer opnieuw te laden.
          </p>
        )}

        {data && (
          <>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <span className="min-w-0 truncate text-slate-400">
                Branch: <span className="text-slate-200">{data.branch}</span>
              </span>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${syncLabelClass}`}
              >
                {syncLabel}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-400">
              <span className="truncate">
                Lokaal:{" "}
                <span className="font-mono text-slate-200">
                  {shortHash(data.local_commit)}
                </span>
              </span>
              <span className="truncate">
                Upstream:{" "}
                <span className="font-mono text-slate-200">
                  {shortHash(data.remote_commit)}
                </span>
              </span>
              <span className="flex items-center gap-1">
                <ArrowUpFromLine className="size-3" />
                {data.ahead} vooruit
              </span>
              <span className="flex items-center gap-1">
                <ArrowDownToLine className="size-3" />
                {data.behind} achter
              </span>
            </div>

            {data.has_local_changes && (
              <p className="mt-2 text-xs text-amber-300">
                Er zijn lokale wijzigingen.
              </p>
            )}

          </>
        )}

        <ActionButton
          variant="success"
          className="mt-3 w-full"
          disabled={!canPublish || publishMutation.isPending}
          onClick={() => setPublishOpen(true)}
        >
          <ArrowUpFromLine className="size-4" />
          {canPublish
            ? "Commit & push"
            : data
              ? "Geen wijzigingen om te pushen"
              : "Git-status nodig voor commit & push"}
        </ActionButton>
      </section>

      <Dialog
        open={publishOpen}
        onOpenChange={(open) => {
          if (!publishMutation.isPending) setPublishOpen(open);
        }}
      >
        <DialogContent className="border-white/10 bg-[#0d111b] text-white">
          <DialogHeader>
            <DialogTitle>Commit &amp; push — {application.name}</DialogTitle>
            <p className="text-sm text-slate-400">
              Niet-genegeerde wijzigingen worden gecommit en de branch wordt
              gepusht. Laat leeg om de standaard committekst te gebruiken.
            </p>
          </DialogHeader>

          <Input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder={`Update ${application.name}`}
            aria-label="Commitbericht (optioneel)"
            disabled={publishMutation.isPending}
          />

          <div className="flex justify-end gap-2">
            <ActionButton
              variant="ghost"
              onClick={() => setPublishOpen(false)}
              disabled={publishMutation.isPending}
            >
              Annuleren
            </ActionButton>
            <ActionButton
              variant="success"
              loading={publishMutation.isPending}
              onClick={publishChanges}
            >
              <ArrowUpFromLine className="size-4" />
              Commit &amp; push
            </ActionButton>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function shortHash(hash: string | null) {
  return hash ? hash.slice(0, 7) : "—";
}
