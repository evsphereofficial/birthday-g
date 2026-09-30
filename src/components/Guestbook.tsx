"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { seedWishes, type Wish } from "@/data/content";
import { sparkleBurst } from "@/lib/confetti";

const STORAGE_KEY = "gianna-birthday-wishes-v1";
const EMOJIS = ["🌸", "🎀", "✨", "🎂", "🕯️", "⭐", "🍰", "🫶", "💫", "🌷"];
const TINTS = ["#ffe9f1", "#e9ddf7", "#fff1e7", "#d9f2e6", "#ffeef4", "#fff6d8"];

function makeWish(name: string, message: string): Wish {
  return {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `wish-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name,
    message,
    emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    tint: TINTS[Math.floor(Math.random() * TINTS.length)],
  };
}

export default function Guestbook() {
  const [wishes, setWishes] = useState<Wish[]>(seedWishes);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as Wish[];
          if (Array.isArray(parsed) && parsed.length) setWishes(parsed);
        }
      } catch {
        /* ignore broken storage */
      }
      setHydrated(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));
    } catch {
      /* ignore quota errors */
    }
  }, [wishes, hydrated]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;
    const wish = makeWish(name.trim() || "anonymous star", trimmed);
    setWishes((current) => [wish, ...current]);
    setMessage("");
    sparkleBurst({ x: 0.5, y: 0.75 });
  };

  const remove = (id: string) => {
    setWishes((current) => current.filter((wish) => wish.id !== id));
  };

  return (
    <section
      id="wishes"
      className="relative overflow-hidden bg-linear-to-b from-blush via-white to-cream px-6 py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute -right-20 top-16 h-72 w-72 rounded-full bg-petal/60 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-10 h-64 w-64 rounded-full bg-lilac/50 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="the wish wall"
          title="leave her"
          script="a little note"
          description="Sign it, keep it anonymous, be sweet. Notes are saved right here on this device."
        />

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <form
            onSubmit={submit}
            className="rounded-[2rem] border border-petal bg-white/85 p-6 shadow-[0_34px_60px_-42px_rgba(226,112,154,0.95)] backdrop-blur sm:p-7"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-linear-to-br from-petal to-cream-deep text-xl">
                ✍️
              </span>
              <div>
                <h3 className="font-display text-lg font-black text-ink">
                  write something kind
                </h3>
                <p className="text-xs text-muted-foreground">
                  it will show up on the wall instantly
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-4">
              <label className="flex flex-col gap-2 text-xs font-bold tracking-[0.2em] text-rose-deep uppercase">
                your name
                <Input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="anonymous star"
                  maxLength={28}
                  className="h-12 rounded-xl border-petal bg-blush/60 text-base text-ink placeholder:text-muted-foreground/70 focus-visible:border-rose focus-visible:ring-rose/40"
                />
              </label>

              <label className="flex flex-col gap-2 text-xs font-bold tracking-[0.2em] text-rose-deep uppercase">
                your wish
                <Textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="happy birthday gianna, here is to a softer year..."
                  rows={5}
                  maxLength={280}
                  className="resize-none rounded-xl border-petal bg-blush/60 text-base text-ink placeholder:text-muted-foreground/70 focus-visible:border-rose focus-visible:ring-rose/40"
                />
              </label>

              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] tabular-nums text-muted-foreground">
                  {message.length}/280
                </span>
                <Button
                  type="submit"
                  disabled={!message.trim()}
                  className="h-12 rounded-full bg-linear-to-r from-rose-deep to-rose px-7 text-sm font-bold text-white shadow-[0_16px_30px_-16px_rgba(226,112,154,1)] transition-transform duration-300 hover:scale-105 disabled:opacity-60"
                >
                  pin it to the wall ✦
                </Button>
              </div>
            </div>
          </form>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AnimatePresence initial={false}>
              {wishes.map((wish, index) => (
                <motion.article
                  key={wish.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: -14 }}
                  transition={{ type: "spring", stiffness: 240, damping: 22 }}
                  className={`group relative overflow-hidden rounded-3xl border border-white/70 p-5 shadow-[0_26px_50px_-38px_rgba(226,112,154,1)] ${
                    index % 5 === 4 ? "sm:col-span-2" : ""
                  }`}
                  style={{
                    background: `linear-gradient(150deg, ${wish.tint} 0%, #ffffff 130%)`,
                    rotate: `${(index % 2 === 0 ? -1 : 1) * (1 + (index % 3))}deg`,
                  }}
                >
                  <span className="absolute -top-3 left-1/2 h-7 w-20 -translate-x-1/2 -rotate-3 rounded-sm bg-white/55 backdrop-blur-[1px]" />
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-2xl">{wish.emoji}</span>
                    <button
                      type="button"
                      onClick={() => remove(wish.id)}
                      aria-label="Remove this wish"
                      className="text-xs text-ink/25 opacity-0 transition-all duration-300 group-hover:opacity-100 hover:text-rose-deep"
                    >
                      remove
                    </button>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink/85">
                    {wish.message}
                  </p>
                  <p className="mt-3 font-script text-xl text-rose-deep">
                    — {wish.name}
                  </p>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
