import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/public/prisma";
import { getSessionUser } from "@/lib/user/session";
import { hashPassword, verifyPassword } from "@/lib/user/auth";

const passwordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

export async function PUT(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = passwordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({
    where: { id: user.userId },
  });
  if (!existing) {
    return NextResponse.json({ error: "User tidak ditemukan." }, { status: 404 });
  }

  const ok = await verifyPassword(parsed.data.currentPassword, existing.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Password lama salah." }, { status: 401 });
  }

  const passwordHash = await hashPassword(parsed.data.newPassword);
  await prisma.user.update({
    where: { id: user.userId },
    data: { passwordHash },
  });

  return NextResponse.json({ success: true });
}

