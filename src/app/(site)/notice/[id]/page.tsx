import type { Metadata } from "next";
import BoardView from "@/components/board/BoardView";
import SubHero from "@/components/SubHero";
import { sections } from "@/content/site";
import { BOARDS, getPost } from "@/lib/posts";

export async function generateMetadata({ params }: PageProps<"/notice/[id]">): Promise<Metadata> {
  const data = await getPost("notice", Number((await params).id));
  return { title: data ? `${data.post.title} - ${BOARDS.notice.label}` : BOARDS.notice.label };
}

export default async function Page({ params }: PageProps<"/notice/[id]">) {
  const id = Number((await params).id);
  return (
    <>
      <SubHero {...sections.notice} heading={BOARDS.notice.label} />
      <BoardView board="notice" id={id} />
    </>
  );
}
