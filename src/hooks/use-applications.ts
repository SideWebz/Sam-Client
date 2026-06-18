import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Application } from "@/types/application";

type ApplicationsResponse = {
  applications: Application[];
};

export function useApplications() {
  return useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const response = await api.get<ApplicationsResponse>("/applications");
      return response.data.applications;
    },
  });
}