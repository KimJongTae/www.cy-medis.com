"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { company, nav } from "@/content/site";
import Logo from "./Logo";

const isActive = (pathname: string, href: string) => {
  const base = "/" + href.split("/")[1];
  return pathname === href || pathname.startsWith(base + "/") || pathname === base;
};

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 페이지 이동 시 모바일 메뉴 닫기
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={`group/header fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? "bg-white/95 shadow-sm backdrop-blur-md" : "bg-transparent hover:bg-white/95"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
        <Link href="/" aria-label={`${company.name} 홈`} className="shrink-0">
          <Logo
            variant={solid ? "color" : "white"}
            className={`h-8 w-auto transition md:h-9 ${solid ? "" : "group-hover/header:hidden"}`}
          />
          {!solid && <Logo variant="color" className="hidden h-8 w-auto md:h-9 group-hover/header:block" />}
        </Link>

        <nav aria-label="주요 메뉴" className="hidden lg:block">
          <ul className="flex items-center">
            {nav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href} className="group/item relative">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative block px-5 py-7 text-[15px] font-bold transition-colors ${
                      solid ? "text-slate-800" : "text-white group-hover/header:text-slate-800"
                    } hover:!text-brand-600`}
                  >
                    {item.label}
                    <span
                      className={`absolute inset-x-5 bottom-5 h-0.5 rounded-full bg-sky-400 transition-transform duration-300 ${
                        active ? "scale-x-100" : "scale-x-0 group-hover/item:scale-x-100"
                      }`}
                    />
                  </Link>
                  {item.children && item.children.length > 1 && (
                    <ul className="invisible absolute top-full left-1/2 min-w-40 -translate-x-1/2 translate-y-2 rounded-2xl bg-white p-2 opacity-0 shadow-xl ring-1 ring-slate-100 transition-all duration-200 group-focus-within/item:visible group-focus-within/item:translate-y-0 group-focus-within/item:opacity-100 group-hover/item:visible group-hover/item:translate-y-0 group-hover/item:opacity-100">
                      {item.children.map((c) => (
                        <li key={c.href}>
                          <Link
                            href={c.href}
                            className={`block rounded-xl px-4 py-2.5 text-center text-sm font-medium whitespace-nowrap transition ${
                              pathname === c.href ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50 hover:text-brand-700"
                            }`}
                          >
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <a
          href={`tel:${company.tel}`}
          className="hidden rounded-full bg-brand-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-700 lg:block"
        >
          {company.tel}
        </a>

        <button
          type="button"
          className={`grid size-10 place-items-center rounded-lg lg:hidden ${solid ? "text-navy-900" : "text-white"}`}
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`overflow-y-auto border-t border-slate-100 bg-white transition-[max-height] duration-300 lg:hidden ${
          open ? "max-h-[calc(100svh-4rem)]" : "max-h-0 border-t-0"
        }`}
      >
        <ul className="px-5 py-3">
          {nav.map((item) => {
            const hasSub = item.children && item.children.length > 1;
            const isOpen = expanded === item.href;
            return (
              <li key={item.href} className="border-b border-slate-100 last:border-0">
                {hasSub ? (
                  <>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setExpanded(isOpen ? null : item.href)}
                      className="flex w-full items-center justify-between py-4 text-left text-base font-bold text-slate-800"
                    >
                      {item.label}
                      <svg viewBox="0 0 24 24" className={`size-5 transition ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    <ul className={`grid overflow-hidden transition-all ${isOpen ? "mb-3 grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                      <div className="min-h-0">
                        {item.children!.map((c) => (
                          <li key={c.href}>
                            <Link
                              href={c.href}
                              className={`block rounded-lg px-3 py-2.5 text-[15px] ${pathname === c.href ? "bg-brand-50 font-bold text-brand-700" : "text-slate-600"}`}
                            >
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </div>
                    </ul>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`block py-4 text-base font-bold ${isActive(pathname, item.href) ? "text-brand-600" : "text-slate-800"}`}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
        <div className="px-5 pb-6">
          <a href={`tel:${company.tel}`} className="block rounded-xl bg-brand-600 px-4 py-3.5 text-center font-bold text-white">
            전화 문의 {company.tel}
          </a>
        </div>
      </div>
    </header>
  );
}
