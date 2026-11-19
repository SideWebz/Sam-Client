"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ExternalLink,
  Pencil,
  Rocket,
  RotateCcw,
  ScrollText,
  Power,
} from "lucide-react";

import type { Application } from "@/types/application";
import { StatusDot } from "@/components/applications/status-dot";
import { LiveStatusPanel } from "@/components/applications/live-status-panel";
import {
  ActionButton,
  actionButtonClass,
} from "@/components/sam/action-button";
import { useApplicationAction } from "@/hooks/use-application-actions";
import { LogsDialog } from "@/components/applications/logs-dialog";
import { GitStatusPanel } from "@/components/applications/git-status-panel";

type ApplicationCardProps = {
  application: Application;
};

export function ApplicationCard({ application }: ApplicationCardProps) {
  const [logsOpen, setLogsOpen] = useState(false);

  const actionMutation = useApplicationAction();
  const isRunning = application.status === "running";

  const url = application.domain.startsWith("http")
    ? application.domain
    : `http://${application.domain}`;

  function runAction(action: "deploy" | "start" | "stop" | "restart") {
    actionMutation.mutate({
      id: application.id,
      action,
    });
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-xl border bg-card transition-colors hover:border-foreground/20"
      >
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold tracking-tight">
                {application.name}
              </h2>
              <p className="mt-0.5 truncate text-sm text-muted-foreground">
                {application.domain}
              </p>
            </div>

            <StatusDot status={application.status} />
          </div>

          <LiveStatusPanel application={application} />
          <GitStatusPanel application={application} />

          <div className="mt-5 grid grid-cols-2 gap-2.5">
            <ActionButton
              variant="primary"
              loading={
                actionMutation.isPending &&
                actionMutation.variables?.id === application.id &&
                actionMutation.variables?.action === "deploy"
              }
              onClick={() => runAction("deploy")}
            >
              <Rocket className="size-4" />
              Deploy
            </ActionButton>

            <ActionButton
              variant={isRunning ? "danger" : "success"}
              loading={
                actionMutation.isPending &&
                actionMutation.variables?.id === application.id &&
                ["start", "stop"].includes(
                  actionMutation.variables?.action ?? ""
                )
              }
              onClick={() => runAction(isRunning ? "stop" : "start")}
            >
              <Power className="size-4" />
              {isRunning ? "Stop" : "Start"}
            </ActionButton>

            <ActionButton
              variant="ghost"
              loading={
                actionMutation.isPending &&
                actionMutation.variables?.id === application.id &&
                actionMutation.variables?.action === "restart"
              }
              onClick={() => runAction("restart")}
            >
              <RotateCcw className="size-4" />
              Restart
            </ActionButton>

            <ActionButton variant="ghost" onClick={() => setLogsOpen(true)}>
              <ScrollText className="size-4" />
              Logs
            </ActionButton>

            <ActionButton
              variant="ghost"
              onClick={() => window.open(url, "_blank")}
            >
              <ExternalLink className="size-4" />
              Open
            </ActionButton>

            <Link
              href={`/applications/${application.id}/edit`}
              className={actionButtonClass("ghost")}
            >
              <Pencil className="size-4" />
              Edit
            </Link>
          </div>
        </div>
      </motion.div>

      <LogsDialog
        application={application}
        open={logsOpen}
        onOpenChange={setLogsOpen}
      />
    </>
  );
}