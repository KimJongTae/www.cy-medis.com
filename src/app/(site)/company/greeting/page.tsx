import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import SubHero from "@/components/SubHero";
import { greeting, sections } from "@/content/site";

export const metadata: Metadata = { title: "인사말" };

export default function GreetingPage() {
  return (
    <>
      <SubHero {...sections.company} heading="CEO 인사말" />
      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:px-8 md:py-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,8fr)] lg:gap-20">
        <Reveal className="relative mx-auto w-full max-w-sm lg:max-w-none">
          <div className="relative aspect-[383/600] overflow-hidden rounded-3xl shadow-2xl">
            <Image src={greeting.image} alt="청연메디칼 의료 이미지" fill sizes="(min-width:1024px) 35vw, 90vw" className="object-cover" />
          </div>
          <div className="absolute -right-4 -bottom-4 -z-10 size-full rounded-3xl bg-brand-50" />
        </Reveal>
        <div>
          <Reveal>
            <p className="text-2xl leading-snug font-bold text-navy-900 md:text-3xl">
              {greeting.headline[0]}
              <br />
              <span className="text-brand-600">{greeting.headline[1]}</span>
            </p>
          </Reveal>
          <div className="mt-8 space-y-6 text-base leading-[1.9] text-slate-600 md:text-[17px]">
            {greeting.paragraphs.map((p, i) => (
              <Reveal as="p" key={i} delay={i * 80}>
                {p}
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10 border-t border-slate-200 pt-8">
            <p className="text-slate-600">{greeting.closing}</p>
            <p className="mt-2 text-xl font-black text-navy-900">{greeting.signature}</p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
