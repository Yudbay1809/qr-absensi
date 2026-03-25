"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const defaults = {
  defaultShiftId: null as number | null,
};

type Shift = {
  id: number;
  name: string;
  workStart: string;
  breakStart: string;
  breakEnd: string;
  workEnd: string;
};

type Settings = typeof defaults;

export default function SettingsPage() {
  const [form, setForm] = useState<Settings>(defaults);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/admin/settings");
      if (!res.ok) return;
      const data = await res.json();
      if (data?.settings) {
        setForm({ defaultShiftId: data.settings.defaultShiftId ?? null });
      }
      setShifts(data.shifts ?? []);
    };
    load();
  }, []);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSaved(false);
    setLoading(true);

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Gagal menyimpan pengaturan.");
      return;
    }

    setSaved(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-brand-600">
          Admin
        </p>
        <h1 className="font-heading text-3xl font-semibold text-brand-950">
          Pengaturan jam kerja
        </h1>
        <p className="mt-2 text-sm text-brand-900/70">
          Pilih shift default untuk aturan absensi.
        </p>
      </header>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <Card className="p-6">
        <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-brand-900">
            Shift default
            <select
              value={form.defaultShiftId ?? ""}
              onChange={(event) =>
                setForm({
                  defaultShiftId: event.target.value
                    ? Number(event.target.value)
                    : null,
                })
              }
              className="rounded-2xl border border-brand-100 bg-white px-3 py-2 text-sm"
            >
              <option value="">Pilih shift</option>
              {shifts.map((shift) => (
                <option key={shift.id} value={shift.id}>
                  {shift.name} ({shift.workStart}-{shift.workEnd})
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
          {saved && (
            <span className="text-sm text-brand-700">
              Pengaturan tersimpan.
            </span>
          )}
        </form>
      </Card>
    </div>
  );
}
