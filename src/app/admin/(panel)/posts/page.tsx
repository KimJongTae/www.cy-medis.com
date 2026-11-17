import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { BOARDS, formatDate, isBoard, listPosts } from "@/lib/posts";

export const metadata = { title: "게시물 관리" };

export default async function AdminPosts({ searchParams }: PageProps<"/admin/posts">) {
  await requireAdmin();
  const sp = await searchParams;
  if (!isBoard(sp.board)) notFound();
  const board = sp.board;
  const page = Number(sp.page) || 1;
  const { items, total, page: current, pages } = await listPosts(board, { page });

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black text-navy-900">
          {BOARDS[board].label} <span className="text-base font-medium text-slate-400">{total}건</span>
        </h1>
        <div className="flex gap-2">
          <Link href={BOARDS[board].path} target="_blank" className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm hover:text-brand-600">
            사이트에서 보기 ↗
          </Link>
          <Link href={`/admin/posts/new?board=${board}`} className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700">
            + 새 글 작성
          </Link>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="w-16 px-4 py-3 text-left font-medium">ID</th>
              <th className="px-4 py-3 text-left font-medium">제목</th>
              <th className="w-20 px-4 py-3 font-medium">첨부</th>
              <th className="w-20 px-4 py-3 font-medium">조회</th>
              <th className="w-32 px-4 py-3 font-medium">작성일</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="py-16 text-center text-slate-400">
                  게시물이 없습니다.
                </td>
              </tr>
            )}
            {items.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-400">{p.id}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/posts/${p.id}?board=${board}`} className="font-medium text-slate-800 hover:text-brand-600">
                    {p.pinned ? <span className="mr-2 rounded bg-brand-600 px-1.5 py-0.5 text-xs text-white">상단고정</span> : null}
                    {p.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-center text-slate-500">{p.file_count || "-"}</td>
                <td className="px-4 py-3 text-center text-slate-500">{p.views}</td>
                <td className="px-4 py-3 text-center text-slate-500">{formatDate(p.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="mt-6 flex justify-center gap-1">
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={`/admin/posts?board=${board}&page=${n}`}
              className={`grid size-9 place-items-center rounded-lg text-sm ${n === current ? "bg-navy-800 font-bold text-white" : "bg-white text-slate-600"}`}
            >
              {n}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
