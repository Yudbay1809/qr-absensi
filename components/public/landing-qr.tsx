"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import Image from "next/image";

export default function LandingQR() {
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Memuat QR...");
  const [mode, setMode] = useState<"rolling" | "locked" | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    const load = async () => {
      const res = await fetch("/api/qr/active");
      if (!res.ok) {
        setStatus("Gagal memuat QR.");
        return;
      }

      const data = await res.json();
      if (!data.session) {
        setQrImage(null);
        setMode(null);
        setStatus("QR belum tersedia.");
        return;
      }

      const dataUrl = await QRCode.toDataURL(data.session.url, {
        width: 240,
        margin: 1,
        color: { dark: "#0f7a54", light: "#ffffff" },
      });
      setQrImage(dataUrl);
      setExpiresAt(data.session.expiresAt);
      setMode(data.session.mode);
      setStatus(
        data.session.mode === "locked"
          ? "QR locked (setelah terlambat)."
          : "QR aktif untuk absensi."
      );
    };

    load();
    interval = setInterval(() => {
      load().catch(() => undefined);
    }, 10000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  return (
    <div className="rounded-3xl border border-brand-200/70 bg-white/90 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brand-600">
            QR Absen
          </p>
          <p className="font-heading text-xl font-semibold text-brand-950">
            Scan untuk hadir
          </p>
        </div>
        {mode === "locked" ? (
          <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
            Locked
          </span>
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
            -
          </span>
        )}
      </div>
      <div className="mt-4 flex items-center justify-center rounded-3xl border border-dashed border-brand-200 bg-brand-50 p-6">
        {qrImage ? (
          <Image
            src={qrImage}
            alt="QR Absensi"
            width={240}
            height={240}
            unoptimized
            className="rounded-2xl bg-white p-4"
          />
        ) : (
          <div className="text-sm text-brand-700">{status}</div>
        )}
      </div>
      <p className="mt-3 text-xs text-brand-700">
        {mode === "locked" && expiresAt
          ? `Terkunci sejak ${new Date(expiresAt).toLocaleTimeString("id-ID")}`
          : status}
      </p>
      {mode === "locked" && (
        <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          QR LOCKED — setelah jam masuk, QR tidak berubah.
        </div>
      )}
    </div>
  );
}

