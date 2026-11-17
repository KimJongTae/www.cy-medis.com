import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import SubHero from "@/components/SubHero";
import { history, sections } from "@/content/site";

export const metadata: Metadata = { title: "회사연혁" };

export default function HistoryPage() {
  const first = history.years[0].year;
  const last = history.years[history.years.length - 1].year;
  return (
    <>
      <SubHero {...sections.company} heading="회사연혁" />
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <Reveal className="grid items-center gap-8 overflow-hidden rounded-3xl bg-navy-800 text-white md:grid-cols-2">
          <div className="p-8 md:p-12">
            <p className="text-sm font-bold tracking-[0.3em] text-sky-300">CHUNG YUN</p>
            <p className="mt-4 text-2xl leading-snug font-bold md:text-3xl">{history.title}</p>
            <p className="mt-6 text-5xl font-black text-white/15 md:text-6xl">
              {first} — {last}
            </p>
          </div>
          <div className="relative aspect-[445/260] md:h-full md:aspect-auto">
            <Image src={history.image} alt="" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
          </div>
        </Reveal>

        <ol className="relative mt-20 md:mt-24">
          <span aria-hidden className="absolute top-3 bottom-3 left-[7px] w-px bg-gradient-to-b from-brand-600 via-sky-400 to-slate-200 md:left-[180px]" />
          {history.years.map((y, i) => (
            <Reveal as="li" key={y.year} delay={i * 60} className="relative grid gap-3 pb-12 pl-10 last:pb-0 md:grid-cols-[180px_1fr] md:gap-0 md:pl-0">
              <span aria-hidden className="absolute top-2.5 left-0 size-[15px] rounded-full border-4 border-white bg-brand-600 shadow ring-1 ring-brand-600/30 md:left-[173px]" />
              <p className="text-3xl leading-none font-black text-navy-900 md:pr-12 md:text-right md:text-4xl">{y.year}</p>
              <ul className="space-y-2 md:pl-12">
                {y.events.map((e) => (
                  <li key={e} className="rounded-2xl bg-slate-50 px-5 py-4 text-base font-medium text-slate-700 ring-1 ring-slate-100 md:text-lg">
                    {e}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ol>
      </section>
    </>
  );
}
