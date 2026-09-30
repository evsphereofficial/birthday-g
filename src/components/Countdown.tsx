"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { birthday } from "@/data/content";
import { sparkleBurst } from "@/lib/confetti";

type Parts = { days: number; hours: number; minutes: number; seconds: number };

function isHerDay(now: Date) {
  return now.getMonth() === birthday.month && now.getDate() === birthday.day;
}

function nextOccurrence(now: Date) {
  const thisYear = new Date(now.getFullYear(), birthday.month, birthday.day, 0, 0, 0, 0);
  if (now >= thisYear) {
    return new Date(now.getFullYear() + 1, birthday.month, birthday.day, 0, 0, 0, 0);
  }
  return thisYear;
}

function getParts(target: Date): Parts {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function Digits({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, "0");

  return (
    <div className="group relative flex flex-col items-center gap-2 rounded-3xl border border-petal bg-white/80 px-4 py-5 shadow-[0_24px_50px_-32px_rgba(226,112,154,0.65)] backdrop-blur transition-all duration-500 hover:-translate-y-1.5 hover:border-rose hover:shadow-[0_30px_60px_-30px_rgba(226,112,154,0.85)] sm:px-6 sm:py-6">
      <span className="pointer-events-none absolute -top-3 right-4 text-xs text-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        ✦
      </span>
      <span className="relative block h-12 w-full overflow-hidden sm:h-16">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={display}
            initial={{ y: "100%", opacity: 0, rotateX: -70 }}
            animate={{ y: "0%", opacity: 1, rotateX: 0 }}
            exit={{ y: "-100%", opacity: 0, rotateX: 70 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex items-center justify-center font-display text-4xl font-black text-ink tabular-nums sm:text-6xl"
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="text-[10px] font-bold tracking-[0.3em] text-rose-deep uppercase sm:text-xs">
        {label}
      </span>
    </div>
  );
}

export default function Countdown() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setNow(new Date()));
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(timer);
    };
  }, []);

  const today = now ? isHerDay(now) : false;
  const target = now ? nextOccurrence(now) : null;
  const parts = target ? getParts(target) : { days: 0, hours: 0, minutes: 0, seconds: 0 };

  const lastBirthday = now
    ? new Date(now.getFullYear() - (isHerDay(now) || now < new Date(now.getFullYear(), birthday.month, birthday.day) ? 1 : 0), birthday.month, birthday.day)
    : null;
  const nextBirthday = now ? nextOccurrence(now) : null;

  let yearProgress = 0;
  if (lastBirthday && nextBirthday) {
    const span = nextBirthday.getTime() - lastBirthday.getTime();
    const elapsed = now!.getTime() - lastBirthday.getTime();
    yearProgress = Math.min(1, Math.max(0, elapsed / span));
  }

  const circumference = 2 * Math.PI * 78;
  const dashOffset = circumference * (1 - yearProgress);

  return (
    <section
      id="countdown"
      className="relative overflow-hidden bg-linear-to-b from-cream via-white to-blush px-6 py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[720px] -translate-x-1/2 rounded-full bg-petal/50 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="the countdown"
          title="until the"
          script="ztar turns another page"
          description="1st October. One day a year the whole calendar quietly belongs to you."
        />

        <div className="mt-14 grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal className="flex justify-center">
            <div className="relative">
              <svg width="200" height="200" viewBox="0 0 200 200" className="-rotate-90">
                <circle
                  cx="100"
                  cy="100"
                  r="78"
                  fill="none"
                  stroke="#ffe9f1"
                  strokeWidth="16"
                />
                <motion.circle
                  cx="100"
                  cy="100"
                  r="78"
                  fill="none"
                  stroke="url(#yearGradient)"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: dashOffset }}
                  transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                />
                <defs>
                  <linearGradient id="yearGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#f79bb9" />
                    <stop offset="55%" stopColor="#e2709a" />
                    <stop offset="100%" stopColor="#e9c48a" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-display text-4xl font-black text-ink">
                  {Math.round(yearProgress * 100)}%
                </span>
                <span className="mt-1 max-w-[9rem] text-[10px] font-bold tracking-[0.2em] text-rose-deep uppercase">
                  of her year complete
                </span>
              </div>
              <span className="animate-sparkle absolute top-2 right-4 text-xl text-gold">✦</span>
              <span className="animate-sparkle absolute bottom-6 left-2 text-lg text-rose [animation-delay:1s]">
                ✦
              </span>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            <Digits value={parts.days} label="days" />
            <Digits value={parts.hours} label="hours" />
            <Digits value={parts.minutes} label="minutes" />
            <Digits value={parts.seconds} label="seconds" />
          </div>
        </div>

        <Reveal delay={0.15} className="mt-12">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 rounded-[2rem] border border-petal bg-white/80 px-6 py-6 text-center shadow-[0_30px_60px_-40px_rgba(226,112,154,0.8)] backdrop-blur">
            {today ? (
              <>
                <p className="font-display text-2xl font-black text-rose-deep sm:text-3xl">
                  IT&apos;S HER DAY ✦
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  The countdown hit zero. Cake, balloons and far too many
                  animations: all officially unlocked.
                </p>
                <button
                  type="button"
                  onClick={() => sparkleBurst()}
                  className="rounded-full bg-linear-to-r from-rose-deep to-rose px-6 py-3 text-sm font-bold text-white shadow-[0_16px_30px_-14px_rgba(226,112,154,0.95)] transition-transform duration-300 hover:scale-105"
                >
                  release the confetti 🎊
                </button>
              </>
            ) : (
              <p className="font-script text-2xl text-ink/75 sm:text-3xl">
                {parts.days} days, {parts.hours} hours and {parts.minutes}{" "}
                minutes until {birthday.shortName}&apos;s day
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
