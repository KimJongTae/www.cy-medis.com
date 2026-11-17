import type { Metadata } from "next";
import Icon from "@/components/Icon";
import KakaoMap from "@/components/KakaoMap";
import Reveal from "@/components/Reveal";
import SubHero from "@/components/SubHero";
import { company, sections } from "@/content/site";

export const metadata: Metadata = { title: "오시는길" };

export default function LocationPage() {
  const items = [
    { icon: "pin", label: "주소", value: company.address },
    { icon: "phone", label: "전화", value: company.tel, href: `tel:${company.tel}` },
    { icon: "fax", label: "팩스", value: company.fax },
    { icon: "mail", label: "이메일", value: company.email, href: `mailto:${company.email}` },
  ];
  return (
    <>
      <SubHero {...sections.company} heading="오시는길" />
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <Reveal>
          <KakaoMap address={company.address} />
        </Reveal>
        <Reveal delay={100} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div key={it.label} className="flex gap-4 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-100">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-600 text-white">
                <Icon name={it.icon} className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-slate-400">{it.label}</p>
                {it.href ? (
                  <a href={it.href} className="font-bold break-all text-navy-900 hover:text-brand-600">
                    {it.value}
                  </a>
                ) : (
                  <p className="font-bold text-navy-900">{it.value}</p>
                )}
              </div>
            </div>
          ))}
        </Reveal>
      </section>
    </>
  );
}
