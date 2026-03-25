"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const defaults = {
  name: "",
  workStart: "09:00",
  breakStart: "12:00",
  breakEnd: "13:00",
  workEnd: "17:00",
  isActive: true,
};

type Shift = typeof defaults & { id: number };

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [form, setForm] = useState(defaults);
  const [editing, setEditing] = useState<Shift | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch("/api/admin/shifts");
    if (!res.ok) return;
    const data = await res.json();
    setShifts(data.shifts ?? []);
  };

  useEffect(() => {
    load();
  }, []);

  const onCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    const res = await fetch("/api/admin/shifts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Gagal menambah shift.");
      return;
    }

    setForm(defaults);
    await load();
  };

  const onUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editing) return;
    const res = await fetch(`/api/admin/shifts/${editing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Gagal memperbarui shift.");
      return;
    }

    setEditing(null);
    await load();
  };

  const onDelete = async (shift: Shift) => {
    const ok = window.confirm(`Hapus shift ${shift.name}?`);
    if (!ok) return;

    const res = await fetch(`/api/admin/shifts/${shift.id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Gagal menghapus shift.");
      return;
    }

    await load();
  };

  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-brand-600">
          Admin
        </p>
        <h1 className="font-heading text-3xl font-semibold text-brand-950">
          Pengaturan shift
        </h1>
        <p className="mt-2 text-sm text-brand-900/70">
          Atur multi-shift untuk jam kerja yang berbeda.
        </p>
      </header>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <Card className="p-6">
        <h2 className="font-heading text-xl font-semibold text-brand-950">
          Tambah shift
        </h2>
        <form onSubmit={onCreate} className="mt-4 grid gap-3 md:grid-cols-3">
          <input
            className="rounded-2xl border border-brand-100 bg-white px-3 py-2 text-sm"
            placeholder="Nama shift"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            required
          />
          <label className="grid gap-2 text-xs text-brand-700">
            Jam masuk
            <input
              type="time"
              className="rounded-2xl border border-brand-100 bg-white px-3 py-2 text-sm"
              value={form.workStart}
              onChange={(event) =>
                setForm({ ...form, workStart: event.target.value })
              }
              required
            />
          </label>
          <label className="grid gap-2 text-xs text-brand-700">
            Jam pulang
            <input
              type="time"
              className="rounded-2xl border border-brand-100 bg-white px-3 py-2 text-sm"
              value={form.workEnd}
              onChange={(event) =>
                setForm({ ...form, workEnd: event.target.value })
              }
              required
            />
          </label>
          <label className="grid gap-2 text-xs text-brand-700">
            Istirahat mulai
            <input
              type="time"
              className="rounded-2xl border border-brand-100 bg-white px-3 py-2 text-sm"
              value={form.breakStart}
              onChange={(event) =>
                setForm({ ...form, breakStart: event.target.value })
              }
              required
            />
          </label>
          <label className="grid gap-2 text-xs text-brand-700">
            Istirahat selesai
            <input
              type="time"
              className="rounded-2xl border border-brand-100 bg-white px-3 py-2 text-sm"
              value={form.breakEnd}
              onChange={(event) =>
                setForm({ ...form, breakEnd: event.target.value })
              }
              required
            />
          </label>
          <label className="flex items-center gap-2 text-xs text-brand-700">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) =>
                setForm({ ...form, isActive: event.target.checked })
              }
            />
            Aktif
          </label>
          <Button type="submit">Tambah shift</Button>
        </form>
      </Card>

      {editing && (
        <Card className="p-6">
          <h2 className="font-heading text-xl font-semibold text-brand-950">
            Edit shift
          </h2>
          <form onSubmit={onUpdate} className="mt-4 grid gap-3 md:grid-cols-3">
            <input
              className="rounded-2xl border border-brand-100 bg-white px-3 py-2 text-sm"
              placeholder="Nama shift"
              value={editing.name}
              onChange={(event) =>
                setEditing({ ...editing, name: event.target.value })
              }
              required
            />
            <label className="grid gap-2 text-xs text-brand-700">
              Jam masuk
              <input
                type="time"
                className="rounded-2xl border border-brand-100 bg-white px-3 py-2 text-sm"
                value={editing.workStart}
                onChange={(event) =>
                  setEditing({ ...editing, workStart: event.target.value })
                }
                required
              />
            </label>
            <label className="grid gap-2 text-xs text-brand-700">
              Jam pulang
              <input
                type="time"
                className="rounded-2xl border border-brand-100 bg-white px-3 py-2 text-sm"
                value={editing.workEnd}
                onChange={(event) =>
                  setEditing({ ...editing, workEnd: event.target.value })
                }
                required
              />
            </label>
            <label className="grid gap-2 text-xs text-brand-700">
              Istirahat mulai
              <input
                type="time"
                className="rounded-2xl border border-brand-100 bg-white px-3 py-2 text-sm"
                value={editing.breakStart}
                onChange={(event) =>
                  setEditing({ ...editing, breakStart: event.target.value })
                }
                required
              />
            </label>
            <label className="grid gap-2 text-xs text-brand-700">
              Istirahat selesai
              <input
                type="time"
                className="rounded-2xl border border-brand-100 bg-white px-3 py-2 text-sm"
                value={editing.breakEnd}
                onChange={(event) =>
                  setEditing({ ...editing, breakEnd: event.target.value })
                }
                required
              />
            </label>
            <label className="flex items-center gap-2 text-xs text-brand-700">
              <input
                type="checkbox"
                checked={editing.isActive}
                onChange={(event) =>
                  setEditing({ ...editing, isActive: event.target.checked })
                }
              />
              Aktif
            </label>
            <div className="flex gap-2">
              <Button type="submit">Simpan</Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditing(null)}
              >
                Batal
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="p-6">
        <h2 className="font-heading text-xl font-semibold text-brand-950">
          Daftar shift
        </h2>
        <div className="mt-4 grid gap-3">
          {shifts.map((shift) => (
            <div
              key={shift.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm text-brand-900"
            >
              <div>
                <p className="font-semibold text-brand-950">{shift.name}</p>
                <p className="text-xs text-brand-700">
                  {shift.workStart} - {shift.workEnd} | Istirahat {shift.breakStart}
                  - {shift.breakEnd}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge>{shift.isActive ? "Aktif" : "Nonaktif"}</Badge>
                <Button
                  variant="secondary"
                  onClick={() => setEditing(shift)}
                >
                  Edit
                </Button>
                <Button variant="ghost" onClick={() => onDelete(shift)}>
                  Hapus
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
