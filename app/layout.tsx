import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gwen Absensi",
  description:
    "Sistem absensi QR Code modern untuk tim yang rapi, cepat, dan aman.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <head>
        <link rel="stylesheet" href="/fonts/fonts.css" />
      </head>
      <body className="min-h-full flex flex-col bg-emerald-950 text-slate-900">
        {children}
      </body>
    </html>
  );
}

