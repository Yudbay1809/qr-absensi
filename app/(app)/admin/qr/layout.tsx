import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin QR | Gwen Absensi",
  description: "Generate QR untuk sesi absensi karyawan.",
};

export default function AdminQRLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
