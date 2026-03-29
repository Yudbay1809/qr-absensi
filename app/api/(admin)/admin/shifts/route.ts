import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/public/prisma";
import { getSessionUser } from "@/lib/user/session";
import { validateShiftTimes } from "@/lib/public/shift";

const shiftSchema = z.object({
  name: z.string().min(2),
  workStart: z.string().regex(/^\d{2}:\d{2}$/),
  breakStart: z.string().regex(/^\d{2}:\d{2}$/),
  breakEnd: z.string().regex(/^\d{2}:\d{2}$/),
  workEnd: z.string().regex(/^\d{2}:\d{2}$/),
  isActive: z.boolean().optional(),
});

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const shifts = await prisma.shift.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ shifts });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = shiftSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });
  }

  const validationError = validateShiftTimes(parsed.data);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const created = await prisma.shift.create({ data: parsed.data });
  return NextResponse.json({ shift: created });
}

