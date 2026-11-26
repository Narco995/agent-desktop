"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot } from "lucide-react";
import { useDesktopStore } from "@/lib/store";

interface Props {
  agentId?: string;
}

export function AgentChat({ agentId }: Props) {
  const { agents } = useDesktopStore();
  const agent = agents.find((a) => a.id === agentId) || agents[0];
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([
    {
      role: "assistant",
      content: `Hi! I'm ${agent?.name || "your agent"}. This is the foundation of Agent Desktop. Very soon I'll be connected to real Claude / GPT / Grok APIs and will be able to control this entire virtual desktop.`,
    },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", content: userMsg }]);

    // Simulated response for now
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: `You said: "${userMsg}".\n\nReal API integration (Claude, OpenAI, xAI) will be added next. This desktop is already fully functional as a multi-window environment on phone and desktop.`,
        },
      ]);
    }, 600);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-violet-600 text-white"
                  : "bg-white/10 text-white/90"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="flex items-center gap-1.5 mb-1 text-xs text-white/50">
                  <Bot size={12} />
                  {agent?.name || "Agent"}
                </div>
              )}
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 border border-white/10">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Message agent..."
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-white/40"
          />
          <button
            onClick={send}
            className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center hover:bg-violet-500 transition active:scale-95"
          >
            <Send size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}