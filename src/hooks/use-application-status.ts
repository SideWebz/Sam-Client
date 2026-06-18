import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ApplicationStatusResponse } from "@/types/application";

export function useApplicationStatus(applicationId: number) {
  return useQuery({
    queryKey: ["application-status", applicationId],
    queryFn: async () => {
      const response = await api.get<ApplicationStatusResponse>(
        `/applications/${applicationId}/status`
      );

      return response.data.status;
    },
    enabled: Boolean(applicationId),
    refetchInterval: 10000,
  });
}