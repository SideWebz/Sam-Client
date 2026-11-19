"use client";

import { Globe, Server } from "lucide-react";
import { useApplicationStatus } from "@/hooks/use-application-status";
import type { Application } from "@/types/application";

type LiveStatusPanelProps = {
  application: Application;
};

export function LiveStatusPanel({ application }: LiveStatusPanelProps) {
  const { data: status, isLoading, isError } = useApplicationStatus(
    application.id
  );

  if (isLoading) {
    return (
      <div className="mt-5 rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
        Status laden...
      </div>
    );
  }

  if (isError || !status) {
    return (
      <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        Status niet beschikbaar.
      </div>
    );
  }

  return (
    <div className="mt-5 space-y-3 rounded-lg bg-muted px-4 py-3.5 text-sm">
      <StatusRow
        icon={<Server className="size-4" />}
        label="PM2"
        value={status.pm2_running ? "Running" : "Stopped"}
        active={status.pm2_running}
      />

      <StatusRow
        icon={<Globe className="size-4" />}
        label="URL"
        value={status.url}
        active={status.port_open}
      />
    </div>
  );
}

function StatusRow({
  icon,
  label,
  value,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>

      <div className="flex min-w-0 items-center gap-2 text-right">
        <span
          className={`size-2 rounded-full ${
            active ? "bg-emerald-500" : "bg-red-500"
          }`}
        />

        <span className="truncate font-medium">{value}</span>
      </div>
    </div>
  );
}