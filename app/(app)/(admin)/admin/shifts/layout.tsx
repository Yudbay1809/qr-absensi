import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shift Kerja | Gwen Absensi",
  description: "Pengaturan multi-shift untuk jam kerja.",
};

export default function ShiftsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

