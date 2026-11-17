import type { Metadata } from "next";
import SubHero from "@/components/SubHero";
import { company, privacyConsent, sections } from "@/content/site";

export const metadata: Metadata = { title: "개인정보처리방침" };

/** 기본 골격 — 실제 운영 방침에 맞게 검토 후 사용하세요. */
export default function PrivacyPage() {
  const rows = [
    ["1. 수집하는 개인정보 항목", `온라인문의 시: ${privacyConsent.items}`],
    ["2. 개인정보의 수집·이용 목적", privacyConsent.purpose],
    ["3. 보유 및 이용 기간", privacyConsent.retention],
    ["4. 제3자 제공", "회사는 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만 법령에 따른 요청이 있는 경우는 예외로 합니다."],
    ["5. 파기 절차 및 방법", "보유 기간이 지난 개인정보는 지체 없이 복구할 수 없는 방법으로 파기합니다."],
    ["6. 이용자의 권리", "이용자는 언제든지 자신의 개인정보 열람·정정·삭제·처리정지를 요청할 수 있으며, 아래 연락처로 요청하시면 지체 없이 조치하겠습니다."],
    ["7. 개인정보 보호책임자", `${company.name} / 전화 ${company.tel} / 이메일 ${company.email}`],
  ];
  return (
    <>
      <SubHero {...sections.support} heading="개인정보처리방침" />
      <section className="mx-auto max-w-4xl px-5 py-16 md:px-8 md:py-20">
        <p className="leading-relaxed text-slate-600">
          {company.name}(이하 &lsquo;회사&rsquo;)은 「개인정보 보호법」에 따라 이용자의 개인정보를 보호하고 관련 고충을 원활하게 처리할 수 있도록 다음과 같이
          개인정보처리방침을 수립·공개합니다.
        </p>
        <dl className="mt-10 space-y-8">
          {rows.map(([t, d]) => (
            <div key={t}>
              <dt className="text-lg font-bold text-navy-900">{t}</dt>
              <dd className="mt-2 leading-relaxed text-slate-600">{d}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
