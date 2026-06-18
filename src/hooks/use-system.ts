import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { SystemResponse } from "@/types/system";

export function useSystem() {
  return useQuery({
    queryKey: ["system"],
    queryFn: async () => {
      const response = await api.get<SystemResponse>("/system");
      return response.data.system;
    },
  });
}