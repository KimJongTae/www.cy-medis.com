import Link from "next/link";
import Icon from "@/components/Icon";
import { BOARDS, PAGE_SIZE, formatDate, listPosts, type Board } from "@/lib/posts";

export default async function BoardList({ board, page, q }: { board: Board; page: number; q: string }) {
  const { items, total, page: current, pages } = await listPosts(board, { page, q });
  const base = BOARDS[board].path;
  const href = (p: number) => `${base}?${new URLSearchParams({ ...(q ? { q } : {}), ...(p > 1 ? { page: String(p) } : {}) })}`;
  const start = Math.max(1, current - 2);
  const nums = Array.from({ length: Math.min(5, pages - start + 1) }, (_, i) => start + i);

  return (
    <section className="mx-auto max-w-5xl px-5 py-16 md:px-8 md:py-20">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <p className="text-sm text-slate-500">
          전체 <strong className="text-brand-600">{total}</strong>건 · {current}/{pages} 페이지
        </p>
        <form role="search" action={base} className="flex gap-2">
          <label htmlFor="q" className="sr-only">
            검색어
          </label>
          <input id="q" name="q" defaultValue={q} placeholder="제목·내용 검색" className="field w-56 !py-2.5" />
          <button className="rounded-xl bg-navy-800 px-5 text-sm font-bold text-white hover:bg-brand-600">검색</button>
        </form>
      </div>

      <table className="mt-5 w-full border-t-2 border-navy-800 text-[15px]">
        <caption className="sr-only">{BOARDS[board].label} 목록</caption>
        <thead className="hidden border-b border-slate-200 bg-slate-50 text-sm text-slate-500 md:table-header-group">
          <tr>
            <th scope="col" className="w-20 py-3.5 font-medium">번호</th>
            <th scope="col" className="py-3.5 font-medium">제목</th>
            <th scope="col" className="w-28 py-3.5 font-medium">작성자</th>
            <th scope="col" className="w-20 py-3.5 font-medium">조회</th>
            <th scope="col" className="w-32 py-3.5 font-medium">날짜</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr>
              <td colSpan={5} className="border-b border-slate-200 py-20 text-center text-slate-400">
                {q ? `"${q}"에 대한 검색 결과가 없습니다.` : "게시물이 없습니다."}
              </td>
            </tr>
          )}
          {items.map((p, i) => (
            <tr key={p.id} className="block border-b border-slate-200 py-4 transition hover:bg-slate-50 md:table-row md:py-0">
              <td className="hidden py-4 text-center text-slate-400 md:table-cell">
                {p.pinned ? <span className="rounded-full bg-brand-600 px-2.5 py-1 text-xs font-bold text-white">공지</span> : total - (current - 1) * PAGE_SIZE - i}
              </td>
              <td className="block md:table-cell md:px-4 md:py-4">
                <Link href={`${base}/${p.id}`} className="flex items-center gap-2 font-medium text-slate-800 hover:text-brand-600">
                  {p.pinned ? <span className="rounded-full bg-brand-600 px-2 py-0.5 text-xs font-bold text-white md:hidden">공지</span> : null}
                  <span className="line-clamp-1">{p.title}</span>
                  {p.file_count > 0 && <Icon name="clip" className="size-4 shrink-0 text-slate-400" />}
                </Link>
              </td>
              <td className="inline md:table-cell md:py-4 md:text-center">
                <span className="text-sm text-slate-500">{p.author}</span>
              </td>
              <td className="inline md:table-cell md:py-4 md:text-center">
                <span className="ml-3 text-sm text-slate-400 md:ml-0">조회 {p.views}</span>
              </td>
              <td className="inline md:table-cell md:py-4 md:text-center">
                <span className="ml-3 text-sm text-slate-400 md:ml-0">{formatDate(p.created_at)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {pages > 1 && (
        <nav aria-label="페이지" className="mt-10 flex justify-center gap-1.5">
          {current > 1 && <PageLink href={href(current - 1)} label="이전">‹</PageLink>}
          {nums.map((n) => (
            <PageLink key={n} href={href(n)} active={n === current} label={`${n} 페이지`}>
              {n}
            </PageLink>
          ))}
          {current < pages && <PageLink href={href(current + 1)} label="다음">›</PageLink>}
        </nav>
      )}
    </section>
  );
}

function PageLink({ href, active, label, children }: { href: string; active?: boolean; label: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={`grid size-10 place-items-center rounded-lg text-sm font-bold transition ${
        active ? "bg-navy-800 text-white" : "text-slate-500 hover:bg-slate-100"
      }`}
    >
      {children}
    </Link>
  );
}
