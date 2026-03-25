import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Gwen Absensi",
  description: "Ringkasan kehadiran dan performa absensi tim.",
};

function getTodayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

function getWeekRanges() {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 6);
  weekStart.setHours(0, 0, 0, 0);

  const prevWeekStart = new Date(weekStart);
  prevWeekStart.setDate(weekStart.getDate() - 7);
  const prevWeekEnd = new Date(weekStart);
  prevWeekEnd.setMilliseconds(-1);

  return { weekStart, now, prevWeekStart, prevWeekEnd };
}

export default async function DashboardPage() {
  const user = await getSessionUser();
  const { start, end } = getTodayRange();
  const { weekStart, now, prevWeekStart, prevWeekEnd } = getWeekRanges();

  const [
    todayAttendance,
    todayLate,
    totalAttendance,
    totalUsers,
    latestAttendance,
    weekCount,
    prevWeekCount,
  ] = await Promise.all([
    prisma.attendance.count({
      where: { scannedAt: { gte: start, lte: end } },
    }),
    prisma.attendance.count({
      where: { scannedAt: { gte: start, lte: end }, status: "late" },
    }),
    prisma.attendance.count(),
    prisma.user.count(),
    prisma.attendance.findMany({
      take: 8,
      orderBy: { scannedAt: "desc" },
      include: { user: true },
    }),
    prisma.attendance.count({
      where: { scannedAt: { gte: weekStart, lte: now } },
    }),
    prisma.attendance.count({
      where: { scannedAt: { gte: prevWeekStart, lte: prevWeekEnd } },
    }),
  ]);

  const weeklyChange =
    prevWeekCount === 0
      ? 100
      : Math.round(((weekCount - prevWeekCount) / prevWeekCount) * 100);

  return (
    <div className="flex flex-col gap-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand-600">
              Dashboard
            </p>
            <h1 className="font-heading text-3xl font-semibold text-brand-950">
              Halo, {user?.name ?? "Tim"}
            </h1>
            <p className="mt-2 text-sm text-brand-900/70">
              Ringkasan kehadiran tim Anda hari ini.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-brand-100 bg-white/80 px-4 py-2 text-sm text-brand-900">
              Total pengguna: {totalUsers}
            </span>
            <Link
              href="/admin/qr"
              className="inline-flex items-center justify-center rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(21,184,121,0.35)] transition hover:bg-brand-600"
            >
              Generate QR
            </Link>
            <a
              href="/api/attendance/export"
              className="inline-flex items-center justify-center rounded-full border border-brand-200 bg-white/80 px-4 py-2 text-sm font-semibold text-brand-900 shadow-sm transition hover:border-brand-300 hover:bg-white"
            >
              Export CSV
            </a>
            <a
              href="/api/attendance/export-xlsx"
              className="inline-flex items-center justify-center rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(21,184,121,0.35)] transition hover:bg-brand-600"
            >
              Export Excel
            </a>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-4">
          <div className="rounded-3xl border border-brand-100 bg-white/90 p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-600">
              Hadir Hari Ini
            </p>
            <p className="font-heading text-3xl font-semibold text-brand-950">
              {todayAttendance}
            </p>
            <p className="text-sm text-brand-900/70">Total scan hari ini.</p>
          </div>
          <div className="rounded-3xl border border-brand-100 bg-white/90 p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-600">
              Terlambat
            </p>
            <p className="font-heading text-3xl font-semibold text-brand-950">
              {todayLate}
            </p>
            <p className="text-sm text-brand-900/70">Hari ini.</p>
          </div>
          <div className="rounded-3xl border border-brand-100 bg-white/90 p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-600">
              Total Absensi
            </p>
            <p className="font-heading text-3xl font-semibold text-brand-950">
              {totalAttendance}
            </p>
            <p className="text-sm text-brand-900/70">
              Seluruh histori absensi.
            </p>
          </div>
          <div className="rounded-3xl border border-brand-100 bg-white/90 p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-600">
              Tren Mingguan
            </p>
            <p className="font-heading text-3xl font-semibold text-brand-950">
              {weeklyChange}%
            </p>
            <p className="text-sm text-brand-900/70">
              Dibanding minggu sebelumnya.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-brand-100 bg-white/90 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-brand-600">
                Riwayat Terbaru
              </p>
              <h2 className="font-heading text-2xl font-semibold text-brand-950">
                Aktivitas absensi
              </h2>
            </div>
            <Link
              href="/scan"
              className="text-sm font-semibold text-brand-700 transition hover:text-brand-900"
            >
              Scan baru
            </Link>
          </div>
          <div className="mt-6 grid gap-3">
            {latestAttendance.length === 0 && (
              <div className="rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-700">
                Belum ada absensi. Mulai dengan scan pertama.
              </div>
            )}
            {latestAttendance.map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm text-brand-900"
              >
                <div>
                  <p className="font-semibold text-brand-950">
                    {item.user.name}
                  </p>
                  <p className="text-xs text-brand-700">{item.user.email}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-brand-900">
                    {item.scannedAt.toLocaleString("id-ID")}
                  </p>
                  <p className="text-xs text-brand-700">{item.status}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
    </div>
  );
}
