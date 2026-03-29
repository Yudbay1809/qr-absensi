import { prisma } from "@/lib/public/prisma";
import { getSessionUser } from "@/lib/user/session";
import type { Metadata } from "next";
import AttendanceFilter from "@/components/user/attendance-filter";
import AttendanceList from "@/components/user/attendance-list";

export const metadata: Metadata = {
  title: "Absensi Saya | Gwen Absensi",
  description: "Riwayat absensi pribadi.",
};

function getDateRange(searchParams: { from?: string; to?: string }) {
  const now = new Date();
  const from = searchParams.from ? new Date(searchParams.from) : new Date(now);
  from.setHours(0, 0, 0, 0);

  const to = searchParams.to ? new Date(searchParams.to) : new Date(now);
  to.setHours(23, 59, 59, 999);

  return { from, to };
}

export default async function MyAttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; status?: string }>;
}) {
  const session = await getSessionUser();
  if (!session) return null;

  const params = await searchParams;
  const { from, to } = getDateRange(params);
  const statusFilter =
    params.status && params.status !== "all" ? params.status : undefined;

  const attendance = await prisma.attendance.findMany({
    where: {
      userId: session.userId,
      scannedAt: { gte: from, lte: to },
      status: statusFilter,
    },
    orderBy: { scannedAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-brand-600">
          Absensi
        </p>
        <h1 className="font-heading text-3xl font-semibold text-brand-950">
          Riwayat saya
        </h1>
        <p className="mt-2 text-sm text-brand-900/70">
          Catatan absensi pribadi.
        </p>
      </header>

      <AttendanceFilter
        from={params.from}
        to={params.to}
        status={params.status}
      />

      <div className="card-surface p-6">
        <AttendanceList items={attendance} emptyText="Belum ada absensi." />
      </div>
    </div>
  );
}

