import Image from "next/image";
import Link from "next/link";
import HeroSlideshow from "@/components/HeroSlideshow";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";
import { company, home, partners } from "@/content/site";
import { formatDate, latestPosts } from "@/lib/posts";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.name,
  alternateName: company.nameEn,
  url: company.siteUrl,
  telephone: company.tel,
  faxNumber: company.fax,
  email: company.email,
  foundingDate: "2017-12-11",
  taxID: company.bizNo,
  address: {
    "@type": "PostalAddress",
    streetAddress: "학하남로77번길 4-12",
    addressLocality: "유성구",
    addressRegion: "대전광역시",
    addressCountry: "KR",
  },
};

export default async function Home() {
  const [notices, resources] = await Promise.all([latestPosts("notice"), latestPosts("resources")]);
  const { hero, about, cards, closing } = home;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* HERO */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-navy-950">
        <HeroSlideshow slides={hero.slides} />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/85 via-navy-950/50 to-navy-950/20" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pt-16 md:px-8">
          <p className="animate-fade-up text-sm font-bold tracking-[0.35em] text-sky-300 md:text-base">{hero.eyebrow}</p>
          <h1
            className="mt-5 animate-fade-up text-4xl leading-[1.25] font-black tracking-tight whitespace-pre-line text-white sm:text-5xl lg:text-6xl"
            style={{ "--delay": "150ms" } as React.CSSProperties}
          >
            {hero.title}
          </h1>
          <p
            className="mt-7 max-w-xl animate-fade-up text-base leading-relaxed whitespace-pre-line text-white/75 md:text-lg"
            style={{ "--delay": "350ms" } as React.CSSProperties}
          >
            {hero.description}
          </p>
          <div className="mt-10 flex animate-fade-up flex-wrap gap-3" style={{ "--delay": "500ms" } as React.CSSProperties}>
            <Link
              href="/company/greeting"
              className="group inline-flex items-center gap-3 rounded-full bg-brand-600 px-7 py-3.5 font-bold text-white shadow-lg shadow-brand-900/30 transition hover:bg-brand-500"
            >
              자세히 보기
              <span className="h-px w-8 bg-white/70 transition-all group-hover:w-12" />
            </Link>
            <Link
              href="/support"
              className="rounded-full border border-white/30 bg-white/10 px-7 py-3.5 font-bold text-white backdrop-blur transition hover:bg-white/20"
            >
              온라인문의
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 md:px-8 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative">
            <div className="absolute -top-5 -left-5 hidden size-40 rounded-3xl bg-sky-400/15 lg:block" />
            <div className="relative aspect-[592/357] overflow-hidden rounded-3xl shadow-2xl">
              <Image src={about.image} alt="청연메디칼" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
            </div>
            <div className="absolute -right-3 -bottom-8 rounded-2xl bg-navy-800 px-6 py-5 text-white shadow-xl md:-right-8">
              <p className="text-xs font-medium text-sky-300">{about.badge}</p>
              <p className="mt-1 text-3xl font-black">Since {company.since}~</p>
            </div>
          </Reveal>
          <div>
            <Reveal>
              <p className="text-sm font-bold tracking-[0.25em] text-brand-600">ABOUT US</p>
              <h2 className="mt-4 text-3xl leading-snug font-black text-navy-900 md:text-4xl">{about.title}</h2>
              <p className="mt-3 text-xl leading-relaxed font-bold text-brand-600 md:text-2xl">{about.lead}</p>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-7 text-base leading-relaxed whitespace-pre-line text-slate-600 md:text-lg">{about.body}</p>
              <Link href="/company/history" className="mt-8 inline-flex items-center gap-2 font-bold text-navy-800 hover:text-brand-600">
                회사연혁 보기 <span aria-hidden>→</span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CARDS */}
      <section className="bg-slate-50 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal className="text-center">
            <p className="text-sm font-bold text-brand-600">{company.name}</p>
            <h2 className="mt-4 text-2xl font-black text-navy-900 md:text-4xl">{cards.title}</h2>
          </Reveal>
          <ul className="mt-14 grid gap-6 md:grid-cols-3">
            {cards.items.map((c, i) => (
              <Reveal as="li" key={c.href} delay={i * 120}>
                <Link href={c.href} className="group block overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative aspect-[354/260] overflow-hidden">
                    <Image src={c.image} alt="" fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
                  </div>
                  <div className="p-7">
                    <p className="text-xs font-bold tracking-[0.25em] text-sky-400">{c.eyebrow}</p>
                    <p className="mt-2 text-lg font-bold text-navy-900">{c.title}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-slate-500 group-hover:text-brand-600">
                      자세히 보기 <span className="h-px w-6 bg-current transition-all group-hover:w-10" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="overflow-hidden py-20" aria-labelledby="partners-title">
        <Reveal className="mx-auto max-w-7xl px-5 text-center md:px-8">
          <p className="text-sm font-bold tracking-[0.25em] text-brand-600">PARTNERS</p>
          <h2 id="partners-title" className="mt-3 text-2xl font-black text-navy-900 md:text-3xl">
            글로벌 의료기기 파트너
          </h2>
        </Reveal>
        <div className="group relative mt-12 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
          <ul className="flex w-max animate-marquee gap-6 group-hover:[animation-play-state:paused]">
            {[...partners, ...partners].map((p, i) => (
              <li key={i} aria-hidden={i >= partners.length} className="grid h-24 w-56 shrink-0 place-items-center rounded-2xl bg-white px-4 ring-1 ring-slate-100">
                <Image src={p.logo} alt={i < partners.length ? p.name : ""} width={250} height={80} className="h-auto w-48" />
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-10 text-center">
          <Link href="/products" className="inline-flex items-center gap-2 font-bold text-navy-800 hover:text-brand-600">
            제품소개 전체 보기 <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* LATEST */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 md:grid-cols-2 md:px-8">
          {[
            { title: "공지사항", href: "/notice", items: notices },
            { title: "자료실", href: "/resources", items: resources },
          ].map((b, i) => (
            <Reveal key={b.href} delay={i * 120} className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-navy-900">{b.title}</h2>
                <Link href={b.href} aria-label={`${b.title} 더보기`} className="grid size-9 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-brand-600 hover:text-white">
                  +
                </Link>
              </div>
              <ul className="mt-5 divide-y divide-slate-100">
                {b.items.length === 0 && <li className="py-6 text-center text-sm text-slate-400">등록된 게시물이 없습니다.</li>}
                {b.items.map((p) => (
                  <li key={p.id}>
                    <Link href={`${b.href}/${p.id}`} className="flex items-center justify-between gap-4 py-3.5 hover:text-brand-600">
                      <span className="truncate">{p.title}</span>
                      <span className="shrink-0 text-sm text-slate-400">{formatDate(p.created_at)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CLOSING */}
      <section className="relative overflow-hidden bg-navy-950 py-28 md:py-36">
        <Image src={closing.image} alt="" fill sizes="100vw" className="object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 to-navy-900/40" />
        <Reveal className="relative mx-auto max-w-7xl px-5 md:px-8">
          <p className="text-sm font-bold text-sky-300">{company.name}</p>
          <p className="mt-5 text-2xl leading-snug font-bold whitespace-pre-line text-white md:text-4xl">{closing.title}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/support" className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-bold text-navy-900 transition hover:bg-sky-300">
              <Icon name="mail" className="size-5" /> 온라인문의
            </Link>
            <a href={`tel:${company.tel}`} className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 font-bold text-white transition hover:bg-white/10">
              <Icon name="phone" className="size-5" /> {company.tel}
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
