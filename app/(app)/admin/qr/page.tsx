"use client";

import { useCallback, useEffect, useState } from "react";
import QRCode from "qrcode";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type QRResponse = {
  token: string;
  url: string;
  expiresAt: string;
};

export default function AdminQRPage() {
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generateQR = useCallback(async () => {
    setError(null);
    setLoading(true);

    const res = await fetch("/api/generate-qr", {
      method: "POST",
    });

    setLoading(false);

    if (!res.ok) {
      setError("Gagal membuat QR. Coba lagi.");
      return;
    }

    const data = (await res.json()) as QRResponse;
    const dataUrl = await QRCode.toDataURL(data.url, {
      width: 280,
      margin: 1,
      color: {
        dark: "#0f7a54",
        light: "#ffffff",
      },
    });

    setQrImage(dataUrl);
    setQrUrl(data.url);
    setExpiresAt(data.expiresAt);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    generateQR();
  }, [generateQR]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      generateQR();
    }, 60000);
    return () => clearInterval(interval);
  }, [autoRefresh, generateQR]);

  return (
    <div className="flex flex-col gap-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand-600">
              Admin Panel
            </p>
            <h1 className="font-heading text-3xl font-semibold text-brand-950">
              Generate QR Absensi
            </h1>
          </div>
          <Button onClick={generateQR} aria-label="Generate QR Absensi">
            {loading ? "Memproses..." : "Generate QR"}
          </Button>
        </header>

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
              <Badge>{autoRefresh ? "Auto Refresh" : "Manual"}</Badge>
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
              QR akan otomatis diperbarui setiap 60 detik agar lebih aman.
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
                Tips: tampilkan QR di layar besar agar scan lebih cepat.
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
