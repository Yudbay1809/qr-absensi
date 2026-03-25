import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function escapeCsv(value: string) {
  if (value.includes(",") || value.includes("\n") || value.includes('"')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET() {
  const attendance = await prisma.attendance.findMany({
    orderBy: { scannedAt: "desc" },
    include: { user: true },
  });

  const header = ["id", "name", "email", "scannedAt", "status", "ip", "userAgent"];
  const rows = attendance.map((item) => [
    String(item.id),
    item.user.name,
    item.user.email,
    item.scannedAt.toISOString(),
    item.status,
    item.ip ?? "",
    item.userAgent ?? "",
  ]);

  const csv =
    [header, ...rows]
      .map((row) => row.map((cell) => escapeCsv(cell)).join(","))
      .join("\n") + "\n";

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=absensi.csv",
    },
  });
}
