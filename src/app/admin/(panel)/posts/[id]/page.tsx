import { notFound } from "next/navigation";
import { removePost } from "@/app/actions/admin";
import ConfirmButton from "@/components/admin/ConfirmButton";
import PostForm from "@/components/admin/PostForm";
import { requireAdmin } from "@/lib/auth";
import { BOARDS, formatSize, getPost, isBoard } from "@/lib/posts";

export const metadata = { title: "글 수정" };

export default async function EditPost({ params, searchParams }: PageProps<"/admin/posts/[id]">) {
  await requireAdmin();
  const { board } = await searchParams;
  if (!isBoard(board)) notFound();
  const data = await getPost(board, Number((await params).id));
  if (!data) notFound();
  const { post, files } = data;

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black text-navy-900">{BOARDS[board].label} · 글 수정</h1>
        <form action={removePost}>
          <input type="hidden" name="id" value={post.id} />
          <input type="hidden" name="board" value={board} />
          <ConfirmButton message="이 게시물과 첨부파일을 삭제할까요? 되돌릴 수 없습니다.">게시물 삭제</ConfirmButton>
        </form>
      </div>
      <PostForm
        board={board}
        boardLabel={BOARDS[board].label}
        post={{ id: post.id, title: post.title, content: post.content, author: post.author, pinned: post.pinned }}
        files={files.map((f) => ({ id: f.id, name: f.name, size: formatSize(f.size) }))}
      />
    </>
  );
}
