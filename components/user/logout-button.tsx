"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const onLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <button
      type="button"
      onClick={onLogout}
      aria-label="Keluar dari akun"
      className="rounded-full border border-brand-200 bg-white/80 px-4 py-2 text-sm font-semibold text-brand-700 transition hover:border-brand-300 hover:bg-white"
    >
      Keluar
    </button>
  );
}
