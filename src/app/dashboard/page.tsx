"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { useApplications } from "@/hooks/use-applications";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { AppShell } from "@/components/layout/app-shell";
import { ApplicationCard } from "@/components/applications/application-card";
import { ActionButton } from "@/components/sam/action-button";

export default function DashboardPage() {
  const { data: applications, isLoading, isError } = useApplications();

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-blue-300">
                Applications
              </p>

              <h1 className="mt-2 text-3xl font-bold text-white">
                Dashboard
              </h1>

              <p className="mt-2 text-slate-400">
                Beheer je apps, deployments, status en logs.
              </p>
            </div>

            <Link href="/applications/create">
              <ActionButton>
                <Plus className="size-4" />
                New application
              </ActionButton>
            </Link>
          </div>

          {isLoading && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-slate-400">
              Applicaties laden...
            </div>
          )}

          {isError && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-200">
              Kon applicaties niet ophalen. Check of je Laravel API draait.
            </div>
          )}

          {!isLoading && applications?.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center">
              <h2 className="text-xl font-bold text-white">
                Nog geen applicaties
              </h2>

              <p className="mt-2 text-slate-400">
                Maak je eerste application aan om te starten.
              </p>

              <Link href="/applications/create">
                <ActionButton className="mt-6">
                  Create application
                </ActionButton>
              </Link>
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {applications?.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
              />
            ))}
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}