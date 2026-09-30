"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "@/components/SectionHeading";
import { gallery } from "@/data/content";

gsap.registerPlugin(ScrollTrigger);

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const items = gridRef.current?.querySelectorAll("[data-polaroid]");
      if (!items?.length) return;

      gsap.from(items, {
        y: 90,
        opacity: 0,
        scale: 0.9,
        duration: 1,
        stagger: 0.11,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: gridRef.current, start: "top 80%", once: true },
      });

      items.forEach((item, index) => {
        gsap.to(item, {
          yPercent: index % 2 === 0 ? -7 : 7,
          ease: "none",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="relative overflow-hidden bg-linear-to-b from-white via-cream to-blush px-6 py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(#ffd9e6_1.5px,transparent_1.5px)] [background-size:28px_28px]" />

      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="the photo wall"
          title="moments worth"
          script="pinning to the fridge"
          description="Drop your real photos into /public/photos and they will appear right here. For now these are holding your spot with style."
        />

        <div
          ref={gridRef}
          className="mt-14 grid auto-rows-[150px] grid-cols-2 gap-4 sm:auto-rows-[175px] sm:gap-5 md:grid-cols-4 lg:auto-rows-[195px]"
        >
          {gallery.map((item) => (
            <figure
              key={item.caption}
              data-polaroid
              style={{ rotate: item.rotate }}
              className={`group relative overflow-hidden rounded-2xl border-[10px] border-white bg-white shadow-[0_30px_55px_-40px_rgba(226,112,154,0.95)] transition-all duration-500 hover:rotate-0! hover:scale-[1.035] hover:shadow-[0_42px_70px_-34px_rgba(226,112,154,0.95)] ${item.span}`}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(140deg, ${item.from} 0%, ${item.to} 100%)`,
                }}
              >
                {item.img ? (
                  <Image
                    src={item.img}
                    alt={item.caption}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-5xl transition-transform duration-500 group-hover:scale-125 group-hover:-rotate-12 sm:text-7xl">
                    {item.emoji}
                  </span>
                )}
              </div>

              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/70 to-transparent transition-transform duration-1000 group-hover:translate-x-full"
              />

              <figcaption className="absolute inset-x-0 bottom-0 translate-y-full bg-white/92 px-3 py-2.5 backdrop-blur transition-transform duration-500 group-hover:translate-y-0">
                <span className="block font-display text-sm font-black text-ink sm:text-base">
                  {item.caption}
                </span>
                <span className="block text-[11px] text-rose-deep">
                  {item.note}
                </span>
              </figcaption>

              <span className="pointer-events-none absolute -top-1 right-2 text-xs text-gold opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                ✦
              </span>
            </figure>
          ))}
        </div>

        <p className="mt-8 text-center text-xs tracking-[0.25em] text-muted-foreground uppercase">
          {gallery.length} memories · more being added
        </p>
      </div>
    </section>
  );
}
