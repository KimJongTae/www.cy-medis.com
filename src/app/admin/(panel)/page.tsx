import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import StatusBadge from "@/components/admin/StatusBadge";
import { countByStatus, listInquiries } from "@/lib/inquiries";
import { formatDate, listPosts } from "@/lib/posts";

export const metadata = { title: "대시보드" };

export default async function Dashboard() {
  await requireAdmin();
  const [notice, resources, counts, inquiries] = await Promise.all([
    listPosts("notice"),
    listPosts("resources"),
    countByStatus(),
    listInquiries(),
  ]);
  const stats = [
    { label: "신규 문의", value: counts.new ?? 0, href: "/admin/inquiries?status=new", highlight: true },
    { label: "전체 문의", value: inquiries.length, href: "/admin/inquiries" },
    { label: "공지사항", value: notice.total, href: "/admin/posts?board=notice" },
    { label: "자료실", value: resources.total, href: "/admin/posts?board=resources" },
  ];
  return (
    <>
      <h1 className="text-2xl font-black text-navy-900">대시보드</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className={`rounded-2xl p-6 shadow-sm ${s.highlight ? "bg-brand-600 text-white" : "bg-white"}`}>
            <p className={`text-sm ${s.highlight ? "text-white/80" : "text-slate-500"}`}>{s.label}</p>
            <p className="mt-2 text-3xl font-black">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-navy-900">최근 온라인문의</h2>
          <Link href="/admin/inquiries" className="text-sm text-brand-600 hover:underline">
            전체 보기
          </Link>
        </div>
        <ul className="mt-4 divide-y divide-slate-100">
          {inquiries.length === 0 && <li className="py-8 text-center text-slate-400">접수된 문의가 없습니다.</li>}
          {inquiries.slice(0, 5).map((q) => (
            <li key={q.id}>
              <Link href={`/admin/inquiries/${q.id}`} className="flex items-center gap-3 py-3 hover:text-brand-600">
                <StatusBadge status={q.status} />
                <span className="flex-1 truncate">{q.subject}</span>
                <span className="text-sm text-slate-400">{q.name}</span>
                <span className="hidden text-sm text-slate-400 sm:inline">{formatDate(q.created_at)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin/posts/new?board=notice" className="rounded-xl bg-navy-800 px-5 py-3 text-sm font-bold text-white hover:bg-brand-600">
          + 공지사항 작성
        </Link>
        <Link href="/admin/posts/new?board=resources" className="rounded-xl bg-navy-800 px-5 py-3 text-sm font-bold text-white hover:bg-brand-600">
          + 자료 등록
        </Link>
      </div>
    </>
  );
}

