import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import { BOARDS, formatDate, formatSize, getPost, type Board } from "@/lib/posts";

/** 본문의 URL 을 링크로 변환 (그 외 텍스트는 그대로, HTML 은 해석하지 않음) */
function Linkified({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s<]+)/g);
  return parts.map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer nofollow" className="break-all text-brand-600 underline">
        {part}
      </a>
    ) : (
      part
    ),
  );
}

export default async function BoardView({ board, id }: { board: Board; id: number }) {
  const data = await getPost(board, id, { countView: true });
  if (!data) notFound();
  const { post, files, prev, next } = data;
  const base = BOARDS[board].path;

  return (
    <article className="mx-auto max-w-5xl px-5 py-16 md:px-8 md:py-20">
      <header className="border-t-2 border-navy-800 border-b border-b-slate-200 px-2 py-6">
        <h2 className="text-xl font-bold text-navy-900 md:text-2xl">{post.title}</h2>
        <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500">
          <span>작성자 {post.author}</span>
          <span>작성일 {formatDate(post.created_at, true)}</span>
          <span>조회 {post.views.toLocaleString()}회</span>
        </p>
      </header>

      {files.length > 0 && (
        <ul className="space-y-2 border-b border-slate-200 bg-slate-50 px-4 py-4">
          {files.map((f) => (
            <li key={f.id}>
              <a
                href={`/files/${f.id}`}
                className="group flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl bg-white px-4 py-3 ring-1 ring-slate-200 transition hover:ring-brand-500"
              >
                <Icon name="download" className="size-5 text-brand-600" />
                <span className="font-medium text-slate-800 group-hover:text-brand-600">{f.name}</span>
                <span className="text-sm text-slate-400">
                  ({formatSize(f.size)}) · {f.downloads}회 다운로드
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}

      <div className="min-h-48 border-b border-slate-200 px-2 py-10 text-base leading-[1.9] whitespace-pre-wrap text-slate-700">
        <Linkified text={post.content} />
      </div>

      <nav aria-label="이전/다음 글" className="divide-y divide-slate-200 border-b border-slate-200 text-sm">
        {[
          { label: "이전글", p: prev },
          { label: "다음글", p: next },
        ].map(({ label, p }) => (
          <div key={label} className="flex gap-6 px-2 py-4">
            <span className="w-14 shrink-0 font-bold text-slate-500">{label}</span>
            {p ? (
              <Link href={`${base}/${p.id}`} className="truncate text-slate-700 hover:text-brand-600">
                {p.title}
              </Link>
            ) : (
              <span className="text-slate-400">{label}이 없습니다.</span>
            )}
          </div>
        ))}
      </nav>

      <div className="mt-8 text-center">
        <Link href={base} className="inline-block rounded-full bg-navy-800 px-10 py-3.5 font-bold text-white hover:bg-brand-600">
          목록
        </Link>
      </div>
    </article>
  );
}
