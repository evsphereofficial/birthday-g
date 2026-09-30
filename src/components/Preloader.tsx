"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { birthday } from "@/data/content";

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const duration = 2300;
    const start = performance.now();
    let raf = 0;
    let finished = false;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else if (!finished) {
        finished = true;
        window.setTimeout(() => {
          document.body.style.overflow = previousOverflow;
          onDone();
        }, 420);
      }
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = previousOverflow;
    };
  }, [onDone]);

  const letters = birthday.shortName.split("");

  return (
    <motion.div
      className="fixed inset-0 z-[120] flex items-center justify-center overflow-hidden bg-cream"
      exit={{ y: "-102%" }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="pointer-events-none absolute -top-32 -left-24 h-80 w-80 rounded-full bg-petal/70 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 -bottom-32 h-96 w-96 rounded-full bg-lilac/70 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 right-1/4 h-64 w-64 rounded-full bg-cream-deep blur-3xl" />

      <div className="relative flex flex-col items-center gap-8 px-6 text-center">
        <motion.div
          className="text-6xl animate-bounce-soft"
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 12 }}
        >
          🎂
        </motion.div>

        <div className="flex overflow-hidden">
          {letters.map((letter, index) => (
            <motion.span
              key={`${letter}-${index}`}
              className="font-display text-5xl font-black text-rose-deep sm:text-7xl"
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{
                delay: 0.15 + index * 0.07,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        <div className="w-64 sm:w-80">
          <div className="h-2.5 w-full overflow-hidden rounded-full border border-petal bg-white">
            <div
              className="h-full rounded-full bg-linear-to-r from-rose via-rose-deep to-gold transition-[width] duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs font-bold tracking-[0.3em] text-muted-foreground uppercase">
            <span>loading joy</span>
            <span className="text-rose-deep">{progress}%</span>
          </div>
        </div>

        <p className="font-script text-2xl text-ink/70">
          something soft is being made for you
        </p>
      </div>

      <div className="absolute right-6 bottom-6 animate-sparkle text-gold">✦</div>
      <div className="animate-sparkle absolute top-8 left-8 text-petal [animation-delay:0.8s]">
        ✦
      </div>
      <div className="animate-sparkle absolute bottom-16 left-16 text-rose [animation-delay:1.4s]">
        ✦
      </div>
    </motion.div>
  );
}
