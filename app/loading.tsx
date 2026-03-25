export default function Loading() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#e9fff7,transparent_55%),linear-gradient(180deg,#f6fffd_0%,#e6fdf4_35%,#f9fffd_100%)] px-6 py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="h-8 w-48 animate-pulse rounded-full bg-brand-200/60" />
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-3xl border border-brand-100 bg-white/90"
            />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-3xl border border-brand-100 bg-white/90" />
      </div>
    </div>
  );
}
