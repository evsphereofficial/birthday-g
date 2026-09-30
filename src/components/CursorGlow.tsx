"use client";

import { useEffect, useRef } from "react";

const PETALS = ["✦", "❤", "🎀", "⭐", "🌸", "♪"];

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const glow = glowRef.current;
    const dot = dotRef.current;
    const layer = layerRef.current;
    if (!glow || !dot || !layer) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let glowX = targetX;
    let glowY = targetY;
    let lastSpawnX = targetX;
    let lastSpawnY = targetY;
    let raf = 0;
    let running = true;

    const loop = () => {
      glowX += (targetX - glowX) * 0.12;
      glowY += (targetY - glowY) * 0.12;
      glow.style.transform = `translate3d(${glowX - 170}px, ${glowY - 170}px, 0)`;
      dot.style.transform = `translate3d(${targetX - 5}px, ${targetY - 5}px, 0)`;
      if (running) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const spawn = (x: number, y: number) => {
      const el = document.createElement("span");
      el.textContent = PETALS[Math.floor(Math.random() * PETALS.length)];
      el.setAttribute(
        "style",
        [
          "position:fixed",
          `left:${x + (Math.random() * 44 - 22)}px`,
          `top:${y + (Math.random() * 30 - 15)}px`,
          "pointer-events:none",
          "z-index:9999",
          `font-size:${12 + Math.random() * 16}px`,
          "animation:rise-up 1.5s ease-out forwards",
          `transform:rotate(${Math.random() * 90 - 45}deg)`,
        ].join(";"),
      );
      layer.appendChild(el);
      window.setTimeout(() => el.remove(), 1550);
    };

    const onMove = (event: MouseEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      const distance = Math.hypot(targetX - lastSpawnX, targetY - lastSpawnY);
      if (distance > 70) {
        spawn(targetX, targetY);
        lastSpawnX = targetX;
        lastSpawnY = targetY;
      }
    };

    const onLeave = () => {
      glow.style.opacity = "0";
      dot.style.opacity = "0";
    };
    const onEnter = () => {
      glow.style.opacity = "1";
      dot.style.opacity = "1";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return (
    <>
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[90] hidden h-[340px] w-[340px] rounded-full opacity-70 mix-blend-multiply transition-opacity duration-300 md:block"
        style={{
          background:
            "radial-gradient(circle, rgba(247,155,185,0.42) 0%, rgba(255,233,241,0.28) 42%, rgba(255,250,247,0) 70%)",
        }}
      />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[91] hidden h-2.5 w-2.5 rounded-full bg-rose-deep shadow-[0_0_18px_rgba(226,112,154,0.9)] transition-opacity duration-300 md:block"
      />
      <div ref={layerRef} aria-hidden className="pointer-events-none fixed inset-0 z-[92]" />
    </>
  );
}
