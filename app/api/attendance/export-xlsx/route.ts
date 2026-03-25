import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

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

export async function GET(req: Request) {
  const url = new URL(req.url);
  const from = parseDate(url.searchParams.get("from"));
  const to = parseDate(url.searchParams.get("to"), true);
  const status = url.searchParams.get("status");

  const where: Record<string, unknown> = {};
  if (from && to) {
    where.scannedAt = { gte: from, lte: to };
  }
  if (status && status !== "all") {
    where.status = status;
  }

  const attendance = await prisma.attendance.findMany({
    where,
    orderBy: { scannedAt: "desc" },
    include: { user: true },
  });

  const rows = attendance.map((item) => ({
    id: item.id,
    name: item.user.name,
    email: item.user.email,
    scannedAt: item.scannedAt.toISOString(),
    status: item.status,
    ip: item.ip ?? "",
    userAgent: item.userAgent ?? "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet["!cols"] = [
    { wch: 6 },
    { wch: 18 },
    { wch: 28 },
    { wch: 24 },
    { wch: 12 },
    { wch: 18 },
    { wch: 40 },
  ];
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=absensi.xlsx",
    },
  });
}
