import { marqueeWords } from "@/data/content";

function Row({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={ariaHidden || undefined}>
      {marqueeWords.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="flex shrink-0 items-center gap-6 pr-6"
        >
          <span className="font-display text-xl font-black tracking-[0.16em] whitespace-nowrap uppercase sm:text-3xl">
            {word}
          </span>
          <span className="text-lg opacity-80">✦</span>
        </span>
      ))}
    </div>
  );
}

export default function Marquee({
  tone = "pink",
  tilt = "-1.5deg",
  reverse = false,
  speed = 34,
}: {
  tone?: "pink" | "cream" | "outline";
  tilt?: string;
  reverse?: boolean;
  speed?: number;
}) {
  const tones = {
    pink: "bg-linear-to-r from-rose to-rose-deep text-white border-y-4 border-white/40",
    cream: "bg-cream-deep text-rose-deep border-y-4 border-white/70",
    outline: "bg-white/70 text-rose border-y-4 border-petal",
  } as const;

  return (
    <div
      className={`relative w-full overflow-hidden py-4 ${tones[tone]}`}
      style={{ rotate: tilt }}
    >
      <div className="marquee-mask overflow-hidden">
        <div
          className={`flex w-max ${reverse ? "animate-marquee-rev" : "animate-marquee"}`}
          style={{ animationDuration: `${speed}s` }}
        >
          <Row />
          <Row ariaHidden />
        </div>
      </div>
    </div>
  );
}
