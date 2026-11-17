import type { Metadata } from "next";
import BoardView from "@/components/board/BoardView";
import SubHero from "@/components/SubHero";
import { sections } from "@/content/site";
import { BOARDS, getPost } from "@/lib/posts";

export async function generateMetadata({ params }: PageProps<"/resources/[id]">): Promise<Metadata> {
  const data = await getPost("resources", Number((await params).id));
  return { title: data ? `${data.post.title} - ${BOARDS.resources.label}` : BOARDS.resources.label };
}

export default async function Page({ params }: PageProps<"/resources/[id]">) {
  const id = Number((await params).id);
  return (
    <>
      <SubHero {...sections.resources} heading={BOARDS.resources.label} />
      <BoardView board="resources" id={id} />
    </>
  );
}
