"use client";

import { motion } from "framer-motion";

type Balloon = {
  left: string;
  size: number;
  color: string;
  stringColor: string;
  duration: number;
  delay: number;
  opacity: number;
};

const BALLOONS: Balloon[] = [
  { left: "5%", size: 78, color: "#f9b7cd", stringColor: "#e2709a", duration: 26, delay: 0, opacity: 0.9 },
  { left: "14%", size: 54, color: "#ffd9e6", stringColor: "#f79bb9", duration: 32, delay: 6, opacity: 0.75 },
  { left: "26%", size: 66, color: "#e9ddf7", stringColor: "#b79ee0", duration: 29, delay: 12, opacity: 0.7 },
  { left: "42%", size: 46, color: "#fff1e7", stringColor: "#e9c48a", duration: 35, delay: 3, opacity: 0.65 },
  { left: "58%", size: 72, color: "#ef8fae", stringColor: "#e2709a", duration: 27, delay: 9, opacity: 0.6 },
  { left: "72%", size: 58, color: "#ffe9b0", stringColor: "#e9c48a", duration: 33, delay: 15, opacity: 0.7 },
  { left: "85%", size: 84, color: "#ffd9e6", stringColor: "#f79bb9", duration: 30, delay: 5, opacity: 0.85 },
  { left: "93%", size: 50, color: "#d9f2e6", stringColor: "#8fd6b8", duration: 36, delay: 18, opacity: 0.6 },
];

function BalloonArt({ color, stringColor }: { color: string; stringColor: string }) {
  return (
    <svg viewBox="0 0 90 150" className="h-full w-full overflow-visible">
      <ellipse cx="45" cy="48" rx="33" ry="41" fill={color} />
      <ellipse
        cx="33"
        cy="34"
        rx="10"
        ry="15"
        fill="rgba(255,255,255,0.55)"
        transform="rotate(-18 33 34)"
      />
      <path d="M45 89 L39 99 L51 99 Z" fill={color} />
      <path
        d="M45 99 C 55 112, 35 120, 45 136 C 51 146, 43 150, 45 156"
        fill="none"
        stroke={stringColor}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

export default function Balloons({ count = 8 }: { count?: number }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {BALLOONS.slice(0, count).map((balloon, index) => (
        <motion.div
          key={index}
          className="absolute bottom-0"
          style={{ left: balloon.left, width: balloon.size, opacity: balloon.opacity }}
          initial={{ y: "14vh" }}
          animate={{
            y: ["16vh", "-115vh"],
            rotate: [-8, 8, -8],
          }}
          transition={{
            y: {
              duration: balloon.duration,
              delay: balloon.delay,
              repeat: Infinity,
              ease: "linear",
            },
            rotate: {
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          <div style={{ height: balloon.size * 1.9 }}>
            <BalloonArt color={balloon.color} stringColor={balloon.stringColor} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
