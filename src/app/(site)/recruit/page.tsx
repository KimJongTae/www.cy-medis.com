import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import SubHero from "@/components/SubHero";
import { recruit, sections } from "@/content/site";

export const metadata: Metadata = { title: "채용문의" };

export default function RecruitPage() {
  return (
    <>
      <SubHero {...sections.recruit} heading="RECRUIT" />
      <section className="mx-auto max-w-5xl px-5 py-16 md:px-8 md:py-20">
        <Reveal className="relative overflow-hidden rounded-3xl">
          <Image src={recruit.image} alt="" width={1500} height={500} sizes="(min-width:1024px) 1000px, 100vw" className="h-56 w-full object-cover md:h-72" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/85 to-navy-900/20" />
          <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-12">
            <p className="text-sm font-bold tracking-[0.2em] text-sky-300">{recruit.eyebrow}</p>
            <p className="mt-3 text-xl leading-snug font-bold whitespace-pre-line text-white md:text-3xl">{recruit.title}</p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <dl className="mt-12 divide-y divide-slate-200 border-y-2 border-navy-800">
            {recruit.items.map((it) => (
              <div key={it.label} className="grid gap-2 py-6 sm:grid-cols-[180px_1fr]">
                <dt className="font-bold text-navy-900">{it.label}</dt>
                <dd className="whitespace-pre-line text-slate-600">
                  {it.href ? (
                    <a href={it.href} className="font-medium text-brand-600 hover:underline">
                      {it.value}
                    </a>
                  ) : (
                    it.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>
    </>
  );
}
