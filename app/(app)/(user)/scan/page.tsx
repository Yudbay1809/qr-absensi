"use client";

import { Html5Qrcode } from "html5-qrcode";
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
  const [debug, setDebug] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    scannerRef.current = new Html5Qrcode("reader");
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => undefined);
        scannerRef.current.clear();
      }
    };
  }, []);

  const startScan = async () => {
    setError(null);
    setDebug(null);
    setStatus("Menyiapkan kamera...");

    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode("reader");
    }

    const scanner = scannerRef.current;

    try {
      await scanner.stop();
    } catch {
      // ignore if not running
    }

    const config = {
      fps: 10,
      qrbox: { width: 280, height: 280 },
      aspectRatio: 1.0,
      disableFlip: false,
      experimentalFeatures: { useBarCodeDetectorIfSupported: true },
    };

    const onSuccess = async (decodedText: string) => {
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;
      const token = extractToken(decodedText);
      setStatus("Memvalidasi QR...");
      setError(null);
      setIsScanning(false);

      await scanner.stop().catch(() => undefined);
      scanner.clear();

      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Gagal menyimpan absensi.");
        setStatus("Coba scan ulang.");
        isProcessingRef.current = false;
        return;
      }

      setStatus("Absensi berhasil disimpan.");
    };

    const onFailure = () => {
      // ignore scan errors to avoid noisy UI
    };

    setIsReady(true);
    setIsScanning(true);
    isProcessingRef.current = false;

    const startCamera = async (constraints: MediaTrackConstraints) => {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("getUserMedia tidak didukung");
      }
      // Preflight permission for iOS Safari
      const preflight = await navigator.mediaDevices.getUserMedia({
        video: {
          ...constraints,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      preflight.getTracks().forEach((track) => track.stop());

      const cameras = await Html5Qrcode.getCameras().catch(() => []);
      if (Array.isArray(cameras) && cameras.length > 0) {
        const backCamera =
          cameras.find((cam) =>
            /back|rear|environment/gi.test(cam.label)
          ) ?? cameras[0];
        await scanner.start(backCamera.id, config, onSuccess, onFailure);
        return;
      }

      await scanner.start(constraints, config, onSuccess, onFailure);
    };

    try {
      await startCamera({ facingMode: { ideal: "environment" } });
      setStatus("Kamera aktif. Arahkan ke QR.");
    } catch {
      try {
        await startCamera({ facingMode: "user" });
        setStatus("Kamera aktif. Arahkan ke QR.");
      } catch {
        setError(
          "Akses kamera ditolak atau perangkat tidak mendukung kamera. Buka Settings > Safari > Camera > Allow, lalu muat ulang halaman."
        );
        setDebug(
          "Jika tetap gagal: gunakan Safari, pastikan HTTPS, dan nonaktifkan Private Mode."
        );
        setStatus("Izin kamera dibutuhkan untuk scan.");
        setIsScanning(false);
      }
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
              className="inline-flex items-center justify-center rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(21,184,121,0.35)] transition hover:bg-brand-600"
            >
              {isReady ? "Scan Ulang" : "Mulai Scan"}
            </button>
          </div>
          <div
            id="reader"
            className="min-h-[240px] overflow-hidden rounded-2xl bg-white"
          />
          <div
            className="mt-4 rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-900"
            aria-live="polite"
          >
            {status}
          </div>
          {error && (
            <div
              className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
              role="alert"
            >
              {error}
            </div>
          )}
          {debug && (
            <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
              {debug}
            </div>
          )}
          <p className="mt-3 text-xs text-brand-900/60">
            Pastikan memakai Safari dan koneksi HTTPS. Jika izin kamera tidak
            muncul, matikan mode private lalu coba lagi.
          </p>
        </div>
      </div>
    </div>
  );
}

