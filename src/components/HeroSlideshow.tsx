"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const INTERVAL = 6000;

export default function HeroSlideshow({ slides }: { slides: readonly string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), INTERVAL);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <>
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        {slides.map((src, i) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${i === index ? "opacity-100" : "opacity-0"}`}
          >
            <Image
              src={src}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              // key 변경으로 활성화될 때마다 켄번즈 애니메이션을 다시 시작
              key={i === index ? `on-${index}` : "off"}
              className={`object-cover ${i === index ? "animate-kenburns" : ""}`}
            />
          </div>
        ))}
      </div>

      <div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 gap-2.5">
        {slides.map((src, i) => (
          <button
            key={src}
            type="button"
            aria-label={`${i + 1}번 슬라이드 보기`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? "w-10 bg-sky-400" : "w-5 bg-white/50 hover:bg-white/80"}`}
          />
        ))}
      </div>
    </>
  );
}
