import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";

export function useDeleteApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/applications/${id}`);
    },

    onSuccess: () => {
      toast.success("Application verwijderd");

      queryClient.invalidateQueries({
        queryKey: ["applications"],
      });
    },

    onError: () => {
      toast.error("Kon application niet verwijderen");
    },
  });
}