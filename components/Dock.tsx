"use client";

import { motion } from "framer-motion";
import { MessageSquare, FileText, Folder, Globe, Settings, Plus } from "lucide-react";
import { useDesktopStore } from "@/lib/store";

const apps = [
  { type: "agent" as const, icon: MessageSquare, label: "Agents", color: "from-violet-500 to-purple-600" },
  { type: "notes" as const, icon: FileText, label: "Notes", color: "from-amber-500 to-orange-600" },
  { type: "files" as const, icon: Folder, label: "Files", color: "from-blue-500 to-cyan-600" },
  { type: "browser" as const, icon: Globe, label: "Browser", color: "from-emerald-500 to-teal-600" },
  { type: "settings" as const, icon: Settings, label: "Settings", color: "from-slate-500 to-slate-600" },
];

export function Dock() {
  const { openWindow, windows, focusWindow } = useDesktopStore();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div className="flex justify-center pb-4 pt-2 px-4">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-2 px-3 py-2.5 rounded-2xl border border-white/10 shadow-2xl"
          style={{
            background: "rgba(20, 20, 30, 0.75)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          {apps.map((app) => {
            const isOpen = windows.some((w) => w.type === app.type && !w.minimized);
            return (
              <button
                key={app.type}
                onClick={() => {
                  const existing = windows.find((w) => w.type === app.type);
                  if (existing) {
                    focusWindow(existing.id);
                  } else {
                    openWindow(app.type);
                  }
                }}
                className="relative group flex flex-col items-center"
              >
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center shadow-lg transition-transform active:scale-90 group-hover:scale-105`}
                >
                  <app.icon size={22} className="text-white" />
                </div>
                {isOpen && (
                  <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-white/80" />
                )}
              </button>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}