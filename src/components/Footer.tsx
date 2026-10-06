import Link from "next/link";
import { MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <MapPin className="h-4 w-4" />
            </span>
            <span className="font-bold">
              Ethio<span className="text-brand-600">Connect</span>
            </span>
          </div>
          <p className="max-w-md text-sm text-slate-500">
            Connecting Ethiopians with trusted local service providers — from
            Addis Ababa to Hawassa, Bahir Dar and beyond.
          </p>
          <div className="flex gap-6 text-sm text-slate-600">
            <Link href="/providers" className="hover:text-brand-700">
              Browse
            </Link>
            <Link href="/register" className="hover:text-brand-700">
              Register
            </Link>
            <Link href="/login" className="hover:text-brand-700">
              Log in
            </Link>
          </div>
        </div>
        <p className="mt-8 text-xs text-slate-400">
          © {new Date().getFullYear()} EthioConnect. Built for Ethiopia 🇪🇹
        </p>
      </div>
    </footer>
  );
}
