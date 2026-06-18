"use client";

import { useRouter } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { ApplicationForm } from "@/components/applications/application-form";
import { useCreateApplication } from "@/hooks/use-create-application";
import type { ApplicationFormValues } from "@/types/application";

export default function CreateApplicationPage() {
  const router = useRouter();
  const createMutation = useCreateApplication();

  function handleSubmit(values: ApplicationFormValues) {
    createMutation.mutate(values, {
      onSuccess: () => {
        router.push("/dashboard");
      },
    });
  }

  return (
    <ProtectedRoute>
      <AppShell>
        <ApplicationForm
          title="Create application"
          description="Maak een nieuwe app aan die SAM kan deployen en beheren."
          submitLabel="Create application"
          loading={createMutation.isPending}
          onSubmit={handleSubmit}
        />
      </AppShell>
    </ProtectedRoute>
  );
}