import { prisma } from "@/lib/public/prisma";
import { getSessionUser } from "@/lib/user/session";
import type { Metadata } from "next";
import ProfileClient from "@/components/user/profile-client";

export const metadata: Metadata = {
  title: "Profil Saya | Gwen Absensi",
  description: "Profil karyawan dan status absensi hari ini.",
};

function getTodayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

export default async function ProfilePage() {
  const session = await getSessionUser();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  const { start, end } = getTodayRange();
  const todayAttendance = await prisma.attendance.findMany({
    where: {
      userId: session.userId,
      scannedAt: { gte: start, lte: end },
    },
    orderBy: { scannedAt: "asc" },
  });

  const hasCheckIn = todayAttendance.some((item) => item.type === "check_in");
  const hasCheckOut = todayAttendance.some((item) => item.type === "check_out");

  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-brand-600">
          Profil
        </p>
        <h1 className="font-heading text-3xl font-semibold text-brand-950">
          Data saya
        </h1>
        <p className="mt-2 text-sm text-brand-900/70">
          Lihat detail profil dan status absensi hari ini.
        </p>
      </header>

      <div className="card-surface p-6">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand-600">
              Nama
            </p>
            <p className="font-semibold text-brand-950">{user?.name}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand-600">
              Username
            </p>
            <p className="font-semibold text-brand-950">@{user?.username}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand-600">
              Email
            </p>
            <p className="font-semibold text-brand-950">{user?.email}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand-600">
              Jabatan
            </p>
            <p className="font-semibold text-brand-950">
              {user?.position ?? "-"}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand-600">
              Jenis kelamin
            </p>
            <p className="font-semibold text-brand-950">
              {user?.gender === "L"
                ? "Laki-laki"
                : user?.gender === "P"
                ? "Perempuan"
                : "-"}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand-600">
              Tanggal masuk
            </p>
            <p className="font-semibold text-brand-950">
              {user?.startDate
                ? new Date(user.startDate).toLocaleDateString("id-ID")
                : "-"}
            </p>
          </div>
        </div>
      </div>

      <div className="card-surface p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-600">
          Status hari ini
        </p>
        <p className="font-semibold text-brand-950">
          {hasCheckIn && hasCheckOut
            ? "Sudah absen masuk dan pulang"
            : hasCheckIn
            ? "Sudah absen masuk"
            : "Belum absen"}
        </p>
      </div>
      <ProfileClient />
    </div>
  );
}

