"use client";

import { motion } from "framer-motion";
import { useDesktopStore } from "@/lib/store";
import { Sparkles } from "lucide-react";

export function AgentOrb() {
  const { openWindow, agents } = useDesktopStore();

  return (
    <motion.button
      drag
      dragMomentum={false}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => openWindow("agent", "New Agent")}
      className="fixed bottom-28 right-5 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 shadow-lg shadow-violet-500/30 flex items-center justify-center border border-white/20"
      style={{ touchAction: "none" }}
    >
      <Sparkles size={22} className="text-white" />
    </motion.button>
  );
}