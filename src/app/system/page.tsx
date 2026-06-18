"use client";

import { CheckCircle2, XCircle, RefreshCcw, Terminal } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { ActionButton } from "@/components/sam/action-button";
import { useSystem } from "@/hooks/use-system";

export default function SystemPage() {
  const { data: system, isLoading, isError, refetch, isFetching } = useSystem();

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-blue-300">
                System
              </p>

              <h1 className="mt-2 text-3xl font-bold text-white">
                System check
              </h1>

              <p className="mt-2 text-slate-400">
                Controleer of alle vereiste server tools beschikbaar zijn.
              </p>
            </div>

            <ActionButton
              variant="ghost"
              loading={isFetching}
              onClick={() => refetch()}
            >
              <RefreshCcw className="size-4" />
              Refresh
            </ActionButton>
          </div>

          {isLoading && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-slate-400">
              System check laden...
            </div>
          )}

          {isError && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-200">
              Kon system check niet ophalen. Check of je Laravel API draait.
            </div>
          )}

          {system && (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {Object.entries(system).map(([name, item]) => (
                <div
                  key={name}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d111b] shadow-2xl shadow-black/30"
                >
                  <div
                    className={`h-1 ${
                      item.installed
                        ? "bg-gradient-to-r from-emerald-500 to-cyan-400"
                        : "bg-gradient-to-r from-red-500 to-orange-400"
                    }`}
                  />

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-xl bg-white/5 text-slate-300">
                          <Terminal className="size-5" />
                        </div>

                        <div>
                          <h2 className="text-xl font-bold capitalize text-white">
                            {name}
                          </h2>
                          <p className="mt-1 text-sm text-slate-400">
                            {item.message}
                          </p>
                        </div>
                      </div>

                      {item.installed ? (
                        <CheckCircle2 className="size-6 text-emerald-400" />
                      ) : (
                        <XCircle className="size-6 text-red-400" />
                      )}
                    </div>

                    <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        Path
                      </p>

                      <p className="mt-2 break-all font-mono text-sm text-slate-300">
                        {item.path || "Niet gevonden"}
                      </p>
                    </div>
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