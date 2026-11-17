import type { Metadata } from "next";
import BoardList from "@/components/board/BoardList";
import SubHero from "@/components/SubHero";
import { sections } from "@/content/site";
import { BOARDS } from "@/lib/posts";

export const metadata: Metadata = { title: BOARDS.resources.label };

export default async function Page({ searchParams }: PageProps<"/resources">) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 50) : "";
  return (
    <>
      <SubHero {...sections.resources} heading={BOARDS.resources.label} />
      <BoardList board="resources" page={page} q={q} />
    </>
  );
}
