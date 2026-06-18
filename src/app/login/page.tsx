"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
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
    <main className="flex min-h-screen items-center justify-center bg-[#070a12] p-6 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl">
        <p className="text-sm uppercase tracking-[0.3em] text-blue-300">
          SAM Client
        </p>

        <h1 className="mt-3 text-3xl font-bold">Login</h1>

        <p className="mt-2 text-sm text-slate-400">
          Log in om je server applicaties te beheren.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label>Username</Label>
            <Input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="border-white/10 bg-white/5 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="border-white/10 bg-white/5 text-white"
            />
          </div>

          <Button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full"
          >
            {loginMutation.isPending ? "Inloggen..." : "Login"}
          </Button>
        </form>
      </div>
    </main>
  );
}