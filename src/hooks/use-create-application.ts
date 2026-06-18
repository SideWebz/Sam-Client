import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Application, ApplicationFormValues } from "@/types/application";

export function useCreateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: ApplicationFormValues) => {
      const response = await api.post<Application>("/applications", values);
      return response.data;
    },

    onSuccess: () => {
      toast.success("Application aangemaakt");
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },

    onError: () => {
      toast.error("Kon application niet aanmaken");
    },
  });
}