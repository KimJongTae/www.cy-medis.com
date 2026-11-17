import Link from "next/link";
import StatusBadge from "@/components/admin/StatusBadge";
import { requireAdmin } from "@/lib/auth";
import { countByStatus, listInquiries, STATUS_LABEL, type InquiryStatus } from "@/lib/inquiries";
import { formatDate } from "@/lib/posts";

export const metadata = { title: "온라인문의" };

export default async function AdminInquiries({ searchParams }: PageProps<"/admin/inquiries">) {
  await requireAdmin();
  const { status: s } = await searchParams;
  const status = (["new", "read", "done"] as const).find((x) => x === s) as InquiryStatus | undefined;
  const [items, counts] = await Promise.all([listInquiries(status), countByStatus()]);
  const all = Object.values(counts).reduce((a, b) => a + (b ?? 0), 0);
  const tabs = [
    { key: undefined, label: "전체", n: all },
    ...(["new", "read", "done"] as const).map((k) => ({ key: k, label: STATUS_LABEL[k], n: counts[k] ?? 0 })),
  ];

  return (
    <>
      <h1 className="text-2xl font-black text-navy-900">온라인문의</h1>
      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Link
            key={t.label}
            href={t.key ? `/admin/inquiries?status=${t.key}` : "/admin/inquiries"}
            className={`rounded-full px-4 py-2 text-sm font-bold ${status === t.key ? "bg-navy-800 text-white" : "bg-white text-slate-600 shadow-sm"}`}
          >
            {t.label} {t.n}
          </Link>
        ))}
      </div>
      <div className="mt-4 overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="w-24 px-4 py-3 font-medium">상태</th>
              <th className="px-4 py-3 text-left font-medium">제목</th>
              <th className="w-28 px-4 py-3 font-medium">이름</th>
              <th className="w-40 px-4 py-3 font-medium">접수일시</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="py-16 text-center text-slate-400">
                  문의가 없습니다.
                </td>
              </tr>
            )}
            {items.map((q) => (
              <tr key={q.id} className={`hover:bg-slate-50 ${q.status === "new" ? "font-bold" : ""}`}>
                <td className="px-4 py-3 text-center">
                  <StatusBadge status={q.status} />
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/inquiries/${q.id}`} className="text-slate-800 hover:text-brand-600">
                    {q.subject}
                  </Link>
                </td>
                <td className="px-4 py-3 text-center text-slate-600">{q.name}</td>
                <td className="px-4 py-3 text-center text-slate-500">{formatDate(q.created_at, true)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
