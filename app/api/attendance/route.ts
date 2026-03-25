import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { rateLimit } from "@/lib/rate-limit";

const payloadSchema = z.object({
  token: z.string().min(8),
});

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

  const qrSession = await prisma.qRSession.findUnique({
    where: { token: parsed.data.token },
  });

  if (!qrSession) {
    return NextResponse.json({ error: "QR tidak ditemukan." }, { status: 404 });
  }

  if (qrSession.isUsed) {
    return NextResponse.json({ error: "QR sudah dipakai." }, { status: 409 });
  }

  if (qrSession.expiresAt.getTime() < Date.now()) {
    return NextResponse.json({ error: "QR sudah kedaluwarsa." }, { status: 410 });
  }

  const lateAfterHour = 9;
  const scannedAt = new Date();
  const lateThreshold = new Date(scannedAt);
  lateThreshold.setHours(lateAfterHour, 0, 0, 0);
  const status = scannedAt > lateThreshold ? "late" : "on_time";

  const attendance = await prisma.attendance.create({
    data: {
      userId: user.userId,
      qrSessionId: qrSession.id,
      status,
      ip,
      userAgent: req.headers.get("user-agent") ?? undefined,
    },
  });

  await prisma.qRSession.update({
    where: { id: qrSession.id },
    data: {
      isUsed: true,
      usedAt: new Date(),
    },
  });

  return NextResponse.json({
    success: true,
    attendanceId: attendance.id,
  });
}
