type AttendanceFilterProps = {
  from?: string;
  to?: string;
  status?: string;
};

export default function AttendanceFilter({
  from,
  to,
  status,
}: AttendanceFilterProps) {
  return (
    <form className="grid gap-3 rounded-3xl border border-brand-100 bg-white/90 p-6 shadow-sm md:grid-cols-4">
      <label className="grid gap-2 text-sm font-medium text-brand-900">
        Dari
        <input
          type="date"
          name="from"
          defaultValue={from}
          className="rounded-2xl border border-brand-100 bg-white px-3 py-2 text-sm"
        />
      </label>
      <label className="grid gap-2 text-sm font-medium text-brand-900">
        Sampai
        <input
          type="date"
          name="to"
          defaultValue={to}
          className="rounded-2xl border border-brand-100 bg-white px-3 py-2 text-sm"
        />
      </label>
      <label className="grid gap-2 text-sm font-medium text-brand-900">
        Status
        <select
          name="status"
          defaultValue={status ?? "all"}
          className="rounded-2xl border border-brand-100 bg-white px-3 py-2 text-sm"
        >
          <option value="all">Semua</option>
          <option value="on_time">Tepat waktu</option>
          <option value="late">Terlambat</option>
        </select>
      </label>
      <button
        type="submit"
        className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(21,184,121,0.35)] transition hover:bg-brand-600"
      >
        Terapkan filter
      </button>
    </form>
  );
}
