"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const menuItems = [
  { href: "/", label: "Overview" },
  { href: "/install", label: "Install" },
  { href: "/issues", label: "Issues" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 flex w-full items-center justify-center bg-black/60 backdrop-blur-xl">
        <div className="relative flex w-full items-center justify-center">
          <nav className="relative z-50 flex h-12 w-5/7 items-center justify-between">
            <Link
              href="/"
              className="font-pixelify text-xl font-bold tracking-[0.24em] text-[#555555]"
              onClick={() => setIsOpen(false)}
            >
              napster
            </Link>

            <button
              type="button"
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isOpen}
              onClick={() => setIsOpen((open) => !open)}
              className="group relative flex h-11 w-11 items-center justify-center rounded-full transition hover:border-white/20 hover:bg-white/10"
            >
              <span className="relative block h-4 w-5">
                <span
                  className={`absolute left-0 h-0.5 w-5 rounded-full bg-[#555555] transition-all duration-300 ease-out ${
                    isOpen ? "top-[7px] rotate-45" : "top-[3px]"
                  }`}
                />
                <span
                  className={`absolute left-0 h-0.5 w-5 rounded-full bg-[#555555] transition-all duration-300 ease-out ${
                    isOpen ? "top-[7px] -rotate-45" : "top-[11px]"
                  }`}
                />
              </span>
            </button>
          </nav>

          <div
            className={`absolute inset-x-0 top-full z-50 origin-top transition-all duration-300 ease-out ${
              isOpen
                ? "pointer-events-auto translate-y-0 scale-y-100 opacity-100"
                : "pointer-events-none -translate-y-3 scale-y-95 opacity-0"
            }`}
          >
            <div className="flex items-center justify-center bg-black/80 shadow-[0_18px_80px_rgba(0,0,0,0.55)] backdrop-blur-3xl">
              <div className="w-5/7 px-6 py-6">
                <div className="flex flex-col gap-3">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="group flex items-center justify-between rounded-2xl py-1 transition"
                    >
                      <span className="text-xl text-[#787878] transition group-hover:text-white">
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <button
        type="button"
        aria-label="Close navigation overlay"
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition duration-300 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
    </>
  );
}
