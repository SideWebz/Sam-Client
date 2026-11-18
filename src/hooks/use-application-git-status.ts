import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { ApplicationGitStatus } from "@/types/application";

export function useApplicationGitStatus(applicationId: number) {
  return useQuery({
    queryKey: ["application-git-status", applicationId],
    queryFn: async () => {
      const response = await api.get<ApplicationGitStatus>(
        `/applications/${applicationId}/git/status`
      );

      return response.data;
    },
    enabled: Boolean(applicationId),
    refetchInterval: 30000,
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
