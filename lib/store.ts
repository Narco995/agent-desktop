"use client";

import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

export type WindowType = "agent" | "notes" | "browser" | "files" | "settings";

export interface AppWindow {
  id: string;
  type: WindowType;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
  agentId?: string;
}

export interface Agent {
  id: string;
  name: string;
  model: "claude" | "gpt" | "grok" | "local";
  color: string;
  status: "idle" | "thinking" | "working";
}

interface DesktopState {
  windows: AppWindow[];
  agents: Agent[];
  activeWindowId: string | null;
  nextZIndex: number;
  isMobile: boolean;

  // Actions
  setIsMobile: (v: boolean) => void;
  openWindow: (type: WindowType, title?: string, agentId?: string) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindow: (id: string, updates: Partial<AppWindow>) => void;
  minimizeWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
  addAgent: (name: string, model: Agent["model"]) => void;
}

const AGENT_COLORS = ["#8b5cf6", "#06b6d4", "#f43f5e", "#10b981", "#f59e0b", "#ec4899"];

export const useDesktopStore = create<DesktopState>((set, get) => ({
  windows: [],
  agents: [
    { id: "claude-1", name: "Claude", model: "claude", color: "#8b5cf6", status: "idle" },
    { id: "gpt-1", name: "ChatGPT", model: "gpt", color: "#10b981", status: "idle" },
  ],
  activeWindowId: null,
  nextZIndex: 10,
  isMobile: false,

  setIsMobile: (v) => set({ isMobile: v }),

  openWindow: (type, title, agentId) => {
    const { windows, nextZIndex, isMobile } = get();
    const id = uuidv4();

    const defaultSizes: Record<WindowType, { w: number; h: number }> = {
      agent: { w: 400, h: 560 },
      notes: { w: 360, h: 480 },
      browser: { w: 420, h: 600 },
      files: { w: 380, h: 500 },
      settings: { w: 340, h: 420 },
    };

    const size = defaultSizes[type];
    const offset = (windows.length % 5) * 24;

    const newWindow: AppWindow = {
      id,
      type,
      title: title || type.charAt(0).toUpperCase() + type.slice(1),
      x: isMobile ? 0 : 40 + offset,
      y: isMobile ? 0 : 40 + offset,
      width: isMobile ? window.innerWidth : size.w,
      height: isMobile ? window.innerHeight - 80 : size.h,
      minimized: false,
      maximized: isMobile,
      zIndex: nextZIndex,
      agentId,
    };

    set({
      windows: [...windows, newWindow],
      activeWindowId: id,
      nextZIndex: nextZIndex + 1,
    });
  },

  closeWindow: (id) => {
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    }));
  },

  focusWindow: (id) => {
    const { nextZIndex } = get();
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, zIndex: nextZIndex, minimized: false } : w
      ),
      activeWindowId: id,
      nextZIndex: nextZIndex + 1,
    }));
  },

  updateWindow: (id, updates) => {
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, ...updates } : w)),
    }));
  },

  minimizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, minimized: true } : w
      ),
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    }));
  },

  toggleMaximize: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, maximized: !w.maximized } : w
      ),
    }));
  },

  addAgent: (name, model) => {
    const id = uuidv4();
    const color = AGENT_COLORS[get().agents.length % AGENT_COLORS.length];
    set((state) => ({
      agents: [...state.agents, { id, name, model, color, status: "idle" }],
    }));
  },
}));