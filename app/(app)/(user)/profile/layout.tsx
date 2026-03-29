import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil | Gwen Absensi",
  description: "Profil user dan pengaturan akun.",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

