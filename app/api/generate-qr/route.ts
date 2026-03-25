import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const rate = rateLimit(`generate-qr:${ip}`, 6, 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Terlalu sering generate QR. Coba lagi sebentar." },
      { status: 429 }
    );
  }
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 5);

  const session = await prisma.qRSession.create({
    data: {
      token,
      expiresAt,
    },
  });

  const origin =
    req.headers.get("origin") ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:3000";

  return NextResponse.json({
    token: session.token,
    url: `${origin}/scan?token=${session.token}`,
    expiresAt: session.expiresAt,
  });
}
