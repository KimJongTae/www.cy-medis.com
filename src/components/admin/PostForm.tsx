"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { savePost, type PostFormState } from "@/app/actions/admin";

type Props = {
  board: "notice" | "resources";
  boardLabel: string;
  post?: { id: number; title: string; content: string; author: string; pinned: number };
  files?: { id: string; name: string; size: string }[];
};

export default function PostForm({ board, boardLabel, post, files = [] }: Props) {
  const [state, action, pending] = useActionState<PostFormState, FormData>(savePost, {});
  const [picked, setPicked] = useState<string[]>([]);

  return (
    <form action={action} className="space-y-6 rounded-2xl bg-white p-6 shadow-sm md:p-8">
      <input type="hidden" name="board" value={board} />
      {post && <input type="hidden" name="id" value={post.id} />}

      {state.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="title" className="mb-2 block text-sm font-bold text-slate-700">
          제목 <span className="text-brand-600">*</span>
        </label>
        <input id="title" name="title" required maxLength={200} defaultValue={post?.title} className="field" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="author" className="mb-2 block text-sm font-bold text-slate-700">
            작성자
          </label>
          <input id="author" name="author" defaultValue={post?.author ?? "관리자"} maxLength={30} className="field" />
        </div>
        <label className="flex items-center gap-2 self-end pb-3 text-sm font-medium text-slate-700">
          <input type="checkbox" name="pinned" defaultChecked={!!post?.pinned} className="size-5 accent-brand-600" />
          목록 상단에 고정 (공지)
        </label>
      </div>

      <div>
        <label htmlFor="content" className="mb-2 block text-sm font-bold text-slate-700">
          내용
        </label>
        <textarea id="content" name="content" rows={14} defaultValue={post?.content} className="field resize-y leading-relaxed" />
        <p className="mt-1.5 text-xs text-slate-400">줄바꿈은 그대로 표시되며, http(s) 주소는 자동으로 링크됩니다.</p>
      </div>

      <div>
        <p className="mb-2 text-sm font-bold text-slate-700">첨부파일</p>
        {files.length > 0 && (
          <ul className="mb-3 space-y-2">
            {files.map((f) => (
              <li key={f.id} className="flex flex-wrap items-center gap-3 rounded-xl bg-slate-50 px-4 py-2.5 text-sm">
                <a href={`/files/${f.id}`} className="font-medium text-slate-700 hover:text-brand-600">
                  {f.name}
                </a>
                <span className="text-slate-400">{f.size}</span>
                <label className="ml-auto flex items-center gap-1.5 text-red-600">
                  <input type="checkbox" name="removeFile" value={f.id} className="accent-red-600" /> 삭제
                </label>
              </li>
            ))}
          </ul>
        )}
        <label className="block cursor-pointer rounded-xl border-2 border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500 transition hover:border-brand-500 hover:text-brand-600">
          <input
            type="file"
            name="files"
            multiple
            className="sr-only"
            onChange={(e) => setPicked(Array.from(e.target.files ?? []).map((f) => `${f.name} (${(f.size / 1024 / 1024).toFixed(1)}MB)`))}
          />
          {picked.length ? picked.join(", ") : "클릭해서 파일 선택 (여러 개 가능, 파일당 최대 30MB)"}
        </label>
      </div>

      <div className="flex justify-between gap-3 border-t border-slate-100 pt-6">
        <Link href={`/admin/posts?board=${board}`} className="rounded-xl px-5 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100">
          취소
        </Link>
        <button disabled={pending} className="rounded-xl bg-brand-600 px-8 py-3 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-60">
          {pending ? "저장 중…" : post ? "수정 저장" : `${boardLabel}에 등록`}
        </button>
      </div>
    </form>
  );
}
