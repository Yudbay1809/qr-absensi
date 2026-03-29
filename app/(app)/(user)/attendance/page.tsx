import Link from "next/link";
import { prisma } from "@/lib/public/prisma";
import type { Metadata } from "next";
import AttendanceFilter from "@/components/user/attendance-filter";
import AttendanceList from "@/components/user/attendance-list";

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
  const queryString = new URLSearchParams({
    ...(params.from ? { from: params.from } : {}),
    ...(params.to ? { to: params.to } : {}),
    ...(params.status ? { status: params.status } : {}),
  }).toString();

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
            href={`/api/attendance/export${queryString ? `?${queryString}` : ""}`}
            className="inline-flex items-center justify-center rounded-full border border-brand-200 bg-white/80 px-4 py-2 text-sm font-semibold text-brand-900 shadow-sm transition hover:border-brand-300 hover:bg-white"
          >
            Export CSV
          </Link>
          <Link
            href={`/api/attendance/export-xlsx${queryString ? `?${queryString}` : ""}`}
            className="inline-flex items-center justify-center rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(21,184,121,0.35)] transition hover:bg-brand-600"
          >
            Export Excel
          </Link>
        </div>
      </header>

      <AttendanceFilter
        from={params.from}
        to={params.to}
        status={params.status}
      />

      <div className="rounded-3xl border border-brand-100 bg-white/90 p-6 shadow-sm">
        <AttendanceList
          items={attendance}
          emptyText="Tidak ada data untuk rentang tanggal ini."
          showUser
          showAudit
        />
      </div>
    </div>
  );
}

