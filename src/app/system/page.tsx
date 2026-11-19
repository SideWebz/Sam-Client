"use client";

import { CheckCircle2, XCircle, RefreshCcw, Terminal } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { ActionButton } from "@/components/sam/action-button";
import { useSystem } from "@/hooks/use-system";

export default function SystemPage() {
  const { data: system, isLoading, isError, refetch, isFetching } = useSystem();

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="flex flex-col gap-8">
          <PageHeader
            eyebrow="System"
            title="System check"
            description="Controleer of alle vereiste server tools beschikbaar zijn."
            actions={
              <ActionButton
                variant="ghost"
                loading={isFetching}
                onClick={() => refetch()}
                className="w-full sm:w-auto"
              >
                <RefreshCcw className="size-4" />
                Refresh
              </ActionButton>
            }
          />

          {isLoading && (
            <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
              System check laden...
            </div>
          )}

          {isError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
              Kon system check niet ophalen. Check of je Laravel API draait.
            </div>
          )}

          {system && (
            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {Object.entries(system).map(([name, item]) => (
                <div key={name} className="rounded-xl border bg-card p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <Terminal className="size-[18px]" />
                      </div>

                      <div className="min-w-0">
                        <h2 className="truncate font-semibold capitalize">
                          {name}
                        </h2>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {item.message}
                        </p>
                      </div>
                    </div>

                    {item.installed ? (
                      <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
                    ) : (
                      <XCircle className="size-5 shrink-0 text-red-600" />
                    )}
                  </div>

                  <div className="mt-4 rounded-lg bg-muted px-3.5 py-3">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      Path
                    </p>

                    <p className="mt-1 break-all font-mono text-xs text-foreground">
                      {item.path || "Niet gevonden"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
