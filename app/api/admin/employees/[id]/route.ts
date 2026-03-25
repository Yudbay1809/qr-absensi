import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { hashPassword } from "@/lib/auth";

const updateSchema = z.object({
  name: z.string().min(2),
  username: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6).optional().or(z.literal("")),
  startDate: z.string().optional(),
  position: z.string().optional(),
  gender: z.string().optional(),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({
    where: { id: Number(id) },
  });
  if (!existing || existing.role !== "EMPLOYEE") {
    return NextResponse.json({ error: "Karyawan tidak ditemukan." }, { status: 404 });
  }

  const conflict = await prisma.user.findFirst({
    where: {
      OR: [{ email: parsed.data.email }, { username: parsed.data.username }],
      NOT: { id: existing.id },
    },
  });
  if (conflict) {
    return NextResponse.json(
      { error: "Email atau username sudah terpakai." },
      { status: 409 }
    );
  }

  const passwordHash = parsed.data.password
    ? await hashPassword(parsed.data.password)
    : undefined;

  const updated = await prisma.user.update({
    where: { id: existing.id },
    data: {
      name: parsed.data.name,
      username: parsed.data.username,
      email: parsed.data.email,
      ...(passwordHash ? { passwordHash } : {}),
      startDate: parsed.data.startDate
        ? new Date(parsed.data.startDate)
        : undefined,
      position: parsed.data.position || undefined,
      gender: parsed.data.gender || undefined,
    },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      startDate: true,
      position: true,
      gender: true,
    },
  });

  return NextResponse.json({ employee: updated });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const existing = await prisma.user.findUnique({
    where: { id: Number(id) },
  });
  if (!existing || existing.role !== "EMPLOYEE") {
    return NextResponse.json({ error: "Karyawan tidak ditemukan." }, { status: 404 });
  }

  await prisma.user.delete({ where: { id: existing.id } });
  return NextResponse.json({ success: true });
}
