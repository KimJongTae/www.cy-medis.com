import Link from "next/link";
import { company, nav } from "@/content/site";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white/60">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div>
            <Logo variant="white" className="h-9 w-auto" />
            <address className="mt-6 space-y-1.5 text-sm leading-relaxed not-italic">
              <p>
                <span className="font-bold text-white/80">{company.name}</span>
                <Sep />
                대표이사 {company.ceo}
                <Sep />
                사업자등록번호 {company.bizNo}
              </p>
              <p>주소 : {company.address}</p>
              <p>
                전화 <a href={`tel:${company.tel}`} className="hover:text-white">{company.tel}</a>
                <Sep />
                팩스 {company.fax}
                <Sep />
                E-mail <a href={`mailto:${company.email}`} className="hover:text-white">{company.email}</a>
              </p>
            </address>
          </div>
          <nav aria-label="하단 메뉴">
            <ul className="grid grid-cols-3 gap-x-8 gap-y-3 text-sm sm:flex sm:flex-wrap sm:gap-x-6">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="hover:text-white">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs sm:flex-row">
          <p>Copyright © {company.name} All Rights Reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">개인정보처리방침</Link>
            <Link href="/admin" className="hover:text-white" rel="nofollow">관리자</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

const Sep = () => <span className="mx-2 text-white/20">|</span>;
