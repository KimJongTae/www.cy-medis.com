import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SubHero from "@/components/SubHero";
import { partners, sections } from "@/content/site";

export const metadata: Metadata = { title: "제품소개" };

export default function ProductsPage() {
  return (
    <>
      <SubHero {...sections.product} heading="제품소개" />
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <Reveal className="mx-auto max-w-2xl text-center text-base leading-relaxed text-slate-600 md:text-lg">
          ㈜청연메디칼은 세계적인 의료기기 기업들과 파트너십을 맺고
          <br className="hidden sm:block" /> 의료 현장에 신뢰할 수 있는 제품을 공급하고 있습니다.
        </Reveal>
        <ul className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {partners.map((p, i) => (
            <Reveal
              as="li"
              key={p.name}
              delay={(i % 5) * 60}
              className="group grid aspect-[250/130] place-items-center rounded-2xl bg-white p-4 ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg hover:ring-brand-500/40"
            >
              <Image src={p.logo} alt={p.name} width={250} height={80} className="h-auto w-full max-w-[200px]" />
              <span className="sr-only">{p.name}</span>
            </Reveal>
          ))}
        </ul>
        <Reveal className="mt-14 flex flex-col items-center justify-between gap-5 rounded-3xl bg-brand-50 p-8 text-center md:flex-row md:text-left">
          <div>
            <p className="text-lg font-bold text-navy-900">제품 견적 및 상세 정보가 필요하신가요?</p>
            <p className="mt-1 text-slate-600">브로셔는 자료실에서, 견적·상담은 온라인문의로 요청해 주세요.</p>
          </div>
          <div className="flex shrink-0 gap-3">
            <Link href="/resources" className="rounded-full border border-brand-600 px-6 py-3 font-bold text-brand-600 hover:bg-white">
              자료실
            </Link>
            <Link href="/support" className="rounded-full bg-brand-600 px-6 py-3 font-bold text-white hover:bg-brand-700">
              온라인문의
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
