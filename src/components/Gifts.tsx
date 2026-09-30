"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "@/components/SectionHeading";
import { gifts } from "@/data/content";
import { sparkleBurst } from "@/lib/confetti";

gsap.registerPlugin(ScrollTrigger);

export default function Gifts() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [opened, setOpened] = useState<number[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll("[data-gift]");
      if (!cards?.length) return;

      gsap.from(cards, {
        y: 80,
        opacity: 0,
        rotateY: -35,
        transformPerspective: 900,
        duration: 1,
        stagger: 0.12,
        ease: "back.out(1.4)",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: gridRef.current, start: "top 82%", once: true },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const toggle = (index: number) => {
    setOpened((current) => {
      const isOpen = current.includes(index);
      if (isOpen) return current.filter((value) => value !== index);
      sparkleBurst({ x: 0.5, y: 0.6 });
      return [...current, index];
    });
  };

  const allOpen = opened.length === gifts.length;

  return (
    <section
      ref={sectionRef}
      id="gifts"
      className="relative overflow-hidden bg-linear-to-b from-white via-blush to-white px-6 py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-lilac/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-petal/60 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="six little parcels"
          title="things I am"
          script="wrapping for you"
          description="Tap a box to tear the paper off. None of them are refundable, all of them are yours to keep."
        />

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => {
              if (allOpen) {
                setOpened([]);
              } else {
                setOpened(gifts.map((_, index) => index));
                sparkleBurst({ x: 0.5, y: 0.5 });
              }
            }}
            className="rounded-full border-2 border-petal bg-white/85 px-6 py-3 text-xs font-bold tracking-[0.25em] text-rose-deep uppercase transition-all duration-300 hover:-translate-y-0.5 hover:border-rose hover:bg-white"
          >
            {allOpen ? "wrap them back up" : "open everything at once"}
          </button>
        </div>

        <div
          ref={gridRef}
          className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {gifts.map((gift, index) => {
            const isOpen = opened.includes(index);
            return (
              <div key={gift.title} data-gift className="h-[280px] [perspective:1200px]">
                <motion.button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-pressed={isOpen}
                  className="relative h-full w-full cursor-pointer text-left outline-none"
                  animate={{ rotateY: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <span
                    className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-[1.8rem] border border-white/70 p-6 text-center shadow-[0_34px_60px_-40px_rgba(226,112,154,1)] transition-transform duration-300 hover:-translate-y-1 [backface-visibility:hidden]"
                    style={{
                      background: `linear-gradient(150deg, ${gift.from} 0%, ${gift.to} 100%)`,
                    }}
                  >
                    <span
                      aria-hidden
                      className="absolute inset-x-0 top-1/2 h-8 -translate-y-1/2 opacity-70"
                      style={{ background: gift.ribbon }}
                    />
                    <span
                      aria-hidden
                      className="absolute inset-y-0 left-1/2 w-8 -translate-x-1/2 opacity-70"
                      style={{ background: gift.ribbon }}
                    />
                    <span className="relative grid h-24 w-24 place-items-center rounded-full bg-white/90 text-5xl shadow-lg transition-transform duration-500 hover:scale-110 hover:rotate-12">
                      {gift.emoji}
                    </span>
                    <span className="relative rounded-full bg-white/85 px-4 py-1.5 text-[10px] font-bold tracking-[0.3em] text-ink uppercase">
                      tap to unwrap
                    </span>
                    <span className="pointer-events-none absolute top-4 right-4 text-xl text-white/90">
                      ✦
                    </span>
                  </span>

                  <span
                    className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[1.8rem] border-2 border-white bg-white/95 p-6 text-center shadow-[0_34px_60px_-40px_rgba(226,112,154,1)] [backface-visibility:hidden]"
                    style={{ transform: "rotateY(180deg)" }}
                  >
                    <span className="text-4xl">{gift.emoji}</span>
                    <span className="font-display text-xl font-black text-ink">
                      {gift.title}
                    </span>
                    <span className="text-sm leading-relaxed text-muted-foreground">
                      {gift.text}
                    </span>
                    <span className="mt-1 text-[10px] font-bold tracking-[0.3em] text-rose-deep uppercase">
                      gift {index + 1} of {gifts.length} · tap to close
                    </span>
                  </span>
                </motion.button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
