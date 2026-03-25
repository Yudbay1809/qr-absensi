import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Karyawan | Gwen Absensi",
  description: "Daftar karyawan yang terdaftar di Gwen Absensi.",
};

export default function EmployeesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
