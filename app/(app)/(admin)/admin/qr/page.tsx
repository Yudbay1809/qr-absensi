"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Badge } from "@/components/(shared)/ui/badge";
import { Button } from "@/components/(shared)/ui/button";
import AdminPageHeader from "@/components/admin/admin-page-header";
import Image from "next/image";

type QRResponse = {
  session: {
    id: number;
    token: string;
    url: string;
    expiresAt: string;
    mode: "rolling" | "locked";
  } | null;
};

type AttendanceItem = {
  id: number;
  scannedAt: string;
  status: string;
  user: { name: string; email: string };
};

export default function AdminQRPage() {
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attendance, setAttendance] = useState<AttendanceItem[]>([]);
  const [mode, setMode] = useState<"rolling" | "locked" | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);

  const loadActiveQR = useCallback(async () => {
    setError(null);
    setLoading(true);

    const res = await fetch("/api/qr/active");

    setLoading(false);

    if (!res.ok) {
      setError("Gagal memuat QR aktif.");
      return;
    }

    const data = (await res.json()) as QRResponse;
    if (!data.session) {
      setQrImage(null);
      setQrUrl(null);
      setExpiresAt(null);
      setSessionId(null);
      return;
    }

    const dataUrl = await QRCode.toDataURL(data.session.url, {
      width: 280,
      margin: 1,
      color: {
        dark: "#0f7a54",
        light: "#ffffff",
      },
    });

    setQrImage(dataUrl);
    setQrUrl(data.session.url);
    setExpiresAt(data.session.expiresAt);
    setSessionId(data.session.id);
    setMode(data.session.mode);
    setAttendance([]);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadActiveQR();
  }, [loadActiveQR]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      loadActiveQR();
    }, 60000);
    return () => clearInterval(interval);
  }, [autoRefresh, loadActiveQR]);

  useEffect(() => {
    if (!sessionId) return;

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const es = new EventSource(`/api/admin/qr-sessions/${sessionId}/stream`);
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as { items: AttendanceItem[] };
        if (!data?.items?.length) return;
        setAttendance((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const merged = [...prev];
          for (const item of data.items) {
            if (!existingIds.has(item.id)) {
              merged.unshift(item);
            }
          }
          return merged;
        });
      } catch {
        // ignore parse errors
      }
    };

    es.onerror = () => {
      es.close();
    };

    return () => {
      es.close();
    };
  }, [sessionId]);

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        eyebrow="Admin Panel"
        title="Generate QR Absensi"
        actions={
          <Button onClick={loadActiveQR} aria-label="Ambil QR Aktif">
            {loading ? "Memproses..." : "Ambil QR Aktif"}
          </Button>
        }
      />

      {mode === "locked" && (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-4 text-base font-semibold text-rose-700">
          QR LOCKED — setelah jam masuk, QR tidak berubah.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-3xl border border-brand-100 bg-white/90 p-8 shadow-[0_20px_50px_rgba(10,77,56,0.12)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-brand-600">
                QR Aktif
              </p>
              <p className="font-heading text-xl font-semibold text-brand-950">
                Session Hari Ini
              </p>
            </div>
            <Badge>
              {mode === "locked" ? "Locked" : autoRefresh ? "Auto" : "Manual"}
            </Badge>
          </div>
          <div className="mt-6 flex items-center justify-center rounded-3xl border border-dashed border-brand-200 bg-brand-50 p-8">
            {qrImage ? (
              <Image
                src={qrImage}
                alt="QR Absensi"
                width={288}
                height={288}
                unoptimized
                className="h-72 w-72 rounded-2xl bg-white p-4"
              />
            ) : (
              <div className="text-sm text-brand-700">QR belum tersedia.</div>
            )}
          </div>
          {qrUrl && (
            <div className="mt-4 rounded-2xl border border-brand-100 bg-white px-4 py-3 text-xs text-brand-700">
              {qrUrl}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-brand-100 bg-white/90 p-8 shadow-[0_20px_50px_rgba(10,77,56,0.12)]">
          <h2 className="font-heading text-xl font-semibold text-brand-950">
            Kontrol Sesi
          </h2>
          <p className="mt-2 text-sm text-brand-900/70">
            QR akan otomatis diperbarui setiap 10 menit selama sebelum terlambat.
          </p>
          <div className="mt-6 grid gap-4">
            <label className="flex items-center justify-between rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-900">
              Auto refresh
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={() => setAutoRefresh((prev) => !prev)}
                className="h-5 w-5 accent-brand-500"
              />
            </label>
            <div className="rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm text-brand-900">
              <p className="text-xs uppercase tracking-[0.2em] text-brand-600">
                Kedaluwarsa
              </p>
              <p className="font-semibold">
                {expiresAt
                  ? new Date(expiresAt).toLocaleTimeString("id-ID")
                  : "-"}
              </p>
            </div>
            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}
            <div className="rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-xs text-brand-700">
              Setelah lewat jam masuk, QR akan tetap statis.
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-brand-100 bg-white/90 p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand-600">
              Log QR Session
            </p>
            <h2 className="font-heading text-xl font-semibold text-brand-950">
              Absensi realtime
            </h2>
          </div>
          <span className="text-sm text-brand-700">
            {attendance.length} hadir
          </span>
        </div>
        <div className="mt-4 grid gap-3">
          {attendance.length === 0 && (
            <div className="rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-700">
              Belum ada karyawan yang scan.
            </div>
          )}
          {attendance.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm text-brand-900"
            >
              <div>
                <p className="font-semibold text-brand-950">{item.user.name}</p>
                <p className="text-xs text-brand-700">{item.user.email}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-brand-900">
                  {new Date(item.scannedAt).toLocaleTimeString("id-ID")}
                </p>
                <p className="text-xs text-brand-700">{item.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

