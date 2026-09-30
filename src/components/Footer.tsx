"use client";

import { motion } from "framer-motion";
import { birthday } from "@/data/content";
import { starCannons } from "@/lib/confetti";

const FLOATERS = [
  { left: "8%", delay: 0, glyph: "❤", size: 26 },
  { left: "22%", delay: 2.4, glyph: "✦", size: 20 },
  { left: "38%", delay: 1.2, glyph: "🎀", size: 24 },
  { left: "55%", delay: 3.6, glyph: "⭐", size: 18 },
  { left: "70%", delay: 0.8, glyph: "❤", size: 22 },
  { left: "86%", delay: 4.4, glyph: "🌸", size: 26 },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-linear-to-b from-cream to-petal/70 pt-20 pb-10">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-72 opacity-40 [background-image:radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:26px_26px]" />

      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-56 overflow-hidden">
        {FLOATERS.map((floater, index) => (
          <motion.span
            key={index}
            className="absolute bottom-0 text-rose-deep/70"
            style={{ left: floater.left, fontSize: floater.size }}
            animate={{ y: [40, -260], opacity: [0, 1, 0], rotate: [0, 40] }}
            transition={{
              duration: 9,
              delay: floater.delay,
              repeat: Infinity,
              ease: "easeOut",
            }}
          >
            {floater.glyph}
          </motion.span>
        ))}
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-3"
        >
          <span className="text-xs font-bold tracking-[0.4em] text-rose-deep uppercase">
            ✦ {birthday.dateLabel} · {birthday.yearTag} ✦
          </span>
          <h2 className="font-script text-6xl leading-none text-ink sm:text-7xl md:text-8xl">
            happy birthday
          </h2>
          <p className="font-display text-3xl leading-none font-black tracking-tight text-rose-deep uppercase sm:text-5xl md:text-6xl">
            Gianna Ztar Fang
          </p>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            May this year be gentle, a little silly, full of good food and
            people who actually stay kind. You are allowed to start over
            whenever you want.
          </p>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <motion.button
            type="button"
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => starCannons()}
            className="group flex items-center gap-3 rounded-full bg-linear-to-r from-rose-deep to-rose px-6 py-3 text-xs font-bold tracking-[0.25em] text-white uppercase shadow-[0_20px_40px_-26px_rgba(226,112,154,1)] transition-colors hover:brightness-105"
          >
            one last confetti
            <span className="transition-transform duration-300 group-hover:rotate-12">
              🎊
            </span>
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex items-center gap-3 rounded-full border-2 border-white bg-white/80 px-6 py-3 text-xs font-bold tracking-[0.25em] text-rose-deep uppercase shadow-[0_20px_40px_-26px_rgba(226,112,154,1)] backdrop-blur transition-colors hover:bg-white"
          >
            back to the top
            <span className="transition-transform duration-300 group-hover:-translate-y-1">
              ↑
            </span>
          </motion.button>
        </div>

        <div className="mt-4 flex flex-col items-center gap-3 border-t border-white/70 pt-6 w-full">
          <p className="text-[10px] leading-relaxed tracking-[0.2em] text-muted-foreground uppercase">
            next.js · gsap · framer-motion · three.js · shadcn/ui · a
            suspicious amount of pink
          </p>
          <p className="font-script text-2xl text-rose-deep/80">
            made with a lot of care, and even more animation ✦
          </p>
        </div>
      </div>
    </footer>
  );
}
