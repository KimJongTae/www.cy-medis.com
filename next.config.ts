import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker 배포용: 실행에 필요한 파일만 .next/standalone 에 모음
  output: "standalone",
  // 이미지는 미리 WebP 로 최적화해 두었으므로 런타임 변환을 쓰지 않음
  images: { unoptimized: true },
  experimental: {
    // 관리자 첨부파일 업로드 (파일당 30MB, 한 번에 여러 개)
    serverActions: { bodySizeLimit: "100mb" },
  },
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
