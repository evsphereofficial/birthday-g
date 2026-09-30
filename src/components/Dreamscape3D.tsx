"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createRng } from "@/lib/random";
import SectionHeading from "@/components/SectionHeading";
import { sparkleBurst, starCannons } from "@/lib/confetti";

function heartGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.45);
  shape.bezierCurveTo(0, 0.78, -0.58, 1.02, -0.88, 0.48);
  shape.bezierCurveTo(-1.18, -0.06, -0.36, -0.4, 0, -0.74);
  shape.bezierCurveTo(0.36, -0.4, 1.18, -0.06, 0.88, 0.48);
  shape.bezierCurveTo(0.58, 1.02, 0, 0.78, 0, 0.45);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.3,
    bevelEnabled: true,
    bevelSize: 0.07,
    bevelThickness: 0.07,
    bevelSegments: 4,
  });
  geometry.center();
  return geometry;
}

function starGeometry() {
  const shape = new THREE.Shape();
  const points = 5;
  const total = points * 2;
  for (let i = 0; i < total; i += 1) {
    const radius = i % 2 === 0 ? 0.62 : 0.28;
    const angle = (i / total) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.22,
    bevelEnabled: true,
    bevelSize: 0.05,
    bevelThickness: 0.05,
    bevelSegments: 3,
  });
  geometry.center();
  return geometry;
}

type Kind = "heart" | "star" | "bubble" | "ring" | "gift";

type Item = {
  kind: Kind;
  position: [number, number, number];
  scale: number;
  color: string;
  speed: number;
  spin: number;
};

const PALETTE = [
  "#f79bb9",
  "#e2709a",
  "#ffd9e6",
  "#ffb3c9",
  "#e9c48a",
  "#e9ddf7",
  "#f9b7cd",
  "#f2a3bd",
];

function useItems(): Item[] {
  return useMemo(() => {
    const rng = createRng(10_010_001);
    const kinds: Kind[] = ["heart", "star", "bubble", "ring", "gift"];

    return Array.from({ length: 26 }).map((_, index) => {
      const zone = index % 4;
      let x = 0;
      let y = 0;

      if (zone === 0) {
        x = -7.6 + rng() * 2.6;
        y = (rng() - 0.5) * 8.4;
      } else if (zone === 1) {
        x = 5 + rng() * 2.6;
        y = (rng() - 0.5) * 8.4;
      } else if (zone === 2) {
        x = (rng() - 0.5) * 15;
        y = 3.6 + rng() * 1.4;
      } else {
        x = (rng() - 0.5) * 15;
        y = -5 + rng() * 1.4;
      }

      return {
        kind: kinds[index % kinds.length],
        position: [x, y, (rng() - 0.5) * 6 - 1],
        scale: 0.4 + rng() * 0.6,
        color: PALETTE[index % PALETTE.length],
        speed: 0.3 + rng() * 0.7,
        spin: (rng() - 0.5) * 0.7,
      };
    });
  }, []);
}

function FloatItem({ item, index }: { item: Item; index: number }) {
  const ref = useRef<THREE.Group>(null);
  const offset = useMemo(() => index * 1.37, [index]);

  const heart = useMemo(() => heartGeometry(), []);
  const star = useMemo(() => starGeometry(), []);

  useFrame((state) => {
    const group = ref.current;
    if (!group) return;
    const t = state.clock.elapsedTime * item.speed + offset;
    group.position.y = item.position[1] + Math.sin(t) * 0.65;
    group.position.x = item.position[0] + Math.cos(t * 0.6) * 0.4;
    group.rotation.y += 0.004 + Math.abs(item.spin) * 0.01;
    group.rotation.z = Math.sin(t * 0.8) * 0.35;
  });

  return (
    <group ref={ref} position={item.position} scale={item.scale}>
      {item.kind === "heart" ? (
        <mesh geometry={heart} castShadow>
          <meshStandardMaterial color={item.color} roughness={0.32} metalness={0.08} />
        </mesh>
      ) : null}
      {item.kind === "star" ? (
        <mesh geometry={star}>
          <meshStandardMaterial
            color={item.color}
            roughness={0.25}
            metalness={0.35}
            emissive={item.color}
            emissiveIntensity={0.16}
          />
        </mesh>
      ) : null}
      {item.kind === "bubble" ? (
        <mesh>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshStandardMaterial
            color={item.color}
            roughness={0.12}
            metalness={0.1}
            transparent
            opacity={0.85}
          />
        </mesh>
      ) : null}
      {item.kind === "ring" ? (
        <mesh rotation={[Math.PI / 2.4, 0, 0]}>
          <torusGeometry args={[0.55, 0.16, 20, 60]} />
          <meshStandardMaterial color={item.color} roughness={0.3} metalness={0.25} />
        </mesh>
      ) : null}
      {item.kind === "gift" ? (
        <group>
          <mesh castShadow>
            <boxGeometry args={[0.9, 0.75, 0.9]} />
            <meshStandardMaterial color={item.color} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.94, 0.79, 0.2]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} />
          </mesh>
          <mesh>
            <boxGeometry args={[0.2, 0.79, 0.94]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.48, 0]} rotation={[0, 0.6, 0]}>
            <torusGeometry args={[0.16, 0.05, 10, 24]} />
            <meshStandardMaterial color="#e2709a" roughness={0.35} />
          </mesh>
        </group>
      ) : null}
    </group>
  );
}

function Scene({ shake }: { shake: number }) {
  const items = useItems();
  const groupRef = useRef<THREE.Group>(null);
  const impulse = useRef(0);
  const lastShake = useRef(shake);

  useEffect(() => {
    if (shake !== lastShake.current) {
      lastShake.current = shake;
      impulse.current = 1;
    }
  }, [shake]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;
    impulse.current = Math.max(0, impulse.current - delta * 0.75);
    const kick = impulse.current;

    group.rotation.y += (state.pointer.x * 0.28 - group.rotation.y) * 0.04;
    group.rotation.x += (-state.pointer.y * 0.16 - group.rotation.x) * 0.04;
    group.rotation.z = Math.sin(kick * 34) * 0.22 * kick;
    group.scale.setScalar(1 + Math.sin(kick * 26) * 0.07 * kick);
  });

  return (
    <>
      <ambientLight intensity={1.25} />
      <hemisphereLight args={["#fff1e7", "#f79bb9", 1.1]} />
      <directionalLight position={[6, 8, 6]} intensity={1.8} color="#fff6ee" />
      <pointLight position={[-7, 2, 4]} intensity={40} color="#f79bb9" />
      <pointLight position={[7, -3, 3]} intensity={28} color="#e9ddf7" />
      <group ref={groupRef}>
        {items.map((item, index) => (
          <FloatItem key={index} item={item} index={index} />
        ))}
      </group>
    </>
  );
}

export default function Dreamscape3D() {
  const [rain, setRain] = useState(0);

  return (
    <section
      id="dreamscape"
      className="relative min-h-[92vh] overflow-hidden bg-linear-to-b from-cream via-petal/60 to-blush"
    >
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:30px_30px]" />

      <div className="absolute inset-0 z-0 h-full w-full">
        <Canvas
          dpr={[1, 1.8]}
          camera={{ position: [0, 0, 11], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
        >
          <Scene shake={rain} />
        </Canvas>
      </div>

      <div className="pointer-events-none relative z-10 mx-auto flex min-h-[92vh] max-w-3xl flex-col items-center justify-center gap-8 px-6 py-24 text-center">
        <div className="pointer-events-none w-full rounded-[2.5rem] border border-white/70 bg-white/55 px-6 py-10 shadow-[0_40px_80px_-50px_rgba(226,112,154,0.9)] backdrop-blur-xl sm:px-10">
          <SectionHeading
            eyebrow="the dreamscape"
            title="everything floaty"
            script="lives here"
            description="Hearts, stars, bubbles and presents drifting in cream-coloured space. Move your mouse — the whole world leans with you."
          />

          <div className="pointer-events-auto mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                setRain((value) => value + 1);
                starCannons();
              }}
              className="rounded-full bg-linear-to-r from-rose-deep to-rose px-7 py-3.5 text-sm font-bold text-white shadow-[0_18px_35px_-16px_rgba(226,112,154,1)] transition-transform duration-300 hover:scale-105"
            >
              shake the sky 🎁
            </button>
            <button
              type="button"
              onClick={() => sparkleBurst({ x: 0.5, y: 0.4 })}
              className="rounded-full border-2 border-white/90 bg-white/80 px-7 py-3.5 text-sm font-bold text-rose-deep backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
            >
              sprinkle sparkles ✦
            </button>
          </div>

          <p className="mt-7 text-xs font-bold tracking-[0.3em] text-rose-deep/70 uppercase">
            three.js · react three fiber · {26} floating things
            {rain > 0 ? ` · shaken ${rain}×` : ""}
          </p>
        </div>
      </div>
    </section>
  );
}
