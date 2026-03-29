import Link from "next/link";
import type { Metadata } from "next";
import LandingQR from "@/components/public/landing-qr";
import LandingNav from "@/components/public/landing-nav";

export const metadata: Metadata = {
  title: "Gwen Absensi",
  description: "Sistem absensi QR Code modern untuk tim yang rapi dan cepat.",
};

export default function Home() {
  const stats = [
    { label: "Waktu check-in", value: "< 3 detik" },
    { label: "Akurasi scan", value: "99.8%" },
    { label: "Keamanan token", value: "Rotasi 5 menit" },
  ];

  const adminFlow = [
    "Login sebagai admin",
    "Tekan tombol Generate QR",
    "QR tampil di layar",
    "Pantau absen real-time",
  ];

  const employeeFlow = [
    "Login sebagai karyawan",
    "Buka halaman scan",
    "Scan QR di lokasi",
    "Absensi tersimpan otomatis",
  ];

  const features = [
    {
      title: "QR dinamis",
      desc: "Token otomatis diperbarui agar aman dari penyalahgunaan.",
    },
    {
      title: "Pelacakan presisi",
      desc: "Waktu check-in tercatat rapi untuk laporan harian.",
    },
    {
      title: "Dashboard jelas",
      desc: "Ringkasan kehadiran dan tren tim dalam satu layar.",
    },
    {
      title: "Integrasi fleksibel",
      desc: "Siap terhubung dengan payroll dan sistem HR.",
    },
  ];

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[radial-gradient(circle_at_top,#e9fff7,transparent_55%),linear-gradient(180deg,#f6fffd_0%,#e6fdf4_35%,#f9fffd_100%)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-20%] h-72 w-72 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="absolute right-[-5%] top-[10%] h-80 w-80 rounded-full bg-brand-300/30 blur-3xl" />
        <div className="absolute bottom-[-15%] left-[15%] h-96 w-96 rounded-full bg-brand-100/50 blur-3xl" />
      </div>

      <header
        id="landing-header"
        className="sticky top-0 z-30 border-b border-brand-100/70 bg-white/80 backdrop-blur-lg"
      >
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-[0_10px_30px_rgba(21,184,121,0.35)]">
              <span className="font-heading text-xl font-semibold">G</span>
            </div>
            <div>
              <p className="font-heading text-lg font-semibold text-brand-950">
                Gwen Absensi
              </p>
              <p className="text-xs uppercase tracking-[0.2em] text-brand-700">
                QR Attendance
              </p>
            </div>
          </div>
          <LandingNav />
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-full border border-brand-200 bg-white/80 px-4 py-2 text-sm font-semibold text-brand-900 shadow-sm transition hover:border-brand-300 hover:bg-white md:inline-flex"
            >
              Login
            </Link>
            <Link
              href="/scan"
              className="inline-flex items-center justify-center rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(21,184,121,0.35)] transition hover:bg-brand-600"
            >
              Mulai Scan
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col gap-24 px-6 pb-24 pt-10">
        <section id="home" className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
              Sistem Absensi Modern
            </span>
            <h1 className="font-heading text-4xl font-semibold leading-tight text-brand-950 sm:text-5xl lg:text-6xl">
              Absensi QR Code yang rapi, cepat, dan terasa profesional.
            </h1>
            <p className="max-w-xl text-base leading-7 text-brand-900/80 sm:text-lg">
              Gwen Absensi membantu tim Anda mengelola kehadiran dengan alur
              sederhana. Admin cukup tampilkan QR, karyawan scan, data langsung
              masuk dashboard secara real-time.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/admin/qr"
                className="inline-flex items-center justify-center rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(21,184,121,0.35)] transition hover:bg-brand-600"
              >
                Generate QR Admin
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-full border border-brand-200 bg-white/80 px-6 py-3 text-sm font-semibold text-brand-900 shadow-sm transition hover:border-brand-300 hover:bg-white"
              >
                Lihat Dashboard
              </Link>
            </div>
            <div className="grid gap-4 pt-6 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-brand-100 bg-white/80 px-4 py-4 shadow-sm"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-brand-600">
                    {stat.label}
                  </p>
                  <p className="font-heading text-xl font-semibold text-brand-950">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="flex h-full flex-col gap-6 rounded-[28px] border border-brand-200/70 bg-white/95 p-7 shadow-[0_24px_60px_rgba(10,77,56,0.16)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-brand-600">
                    Live QR Session
                  </p>
                  <p className="font-heading text-2xl font-semibold text-brand-950">
                    QR Hari Ini
                  </p>
                </div>
                <span className="rounded-full bg-brand-100 px-4 py-1.5 text-xs font-semibold text-brand-700">
                  Aktif
                </span>
              </div>
              <LandingQR />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-brand-900 px-5 py-4 text-white shadow-[0_14px_30px_rgba(10,77,56,0.2)]">
                  <p className="text-xs uppercase tracking-[0.2em] text-brand-200">
                    Hadir
                  </p>
                  <p className="font-heading text-2xl font-semibold">128</p>
                </div>
                <div className="rounded-2xl border border-brand-200 bg-white px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-brand-600">
                    Terlambat
                  </p>
                  <p className="font-heading text-2xl font-semibold text-brand-950">
                    4
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="fitur" className="grid gap-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-brand-600">
                Fitur Utama
              </p>
              <h2 className="font-heading text-3xl font-semibold text-brand-950">
                Dirancang untuk tim yang bergerak cepat
              </h2>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition hover:text-brand-900"
            >
              Lihat semua insight
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-3xl border border-brand-100 bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand-200"
              >
                <div className="mb-4 h-10 w-10 rounded-2xl bg-brand-500/15 p-2 text-brand-700">
                  <div className="h-full w-full rounded-xl bg-brand-500/30" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-brand-950">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-brand-900/70">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="alur" className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-brand-100 bg-white/90 p-7 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-600">
              Alur Admin
            </p>
            <h3 className="font-heading text-2xl font-semibold text-brand-950">
              Kendali penuh di ujung jari
            </h3>
            <div className="mt-6 grid gap-4">
              {adminFlow.map((step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-4 rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                  <p className="text-sm font-medium text-brand-900">{step}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-brand-100 bg-white/90 p-7 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-600">
              Alur Karyawan
            </p>
            <h3 className="font-heading text-2xl font-semibold text-brand-950">
              Absen tanpa gesekan
            </h3>
            <div className="mt-6 grid gap-4">
              {employeeFlow.map((step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-4 rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                  <p className="text-sm font-medium text-brand-900">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="dashboard"
          className="rounded-3xl border border-brand-100 bg-brand-950 px-8 py-10 text-white shadow-[0_30px_70px_rgba(7,43,33,0.35)]"
        >
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-brand-200">
                Dashboard Insight
              </p>
              <h2 className="font-heading text-3xl font-semibold">
                Semua kehadiran tersusun dalam satu pusat kontrol.
              </h2>
              <p className="mt-3 max-w-xl text-sm text-brand-100/80">
                Pantau tingkat kehadiran, keterlambatan, dan histori per tim.
                Data siap diekspor kapan saja untuk payroll atau audit internal.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-brand-950 shadow-sm"
                >
                  Buka Dashboard
                </Link>
                <Link
                  href="/admin/qr"
                  className="inline-flex items-center justify-center rounded-full border border-brand-300/30 px-5 py-2 text-sm font-semibold text-brand-100 transition hover:bg-brand-900"
                >
                  Buat QR Sesi
                </Link>
              </div>
            </div>
            <div className="grid gap-4">
              <div className="rounded-2xl border border-brand-800 bg-brand-900/70 px-5 py-4">
                <p className="text-xs uppercase tracking-[0.2em] text-brand-200">
                  Hari Ini
                </p>
                <p className="font-heading text-3xl font-semibold">94%</p>
                <p className="text-sm text-brand-100/70">
                  Tingkat kehadiran tim operasional
                </p>
              </div>
              <div className="rounded-2xl border border-brand-800 bg-brand-900/70 px-5 py-4">
                <p className="text-xs uppercase tracking-[0.2em] text-brand-200">
                  Mingguan
                </p>
                <p className="font-heading text-3xl font-semibold">+12%</p>
                <p className="text-sm text-brand-100/70">
                  Peningkatan kehadiran dibanding minggu lalu
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-brand-100 bg-white/80">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-brand-700 md:flex-row md:items-center md:justify-between">
          <p>Copyright 2026 Gwen Absensi. Semua hak cipta dilindungi.</p>
          <div className="flex items-center gap-4">
            <Link href="/login">Masuk</Link>
            <Link href="/scan">Scan QR</Link>
            <Link href="/admin/qr">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

