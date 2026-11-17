import type { MetadataRoute } from "next";
import { company, nav } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = new Set(["/", ...nav.flatMap((n) => [n.href, ...(n.children?.map((c) => c.href) ?? [])])]);
  return [...paths].map((p) => ({ url: `${company.siteUrl}${p}`, changeFrequency: "monthly", priority: p === "/" ? 1 : 0.7 }));
}
