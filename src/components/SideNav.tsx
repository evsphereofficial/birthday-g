"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { sections } from "@/data/content";

export default function SideNav() {
  const [active, setActive] = useState<string>(sections[0].id);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const marker = window.innerHeight * 0.4;
      let current = sections[0].id;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (!element) continue;
        if (element.getBoundingClientRect().top <= marker) current = section.id;
      }

      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 6) {
        current = sections[sections.length - 1].id;
      }

      setActive((previous) => (previous === current ? previous : current));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <nav className="fixed top-1/2 right-4 z-[80] hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex">
      {sections.map((section) => {
        const isActive = active === section.id;
        return (
          <button
            key={section.id}
            type="button"
            onClick={() =>
              document
                .getElementById(section.id)
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            className="group flex items-center gap-3 outline-none"
            aria-label={`Jump to ${section.label}`}
            aria-current={isActive ? "true" : undefined}
          >
            <AnimatePresence>
              {isActive ? (
                <motion.span
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  className="rounded-full border border-petal bg-white/85 px-3 py-1 text-[10px] font-bold tracking-[0.22em] text-rose-deep uppercase shadow-sm backdrop-blur"
                >
                  {section.label}
                </motion.span>
              ) : (
                <span className="rounded-full bg-white/70 px-3 py-1 text-[10px] font-bold tracking-[0.22em] text-ink/40 uppercase opacity-0 transition-all duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  {section.label}
                </span>
              )}
            </AnimatePresence>
            <span
              className={`block rounded-full transition-all duration-300 ${
                isActive
                  ? "h-6 w-2.5 bg-linear-to-b from-rose to-rose-deep"
                  : "h-2.5 w-2.5 bg-petal group-hover:bg-rose"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
