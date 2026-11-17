import type { Metadata } from "next";
import BoardList from "@/components/board/BoardList";
import SubHero from "@/components/SubHero";
import { sections } from "@/content/site";
import { BOARDS } from "@/lib/posts";

export const metadata: Metadata = { title: BOARDS.notice.label };

export default async function Page({ searchParams }: PageProps<"/notice">) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 50) : "";
  return (
    <>
      <SubHero {...sections.notice} heading={BOARDS.notice.label} />
      <BoardList board="notice" page={page} q={q} />
    </>
  );
}
