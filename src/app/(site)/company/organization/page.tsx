import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import SubHero from "@/components/SubHero";
import { organization, sections } from "@/content/site";

export const metadata: Metadata = { title: "조직도" };

export default function OrganizationPage() {
  return (
    <>
      <SubHero {...sections.company} heading="조직도" />
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <Reveal className="flex flex-col items-center">
          <div className="rounded-2xl bg-gradient-to-br from-navy-800 to-navy-950 px-14 py-5 text-xl font-black text-white shadow-xl">{organization.head}</div>
          <span aria-hidden className="h-10 w-px bg-slate-300" />
        </Reveal>

        <div className="relative grid gap-12 md:grid-cols-2 md:gap-8">
          {/* 두 부서를 잇는 가로선 (데스크톱) */}
          <span aria-hidden className="absolute top-0 left-1/4 hidden h-px w-1/2 bg-slate-300 md:block" />
          {organization.divisions.map((d, i) => (
            <Reveal key={d.name} delay={i * 150} className="flex flex-col items-center">
              <span aria-hidden className="hidden h-8 w-px bg-slate-300 md:block" />
              <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 px-10 py-4 text-lg font-bold text-white shadow-lg">{d.name}</div>
              <span aria-hidden className="h-8 w-px bg-slate-300" />
              <ul className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
                {d.teams.map((t) => (
                  <li
                    key={t}
                    className="grid min-h-16 place-items-center rounded-xl border border-sky-400/40 bg-sky-400/10 px-3 py-3 text-center text-sm font-bold text-navy-800"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
