type AttendanceUser = {
  name: string;
  email: string;
};

type AttendanceItem = {
  id: number;
  scannedAt: Date;
  type?: string | null;
  status: string;
  overtimeMinutes?: number | null;
  ip?: string | null;
  userAgent?: string | null;
  user?: AttendanceUser | null;
};

type AttendanceListProps = {
  items: AttendanceItem[];
  emptyText: string;
  showUser?: boolean;
  showAudit?: boolean;
};

export default function AttendanceList({
  items,
  emptyText,
  showUser = false,
  showAudit = false,
}: AttendanceListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-700">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div
          key={item.id}
          className={`rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm text-brand-900 ${
            showUser || showAudit
              ? "grid gap-2 md:grid-cols-[1.2fr_1fr_0.8fr]"
              : "flex flex-wrap items-center justify-between gap-2"
          }`}
        >
          {showUser ? (
            <div>
              <p className="font-semibold text-brand-950">{item.user?.name}</p>
              <p className="text-xs text-brand-700">{item.user?.email}</p>
            </div>
          ) : (
            <div>
              <p className="font-medium text-brand-900">
                {item.scannedAt.toLocaleString("id-ID")}
              </p>
              <p className="text-xs text-brand-700">
                {item.type === "check_out"
                  ? "Absen pulang"
                  : "Absen masuk"}{" "}
                - {item.status}
              </p>
            </div>
          )}

          {showUser && (
            <div>
              <p className="font-medium text-brand-900">
                {item.scannedAt.toLocaleString("id-ID")}
              </p>
              <p className="text-xs text-brand-700">
                {item.type === "check_out"
                  ? "Absen pulang"
                  : "Absen masuk"}{" "}
                - {item.status}
                {item.overtimeMinutes
                  ? ` - Lembur ${item.overtimeMinutes} menit`
                  : ""}
              </p>
            </div>
          )}

          {showAudit ? (
            <div>
              <p className="text-xs text-brand-700">IP: {item.ip ?? "-"}</p>
              <p className="truncate text-xs text-brand-700">
                UA: {item.userAgent ?? "-"}
              </p>
            </div>
          ) : !showUser ? (
            <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
              {item.type === "check_out"
                ? "Pulang"
                : item.status === "late"
                ? "Terlambat"
                : "Tepat waktu"}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}
