"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { ApplicationFormValues } from "@/types/application";
import { ActionButton } from "@/components/sam/action-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const applicationSchema = z.object({
  name: z.string().min(2, "Naam moet minstens 2 karakters zijn"),
  repo_url: z.string().url("Gebruik een geldige repository URL"),
  domain: z.string().min(3, "Domain is verplicht"),
  port: z.number().min(1).max(65535),
  install_command: z.string().min(1, "Install command is verplicht"),
  build_command: z.string().min(1, "Build command is verplicht"),
  start_command: z.string().min(1, "Start command is verplicht"),
  env_content: z.string(),
  status: z.string().optional(),
});

type ApplicationFormProps = {
  title: string;
  description: string;
  submitLabel: string;
  defaultValues?: Partial<ApplicationFormValues>;
  loading?: boolean;
  onSubmit: (values: ApplicationFormValues) => void;
};

export function ApplicationForm({
  title,
  description,
  submitLabel,
  defaultValues,
  loading = false,
  onSubmit,
}: ApplicationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: "",
      repo_url: "",
      domain: "",
      port: 3000,
      install_command: "npm install",
      build_command: "npm run build",
      start_command: "npm run start",
      env_content: "PORT=3000",
      ...defaultValues,
    },
  });

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <Link href="/dashboard">
          <ActionButton variant="ghost">
            <ArrowLeft className="size-4" />
            Terug naar dashboard
          </ActionButton>
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d111b] shadow-2xl shadow-black/30">
        <div className="h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400" />

        <div className="border-b border-white/10 p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-blue-300">
            Application
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white">{title}</h1>
          <p className="mt-2 text-slate-400">{description}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
          <Field error={errors.name?.message}>
            <Label>Application name</Label>
            <Input
              {...register("name")}
              placeholder="Test App"
              className="border-white/10 bg-white/5 text-white"
            />
          </Field>

          <Field error={errors.repo_url?.message}>
            <Label>Repository URL</Label>
            <Input
              {...register("repo_url")}
              placeholder="https://github.com/SideWebz/DeZeeHut.git"
              className="border-white/10 bg-white/5 text-white"
            />
          </Field>

          <div className="grid gap-6 md:grid-cols-2">
            <Field error={errors.domain?.message}>
              <Label>Domain</Label>
              <Input
                {...register("domain")}
                placeholder="test.local"
                className="border-white/10 bg-white/5 text-white"
              />
            </Field>

            <Field error={errors.port?.message}>
              <Label>Port</Label>
              <Input
                type="number"
                {...register("port", { valueAsNumber: true })}
                className="border-white/10 bg-white/5 text-white"
              />
            </Field>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Field error={errors.install_command?.message}>
              <Label>Install command</Label>
              <Input
                {...register("install_command")}
                className="border-white/10 bg-white/5 text-white"
              />
            </Field>

            <Field error={errors.build_command?.message}>
              <Label>Build command</Label>
              <Input
                {...register("build_command")}
                className="border-white/10 bg-white/5 text-white"
              />
            </Field>

            <Field error={errors.start_command?.message}>
              <Label>Start command</Label>
              <Input
                {...register("start_command")}
                className="border-white/10 bg-white/5 text-white"
              />
            </Field>
          </div>

          <Field error={errors.env_content?.message}>
            <Label>Environment content</Label>
            <Textarea
              {...register("env_content")}
              rows={8}
              placeholder="PORT=3000"
              className="border-white/10 bg-black/40 font-mono text-sm text-green-400"
            />
          </Field>

          <div className="flex justify-end border-t border-white/10 pt-6">
            <ActionButton type="submit" loading={loading}>
              <Save className="size-4" />
              {submitLabel}
            </ActionButton>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  children,
  error,
}: {
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      {children}
      {error && <p className="text-sm text-red-300">{error}</p>}
    </div>
  );
}