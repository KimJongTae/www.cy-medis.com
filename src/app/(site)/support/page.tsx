import type { Metadata } from "next";
import Icon from "@/components/Icon";
import InquiryForm from "@/components/InquiryForm";
import SubHero from "@/components/SubHero";
import { company, sections } from "@/content/site";

export const metadata: Metadata = { title: "온라인문의" };

export default function SupportPage() {
  return (
    <>
      <SubHero {...sections.support} heading="온라인문의" />
      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:px-8 md:py-20 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="relative">
          <InquiryForm />
        </div>
        <aside className="space-y-4 lg:sticky lg:top-36 lg:self-start">
          <div className="rounded-3xl bg-gradient-to-br from-navy-800 to-navy-950 p-8 text-white">
            <p className="text-sm font-bold tracking-[0.2em] text-sky-300">CONTACT</p>
            <p className="mt-3 text-xl font-bold">전화·이메일로도 문의하실 수 있습니다.</p>
            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <Icon name="phone" className="size-5 text-sky-300" />
                <a href={`tel:${company.tel}`} className="text-lg font-bold hover:text-sky-300">{company.tel}</a>
              </li>
              <li className="flex items-center gap-3">
                <Icon name="fax" className="size-5 text-sky-300" />
                FAX {company.fax}
              </li>
              <li className="flex items-center gap-3">
                <Icon name="mail" className="size-5 text-sky-300" />
                <a href={`mailto:${company.email}`} className="break-all hover:text-sky-300">{company.email}</a>
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </>
  );
}
