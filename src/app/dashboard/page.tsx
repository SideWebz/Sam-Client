"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { useApplications } from "@/hooks/use-applications";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { ApplicationCard } from "@/components/applications/application-card";
import { actionButtonClass } from "@/components/sam/action-button";

export default function DashboardPage() {
  const { data: applications, isLoading, isError } = useApplications();

  const total = applications?.length ?? 0;
  const running =
    applications?.filter((application) => application.status === "running")
      .length ?? 0;

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="flex flex-col gap-8">
          <PageHeader
            eyebrow="Applications"
            title="Dashboard"
            description="Beheer je apps, deployments, status en logs."
            actions={
              <Link
                href="/applications/create"
                className={actionButtonClass("primary", "w-full sm:w-auto")}
              >
                <Plus className="size-4" />
                New application
              </Link>
            }
          />

          {applications && applications.length > 0 && (
            <dl className="grid grid-cols-3 divide-x rounded-xl border bg-card">
              <Stat label="Totaal" value={total} />
              <Stat label="Running" value={running} />
              <Stat label="Stopped" value={total - running} />
            </dl>
          )}

          {isLoading && (
            <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
              Applicaties laden...
            </div>
          )}

          {isError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
              Kon applicaties niet ophalen. Check of je Laravel API draait.
            </div>
          )}

          {!isLoading && applications?.length === 0 && (
            <div className="rounded-xl border border-dashed bg-card p-10 text-center">
              <h2 className="text-lg font-semibold">Nog geen applicaties</h2>

              <p className="mt-1.5 text-sm text-muted-foreground">
                Maak je eerste application aan om te starten.
              </p>

              <Link
                href="/applications/create"
                className={actionButtonClass("primary", "mt-6")}
              >
                Create application
              </Link>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
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

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="px-4 py-4 sm:px-6">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold tabular-nums tracking-tight">
        {value}
      </dd>
    </div>
  );
}
