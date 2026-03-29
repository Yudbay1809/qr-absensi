import { NextResponse } from "next/server";
import { prisma } from "@/lib/public/prisma";
import { getDefaultShift } from "@/lib/public/shift";
import crypto from "crypto";

const REFRESH_MINUTES = 10;

function endOfDay(date: Date) {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
}

export async function GET() {
  const now = new Date();
  const shift = await getDefaultShift();

  let lateThreshold: Date | null = null;
  if (shift) {
    const [lateHour, lateMinute] = shift.workStart.split(":").map(Number);
    lateThreshold = new Date(now);
    lateThreshold.setHours(lateHour, lateMinute ?? 0, 0, 0);
  }

  const origin = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  if (!lateThreshold || now < lateThreshold) {
    const active = await prisma.qRSession.findFirst({
      where: { expiresAt: { gt: now } },
      orderBy: { createdAt: "desc" },
    });

    if (active) {
      return NextResponse.json({
        session: {
          id: active.id,
          token: active.token,
          url: `${origin}/scan?token=${active.token}`,
          expiresAt: active.expiresAt,
          mode: "rolling",
        },
      });
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + REFRESH_MINUTES * 60 * 1000);
    const session = await prisma.qRSession.create({
      data: { token, expiresAt },
    });

    return NextResponse.json({
      session: {
        id: session.id,
        token: session.token,
        url: `${origin}/scan?token=${session.token}`,
        expiresAt: session.expiresAt,
        mode: "rolling",
      },
    });
  }

  const lateSession = await prisma.qRSession.findFirst({
    where: { createdAt: { gte: lateThreshold } },
    orderBy: { createdAt: "desc" },
  });

  if (lateSession) {
    return NextResponse.json({
      session: {
        id: lateSession.id,
        token: lateSession.token,
        url: `${origin}/scan?token=${lateSession.token}`,
        expiresAt: lateSession.expiresAt,
        mode: "locked",
      },
    });
  }

  const token = crypto.randomUUID();
  const session = await prisma.qRSession.create({
    data: { token, expiresAt: endOfDay(now) },
  });

  return NextResponse.json({
    session: {
      id: session.id,
      token: session.token,
      url: `${origin}/scan?token=${session.token}`,
      expiresAt: session.expiresAt,
      mode: "locked",
    },
  });
}

