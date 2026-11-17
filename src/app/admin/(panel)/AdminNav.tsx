"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function AdminNav({ newInquiries }: { newInquiries: number }) {
  const pathname = usePathname();
  const board = useSearchParams().get("board");
  const items = [
    { href: "/admin", label: "대시보드", active: pathname === "/admin" },
    { href: "/admin/posts?board=notice", label: "공지사항", active: pathname.startsWith("/admin/posts") && board === "notice" },
    { href: "/admin/posts?board=resources", label: "자료실", active: pathname.startsWith("/admin/posts") && board === "resources" },
    { href: "/admin/inquiries", label: "온라인문의", active: pathname.startsWith("/admin/inquiries"), badge: newInquiries },
  ];
  return (
    <nav className="overflow-x-auto px-3 pb-3">
      <ul className="flex gap-1 lg:flex-col">
        {items.map((it) => (
          <li key={it.href}>
            <Link
              href={it.href}
              className={`flex items-center justify-between gap-3 rounded-lg px-4 py-2.5 text-sm font-medium whitespace-nowrap ${
                it.active ? "bg-brand-600 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {it.label}
              {!!it.badge && <span className="rounded-full bg-sky-400 px-2 py-0.5 text-xs font-bold text-navy-950">{it.badge}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
