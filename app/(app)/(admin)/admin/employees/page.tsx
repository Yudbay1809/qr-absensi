"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/(shared)/ui/button";
import { Card } from "@/components/(shared)/ui/card";
import AdminPageHeader from "@/components/admin/admin-page-header";
import EmployeeRow from "@/components/admin/employee-row";

type Employee = {
  id: number;
  name: string;
  email: string;
  username: string;
  startDate?: string | null;
  position?: string | null;
  gender?: string | null;
  shift?: { id: number; name: string } | null;
};

type EmployeeForm = {
  name: string;
  username: string;
  email: string;
  password: string;
  shiftId: string;
  startDate: string;
  position: string;
  gender: string;
};

type ShiftOption = {
  id: number;
  name: string;
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shifts, setShifts] = useState<ShiftOption[]>([]);

  const [form, setForm] = useState<EmployeeForm>({
    name: "",
    username: "",
    email: "",
    password: "",
    shiftId: "",
    startDate: "",
    position: "",
    gender: "",
  });
  const [editing, setEditing] = useState<Employee | null>(null);
  const [editPassword, setEditPassword] = useState("");

  const [query, setQuery] = useState("");

  const loadEmployees = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/employees");
    setLoading(false);

    if (!res.ok) {
      setError("Gagal memuat daftar karyawan.");
      return;
    }

    const data = await res.json();
    setEmployees(data.employees ?? []);
  };

  const loadShifts = async () => {
    const res = await fetch("/api/admin/shifts");
    if (!res.ok) return;
    const data = await res.json();
    setShifts(data.shifts ?? []);
  };

  useEffect(() => {
    loadEmployees();
    loadShifts();
  }, []);

  const onCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    const res = await fetch("/api/admin/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Gagal menambah karyawan.");
      return;
    }

    setForm({
      name: "",
      username: "",
      email: "",
      password: "",
      shiftId: "",
      startDate: "",
      position: "",
      gender: "",
    });
    await loadEmployees();
  };

  const onUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editing) return;

    const res = await fetch(`/api/admin/employees/${editing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editing.name,
        username: editing.username,
        email: editing.email,
        password: editPassword,
        shiftId: editing.shift?.id ?? "",
        startDate: editing.startDate ?? "",
        position: editing.position ?? "",
        gender: editing.gender ?? "",
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Gagal memperbarui karyawan.");
      return;
    }

    setEditing(null);
    setEditPassword("");
    await loadEmployees();
  };

  const onDelete = async (employee: Employee) => {
    const ok = window.confirm(`Hapus karyawan ${employee.name}?`);
    if (!ok) return;

    const res = await fetch(`/api/admin/employees/${employee.id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Gagal menghapus karyawan.");
      return;
    }

    await loadEmployees();
  };

  const filtered = employees.filter((employee) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      employee.name.toLowerCase().includes(q) ||
      employee.email.toLowerCase().includes(q) ||
      employee.username.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Daftar karyawan"
        description={`Total karyawan terdaftar: ${employees.length}`}
      />

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <Card className="p-6">
        <h2 className="font-heading text-xl font-semibold text-brand-950">
          Tambah karyawan
        </h2>
        <form onSubmit={onCreate} className="mt-4 grid gap-3 md:grid-cols-3">
          <input
            className="rounded-2xl border border-brand-100 bg-white px-3 py-2 text-sm"
            placeholder="Nama"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            required
          />
          <input
            className="rounded-2xl border border-brand-100 bg-white px-3 py-2 text-sm"
            placeholder="Username"
            value={form.username}
            onChange={(event) =>
              setForm({ ...form, username: event.target.value })
            }
            required
          />
          <input
            className="rounded-2xl border border-brand-100 bg-white px-3 py-2 text-sm"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
          <input
            className="rounded-2xl border border-brand-100 bg-white px-3 py-2 text-sm"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm({ ...form, password: event.target.value })
            }
            required
          />
          <select
            className="rounded-2xl border border-brand-100 bg-white px-3 py-2 text-sm"
            value={form.shiftId}
            onChange={(event) =>
              setForm({ ...form, shiftId: event.target.value })
            }
          >
            <option value="">Pilih shift</option>
            {shifts.map((shift) => (
              <option key={shift.id} value={shift.id}>
                {shift.name}
              </option>
            ))}
          </select>
          <input
            className="rounded-2xl border border-brand-100 bg-white px-3 py-2 text-sm"
            placeholder="Tanggal masuk"
            type="date"
            value={form.startDate}
            onChange={(event) =>
              setForm({ ...form, startDate: event.target.value })
            }
          />
          <input
            className="rounded-2xl border border-brand-100 bg-white px-3 py-2 text-sm"
            placeholder="Jabatan"
            value={form.position}
            onChange={(event) =>
              setForm({ ...form, position: event.target.value })
            }
          />
          <select
            className="rounded-2xl border border-brand-100 bg-white px-3 py-2 text-sm"
            value={form.gender}
            onChange={(event) =>
              setForm({ ...form, gender: event.target.value })
            }
          >
            <option value="">Pilih jenis kelamin</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
          <Button type="submit" aria-label="Tambah karyawan">
            Tambah
          </Button>
        </form>
      </Card>

      {editing && (
        <Card className="p-6">
          <h2 className="font-heading text-xl font-semibold text-brand-950">
            Edit karyawan
          </h2>
          <form onSubmit={onUpdate} className="mt-4 grid gap-3 md:grid-cols-3">
            <input
              className="rounded-2xl border border-brand-100 bg-white px-3 py-2 text-sm"
              placeholder="Nama"
              value={editing.name}
              onChange={(event) =>
                setEditing({ ...editing, name: event.target.value })
              }
              required
            />
            <input
              className="rounded-2xl border border-brand-100 bg-white px-3 py-2 text-sm"
              placeholder="Username"
              value={editing.username}
              onChange={(event) =>
                setEditing({ ...editing, username: event.target.value })
              }
              required
            />
            <input
              className="rounded-2xl border border-brand-100 bg-white px-3 py-2 text-sm"
              placeholder="Email"
              type="email"
              value={editing.email}
              onChange={(event) =>
                setEditing({ ...editing, email: event.target.value })
              }
              required
            />
            <input
              className="rounded-2xl border border-brand-100 bg-white px-3 py-2 text-sm"
              placeholder="Reset password (opsional)"
              type="password"
              value={editPassword}
              onChange={(event) => setEditPassword(event.target.value)}
            />
            <select
              className="rounded-2xl border border-brand-100 bg-white px-3 py-2 text-sm"
              value={editing.shift?.id ?? ""}
              onChange={(event) =>
                setEditing({
                  ...editing,
                  shift: event.target.value
                    ? {
                        id: Number(event.target.value),
                        name:
                          shifts.find(
                            (shift) => shift.id === Number(event.target.value)
                          )?.name ?? "Shift",
                      }
                    : null,
                })
              }
            >
              <option value="">Pilih shift</option>
              {shifts.map((shift) => (
                <option key={shift.id} value={shift.id}>
                  {shift.name}
                </option>
              ))}
            </select>
            <input
              className="rounded-2xl border border-brand-100 bg-white px-3 py-2 text-sm"
              placeholder="Tanggal masuk"
              type="date"
              value={editing.startDate ? editing.startDate.slice(0, 10) : ""}
              onChange={(event) =>
                setEditing({ ...editing, startDate: event.target.value })
              }
            />
            <input
              className="rounded-2xl border border-brand-100 bg-white px-3 py-2 text-sm"
              placeholder="Jabatan"
              value={editing.position ?? ""}
              onChange={(event) =>
                setEditing({ ...editing, position: event.target.value })
              }
            />
            <select
              className="rounded-2xl border border-brand-100 bg-white px-3 py-2 text-sm"
              value={editing.gender ?? ""}
              onChange={(event) =>
                setEditing({ ...editing, gender: event.target.value })
              }
            >
              <option value="">Pilih jenis kelamin</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
            <div className="flex gap-2">
              <Button type="submit">Simpan</Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setEditing(null);
                  setEditPassword("");
                }}
              >
                Batal
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-heading text-xl font-semibold text-brand-950">
            List karyawan
          </h2>
          <input
            className="rounded-2xl border border-brand-100 bg-white px-3 py-2 text-sm"
            placeholder="Cari nama, username, atau email"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Cari karyawan"
          />
        </div>
        <div className="mt-4 grid gap-3">
          {loading && (
            <div className="rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-700">
              Memuat data...
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <div className="rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-700">
              Tidak ada karyawan yang cocok.
            </div>
          )}
          {filtered.map((employee) => (
            <EmployeeRow
              key={employee.id}
              employee={employee}
              onEdit={(item) => {
                setEditing(item);
                setEditPassword("");
              }}
              onDelete={onDelete}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}

