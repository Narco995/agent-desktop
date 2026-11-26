"use client";

import { useEffect } from "react";
import { useDesktopStore } from "@/lib/store";
import { Window } from "./Window";
import { Dock } from "./Dock";
import { AgentOrb } from "./AgentOrb";
import { motion } from "framer-motion";

export function Desktop() {
  const { windows, setIsMobile, openWindow } = useDesktopStore();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [setIsMobile]);

  // Open a default agent window on first load
  useEffect(() => {
    if (windows.length === 0) {
      openWindow("agent", "Claude", "claude-1");
    }
  }, []);

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-[#0a0a0f]">
      {/* Beautiful gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950/40 via-[#0a0a0f] to-cyan-950/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Windows */}
      {windows.map((win) => (
        <Window key={win.id} window={win} />
      ))}

      {/* Floating Agent Orb (mobile primary interaction) */}
      <AgentOrb />

      {/* Bottom Dock */}
      <Dock />
    </div>
  );
}