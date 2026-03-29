import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/user/session";
import { prisma } from "@/lib/public/prisma";

const settingsSchema = z.object({
  defaultShiftId: z.number().int().positive().nullable(),
});

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const settings = await prisma.settings.findFirst({
    include: { defaultShift: true },
  });

  const shifts = await prisma.shift.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ settings, shifts });
}

export async function PUT(req: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });
  }

  const shiftId = parsed.data.defaultShiftId;
  if (shiftId) {
    const exists = await prisma.shift.findUnique({ where: { id: shiftId } });
    if (!exists) {
      return NextResponse.json({ error: "Shift tidak ditemukan." }, { status: 404 });
    }
  }

  const existing = await prisma.settings.findFirst();
  const settings = existing
    ? await prisma.settings.update({
        where: { id: existing.id },
        data: { defaultShiftId: shiftId },
      })
    : await prisma.settings.create({ data: { defaultShiftId: shiftId } });

  return NextResponse.json({ settings });
}

