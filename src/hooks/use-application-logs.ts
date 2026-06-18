import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ApplicationLogsResponse } from "@/types/application";

export function useApplicationLogs(applicationId: number, open: boolean) {
  return useQuery({
    queryKey: ["application-logs", applicationId],
    queryFn: async () => {
      const response = await api.get<ApplicationLogsResponse>(
        `/applications/${applicationId}/logs?lines=200`
      );

      return response.data;
    },
    enabled: open,
  });
}