"use client";

import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";

function extractToken(text: string) {
  try {
    const url = new URL(text);
    const token = url.searchParams.get("token");
    if (token) return token;
  } catch {
    // not a URL
  }
  return text;
}

export default function ScanPage() {
  const [status, setStatus] = useState("Siapkan kamera Anda.");
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => undefined);
      }
    };
  }, []);

  const startScan = async () => {
    setError(null);
    setStatus("Menyiapkan kamera...");

    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: 240,
      },
      false
    );

    scannerRef.current = scanner;

    scanner.render(
      async (decodedText) => {
        const token = extractToken(decodedText);
        setStatus("Memvalidasi QR...");
        setError(null);

        const res = await fetch("/api/attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          setError(data?.error ?? "Gagal menyimpan absensi.");
          setStatus("Coba scan ulang.");
          return;
        }

        setStatus("Absensi berhasil disimpan.");
        setIsScanning(false);
        scanner.clear().catch(() => undefined);
      },
      () => {
        // ignore scan errors to avoid noisy UI
      }
    );

    setIsReady(true);
    setIsScanning(true);
    setStatus("Kamera aktif. Arahkan ke QR.");

    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
    } catch {
      setError(
        "Akses kamera ditolak. Aktifkan izin kamera di browser lalu coba lagi."
      );
      setStatus("Izin kamera dibutuhkan untuk scan.");
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#e9fff7,transparent_55%),linear-gradient(180deg,#f6fffd_0%,#e6fdf4_35%,#f9fffd_100%)] px-6 py-12">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-brand-600">
          Karyawan
        </p>
        <h1 className="font-heading text-3xl font-semibold text-brand-950">
          Scan QR Absensi
        </h1>
        <p className="mt-2 text-sm text-brand-900/70">
          Scan QR yang ditampilkan oleh admin.
        </p>
      </header>

        <div className="rounded-3xl border border-brand-100 bg-white/90 p-6 shadow-[0_20px_50px_rgba(10,77,56,0.12)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-brand-900">
              {isScanning ? "Kamera aktif" : "Kamera belum aktif"}
            </p>
            <button
              type="button"
              onClick={startScan}
              disabled={isScanning}
              className="inline-flex items-center justify-center rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(21,184,121,0.35)] transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isReady ? "Scan Ulang" : "Mulai Scan"}
            </button>
          </div>
          <div id="reader" className="rounded-2xl" />
          <div
            className="mt-4 rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-900"
            aria-live="polite"
          >
            {status}
          </div>
          {error && (
            <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

