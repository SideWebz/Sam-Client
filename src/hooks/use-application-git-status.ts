import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
  ApplicationGitStatus,
  ApplicationGitStatusResponse,
} from "@/types/application";

export function useApplicationGitStatus(applicationId: number) {
  return useQuery({
    queryKey: ["application-git-status", applicationId],
    queryFn: async () => {
      const response = await api.get<ApplicationGitStatusResponse>(
        `/applications/${applicationId}/git/status`
      );

      const git =
        "git" in response.data ? response.data.git : response.data;
      const hasLocalChanges =
        git.has_local_changes ?? git.has_changes;
      const isUpToDate = git.is_latest ?? git.is_up_to_date;

      if (
        typeof git.branch !== "string" ||
        (typeof git.local_commit !== "string" && git.local_commit !== null) ||
        (typeof git.remote_commit !== "string" && git.remote_commit !== null) ||
        typeof git.ahead !== "number" ||
        typeof git.behind !== "number" ||
        typeof hasLocalChanges !== "boolean" ||
        typeof isUpToDate !== "boolean"
      ) {
        throw new Error("Ongeldige Git-status ontvangen van de API");
      }

      return {
        application_id: applicationId,
        branch: git.branch,
        local_commit: git.local_commit,
        remote_commit: git.remote_commit,
        ahead: git.ahead,
        behind: git.behind,
        has_local_changes: hasLocalChanges,
        is_up_to_date: isUpToDate,
        can_publish: git.can_publish,
      } satisfies ApplicationGitStatus;
    },
    enabled: Boolean(applicationId),
  });
}

export function usePublishApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      message,
    }: {
      id: number;
      message?: string;
    }) => {
      await api.post(
        `/applications/${id}/git/publish`,
        message ? { message } : undefined
      );
    },
    onSuccess: (_, variables) => {
      toast.success("Wijzigingen gecommit en gepusht");
      queryClient.invalidateQueries({
        queryKey: ["application-git-status", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
    onError: () => {
      toast.error("Committen en pushen mislukt");
    },
  });
}
