"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Server, LayoutDashboard, Activity, LogOut, Plus } from "lucide-react";

import { getStoredUser, logout } from "@/lib/auth";

const NAV = [
  { href: "/dashboard", label: "Dashboard", short: "Dashboard", icon: LayoutDashboard },
  { href: "/applications/create", label: "Create application", short: "Create", icon: Plus },
  { href: "/system", label: "System check", short: "System", icon: Activity },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = getStoredUser();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  function isActive(href: string) {
    if (href === "/dashboard") {
      return (
        pathname === "/dashboard" ||
        (pathname.startsWith("/applications") &&
          !pathname.startsWith("/applications/create"))
      );
    }
    return pathname.startsWith(href);
  }

  const username = user?.username ?? "SAM gebruiker";

  return (
    <div className="min-h-dvh bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-sidebar md:flex">
        <div className="flex h-16 items-center gap-3 border-b px-6">
          <Logo />
          <div className="leading-tight">
            <p className="text-sm font-semibold">SAM Client</p>
            <p className="text-xs text-muted-foreground">Application Manager</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={[
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive(href)
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
              ].join(" ")}
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="border-t p-3">
          <div className="flex items-center justify-between gap-2 rounded-lg px-3 py-2">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Ingelogd als</p>
              <p className="truncate text-sm font-medium">{username}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Logout"
              title="Logout"
              className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-card/95 px-4 backdrop-blur md:hidden">
        <div className="flex items-center gap-3">
          <Logo />
          <p className="text-sm font-semibold">SAM Client</p>
        </div>

        <div className="flex items-center gap-1">
          <span className="max-w-[9rem] truncate text-xs text-muted-foreground">
            {username}
          </span>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Logout"
            className="flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="md:pl-64">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 pb-28 md:px-8 md:py-10 md:pb-10">
          {children}
        </div>
      </main>

      {/* Mobile bottom navigation */}
      <nav
        aria-label="Hoofdnavigatie"
        className="fixed inset-x-0 bottom-0 z-30 border-t bg-card/95 backdrop-blur md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="grid grid-cols-3">
          {NAV.map(({ href, short, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive(href) ? "page" : undefined}
                className={[
                  "flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors",
                  isActive(href)
                    ? "text-foreground"
                    : "text-muted-foreground",
                ].join(" ")}
              >
                <Icon size={20} strokeWidth={isActive(href) ? 2.25 : 1.75} />
                {short}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

function Logo() {
  return (
    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
      <Server size={17} />
    </div>
  );
}
