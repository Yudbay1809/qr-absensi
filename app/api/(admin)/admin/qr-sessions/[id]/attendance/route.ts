import { NextResponse } from "next/server";
import { prisma } from "@/lib/public/prisma";
import { getSessionUser } from "@/lib/user/session";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const sessionId = Number(id);

  const attendance = await prisma.attendance.findMany({
    where: { qrSessionId: sessionId },
    orderBy: { scannedAt: "desc" },
    include: { user: true },
  });

  return NextResponse.json({ attendance });
}
