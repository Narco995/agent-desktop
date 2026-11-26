"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { X, Minus, Square, Maximize2 } from "lucide-react";
import { AppWindow, useDesktopStore } from "@/lib/store";
import { AgentChat } from "./AgentChat";
import { NotesApp } from "./apps/NotesApp";
import { FilesApp } from "./apps/FilesApp";

interface Props {
  window: AppWindow;
}

export function Window({ window: win }: Props) {
  const { focusWindow, closeWindow, minimizeWindow, toggleMaximize, updateWindow, isMobile, activeWindowId } =
    useDesktopStore();
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  if (win.minimized) return null;

  const isActive = activeWindowId === win.id;

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isMobile || win.maximized) return;
    focusWindow(win.id);
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - win.x,
      y: e.clientY - win.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updateWindow(win.id, {
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const style = win.maximized || isMobile
    ? { top: 0, left: 0, width: "100%", height: "calc(100% - 80px)", zIndex: win.zIndex }
    : { top: win.y, left: win.x, width: win.width, height: win.height, zIndex: win.zIndex };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`absolute flex flex-col rounded-2xl overflow-hidden border shadow-2xl ${
        isActive ? "border-white/20" : "border-white/10"
      }`}
      style={{
        ...style,
        background: "rgba(20, 20, 28, 0.85)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
      onClick={() => focusWindow(win.id)}
    >
      {/* Title bar */}
      <div
        className="flex items-center justify-between px-4 h-12 cursor-grab active:cursor-grabbing shrink-0"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeWindow(win.id);
              }}
              className="w-3 h-3 rounded-full bg-red-500/90 hover:bg-red-400 transition"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                minimizeWindow(win.id);
              }}
              className="w-3 h-3 rounded-full bg-yellow-500/90 hover:bg-yellow-400 transition hidden sm:block"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMaximize(win.id);
              }}
              className="w-3 h-3 rounded-full bg-green-500/90 hover:bg-green-400 transition hidden sm:block"
            />
          </div>
          <span className="text-sm font-medium text-white/80 ml-2 truncate">{win.title}</span>
        </div>

        <div className="flex items-center gap-1 sm:hidden">
          <button
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(win.id);
            }}
            className="p-1.5 rounded-lg hover:bg-white/10"
          >
            <Minus size={16} className="text-white/70" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(win.id);
            }}
            className="p-1.5 rounded-lg hover:bg-white/10"
          >
            <X size={16} className="text-white/70" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {win.type === "agent" && <AgentChat agentId={win.agentId} />}
        {win.type === "notes" && <NotesApp />}
        {win.type === "files" && <FilesApp />}
        {win.type === "browser" && (
          <div className="h-full flex items-center justify-center text-white/40 text-sm">
            Browser coming soon
          </div>
        )}
        {win.type === "settings" && (
          <div className="h-full flex items-center justify-center text-white/40 text-sm">
            Settings coming soon
          </div>
        )}
      </div>
    </motion.div>
  );
}