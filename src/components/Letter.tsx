"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { letterParagraphs, signature } from "@/data/content";
import { sparkleBurst } from "@/lib/confetti";

export default function Letter() {
  const [open, setOpen] = useState(false);

  return (
    <section
      id="letter"
      className="relative overflow-hidden bg-linear-to-b from-blush via-white to-cream px-6 py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute top-10 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-petal/50 blur-3xl" />
      <div className="animate-drift pointer-events-none absolute top-32 left-10 text-6xl">
        💌
      </div>
      <div
        className="animate-drift pointer-events-none absolute right-12 bottom-24 text-6xl"
        style={{ animationDelay: "3s" }}
      >
        ✦
      </div>

      <div className="relative mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="one page, no takebacks"
          title="a letter for"
          script="gianna"
          description="Written plainly, the way you always preferred. Click the seal when you are ready."
        />

        <div className="mt-14 flex justify-center">
          <AnimatePresence mode="wait" initial={false}>
            {!open ? (
              <motion.div
                key="envelope"
                initial={{ opacity: 0, y: 30, rotate: -3 }}
                animate={{ opacity: 1, y: 0, rotate: -1.5 }}
                exit={{ opacity: 0, y: -40, scale: 0.9, rotate: 6 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-xl"
              >
                <div className="paper relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-petal">
                  <div className="absolute inset-0 bg-linear-to-br from-white to-blush" />
                  <div
                    className="absolute inset-x-0 top-0 h-1/2 origin-top bg-linear-to-b from-cream-deep to-white/90"
                    style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
                  />
                  <div
                    className="absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-petal/80 to-white/70"
                    style={{ clipPath: "polygon(0 100%, 100% 100%, 50% 0)" }}
                  />
                  <div className="absolute inset-x-0 bottom-16 flex flex-col items-center gap-2 px-6 text-center">
                    <span className="font-display text-lg font-black tracking-[0.2em] text-ink uppercase sm:text-xl">
                      for gianna
                    </span>
                    <span className="text-xs tracking-[0.3em] text-rose-deep uppercase">
                      sealed · do not open before oct 1
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(true);
                      sparkleBurst({ x: 0.5, y: 0.5 });
                    }}
                    className="group absolute top-1/2 left-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white/80 bg-linear-to-br from-rose to-rose-deep text-3xl shadow-[0_20px_40px_-18px_rgba(226,112,154,1)] transition-transform duration-300 hover:scale-110 hover:rotate-12 focus-visible:scale-110 focus-visible:outline-none"
                    aria-label="Open the letter"
                  >
                    <span className="transition-transform duration-500 group-hover:rotate-[20deg]">
                      ✦
                    </span>
                  </button>
                </div>
                <p className="mt-5 text-center font-script text-3xl text-ink/70">
                  tap the wax seal
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="paper"
                initial={{ opacity: 0, y: 50, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 40, scale: 0.96 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="paper tape relative w-full rounded-[2rem] border border-petal px-6 pt-14 pb-10 sm:px-12 sm:pt-16 sm:pb-12"
              >
                <div className="pointer-events-none absolute inset-6 hidden rounded-[1.4rem] border border-dashed border-petal/80 sm:block" />

                <div className="relative flex flex-col gap-5">
                  {letterParagraphs.map((paragraph, index) => (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + index * 0.12, duration: 0.6 }}
                      className={`text-[15px] leading-relaxed text-ink/85 sm:text-lg ${
                        index === 0 ? "font-display text-xl font-bold text-ink sm:text-2xl" : ""
                      }`}
                    >
                      {paragraph}
                    </motion.p>
                  ))}

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      delay: 0.2 + letterParagraphs.length * 0.12,
                      duration: 0.8,
                    }}
                    className="mt-2 font-script text-3xl text-rose-deep sm:text-4xl"
                  >
                    {signature}
                  </motion.p>
                </div>

                <div className="relative mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-petal pt-6">
                  <span className="text-[10px] font-bold tracking-[0.3em] text-muted-foreground uppercase">
                    written in one sitting · no edits
                  </span>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-full border border-petal bg-white/85 px-5 py-2.5 text-xs font-bold tracking-[0.2em] text-rose-deep uppercase transition-all duration-300 hover:-translate-y-0.5 hover:border-rose hover:bg-white"
                  >
                    fold it back ✦
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Reveal delay={0.2} className="mt-10 flex justify-center">
          <div className="flex items-center gap-3 rounded-full border border-petal bg-white/80 px-5 py-3 text-sm text-muted-foreground">
            <span className="animate-sparkle text-gold">✦</span>
            nothing here is a scorecard — it is just a birthday
          </div>
        </Reveal>
      </div>
    </section>
  );
}
