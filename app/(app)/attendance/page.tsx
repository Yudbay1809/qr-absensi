import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Riwayat Absensi | Gwen Absensi",
  description: "Lihat riwayat absensi dengan filter tanggal dan status.",
};

function getDateRange(searchParams: { from?: string; to?: string }) {
  const now = new Date();
  const from = searchParams.from ? new Date(searchParams.from) : new Date(now);
  from.setHours(0, 0, 0, 0);

  const to = searchParams.to ? new Date(searchParams.to) : new Date(now);
  to.setHours(23, 59, 59, 999);

  return { from, to };
}

export default async function AttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; status?: string }>;
}) {
  const params = await searchParams;
  const { from, to } = getDateRange(params);
  const statusFilter =
    params.status && params.status !== "all" ? params.status : undefined;

  const attendance = await prisma.attendance.findMany({
    where: {
      scannedAt: { gte: from, lte: to },
      status: statusFilter,
    },
    orderBy: { scannedAt: "desc" },
    include: { user: true },
  });

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brand-600">
            Riwayat
          </p>
          <h1 className="font-heading text-3xl font-semibold text-brand-950">
            Daftar absensi
          </h1>
          <p className="mt-2 text-sm text-brand-900/70">
            Filter absensi berdasarkan tanggal dan status.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/api/attendance/export"
            className="inline-flex items-center justify-center rounded-full border border-brand-200 bg-white/80 px-4 py-2 text-sm font-semibold text-brand-900 shadow-sm transition hover:border-brand-300 hover:bg-white"
          >
            Export CSV
          </Link>
          <Link
            href="/api/attendance/export-xlsx"
            className="inline-flex items-center justify-center rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(21,184,121,0.35)] transition hover:bg-brand-600"
          >
            Export Excel
          </Link>
        </div>
      </header>

      <form className="grid gap-3 rounded-3xl border border-brand-100 bg-white/90 p-6 shadow-sm md:grid-cols-4">
        <label className="grid gap-2 text-sm font-medium text-brand-900">
          Dari
          <input
            type="date"
            name="from"
            defaultValue={params.from}
            className="rounded-2xl border border-brand-100 bg-white px-3 py-2 text-sm"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-brand-900">
          Sampai
          <input
            type="date"
            name="to"
            defaultValue={params.to}
            className="rounded-2xl border border-brand-100 bg-white px-3 py-2 text-sm"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-brand-900">
          Status
          <select
            name="status"
            defaultValue={params.status ?? "all"}
            className="rounded-2xl border border-brand-100 bg-white px-3 py-2 text-sm"
          >
            <option value="all">Semua</option>
            <option value="on_time">Tepat waktu</option>
            <option value="late">Terlambat</option>
          </select>
        </label>
        <button
          type="submit"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(21,184,121,0.35)] transition hover:bg-brand-600"
        >
          Terapkan filter
        </button>
      </form>

      <div className="rounded-3xl border border-brand-100 bg-white/90 p-6 shadow-sm">
        <div className="grid gap-3">
          {attendance.length === 0 && (
            <div className="rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-700">
              Tidak ada data untuk rentang tanggal ini.
            </div>
          )}
          {attendance.map((item) => (
            <div
              key={item.id}
              className="grid gap-2 rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm text-brand-900 md:grid-cols-[1.2fr_1fr_0.8fr]"
            >
              <div>
                <p className="font-semibold text-brand-950">{item.user.name}</p>
                <p className="text-xs text-brand-700">{item.user.email}</p>
              </div>
              <div>
                <p className="font-medium text-brand-900">
                  {item.scannedAt.toLocaleString("id-ID")}
                </p>
                <p className="text-xs text-brand-700">{item.status}</p>
              </div>
              <div>
                <p className="text-xs text-brand-700">IP: {item.ip ?? "-"}</p>
                <p className="truncate text-xs text-brand-700">
                  UA: {item.userAgent ?? "-"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
