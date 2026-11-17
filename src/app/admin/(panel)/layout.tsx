import Link from "next/link";
import { Suspense } from "react";
import { logout } from "@/app/actions/admin";
import Logo from "@/components/Logo";
import { requireAdmin } from "@/lib/auth";
import { countByStatus } from "@/lib/inquiries";
import AdminNav from "./AdminNav";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const counts = await countByStatus();
  return (
    <div className="lg:grid lg:min-h-screen lg:grid-cols-[240px_1fr]">
      <aside className="bg-navy-950 text-white lg:sticky lg:top-0 lg:h-screen">
        <div className="flex items-center justify-between px-5 py-5 lg:block">
          <Link href="/admin">
            <Logo variant="white" className="h-8 w-auto" />
          </Link>
          <p className="hidden text-xs text-white/40 lg:mt-2 lg:block">홈페이지 관리</p>
        </div>
        <Suspense>
          <AdminNav newInquiries={counts.new ?? 0} />
        </Suspense>
        <div className="flex gap-2 px-5 pb-5 lg:absolute lg:inset-x-0 lg:bottom-0 lg:flex-col">
          <Link href="/" target="_blank" className="flex-1 rounded-lg bg-white/10 px-3 py-2 text-center text-sm hover:bg-white/20">
            홈페이지 보기 ↗
          </Link>
          <form action={logout} className="flex-1">
            <button className="w-full rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/10 hover:text-white">로그아웃</button>
          </form>
        </div>
      </aside>
      <div className="min-w-0 p-5 md:p-10">{children}</div>
    </div>
  );
}
