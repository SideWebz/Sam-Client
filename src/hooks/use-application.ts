import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Application } from "@/types/application";

type ApplicationResponse = {
  application: Application;
};

export function useApplication(id: number) {
  return useQuery({
    queryKey: ["application", id],
    queryFn: async () => {
      const response = await api.get<ApplicationResponse>(`/applications/${id}`);
      return response.data.application;
    },
    enabled: Boolean(id),
  });
}