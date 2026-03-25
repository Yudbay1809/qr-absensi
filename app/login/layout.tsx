import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk | Gwen Absensi",
  description: "Login ke sistem absensi QR Code Gwen Absensi.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
