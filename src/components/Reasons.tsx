"use client";

import { useLayoutEffect, useRef, type MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "@/components/SectionHeading";
import { reasons } from "@/data/content";

gsap.registerPlugin(ScrollTrigger);

export default function Reasons() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll("[data-reason]");
      if (!cards?.length) return;

      gsap.set(cards, { transformPerspective: 900 });

      ScrollTrigger.batch(cards, {
        start: "top 86%",
        once: true,
        onEnter: (batch) =>
          gsap.from(batch, {
            y: 70,
            opacity: 0,
            rotateX: -14,
            scale: 0.96,
            duration: 0.95,
            stagger: 0.09,
            ease: "power3.out",
            clearProps: "transform,opacity",
          }),
      });

      gsap.to("[data-reason-float]", {
        yPercent: -22,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(1000px) rotateX(${(-y * 10).toFixed(2)}deg) rotateY(${(x * 14).toFixed(2)}deg) translateY(-10px) scale(1.02)`;
    card.style.setProperty("--gx", `${((x + 0.5) * 100).toFixed(1)}%`);
    card.style.setProperty("--gy", `${((y + 0.5) * 100).toFixed(1)}%`);
  };

  const handleLeave = (event: MouseEvent<HTMLDivElement>) => {
    const card = event.currentTarget;
    card.style.transform = "";
    card.style.setProperty("--gx", "50%");
    card.style.setProperty("--gy", "50%");
  };

  return (
    <section
      ref={sectionRef}
      id="reasons"
      className="relative overflow-hidden bg-linear-to-b from-blush via-white to-cream px-6 py-24 sm:py-32"
    >
      <div
        data-reason-float
        aria-hidden
        className="pointer-events-none absolute top-16 -left-10 text-[10rem] leading-none text-petal/60 select-none"
      >
        ✦
      </div>
      <div
        data-reason-float
        aria-hidden
        className="pointer-events-none absolute -right-6 bottom-10 text-[8rem] leading-none text-lilac/70 select-none"
      >
        ✧
      </div>

      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="a short list"
          title="twelve whole reasons"
          script="you are a big deal"
          description="There were going to be a hundred, but the page would have needed a loading dock. Consider this the highlights reel."
        />

        <div
          ref={gridRef}
          className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {reasons.map((reason, index) => {
            const wide = index % 5 === 0 || index === reasons.length - 1;
            return (
              <div
                key={reason.title}
                data-reason
                onMouseMove={handleMove}
                onMouseLeave={handleLeave}
                className={`group relative overflow-hidden rounded-[1.8rem] border border-petal bg-white/85 p-6 shadow-[0_28px_55px_-40px_rgba(226,112,154,0.9)] backdrop-blur transition-[box-shadow,border-color] duration-300 will-change-transform hover:border-rose hover:shadow-[0_38px_70px_-34px_rgba(226,112,154,0.95)] sm:p-7 ${
                  wide ? "lg:col-span-2" : ""
                }`}
                style={{
                  "--gx": "50%",
                  "--gy": "50%",
                  transitionProperty: "box-shadow, border-color, transform",
                } as React.CSSProperties}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(340px circle at var(--gx) var(--gy), rgba(247,155,185,0.28), transparent 62%)",
                  }}
                />
                <div className="relative flex items-start gap-4">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-petal to-cream-deep text-2xl shadow-inner transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110">
                    {reason.emoji}
                  </span>
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold tracking-[0.3em] text-rose-deep uppercase">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-xl leading-tight font-black text-ink sm:text-2xl">
                      {reason.title}
                    </h3>
                  </div>
                </div>
                <p className="relative mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {reason.text}
                </p>
                <span className="pointer-events-none absolute right-5 bottom-5 text-lg text-gold opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:rotate-90">
                  ✦
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
