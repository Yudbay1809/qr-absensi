"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#e9fff7,transparent_55%),linear-gradient(180deg,#f6fffd_0%,#e6fdf4_35%,#f9fffd_100%)] px-6 py-12">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 rounded-3xl border border-brand-100 bg-white/90 p-8 shadow-sm">
        <h1 className="font-heading text-3xl font-semibold text-brand-950">
          Terjadi kesalahan
        </h1>
        <p className="text-sm text-brand-900/70">
          Maaf, ada sesuatu yang tidak berjalan semestinya. Silakan coba lagi.
        </p>
        <button
          onClick={reset}
          className="mt-2 inline-flex w-fit items-center justify-center rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white"
        >
          Coba ulang
        </button>
        <p className="text-xs text-brand-700">{error.digest}</p>
      </div>
    </div>
  );
}

