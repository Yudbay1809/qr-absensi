"use client";

import { useState } from "react";
import { Button } from "@/components/(shared)/ui/button";

export default function ProfileClient() {
  const [status, setStatus] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setStatus(null);

    const res = await fetch("/api/user/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setStatus(data?.error ?? "Gagal mengganti password.");
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setStatus("Password berhasil diubah.");
  };

  return (
    <div className="card-surface p-6">
      <h2 className="font-heading text-xl font-semibold text-brand-950">
        Ganti password
      </h2>
      <form onSubmit={onSubmit} className="mt-4 grid gap-3 md:grid-cols-2">
        <input
          type="password"
          className="rounded-2xl border border-brand-100 bg-white px-3 py-2 text-sm"
          placeholder="Password lama"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          required
        />
        <input
          type="password"
          className="rounded-2xl border border-brand-100 bg-white px-3 py-2 text-sm"
          placeholder="Password baru"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          required
        />
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan"}
          </Button>
          {status && <span className="text-sm text-brand-700">{status}</span>}
        </div>
      </form>
    </div>
  );
}

