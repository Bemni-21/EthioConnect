"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MapPin } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.user?.role === "ADMIN") router.push("/admin");
      else router.push("/");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setStatus("error");
      setMessage(data.error || "Login failed.");
    }
  }

  const inputCls =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200";

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white">
            <MapPin className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
            Log in to EthioConnect
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Access your account, reviews and provider dashboard.
          </p>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
              className={inputCls}
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
          >
            {status === "loading" && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Log in
          </button>

          {status === "error" && (
            <p className="text-sm text-red-600">{message}</p>
          )}
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        New here?{" "}
        <a href="/register" className="font-semibold text-brand-700 hover:underline">
          Register as a provider
        </a>
      </p>
      <p className="mt-2 text-center text-xs text-slate-400">
        Demo admin: admin@ethioconnect.et / admin123
      </p>
    </div>
  );
}
