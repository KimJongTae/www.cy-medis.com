import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { company } from "@/content/site";
import "./globals.css";

const notoKr = Noto_Sans_KR({
  variable: "--font-noto-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

const description =
  "㈜청연메디칼은 맑은 기준으로 환자와 의료 현장을 이어 가는 의료기기 유통 전문 기업입니다. Medtronic, Abbott, KARL STORZ, Nihon Kohden 등 글로벌 파트너. 대전 유성구.";

export const metadata: Metadata = {
  metadataBase: new URL(company.siteUrl),
  title: { default: `${company.name} | 신뢰받는 의료기기 유통 파트너`, template: `%s | ${company.name}` },
  description,
  keywords: ["청연메디칼", "청연 메디칼", "의료기기 유통", "의료장비", "대전 의료기기", "CHUNG YUN MEDICAL"],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: company.name,
    title: `${company.name} | 신뢰받는 의료기기 유통 파트너`,
    description,
    images: [{ url: "/images/hero-1.webp", width: 1920, height: 919 }],
  },
};

export const viewport: Viewport = { themeColor: "#003a5d" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${notoKr.variable} h-full`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      {/* 브라우저 확장 프로그램이 body 에 붙이는 속성(Grammarly 등)으로 인한 경고 방지 */}
      <body className="min-h-full font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
