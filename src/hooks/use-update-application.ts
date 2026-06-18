import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Application, ApplicationFormValues } from "@/types/application";

export function useUpdateApplication(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: ApplicationFormValues) => {
      const response = await api.put<Application>(`/applications/${id}`, values);
      return response.data;
    },

    onSuccess: () => {
      toast.success("Application aangepast");
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["application", id] });
    },

    onError: () => {
      toast.error("Kon application niet aanpassen");
    },
  });
}