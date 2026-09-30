"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Preloader from "@/components/Preloader";
import ScrollProgress from "@/components/ScrollProgress";
import CursorGlow from "@/components/CursorGlow";
import SideNav from "@/components/SideNav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Countdown from "@/components/Countdown";
import Reasons from "@/components/Reasons";
import Timeline from "@/components/Timeline";
import Gifts from "@/components/Gifts";
import Gallery from "@/components/Gallery";
import Dreamscape3D from "@/components/Dreamscape3D";
import Letter from "@/components/Letter";
import Guestbook from "@/components/Guestbook";
import Footer from "@/components/Footer";
import { sparkleBurst } from "@/lib/confetti";

export default function Home() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const timer = window.setTimeout(() => sparkleBurst({ x: 0.5, y: 0.45 }), 450);
    return () => window.clearTimeout(timer);
  }, [ready]);

  return (
    <>
      <AnimatePresence>
        {!ready ? <Preloader onDone={() => setReady(true)} /> : null}
      </AnimatePresence>

      <ScrollProgress />
      <CursorGlow />
      <SideNav />

      <main className="relative">
        <Hero ready={ready} />

        <div className="relative -mt-6 z-20">
          <Marquee tone="pink" tilt="-1.5deg" />
        </div>

        <Countdown />

        <div className="relative z-20 -mt-6">
          <Marquee tone="outline" tilt="1.5deg" reverse speed={42} />
        </div>

        <Reasons />
        <Timeline />
        <Gifts />
        <Gallery />
        <Dreamscape3D />
        <Letter />
        <Guestbook />
      </main>

      <Footer />
    </>
  );
}
