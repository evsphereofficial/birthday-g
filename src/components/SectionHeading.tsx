import Reveal from "./Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  script,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  script?: string;
  description?: string;
  align?: "center" | "left";
}) {
  const alignCls =
    align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={`flex flex-col gap-4 ${alignCls}`}>
      {eyebrow ? (
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-petal bg-white/70 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.35em] text-rose-deep">
            <span className="animate-sparkle text-gold">✦</span>
            {eyebrow}
            <span className="animate-sparkle text-gold [animation-delay:0.6s]">
              ✦
            </span>
          </span>
        </Reveal>
      ) : null}

      <Reveal delay={0.08}>
        <h2 className="font-display text-4xl leading-[1.05] font-black text-ink sm:text-5xl md:text-6xl">
          {title}
          {script ? (
            <>
              {" "}
              <span className="font-script text-rose-deep lowercase">
                {script}
              </span>
            </>
          ) : null}
        </h2>
      </Reveal>

      {description ? (
        <Reveal delay={0.16}>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
