import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#e9fff7,transparent_55%),linear-gradient(180deg,#f6fffd_0%,#e6fdf4_35%,#f9fffd_100%)] px-6 py-12">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 rounded-3xl border border-brand-100 bg-white/90 p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-600">
          404
        </p>
        <h1 className="font-heading text-3xl font-semibold text-brand-950">
          Halaman tidak ditemukan
        </h1>
        <p className="text-sm text-brand-900/70">
          Sepertinya halaman yang kamu cari tidak tersedia.
        </p>
        <Link
          href="/"
          className="mt-2 inline-flex w-fit items-center justify-center rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white"
        >
          Kembali ke beranda
        </Link>
      </div>
    </div>
  );
}
