import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

export async function GET() {
  const attendance = await prisma.attendance.findMany({
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
