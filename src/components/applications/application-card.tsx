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
import { ActionButton } from "@/components/sam/action-button";
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
        whileHover={{ y: -4 }}
        className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0d111b] shadow-2xl shadow-black/30"
      >
        <div className="h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400" />

        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="truncate text-xl font-bold text-white">
                {application.name}
              </h2>
              <p className="mt-1 truncate text-sm text-slate-400">
                {application.domain}
              </p>
            </div>

            <StatusDot status={application.status} />
          </div>

          <LiveStatusPanel application={application} />
          <GitStatusPanel application={application} />

          <div className="mt-5 grid grid-cols-2 gap-2">
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

            <Link href={`/applications/${application.id}/edit`}>
              <ActionButton variant="ghost" className="w-full">
                <Pencil className="size-4" />
                Edit
              </ActionButton>
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