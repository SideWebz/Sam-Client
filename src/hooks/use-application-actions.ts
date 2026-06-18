import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";

type ApplicationAction =
  | "clone"
  | "install"
  | "build"
  | "deploy"
  | "start"
  | "stop"
  | "restart";

export function useApplicationAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      action,
    }: {
      id: number;
      action: ApplicationAction;
    }) => {
      await api.post(`/applications/${id}/${action}`);
    },

    onSuccess: (_, variables) => {
      toast.success(`${variables.action} uitgevoerd`);
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },

    onError: (_, variables) => {
      toast.error(`${variables.action} mislukt`);
    },
  });
}