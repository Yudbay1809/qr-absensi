import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scan QR | Gwen Absensi",
  description: "Scan QR untuk menyimpan absensi secara cepat.",
};

export default function ScanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

