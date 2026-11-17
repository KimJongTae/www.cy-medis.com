/**
 * 사이트 콘텐츠. 문구 수정은 이 파일만 고치면 됩니다.
 * 출처: 운영 중인 홈페이지 의료장비.com/0-cymedi/ (2026-11-17 수집)
 */

export const company = {
  name: "㈜청연메디칼",
  nameEn: "CHUNG YUN MEDICAL",
  ceo: "서정석",
  bizNo: "263-87-00859",
  since: "2017",
  address: "대전광역시 유성구 학하남로77번길 4-12",
  tel: "042-253-9910",
  fax: "042-254-9910",
  email: "cymedical@cymedical.co.kr",
  siteUrl: "https://www.cy-medis.com",
};

export type NavItem = { label: string; href: string; children?: { label: string; href: string }[] };

export const nav: NavItem[] = [
  {
    label: "회사소개",
    href: "/company/greeting",
    children: [
      { label: "인사말", href: "/company/greeting" },
      { label: "회사연혁", href: "/company/history" },
      { label: "조직도", href: "/company/organization" },
      { label: "오시는길", href: "/company/location" },
    ],
  },
  { label: "제품소개", href: "/products" },
  { label: "공지사항", href: "/notice" },
  { label: "자료실", href: "/resources" },
  { label: "채용문의", href: "/recruit" },
  { label: "고객센터", href: "/support", children: [{ label: "온라인문의", href: "/support" }] },
];

/** 서브페이지 상단 배너 */
export const sections = {
  company: { eyebrow: "COMPANY", title: "신뢰받는 의료기기 유통 파트너", image: "/images/sub-company.webp" },
  product: { eyebrow: "PRODUCT", title: "하나의 제품에도 정성을 기울입니다.", image: "/images/sub-product.webp" },
  notice: { eyebrow: "NOTICE", title: "청연메디칼의 새로운 소식을 전해드립니다.", image: "/images/sub-notice.webp" },
  resources: { eyebrow: "RESOURCES", title: "제품 브로셔와 자료를 내려받으세요.", image: "/images/sub-company.webp" },
  recruit: { eyebrow: "RECRUIT", title: "'청연'과 함께 할 인재 모집", image: "/images/sub-support.webp" },
  support: { eyebrow: "CUSTOMER CENTER", title: "궁금하신 점을 남겨주시면 빠르게 답변드리겠습니다.", image: "/images/sub-support.webp" },
} as const;

export const home = {
  hero: {
    eyebrow: "CHUNG YUN MEDICAL",
    title: "맑은 기준으로 환자와\n의료 현장을 이어 갑니다.",
    description:
      "푸른 연꽃처럼 조용하지만 흔들림 없는 원칙으로\n의료기관과 함께 고민하고, 함께 성장하는\n신뢰받는 의료기기 유통 파트너가 되겠습니다.",
    slides: ["/images/hero-1.webp", "/images/hero-2.webp", "/images/hero-3.webp", "/images/hero-4.webp"],
  },
  about: {
    title: "㈜청연메디칼은",
    lead: "환자에게는 안전을, 병원에는 신뢰를 전하는 의료 솔루션을 제공합니다.",
    badge: "의료기기 유통 파트너",
    body: "청연메디칼의 이름인 ‘청연(淸蓮)’은 푸른 연꽃을 뜻합니다.\n연꽃은 혼탁한 물속에서도 스스로를 더럽히지 않고 고요하게 피어납니다.",
    image: "/images/about.webp",
  },
  cards: {
    title: "본질에 충실한 기준으로 환자와 병원을 지원합니다.",
    items: [
      { eyebrow: "COMPANY", title: "신뢰받는 의료기기 유통 파트너", href: "/company/greeting", image: "/images/card-company.webp" },
      { eyebrow: "PRODUCT", title: "하나의 제품에도 정성을 기울입니다.", href: "/products", image: "/images/card-product.webp" },
      { eyebrow: "RECRUIT", title: "'청연'과 함께 할 인재 모집", href: "/recruit", image: "/images/card-recruit.webp" },
    ],
  },
  closing: {
    title: "눈앞의 효율보다 신뢰의 지속성을,\n규모보다 품질의 일관성을 더 중요하게 여기고 있습니다.",
    image: "/images/closing-bg.webp",
  },
};

export const greeting = {
  image: "/images/ceo.webp",
  headline: ["안녕하십니까.", "주식회사 청연메디칼 입니다."],
  paragraphs: [
    "청연메디칼의 이름인 ‘청연(淸蓮)’은 푸른 연꽃을 뜻합니다. 연꽃은 혼탁한 물속에서도 스스로를 더럽히지 않고 고요하게 피어납니다. 저희는 이 상징에 의료를 대하는 자세와 기업이 지켜야 할 본질적인 가치를 담았습니다.",
    "의료기기는 기술 이전에 사람의 생명과 마주하는 도구라고 생각합니다. 그렇기에 청연메디칼은 단순한 유통을 넘어, 의료 현장에서 안심하고 선택할 수 있는 제품을 정직한 기준과 책임 있는 과정으로 전달하는 데 집중해 왔습니다.",
    "빠르게 변화하는 의료 환경 속에서도 저희는 눈앞의 효율보다 신뢰의 지속성을, 규모보다 품질의 일관성을 더 중요하게 여기고 있습니다. 하나의 제품, 한 번의 납품에도 의료진의 판단과 환자의 안전이 담겨 있음을 잊지 않겠습니다.",
    "㈜청연메디칼은 앞으로도 푸른 연꽃처럼 조용하지만 흔들림 없는 원칙으로 의료기관과 함께 고민하고, 함께 성장하는 신뢰받는 의료기기 유통 파트너가 되겠습니다.",
  ],
  closing: "감사합니다.",
  signature: "주식회사 청연메디칼",
};

export const history = {
  title: "맑은 기준으로 환자와 의료 현장을 이어 갑니다.",
  image: "/images/history.webp",
  years: [
    { year: "2017", events: ["12월 11일 주식회사 청연메디칼 법인설립"] },
    { year: "2018", events: ["MEDTRONIC, TELEFLEX, FISHER & PAYKEL HEALTHCARE", "MEDITREE FOUNDERS 파트너 체결"] },
    { year: "2019", events: ["ABBOTT 파트너 체결"] },
    { year: "2020", events: ["UNIMEDICS, Globaluck LIDCO 파트너 체결"] },
    { year: "2021", events: ["대전시 유성구 학하동 사옥 이전", "KARL STORZ ENDOSCOPE, 유진 인터내셔널 ANI V2 파트너 체결"] },
    { year: "2023", events: ["CONVATEC 파트너 체결"] },
    { year: "2025", events: ["NIHON KOHDEN KOREA 파트너 체결"] },
  ],
};

export const organization = {
  head: "대표이사",
  divisions: [
    { name: "영업관리부", teams: ["영업1팀", "영업2팀", "CUSTOMER SERVICE TEAM"] },
    { name: "경영관리부", teams: ["RA/QA", "재무회계팀", "구매물류팀"] },
  ],
};

export const partners = [
  { name: "Medtronic", logo: "medtronic" },
  { name: "Teleflex", logo: "teleflex" },
  { name: "Abbott Neuromodulation", logo: "abbott-neuromodulation" },
  { name: "Abbott Cardiovascular", logo: "abbott-cardiovascular" },
  { name: "Fisher & Paykel Healthcare", logo: "fisher-paykel" },
  { name: "LivaNova", logo: "livanova" },
  { name: "Nihon Kohden", logo: "nihon-kohden" },
  { name: "ICU Medical", logo: "icu-medical" },
  { name: "Unimedics", logo: "unimedics" },
  { name: "KARL STORZ", logo: "karl-storz" },
  { name: "Eujinmed", logo: "eujinmed" },
  { name: "KIMAL", logo: "kimal" },
  { name: "ZOLL", logo: "zoll" },
  { name: "MediFarmSoft", logo: "medifarmsoft" },
  { name: "Convatec", logo: "convatec" },
].map((p) => ({ ...p, logo: `/images/partners/${p.logo}.webp` }));

export const recruit = {
  image: "/images/recruit.webp",
  eyebrow: "We're looking for",
  title: "㈜청연메디칼에서 미래를 함께 할\n우수한 인재를 선발하고 있습니다.",
  items: [
    { label: "채용대상", value: "상시채용" },
    { label: "전형방법", value: "서류전형 (합격자에게는 개별통보)\n면접전형" },
    { label: "제출서류", value: "이력서, 자기소개서 및 기타 서류" },
    { label: "EMAIL", value: company.email, href: `mailto:${company.email}` },
    { label: "우편접수", value: `${company.address} ${company.name}` },
  ],
};

/** 카카오맵 '약도 퍼가기' — 운영 중인 오시는길 페이지와 같은 값 */
export const kakaoMap = { timestamp: "1768457959720", key: "g2nhgpk4j28", height: 420 };

/** 온라인문의 개인정보 수집·이용 동의 문구 — 실제 운영 방침에 맞게 확인하세요. */
export const privacyConsent = {
  items: "이름, 이메일, 연락처, 문의 내용",
  purpose: "문의 접수 및 답변, 상담 결과 안내",
  retention: "문의 처리 완료 후 1년간 보관 후 파기 (관계 법령에 따라 보존이 필요한 경우 해당 기간)",
};
