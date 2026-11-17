"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/content/site";

type Props = { eyebrow: string; title: string; image: string; heading: string };

/** 서브페이지 상단 배너 + 하위 메뉴 탭 + 페이지 제목 */
export default function SubHero({ eyebrow, title, image, heading }: Props) {
  const pathname = usePathname();
  const section = nav.find((n) => n.children?.some((c) => pathname.startsWith(c.href)) || pathname.startsWith(n.href));
  const tabs = section?.children && section.children.length > 1 ? section.children : null;

  return (
    <>
      <section className="relative flex h-[340px] items-center overflow-hidden bg-navy-950 md:h-[420px]">
        <Image src={image} alt="" fill priority sizes="100vw" className="animate-kenburns object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/70 via-navy-900/50 to-navy-950/80" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pt-16 text-center md:px-8">
          <p className="animate-fade-up text-sm font-bold tracking-[0.3em] text-sky-300">{eyebrow}</p>
          <p
            className="mt-4 animate-fade-up text-2xl font-bold text-white md:text-4xl"
            style={{ "--delay": "150ms" } as React.CSSProperties}
          >
            {title}
          </p>
        </div>
      </section>

      <div className="sticky top-16 z-30 border-b border-slate-200 bg-white md:top-20">
        <div className="mx-auto flex max-w-7xl items-center px-5 md:px-8">
          <Link href="/" aria-label="홈" className="grid size-12 shrink-0 place-items-center border-x border-slate-200 text-slate-500 hover:text-brand-600">
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z" />
            </svg>
          </Link>
          {section && <span className="border-r border-slate-200 px-5 py-3.5 text-sm font-bold whitespace-nowrap text-slate-800">{section.label}</span>}
          {tabs && (
            <nav aria-label={`${section?.label} 하위 메뉴`} className="overflow-x-auto">
              <ul className="flex">
                {tabs.map((t) => (
                  <li key={t.href}>
                    <Link
                      href={t.href}
                      aria-current={pathname === t.href ? "page" : undefined}
                      className={`relative block px-5 py-3.5 text-sm whitespace-nowrap transition ${
                        pathname === t.href ? "font-bold text-brand-600" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {t.label}
                      {pathname === t.href && <span className="absolute inset-x-3 bottom-0 h-0.5 bg-brand-600" />}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 pt-16 pb-4 text-center md:px-8 md:pt-24">
        <h1 className="text-3xl font-black tracking-tight text-navy-900 md:text-4xl">{heading}</h1>
        <span className="mx-auto mt-5 block h-1 w-10 rounded-full bg-gradient-to-r from-sky-400 to-brand-600" />
      </div>
    </>
  );
}
