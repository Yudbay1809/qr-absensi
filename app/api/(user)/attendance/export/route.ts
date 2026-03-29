import { NextResponse } from "next/server";
import { prisma } from "@/lib/public/prisma";

function parseDate(value: string | null, endOfDay = false) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  if (endOfDay) {
    date.setHours(23, 59, 59, 999);
  } else {
    date.setHours(0, 0, 0, 0);
  }
  return date;
}

function escapeCsv(value: string) {
  if (value.includes(",") || value.includes("\n") || value.includes('"')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const from = parseDate(url.searchParams.get("from"));
  const to = parseDate(url.searchParams.get("to"), true);
  const status = url.searchParams.get("status");
  const type = url.searchParams.get("type");

  const where: Record<string, unknown> = {};
  if (from && to) {
    where.scannedAt = { gte: from, lte: to };
  }
  if (status && status !== "all") {
    where.status = status;
  }
  if (type && type !== "all") {
    where.type = type;
  }

  const attendance = await prisma.attendance.findMany({
    where,
    orderBy: { scannedAt: "desc" },
    include: { user: true, shift: true },
  });

  const header = [
    "id",
    "name",
    "email",
    "scannedAt",
    "type",
    "status",
    "shift",
    "overtimeMinutes",
    "ip",
    "userAgent",
  ];
  const rows = attendance.map((item) => [
    String(item.id),
    item.user.name,
    item.user.email,
    item.scannedAt.toISOString(),
    item.type ?? "",
    item.status,
    item.shift?.name ?? "",
    item.overtimeMinutes ? String(item.overtimeMinutes) : "",
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

