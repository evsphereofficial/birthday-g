import confetti from "canvas-confetti";

export const PINK_PALETTE = [
  "#f79bb9",
  "#e2709a",
  "#ffd9e6",
  "#fff1e7",
  "#e9c48a",
  "#e9ddf7",
  "#ffffff",
];

export function sparkleBurst(origin?: confetti.Options["origin"]) {
  confetti({
    particleCount: 90,
    spread: 78,
    startVelocity: 42,
    scalar: 0.95,
    ticks: 220,
    colors: PINK_PALETTE,
    disableForReducedMotion: true,
    origin: origin ?? { x: 0.5, y: 0.62 },
  });
}

export function starCannons() {
  const end = Date.now() + 900;
  const shot = () => {
    confetti({
      particleCount: 45,
      startVelocity: 55,
      spread: 70,
      scalar: 1.1,
      colors: PINK_PALETTE,
      disableForReducedMotion: true,
      origin: { x: Math.random(), y: Math.random() * 0.5 + 0.2 },
    });
    if (Date.now() < end) requestAnimationFrame(shot);
  };
  shot();
}

export function cakeWishBurst() {
  confetti({
    particleCount: 160,
    spread: 100,
    startVelocity: 46,
    decay: 0.92,
    gravity: 0.85,
    scalar: 1.15,
    ticks: 300,
    colors: PINK_PALETTE,
    disableForReducedMotion: true,
    origin: { x: 0.5, y: 0.45 },
  });

  window.setTimeout(() => {
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: PINK_PALETTE,
      disableForReducedMotion: true,
    });
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: PINK_PALETTE,
      disableForReducedMotion: true,
    });
  }, 260);
}
