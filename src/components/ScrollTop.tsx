"use client";

import { useEffect, useState } from "react";
import Icon from "./Icon";

export default function ScrollTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="맨 위로"
      onClick={() => window.scrollTo({ top: 0 })}
      className={`fixed right-5 bottom-5 z-40 grid size-12 place-items-center rounded-full bg-navy-800 text-white shadow-lg transition-all duration-300 hover:bg-brand-600 md:right-8 md:bottom-8 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <Icon name="arrowUp" className="size-5" />
    </button>
  );
}
