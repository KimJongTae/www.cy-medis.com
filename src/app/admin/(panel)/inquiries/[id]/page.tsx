import Link from "next/link";
import { notFound } from "next/navigation";
import { removeInquiry, saveInquiry } from "@/app/actions/admin";
import ConfirmButton from "@/components/admin/ConfirmButton";
import StatusBadge from "@/components/admin/StatusBadge";
import { requireAdmin } from "@/lib/auth";
import { getInquiry, markRead, STATUS_LABEL } from "@/lib/inquiries";
import { formatDate } from "@/lib/posts";

export const metadata = { title: "문의 상세" };

export default async function InquiryDetail({ params }: PageProps<"/admin/inquiries/[id]">) {
  await requireAdmin();
  const id = Number((await params).id);
  const q = await getInquiry(id);
  if (!q) notFound();
  if (q.status === "new") markRead(id);

  const reply = `mailto:${q.email}?subject=${encodeURIComponent(`[청연메디칼] Re: ${q.subject}`)}`;

  return (
    <>
      <Link href="/admin/inquiries" className="text-sm text-slate-500 hover:text-brand-600">
        ← 문의 목록
      </Link>
      <div className="mt-4 grid gap-6 xl:grid-cols-[1fr_340px]">
        <article className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center gap-3">
            <StatusBadge status={q.status} />
            <span className="text-sm text-slate-400">#{q.id} · {formatDate(q.created_at, true)}</span>
          </div>
          <h1 className="mt-3 text-2xl font-black text-navy-900">{q.subject}</h1>
          <dl className="mt-6 grid gap-x-6 gap-y-2 rounded-xl bg-slate-50 p-5 text-sm sm:grid-cols-[80px_1fr]">
            <dt className="text-slate-500">이름</dt>
            <dd className="font-medium">{q.name}</dd>
            <dt className="text-slate-500">이메일</dt>
            <dd>
              <a href={`mailto:${q.email}`} className="font-medium text-brand-600 hover:underline">{q.email}</a>
            </dd>
            <dt className="text-slate-500">연락처</dt>
            <dd>{q.phone ? <a href={`tel:${q.phone}`} className="font-medium text-brand-600 hover:underline">{q.phone}</a> : "-"}</dd>
          </dl>
          <div className="mt-6 leading-relaxed whitespace-pre-wrap text-slate-700">{q.content}</div>
          <a href={reply} className="mt-8 inline-block rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white hover:bg-brand-700">
            이메일로 답변하기
          </a>
        </article>

        <aside className="space-y-4">
          <form action={saveInquiry} className="rounded-2xl bg-white p-6 shadow-sm">
            <input type="hidden" name="id" value={q.id} />
            <label htmlFor="status" className="mb-2 block text-sm font-bold text-slate-700">처리 상태</label>
            <select id="status" name="status" defaultValue={q.status === "new" ? "read" : q.status} className="field">
              {(["new", "read", "done"] as const).map((s) => (
                <option key={s} value={s}>{STATUS_LABEL[s]}</option>
              ))}
            </select>
            <label htmlFor="memo" className="mt-4 mb-2 block text-sm font-bold text-slate-700">관리자 메모</label>
            <textarea id="memo" name="memo" rows={5} defaultValue={q.memo} placeholder="처리 내용, 담당자 등 (고객에게 보이지 않음)" className="field text-sm" />
            <button className="mt-4 w-full rounded-xl bg-navy-800 py-3 text-sm font-bold text-white hover:bg-brand-600">저장</button>
          </form>
          <form action={removeInquiry} className="text-right">
            <input type="hidden" name="id" value={q.id} />
            <ConfirmButton message="이 문의를 삭제할까요? 되돌릴 수 없습니다.">문의 삭제</ConfirmButton>
          </form>
        </aside>
      </div>
    </>
  );
}
