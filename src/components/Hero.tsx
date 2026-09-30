"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Balloons from "@/components/Balloons";
import { birthday, heroLines } from "@/data/content";
import { cakeWishBurst, sparkleBurst } from "@/lib/confetti";
import { createRng } from "@/lib/random";

const Cake3D = dynamic(() => import("@/components/Cake3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <span className="animate-bounce-soft text-7xl">🎂</span>
    </div>
  ),
});

const BIG_LETTERS = heroLines.big.split("");

export default function Hero({ ready }: { ready: boolean }) {
  const [blown, setBlown] = useState(false);
  const [wish, setWish] = useState<string | null>(null);

  const sparkles = useMemo(() => {
    const rng = createRng(31_100_101);
    return Array.from({ length: 46 }).map(() => ({
      left: rng() * 100,
      top: rng() * 100,
      size: 8 + rng() * 18,
      delay: rng() * 4,
      duration: 2 + rng() * 3,
      glyph: rng() > 0.45 ? "✦" : "✧",
    }));
  }, []);

  const handleBlow = () => {
    if (!blown) {
      setBlown(true);
      setWish("wish locked in — now go make it come true");
      cakeWishBurst();
    } else {
      setBlown(false);
      setWish(null);
      sparkleBurst();
    }
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col overflow-hidden bg-linear-to-b from-cream via-blush to-cream"
    >
      <div className="pointer-events-none absolute -top-40 -left-32 h-[420px] w-[420px] rounded-full bg-petal/70 blur-3xl" />
      <div className="pointer-events-none absolute top-1/4 -right-32 h-[460px] w-[460px] rounded-full bg-lilac/60 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-[380px] w-[380px] rounded-full bg-cream-deep blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(#f9b7cd_1px,transparent_1px)] [background-size:34px_34px] [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_72%)]" />

      <div aria-hidden className="pointer-events-none absolute inset-0">
        {sparkles.map((sparkle, index) => (
          <span
            key={index}
            className="animate-twinkle absolute text-rose select-none"
            style={{
              left: `${sparkle.left}%`,
              top: `${sparkle.top}%`,
              fontSize: sparkle.size,
              animationDelay: `${sparkle.delay}s`,
              animationDuration: `${sparkle.duration}s`,
              opacity: 0.6,
            }}
          >
            {sparkle.glyph}
          </span>
        ))}
      </div>

      <Balloons />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-center gap-6 px-6 pt-28 pb-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pt-32">
        <div className="flex flex-col items-start gap-6 text-center lg:text-left">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-petal bg-white/80 px-4 py-2 text-[11px] font-bold tracking-[0.3em] text-rose-deep uppercase backdrop-blur"
          >
            <span className="animate-sparkle text-gold">✦</span>
            {birthday.dateLabel} · {birthday.yearTag}
          </motion.span>

          <h1 className="flex flex-col gap-1">
            <motion.span
              initial={{ opacity: 0, y: 40, rotate: -6 }}
              animate={ready ? { opacity: 1, y: 0, rotate: -3 } : {}}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="font-script text-6xl leading-none text-ink/80 sm:text-7xl lg:text-8xl"
            >
              {heroLines.script}
            </motion.span>

            <span className="flex overflow-hidden py-1" aria-label={heroLines.big}>
              {BIG_LETTERS.map((letter, index) => (
                <motion.span
                  key={`${letter}-${index}`}
                  aria-hidden
                  className="font-display animate-gradient-x bg-linear-to-r from-rose-deep via-rose to-gold bg-clip-text text-6xl leading-[0.9] font-black text-transparent drop-soft sm:text-7xl md:text-8xl lg:text-[7.2rem]"
                  initial={{ y: "115%", opacity: 0 }}
                  animate={ready ? { y: "0%", opacity: 1 } : {}}
                  transition={{
                    duration: 0.95,
                    delay: 0.22 + index * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </span>

            <motion.span
              initial={{ opacity: 0, x: -30 }}
              animate={ready ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-3xl font-bold text-ink sm:text-4xl lg:text-5xl"
            >
              {heroLines.signature}
              <span className="ml-2 inline-block animate-sparkle text-gold">✦</span>
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.95 }}
            className="max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg lg:text-left"
          >
            {birthday.tagline}. Balloons, a countdown, a cake you can actually
            blow out, a letter and roughly nine hundred animations. Ready?
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:items-center lg:justify-start"
          >
            <Button
              onClick={handleBlow}
              className="group relative h-14 w-full overflow-hidden rounded-full bg-linear-to-r from-rose-deep to-rose px-8 text-base font-bold text-white shadow-[0_18px_35px_-14px_rgba(226,112,154,0.9)] transition-transform duration-300 hover:scale-105 sm:w-auto"
            >
              <span className="relative z-10">
                {blown ? "relight the candles ✦" : "blow out the candles 🕯️"}
              </span>
            </Button>
            <Button
              onClick={() =>
                document
                  .getElementById("countdown")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
              variant="outline"
              className="h-14 w-full rounded-full border-2 border-petal bg-white/80 px-8 text-base font-bold text-rose-deep backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-rose hover:bg-white sm:w-auto"
            >
              explore the website ↓
            </Button>
          </motion.div>

          <AnimatePresence>
            {wish ? (
              <motion.p
                key={wish}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="font-script text-2xl text-rose-deep"
              >
                {wish}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.86 }}
          animate={ready ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="relative mx-auto h-[340px] w-full max-w-[560px] sm:h-[420px] lg:h-[620px]">
            <div className="pointer-events-none absolute inset-x-8 top-10 bottom-16 rounded-[3rem] bg-linear-to-b from-white/70 to-petal/40 blur-[2px]" />
            <div className="relative h-full w-full">
              <Cake3D blown={blown} />
            </div>
          </div>

          <div className="pointer-events-none absolute right-0 bottom-6 h-28 w-28 animate-spin-slow sm:h-36 sm:w-36">
            <svg viewBox="0 0 200 200" className="h-full w-full">
              <defs>
                <path
                  id="circlePath"
                  d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0"
                  fill="none"
                />
              </defs>
              <text
                fill="#e2709a"
                fontSize="15.5"
                fontWeight="bold"
                letterSpacing="4"
                fontFamily="var(--font-quicksand), sans-serif"
              >
                <textPath href="#circlePath">
                  HAPPY BIRTHDAY · GIANNA ZTAR FANG · OCT 1 ·
                </textPath>
              </text>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-3xl">
              🎈
            </span>
          </div>
        </motion.div>
      </div>

      <motion.button
        type="button"
        onClick={() =>
          document
            .getElementById("countdown")
            ?.scrollIntoView({ behavior: "smooth", block: "start" })
        }
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="group relative z-10 mx-auto mb-8 flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-rose-deep"
      >
        <span className="text-[10px] font-bold tracking-[0.35em] uppercase">
          keep scrolling
        </span>
        <span className="flex h-11 w-7 items-start justify-center rounded-full border-2 border-petal bg-white/70 p-1.5">
          <span className="h-2.5 w-1 animate-bounce-soft rounded-full bg-rose" />
        </span>
      </motion.button>
    </section>
  );
}
