"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Server, LayoutDashboard, Activity, LogOut, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getStoredUser, logout } from "@/lib/auth";

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = getStoredUser();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  function navClass(href: string) {
    const active =
      href === "/dashboard" ? pathname === href : pathname.startsWith(href);

    return [
      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition",
      active
        ? "bg-white/10 text-white"
        : "text-slate-400 hover:bg-white/10 hover:text-white",
    ].join(" ");
  }

  return (
    <main className="min-h-screen bg-[#070a12] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-white/10 bg-white/[0.03] p-6 md:block">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300">
              <Server size={22} />
            </div>

            <div>
              <p className="text-lg font-bold">SAM Client</p>
              <p className="text-xs text-slate-400">Application Manager</p>
            </div>
          </div>

          <nav className="mt-10 space-y-2">
            <Link href="/dashboard" className={navClass("/dashboard")}>
              <LayoutDashboard size={18} />
              Dashboard
            </Link>

            <Link
              href="/applications/create"
              className={navClass("/applications/create")}
            >
              <Plus size={18} />
              Create application
            </Link>

            <Link href="/system" className={navClass("/system")}>
              <Activity size={18} />
              System check
            </Link>
          </nav>
        </aside>

        <section className="flex-1">
          <header className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-6 py-4">
            <div>
              <p className="text-sm text-slate-400">Welkom terug</p>
              <h1 className="font-semibold">
                {user?.username ?? "SAM gebruiker"}
              </h1>
            </div>

            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white"
            >
              <LogOut className="mr-2 size-4" />
              Logout
            </Button>
          </header>

          <div className="p-6">{children}</div>
        </section>
      </div>
    </main>
  );
}