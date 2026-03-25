import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pengaturan Jam | Gwen Absensi",
  description: "Pengaturan jam kerja untuk absensi karyawan.",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
