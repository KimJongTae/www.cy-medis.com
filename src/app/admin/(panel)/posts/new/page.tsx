import { notFound } from "next/navigation";
import PostForm from "@/components/admin/PostForm";
import { requireAdmin } from "@/lib/auth";
import { BOARDS, isBoard } from "@/lib/posts";

export const metadata = { title: "새 글 작성" };

export default async function NewPost({ searchParams }: PageProps<"/admin/posts/new">) {
  await requireAdmin();
  const { board } = await searchParams;
  if (!isBoard(board)) notFound();
  return (
    <>
      <h1 className="mb-6 text-2xl font-black text-navy-900">{BOARDS[board].label} · 새 글 작성</h1>
      <PostForm board={board} boardLabel={BOARDS[board].label} />
    </>
  );
}
