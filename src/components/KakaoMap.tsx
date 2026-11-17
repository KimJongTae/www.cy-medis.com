"use client";

import { useEffect, useRef, useState } from "react";
import { kakaoMap } from "@/content/site";

type RoughmapLander = new (opts: { timestamp: string; key: string; mapWidth?: string; mapHeight: string }) => { render: () => void };
declare global {
  interface Window {
    daum?: { roughmap?: { Lander?: RoughmapLander } };
  }
}

const LOADER_SRC = "https://ssl.daumcdn.net/dmaps/map_js_init/roughmapLoader.js";

let landerPromise: Promise<void> | null = null;

/**
 * 카카오 roughmapLoader.js 는 document.write 로 실제 Lander 스크립트를 삽입한다.
 * 페이지 로드 후 document.write 를 호출하면 문서가 지워지므로, 로더가 실행되는 동안만
 * document.write 를 <script> 요소 삽입으로 바꿔치기한다.
 */
function loadLander(): Promise<void> {
  if (window.daum?.roughmap?.Lander) return Promise.resolve();
  if (landerPromise) return landerPromise;

  landerPromise = new Promise<void>((resolve, reject) => {
    const originalWrite = document.write.bind(document);
    document.write = (...chunks: string[]) => {
      const src = /src="([^"]+)"/.exec(chunks.join(""))?.[1];
      if (!src) return;
      const s = document.createElement("script");
      s.src = src;
      s.charset = "UTF-8";
      s.onload = () => (window.daum?.roughmap?.Lander ? resolve() : reject(new Error("Lander missing")));
      s.onerror = reject;
      document.head.appendChild(s);
    };

    const loader = document.createElement("script");
    loader.src = LOADER_SRC;
    loader.charset = "UTF-8";
    loader.onload = loader.onerror = () => {
      document.write = originalWrite;
    };
    loader.addEventListener("error", reject);
    document.head.appendChild(loader);
  }).catch((e) => {
    landerPromise = null;
    throw e;
  });

  return landerPromise;
}

/** 카카오맵 '지도 퍼가기' — 기존 사이트와 같은 퍼가기 키를 사용 */
export default function KakaoMap({ address }: { address: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "ready" | "error">("idle");
  const containerId = `daumRoughmapContainer${kakaoMap.timestamp}`;

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    let cancelled = false;

    // 지도 영역이 화면 근처에 올 때만 로드
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        loadLander()
          .then(() => {
            const container = document.getElementById(containerId);
            if (cancelled || !container || container.childElementCount > 0) return;
            new window.daum!.roughmap!.Lander!({
              timestamp: kakaoMap.timestamp,
              key: kakaoMap.key,
              mapWidth: String(Math.round(container.clientWidth)),
              mapHeight: String(kakaoMap.height),
            }).render();
            setState("ready");
          })
          .catch(() => !cancelled && setState("error"));
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(wrap);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [containerId]);

  const searchUrl = `https://map.kakao.com/?q=${encodeURIComponent(address)}`;

  return (
    <div
      ref={wrapRef}
      className="relative overflow-hidden rounded-3xl bg-navy-100 shadow-xl ring-1 ring-black/5"
      style={{ minHeight: kakaoMap.height }}
    >
      <div id={containerId} className="root_daum_roughmap root_daum_roughmap_landing" />
      {state !== "ready" && (
        <a
          href={searchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 grid place-items-center text-center text-navy-700"
        >
          <span>
            <span className="block text-sm">
              {state === "error" ? "지도를 불러오지 못했습니다." : "지도를 불러오는 중입니다…"}
            </span>
            <span className="mt-2 block text-sm font-bold underline underline-offset-4">카카오맵에서 보기 ↗</span>
          </span>
        </a>
      )}
    </div>
  );
}
