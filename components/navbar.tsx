"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const menuItems = [
  { href: "/cloud", label: "Cloud {soon}", disabled: true },
  { href: "/install", label: "Install", disabled: false },
  { href: "/issues", label: "Issues", disabled: false },
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
      <header className="sticky top-0 z-50 flex w-full items-center justify-center bg-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl">
        <div className="relative flex w-full items-center justify-center">
          <nav className="relative z-50 flex h-12 sm:w-5/7 items-center justify-between w-full px-4 sm:px-0">
            <Link
              href="/"
              className="font-pixelify text-xl font-bold text-[#3d3d3d]"
              onClick={() => setIsOpen(false)}
            >
              nap
            </Link>

            <button
              type="button"
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isOpen}
              onClick={() => setIsOpen((open) => !open)}
              className="group relative flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-black/5"
            >
              <span className="relative block h-4 w-5">
                <span
                  className={`absolute left-0 h-0.5 w-5 rounded-full bg-[#3d3d3d] transition-all duration-300 ease-out ${
                    isOpen ? "top-[7px] rotate-45" : "top-[3px]"
                  }`}
                />
                <span
                  className={`absolute left-0 h-0.5 w-5 rounded-full bg-[#3d3d3d] transition-all duration-300 ease-out ${
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
            <div className="flex items-center justify-center bg-white/60 shadow-[0_22px_60px_rgba(0,0,0,0.06)] backdrop-blur-xl">
              <div className="sm:w-5/7 w-full py-6">
                <div className="flex flex-col gap-3">
                  {menuItems.map((item) => (
                    item.disabled ? (
                      <span
                        key={item.href}
                        aria-disabled="true"
                        className="flex cursor-not-allowed items-center justify-between rounded-2xl py-1 text-xl text-[#b4b4b4]"
                      >
                        {item.label}
                      </span>
                    ) : (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="group flex items-center justify-between rounded-2xl px-3 py-2 transition hover:bg-black/4"
                      >
                        <span className="text-xl text-[#4f4f4f] transition group-hover:text-[#111111]">
                          {item.label}
                        </span>
                      </Link>
                    )
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
        className={`fixed inset-0 z-40 bg-white/35 backdrop-blur-sm transition duration-300 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
    </>
  );
}
