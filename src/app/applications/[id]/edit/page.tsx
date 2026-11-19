"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { ApplicationForm } from "@/components/applications/application-form";
import { DeleteDialog } from "@/components/applications/delete-dialog";
import { ActionButton } from "@/components/sam/action-button";
import { useApplication } from "@/hooks/use-application";
import { useUpdateApplication } from "@/hooks/use-update-application";
import type { ApplicationFormValues } from "@/types/application";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default function EditApplicationPage({ params }: Props) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = Number(resolvedParams.id);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data: application, isLoading, isError } = useApplication(id);
  const updateMutation = useUpdateApplication(id);

  function handleSubmit(values: ApplicationFormValues) {
    updateMutation.mutate(
      {
        ...values,
        status: application?.status ?? "stopped",
      },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
      }
    );
  }

  return (
    <ProtectedRoute>
      <AppShell>
        {isLoading && (
          <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
            Application laden...
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            Kon application niet ophalen.
          </div>
        )}

        {application && (
          <>
            <ApplicationForm
              title={`Edit ${application.name}`}
              description="Pas de instellingen van deze application aan."
              submitLabel="Save changes"
              loading={updateMutation.isPending}
              defaultValues={{
                name: application.name,
                repo_url: application.repo_url,
                domain: application.domain,
                port: application.port,
                install_command: application.install_command,
                build_command: application.build_command,
                start_command: application.start_command,
                env_content: application.env_content,
                status: application.status,
              }}
              onSubmit={handleSubmit}
            />

            <div className="mx-auto mt-6 max-w-3xl rounded-xl border border-red-200 bg-card p-5">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h2 className="font-semibold text-red-700">Danger zone</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Verwijder deze application, PM2 process, logs en projectmap.
                  </p>
                </div>

                <ActionButton
                  variant="danger"
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash className="size-4" />
                  Delete application
                </ActionButton>
              </div>
            </div>

            <DeleteDialog
              application={application}
              open={deleteOpen}
              onOpenChange={setDeleteOpen}
              onDeleted={() => router.push("/dashboard")}
            />
          </>
        )}
      </AppShell>
    </ProtectedRoute>
  );
}