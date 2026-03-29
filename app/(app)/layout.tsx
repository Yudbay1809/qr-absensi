import Link from "next/link";
import { getSessionUser } from "@/lib/user/session";
import LogoutButton from "@/components/user/logout-button";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Riwayat", href: "/attendance" },
  { label: "Absensi Saya", href: "/attendance/me" },
  { label: "Profil", href: "/profile" },
  { label: "Scan", href: "/scan" },
  { label: "Admin QR", href: "/admin/qr", adminOnly: true },
  { label: "Karyawan", href: "/admin/employees", adminOnly: true },
  { label: "Jam Kerja", href: "/admin/settings", adminOnly: true },
  { label: "Shift", href: "/admin/shifts", adminOnly: true },
];

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#e9fff7,transparent_55%),linear-gradient(180deg,#f6fffd_0%,#e6fdf4_35%,#f9fffd_100%)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-[0_10px_25px_rgba(21,184,121,0.35)]">
              <span className="font-heading text-lg font-semibold">G</span>
            </div>
            <div>
              <p className="font-heading text-lg font-semibold text-brand-950">
                Gwen Absensi
              </p>
              <p className="text-xs uppercase tracking-[0.2em] text-brand-700">
                {user?.role === "ADMIN" ? "Admin" : "Karyawan"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full border border-brand-100 bg-white/80 px-4 py-2 text-sm text-brand-900">
              {user?.name ?? "Pengguna"}
            </div>
            <LogoutButton />
          </div>
        </header>

        <div className="flex flex-wrap gap-2">
          {navItems
            .filter((item) => !item.adminOnly || user?.role === "ADMIN")
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-brand-100 bg-white/80 px-4 py-2 text-sm font-semibold text-brand-900 transition hover:border-brand-300 hover:bg-white"
              >
                {item.label}
              </Link>
            ))}
        </div>

        <main>{children}</main>
      </div>
    </div>
  );
}

