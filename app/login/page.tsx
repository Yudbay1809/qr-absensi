"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Gagal login. Coba lagi.");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#e9fff7,transparent_55%),linear-gradient(180deg,#f6fffd_0%,#e6fdf4_35%,#f9fffd_100%)] px-6">
      <Card className="w-full max-w-md p-8 shadow-[0_20px_50px_rgba(10,77,56,0.16)]">
        <div className="mb-6 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-600">
            Gwen Absensi
          </p>
          <h1 className="font-heading text-3xl font-semibold text-brand-950">
            Masuk ke akun
          </h1>
          <p className="mt-2 text-sm text-brand-900/70">
            Gunakan email dan password yang terdaftar.
          </p>
        </div>
        <form onSubmit={submit} className="grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-brand-900">
            Username
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm text-brand-900 outline-none transition focus:border-brand-400"
              placeholder="admin atau karyawan"
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-brand-900">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm text-brand-900 outline-none transition focus:border-brand-400"
              placeholder="******"
              required
            />
          </label>
          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="mt-2 py-3 disabled:cursor-not-allowed disabled:opacity-70"
            aria-label="Masuk ke dashboard"
          >
            {loading ? "Memproses..." : "Masuk"}
          </Button>
        </form>
        <div className="mt-6 rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-xs text-brand-700">
          Demo login akan tersedia setelah menjalankan seed database.
        </div>
      </Card>
    </div>
  );
}
