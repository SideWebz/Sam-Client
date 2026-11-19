"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Server } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { LoginResponse } from "@/types/auth";
import { getToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
  if (getToken()) {
    router.replace("/dashboard");
  }
}, [router]);

  const [username, setUsername] = useState("rune.vanderstuyft");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post<LoginResponse>("/login", {
        username,
        password,
      });

      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("sam_token", data.token);
      localStorage.setItem("sam_user", JSON.stringify(data.user));

      toast.success("Ingelogd");
      router.push("/dashboard");
    },
    onError: () => {
      toast.error("Login mislukt");
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    loginMutation.mutate();
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Server className="size-5" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold">SAM Client</p>
            <p className="text-xs text-muted-foreground">Application Manager</p>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight">Login</h1>

          <p className="mt-1.5 text-sm text-muted-foreground">
            Log in om je server applicaties te beheren.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                autoComplete="username"
                autoCapitalize="none"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={loginMutation.isPending}
              className="w-full"
            >
              {loginMutation.isPending ? "Inloggen..." : "Login"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
