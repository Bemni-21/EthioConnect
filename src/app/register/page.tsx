"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  User,
  Briefcase,
  Phone,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import {
  CATEGORIES,
  CITIES,
  ADDIS_SUBCITIES,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

const STEPS = ["Account", "Business", "Location & Contact"];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "done">(
    "idle"
  );
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    bio: "",
    city: "Addis Ababa",
    subcity: "",
    woreda: "",
    categories: [] as string[],
    pricingType: "NEGOTIABLE" as "HOURLY" | "FIXED" | "NEGOTIABLE",
    startingPrice: "",
    telegram: "",
    whatsapp: "",
  });

  const set = (k: keyof typeof form, v: unknown) =>
    setForm((f) => ({ ...f, [k]: v }));

  const toggleCategory = (slug: string) =>
    setForm((f) => ({
      ...f,
      categories: f.categories.includes(slug)
        ? f.categories.filter((c) => c !== slug)
        : [...f.categories, slug],
    }));

  const canNext = () => {
    if (step === 0)
      return form.name.trim() && form.email.trim() && form.password.length >= 6 && form.password === form.confirmPassword;
    if (step === 1)
      return form.businessName.trim() && form.bio.trim() && form.categories.length > 0;
    return true;
  };

  async function submit() {
    setStatus("loading");
    setMessage("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        password: form.password,
        role: "PROVIDER",
        businessName: form.businessName,
        bio: form.bio,
        city: form.city,
        subcity: form.subcity || null,
        woreda: form.woreda || null,
        categories: form.categories,
        pricingType: form.pricingType,
        startingPrice: form.startingPrice ? Number(form.startingPrice) : null,
        telegram: form.telegram || null,
        whatsapp: form.whatsapp || null,
      }),
    });
    if (res.ok) {
      setStatus("done");
      setTimeout(() => router.push("/providers"), 1800);
    } else {
      const data = await res.json().catch(() => ({}));
      setStatus("error");
      setMessage(data.error || "Registration failed.");
    }
  }

  const inputCls =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200";

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Register as a service provider
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Free to join. Get listed, verified and start receiving customers.
        </p>
      </div>

      {/* Stepper */}
      <div className="mt-8 flex items-center">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                  i < step
                    ? "bg-brand-600 text-white"
                    : i === step
                      ? "bg-brand-100 text-brand-700 ring-2 ring-brand-600"
                      : "bg-slate-100 text-slate-400"
                )}
              >
                {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </span>
              <span
                className={cn(
                  "text-sm font-medium",
                  i === step ? "text-slate-900" : "text-slate-400"
                )}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "mx-2 h-px flex-1",
                  i < step ? "bg-brand-600" : "bg-slate-200"
                )}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {status === "done" ? (
          <div className="py-10 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-brand-600" />
            <h2 className="mt-4 text-xl font-bold text-slate-900">
              Registration submitted! 🎉
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-600">
              Your profile is live and pending verification. An admin will
              review your listing — you can now log in and manage it.
            </p>
          </div>
        ) : (
          <>
            {step === 0 && (
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Full name
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="e.g. Abraham Tadesse"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="you@example.com"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Phone (optional)
                  </label>
                  <input
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="+251 9XX XXX XXX"
                    className={inputCls}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Password
                    </label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => set("password", e.target.value)}
                      placeholder="Min. 6 characters"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Confirm password
                    </label>
                    <input
                      type="password"
                      value={form.confirmPassword}
                      onChange={(e) => set("confirmPassword", e.target.value)}
                      placeholder="Repeat password"
                      className={inputCls}
                    />
                  </div>
                </div>
                {form.password !== form.confirmPassword && form.confirmPassword && (
                  <p className="text-xs text-red-600">Passwords do not match.</p>
                )}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Business / trade name
                  </label>
                  <input
                    value={form.businessName}
                    onChange={(e) => set("businessName", e.target.value)}
                    placeholder="e.g. Bole Plumbing Services"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    About your service
                  </label>
                  <textarea
                    rows={4}
                    value={form.bio}
                    onChange={(e) => set("bio", e.target.value)}
                    placeholder="Years of experience, what you offer, your strengths…"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Service categories (select all that apply)
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c.slug}
                        type="button"
                        onClick={() => toggleCategory(c.slug)}
                        className={cn(
                          "rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors",
                          form.categories.includes(c.slug)
                            ? "border-brand-600 bg-brand-50 text-brand-700"
                            : "border-slate-300 text-slate-600 hover:bg-slate-50"
                        )}
                      >
                        {c.nameEn}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Pricing type
                    </label>
                    <select
                      value={form.pricingType}
                      onChange={(e) => set("pricingType", e.target.value)}
                      className={inputCls}
                    >
                      <option value="NEGOTIABLE">Negotiable</option>
                      <option value="HOURLY">Hourly rate</option>
                      <option value="FIXED">Fixed price</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Starting price (ETB, optional)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.startingPrice}
                      onChange={(e) => set("startingPrice", e.target.value)}
                      placeholder="e.g. 500"
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    City
                  </label>
                  <select
                    value={form.city}
                    onChange={(e) => {
                      set("city", e.target.value);
                      set("subcity", "");
                    }}
                    className={inputCls}
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {form.city === "Addis Ababa" && (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Subcity
                    </label>
                    <select
                      value={form.subcity}
                      onChange={(e) => set("subcity", e.target.value)}
                      className={inputCls}
                    >
                      <option value="">Select subcity…</option>
                      {ADDIS_SUBCITIES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Woreda / specific area (optional)
                  </label>
                  <input
                    value={form.woreda}
                    onChange={(e) => set("woreda", e.target.value)}
                    placeholder="e.g. Woreda 03, near Bole Medhanealem"
                    className={inputCls}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Telegram username (optional)
                    </label>
                    <input
                      value={form.telegram}
                      onChange={(e) => set("telegram", e.target.value)}
                      placeholder="@username"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      WhatsApp number (optional)
                    </label>
                    <input
                      value={form.whatsapp}
                      onChange={(e) => set("whatsapp", e.target.value)}
                      placeholder="+251 9XX XXX XXX"
                      className={inputCls}
                    />
                  </div>
                </div>

                <p className="rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-slate-500">
                  💡 Tip: Providers with a Telegram username and phone number get
                  significantly more customer contacts in Ethiopia.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {status !== "done" && (
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => canNext() && setStep((s) => s + 1)}
              disabled={!canNext()}
              className="flex items-center gap-1 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-40"
            >
              Continue <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={status === "loading"}
              className="flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
            >
              {status === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              Submit registration
            </button>
          )}
        </div>
      )}

      {status === "error" && (
        <p className="mt-3 text-center text-sm text-red-600">{message}</p>
      )}

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <a href="/login" className="font-semibold text-brand-700 hover:underline">
          Log in
        </a>
      </p>
    </div>
  );
}
