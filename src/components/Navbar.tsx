"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Menu, X, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "CLIENT" | "PROVIDER" | "ADMIN";
}

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/providers", label: "Browse Services" },
  { href: "/register", label: "Become a Provider" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUser(data?.user ?? null))
      .catch(() => {});
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
            <MapPin className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight">
            Ethio<span className="text-brand-600">Connect</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              {link.label}
            </Link>
          ))}
          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === "/admin"
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              Admin
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <span className="text-sm font-medium text-slate-700">
              Hi, {user.name.split(" ")[0]}
            </span>
          ) : (
            <Link
              href="/login"
              className="rounded-md border border-brand-600 px-4 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50"
            >
              Log in
            </Link>
          )}
        </div>

        <button
          className="rounded-md p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-slate-200 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium",
                  pathname === link.href
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                {link.label}
              </Link>
            ))}
            {user?.role === "ADMIN" && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Admin Dashboard
              </Link>
            )}
            {!user && (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-semibold text-brand-700"
              >
                Log in
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
