"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "@/components/SectionHeading";
import { timeline } from "@/data/content";

gsap.registerPlugin(ScrollTrigger);

export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: listRef.current,
              start: "top 72%",
              end: "bottom 78%",
              scrub: 0.6,
            },
          },
        );
      }

      const items = listRef.current?.querySelectorAll("[data-moment]");
      if (!items?.length) return;

      items.forEach((item) => {
        const fromLeft = item.getAttribute("data-side") === "left";
        gsap.from(item, {
          x: fromLeft ? -70 : 70,
          opacity: 0,
          filter: "blur(8px)",
          duration: 1,
          ease: "power3.out",
          clearProps: "transform,opacity,filter",
          scrollTrigger: {
            trigger: item,
            start: "top 84%",
            once: true,
          },
        });
      });

      gsap.to("[data-story-star]", {
        yPercent: -60,
        rotate: 45,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="story"
      className="relative overflow-hidden bg-linear-to-b from-cream via-blush to-white px-6 py-24 sm:py-32"
    >
      <div
        data-story-star
        aria-hidden
        className="pointer-events-none absolute top-24 right-6 text-[7rem] leading-none text-petal/70 select-none sm:text-[10rem]"
      >
        ✦
      </div>
      <div
        data-story-star
        aria-hidden
        className="pointer-events-none absolute bottom-32 left-4 text-[6rem] leading-none text-lilac/70 select-none sm:text-[8rem]"
      >
        ✧
      </div>

      <div className="relative mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="our story so far"
          title="every chapter"
          script="still worth keeping"
          description="No scoreboard, no winner. Just the honest version of how it went, and where it goes from here."
        />

        <ol ref={listRef} className="relative mt-16">
          <div className="absolute top-0 bottom-0 left-5 w-0.5 bg-petal/70 sm:left-1/2 sm:-translate-x-1/2" />
          <div
            ref={lineRef}
            className="absolute top-0 bottom-0 left-5 w-0.5 origin-top bg-linear-to-b from-rose via-rose-deep to-gold shadow-[0_0_18px_rgba(226,112,154,0.7)] sm:left-1/2 sm:-translate-x-1/2"
          />

          <div className="flex flex-col gap-12">
            {timeline.map((moment, index) => {
              const side = index % 2 === 0 ? "left" : "right";
              const isLeft = side === "left";
              return (
                <li
                  key={moment.title}
                  data-moment
                  data-side={side}
                  className="relative pl-14 sm:pl-0"
                >
                  <span className="absolute top-1 left-5 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border-4 border-white bg-linear-to-br from-rose to-rose-deep text-lg shadow-[0_10px_22px_-10px_rgba(226,112,154,0.95)] sm:left-1/2">
                    {moment.emoji}
                  </span>

                  <div
                    className={`sm:w-[calc(50%-2.75rem)] ${
                      isLeft ? "sm:mr-auto sm:text-right" : "sm:ml-auto"
                    }`}
                  >
                    <div className="inline-flex items-center gap-2 rounded-full border border-petal bg-white/85 px-3 py-1 text-[10px] font-bold tracking-[0.25em] text-rose-deep uppercase">
                      <span className="text-gold">✦</span>
                      {moment.tag}
                    </div>
                    <div className="mt-3 rounded-[1.6rem] border border-petal bg-white/85 p-5 shadow-[0_30px_55px_-42px_rgba(226,112,154,0.95)] backdrop-blur transition-all duration-500 hover:-translate-y-1 hover:border-rose hover:shadow-[0_38px_66px_-36px_rgba(226,112,154,0.95)] sm:p-6">
                      <h3 className="font-display text-xl font-black text-ink sm:text-2xl">
                        {moment.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                        {moment.text}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </div>
        </ol>
      </div>
    </section>
  );
}
