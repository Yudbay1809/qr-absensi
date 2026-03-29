"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

const navItems = [
  { id: "home", label: "Beranda", href: "#home" },
  { id: "fitur", label: "Fitur", href: "#fitur" },
  { id: "alur", label: "Alur", href: "#alur" },
  { id: "dashboard", label: "Dashboard", href: "#dashboard" },
];

export default function LandingNav() {
  const pathname = usePathname();
  const [activeId, setActiveId] = useState<string>("home");

  const navTargets = useMemo(
    () => navItems.map((item) => item.id),
    []
  );

  useEffect(() => {
    if (pathname !== "/") return;

    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && navTargets.includes(hash)) {
        setActiveId(hash);
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);

    const sections = navTargets
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) {
      return () => {
        window.removeEventListener("hashchange", handleHash);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          setActiveId(visible.target.id);
        }
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: [0.1, 0.25, 0.5],
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      window.removeEventListener("hashchange", handleHash);
      observer.disconnect();
    };
  }, [pathname, navTargets]);

  const handleClick = (id: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    const header = document.getElementById("landing-header");
    const headerOffset = header?.offsetHeight ?? 0;
    const top =
      target.getBoundingClientRect().top + window.scrollY - headerOffset - 16;
    window.history.replaceState(null, "", `#${id}`);
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <nav className="hidden items-center gap-6 text-sm font-medium text-brand-900 md:flex">
      {navItems.map((item) => {
        const isActive = activeId === item.id;
        return (
          <Link
            key={item.id}
            href={item.href}
            onClick={handleClick(item.id)}
            aria-current={isActive ? "page" : undefined}
            className={`relative transition ${
              isActive
                ? "text-brand-950"
                : "text-brand-900/70 hover:text-brand-950"
            }`}
          >
            {item.label}
            <span
              className={`absolute -bottom-2 left-0 h-0.5 w-full rounded-full bg-brand-500 transition ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            />
          </Link>
        );
      })}
    </nav>
  );
}

