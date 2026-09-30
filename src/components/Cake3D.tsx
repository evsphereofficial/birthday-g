"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float } from "@react-three/drei";
import * as THREE from "three";
import { createRng } from "@/lib/random";

function makeStarShape(outer = 0.5, inner = 0.23, points = 5) {
  const shape = new THREE.Shape();
  const total = points * 2;
  for (let i = 0; i < total; i += 1) {
    const radius = i % 2 === 0 ? outer : inner;
    const angle = (i / total) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return shape;
}

const SPRINKLE_COLORS = [
  "#f79bb9",
  "#e2709a",
  "#e9c48a",
  "#e9ddf7",
  "#d9f2e6",
  "#ffffff",
];

type Sprinkle = {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
};

function useSprinkles() {
  return useMemo<Sprinkle[]>(() => {
    const rng = createRng(20_251_001);
    const items: Sprinkle[] = [];
    for (let i = 0; i < 60; i += 1) {
      const onTop = i < 34;
      const radius = onTop ? rng() * 0.78 : 1.1 + rng() * 0.6;
      const angle = rng() * Math.PI * 2;
      items.push({
        position: [
          Math.cos(angle) * radius,
          onTop ? 3.22 : 2.28 + rng() * 0.04,
          Math.sin(angle) * radius,
        ],
        rotation: [rng() * Math.PI, rng() * Math.PI, rng() * Math.PI],
        color: SPRINKLE_COLORS[i % SPRINKLE_COLORS.length],
      });
    }
    for (let i = 0; i < 16; i += 1) {
      const angle = rng() * Math.PI * 2;
      items.push({
        position: [
          Math.cos(angle) * (2.05 + rng() * 0.25),
          0.2,
          Math.sin(angle) * (2.05 + rng() * 0.25),
        ],
        rotation: [rng() * Math.PI, rng() * Math.PI, rng() * Math.PI],
        color: SPRINKLE_COLORS[(i + 2) % SPRINKLE_COLORS.length],
      });
    }
    return items;
  }, []);
}

function Candle({
  x,
  z,
  index,
  blown,
}: {
  x: number;
  z: number;
  index: number;
  blown: boolean;
}) {
  const flameRef = useRef<THREE.Group>(null);
  const smokeRef = useRef<THREE.Group>(null);
  const clockOffset = useRef(index * 1.7);

  useFrame((state) => {
    const t = state.clock.elapsedTime + clockOffset.current;
    if (flameRef.current) {
      const target = blown ? 0 : 1;
      const current = flameRef.current.scale.x;
      const next = THREE.MathUtils.lerp(current, target, 0.09);
      flameRef.current.scale.set(
        next * (1 + Math.sin(t * 16) * 0.06),
        next * (1 + Math.sin(t * 19) * 0.12),
        next * (1 + Math.cos(t * 15) * 0.06),
      );
      flameRef.current.position.x = Math.sin(t * 8) * 0.012;
    }
    if (smokeRef.current) {
      smokeRef.current.visible = blown;
      smokeRef.current.children.forEach((child, i) => {
        const phase = (t * 0.35 + i * 0.33) % 1;
        child.position.y = phase * 1.15;
        const scale = 0.55 + phase * 1.5;
        child.scale.setScalar(scale);
        const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        material.opacity = Math.max(0, 0.4 * (1 - phase));
      });
    }
  });

  return (
    <group position={[x, 3.2, z]}>
      <mesh castShadow position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.065, 0.075, 0.56, 16]} />
        <meshStandardMaterial
          color={index % 2 === 0 ? "#ffffff" : "#ffd9e6"}
          roughness={0.45}
        />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <torusGeometry args={[0.072, 0.022, 8, 24]} />
        <meshStandardMaterial color="#f79bb9" roughness={0.5} />
      </mesh>
      <group ref={flameRef} position={[0, 0.62, 0]}>
        <mesh>
          <coneGeometry args={[0.085, 0.26, 12]} />
          <meshStandardMaterial
            color="#ffd48a"
            emissive="#ff9f45"
            emissiveIntensity={2.6}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0, -0.04, 0]}>
          <coneGeometry args={[0.045, 0.16, 10]} />
          <meshBasicMaterial color="#fff6d8" toneMapped={false} />
        </mesh>
      </group>
      <group ref={smokeRef} position={[0, 0.72, 0]} visible={false}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0, i * 0.3, 0]}>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshBasicMaterial
              color="#e8dfe3"
              transparent
              opacity={0}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Cake({ blown }: { blown: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const sprinkles = useSprinkles();

  const starGeometry = useMemo(() => {
    const geometry = new THREE.ExtrudeGeometry(makeStarShape(0.46, 0.21, 5), {
      depth: 0.1,
      bevelEnabled: true,
      bevelSize: 0.035,
      bevelThickness: 0.035,
      bevelSegments: 3,
    });
    geometry.center();
    return geometry;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const pointer = state.pointer;
    groupRef.current.rotation.y += (pointer.x * 0.42 - groupRef.current.rotation.y) * 0.05;
    groupRef.current.rotation.x += (-pointer.y * 0.14 - groupRef.current.rotation.x) * 0.05;
    groupRef.current.position.y =
      -2 + Math.sin(state.clock.elapsedTime * 0.9) * 0.07;
    groupRef.current.rotation.y += delta * 0.06;
  });

  const candles = useMemo(() => {
    const list: { x: number; z: number; i: number }[] = [];
    for (let i = 0; i < 6; i += 1) {
      const angle = (i / 6) * Math.PI * 2;
      list.push({ x: Math.cos(angle) * 0.5, z: Math.sin(angle) * 0.5, i });
    }
    return list;
  }, []);

  return (
    <group ref={groupRef} position={[0, -2, 0]}>
      <mesh castShadow receiveShadow position={[0, 0.08, 0]}>
        <cylinderGeometry args={[2.5, 2.5, 0.16, 64]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.06} />
      </mesh>

      <mesh castShadow receiveShadow position={[0, 0.66, 0]}>
        <cylinderGeometry args={[1.9, 1.9, 1, 48]} />
        <meshStandardMaterial color="#fff1e7" roughness={0.62} />
      </mesh>
      <mesh position={[0, 1.16, 0]}>
        <cylinderGeometry args={[1.96, 1.96, 0.3, 48]} />
        <meshStandardMaterial color="#f9b7cd" roughness={0.45} />
      </mesh>

      <mesh castShadow position={[0, 1.72, 0]}>
        <cylinderGeometry args={[1.34, 1.34, 0.82, 48]} />
        <meshStandardMaterial color="#fffaf5" roughness={0.62} />
      </mesh>
      <mesh position={[0, 2.24, 0]}>
        <cylinderGeometry args={[1.4, 1.4, 0.26, 48]} />
        <meshStandardMaterial color="#ffd9e6" roughness={0.45} />
      </mesh>

      <mesh castShadow position={[0, 2.68, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.6, 48]} />
        <meshStandardMaterial color="#fff1e7" roughness={0.62} />
      </mesh>
      <mesh position={[0, 3.06, 0]}>
        <cylinderGeometry args={[0.96, 0.96, 0.24, 48]} />
        <meshStandardMaterial color="#f9b7cd" roughness={0.45} />
      </mesh>

      {Array.from({ length: 14 }).map((_, i) => {
        const angle = (i / 14) * Math.PI * 2;
        return (
          <mesh
            key={`drip-${i}`}
            position={[Math.cos(angle) * 1.93, 0.98, Math.sin(angle) * 1.93]}
            scale={[1, 1.6 + (i % 3) * 0.3, 1]}
          >
            <sphereGeometry args={[0.11, 12, 12]} />
            <meshStandardMaterial color="#f9b7cd" roughness={0.4} />
          </mesh>
        );
      })}

      {Array.from({ length: 9 }).map((_, i) => {
        const angle = (i / 9) * Math.PI * 2;
        return (
          <mesh
            key={`berry-${i}`}
            position={[Math.cos(angle) * 1.05, 2.4, Math.sin(angle) * 1.05]}
          >
            <sphereGeometry args={[0.13, 16, 16]} />
            <meshStandardMaterial color="#e2709a" roughness={0.25} />
          </mesh>
        );
      })}

      {sprinkles.map((sprinkle, i) => (
        <mesh
          key={`sprinkle-${i}`}
          position={sprinkle.position}
          rotation={sprinkle.rotation}
        >
          <capsuleGeometry args={[0.03, 0.09, 4, 8]} />
          <meshStandardMaterial color={sprinkle.color} roughness={0.35} />
        </mesh>
      ))}

      {candles.map((candle) => (
        <Candle
          key={candle.i}
          x={candle.x}
          z={candle.z}
          index={candle.i}
          blown={blown}
        />
      ))}

      <group position={[0, 4.25, -0.15]} rotation={[0, 0, 0]}>
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 1, 8]} />
          <meshStandardMaterial color="#e9c48a" metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh geometry={starGeometry}>
          <meshStandardMaterial
            color="#e9c48a"
            metalness={0.55}
            roughness={0.25}
            emissive="#e9c48a"
            emissiveIntensity={0.14}
          />
        </mesh>
      </group>
    </group>
  );
}

export default function Cake3D({ blown = false }: { blown?: boolean }) {
  return (
    <Canvas
      dpr={[1, 2]}
      shadows
      camera={{ position: [0, 1.1, 9.4], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      className="h-full w-full"
    >
      <ambientLight intensity={1.05} />
      <directionalLight
        position={[4, 8, 6]}
        intensity={1.5}
        color="#fff6ee"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-5, 3, -4]} intensity={22} color="#ffd9e6" />
      <pointLight position={[3, -1, 4]} intensity={14} color="#e9ddf7" />

      <Float speed={1.4} rotationIntensity={0.12} floatIntensity={0.5}>
        <Cake blown={blown} />
      </Float>

      <ContactShadows
        position={[0, -2.1, 0]}
        opacity={0.35}
        scale={14}
        blur={2.6}
        far={6}
        color="#e2709a"
      />
    </Canvas>
  );
}
