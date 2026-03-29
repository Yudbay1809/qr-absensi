import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/public/prisma";
import { getSessionUser } from "@/lib/user/session";
import { rateLimit } from "@/lib/public/rate-limit";
import { getDefaultShift } from "@/lib/public/shift";

const payloadSchema = z.object({
  token: z.string().min(8),
});

function getJakartaDate(base: Date = new Date()) {
  return new Date(base.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
}

function getJakartaDayRange(base: Date) {
  const start = new Date(base);
  start.setHours(0, 0, 0, 0);
  const end = new Date(base);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

function buildJakartaTime(base: Date, time: string) {
  const [hour, minute] = time.split(":").map(Number);
  const date = new Date(base);
  date.setHours(hour, minute || 0, 0, 0);
  return date;
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const rate = rateLimit(`attendance:${ip}`, 10, 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Terlalu banyak permintaan. Coba lagi sebentar." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Token tidak valid." }, { status: 400 });
  }

  const [qrSession, dbUser] = await Promise.all([
    prisma.qRSession.findUnique({
      where: { token: parsed.data.token },
    }),
    prisma.user.findUnique({
      where: { id: user.userId },
      include: { shift: true },
    }),
  ]);

  if (!qrSession) {
    return NextResponse.json({ error: "QR tidak ditemukan." }, { status: 404 });
  }

  if (qrSession.expiresAt.getTime() < Date.now()) {
    return NextResponse.json({ error: "QR sudah kedaluwarsa." }, { status: 410 });
  }

  const scannedAt = new Date();
  const jakartaNow = getJakartaDate(scannedAt);
  const { start, end } = getJakartaDayRange(jakartaNow);

  const todayAttendance = await prisma.attendance.findMany({
    where: {
      userId: user.userId,
      scannedAt: { gte: start, lte: end },
    },
    orderBy: { scannedAt: "asc" },
  });

  const hasCheckIn = todayAttendance.some((item) => item.type === "check_in");
  const hasCheckOut = todayAttendance.some((item) => item.type === "check_out");

  if (hasCheckIn && hasCheckOut) {
    return NextResponse.json(
      { error: "Anda sudah absen masuk dan pulang hari ini." },
      { status: 409 }
    );
  }

  const shift = dbUser?.shift ?? (await getDefaultShift());
  const scanType = hasCheckIn ? "check_out" : "check_in";
  let status = "on_time";
  let overtimeMinutes: number | null = null;

  if (shift) {
    const workStart = buildJakartaTime(jakartaNow, shift.workStart);
    const workEnd = buildJakartaTime(jakartaNow, shift.workEnd);

    if (scanType === "check_in") {
      status = scannedAt > workStart ? "late" : "on_time";
    } else {
      status = "checked_out";
      const diffMinutes = Math.max(
        0,
        Math.round((scannedAt.getTime() - workEnd.getTime()) / 60000)
      );
      overtimeMinutes = diffMinutes > 0 ? diffMinutes : null;
    }
  } else if (scanType === "check_out") {
    status = "checked_out";
  }

  const attendance = await prisma.attendance.create({
    data: {
      userId: user.userId,
      qrSessionId: qrSession.id,
      shiftId: shift?.id ?? null,
      type: scanType,
      status,
      overtimeMinutes,
      ip,
      userAgent: req.headers.get("user-agent") ?? undefined,
    },
  });

  return NextResponse.json({
    success: true,
    attendanceId: attendance.id,
    type: scanType,
  });
}
