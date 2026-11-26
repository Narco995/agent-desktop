"use client";

import { useState } from "react";

export function NotesApp() {
  const [text, setText] = useState("Welcome to Agent Desktop Notes.\n\nThis is a fully working multi-window environment that feels native on your phone.\n\nNext steps: connect real AI models, add file system, browser, and agent computer-use.");

  return (
    <div className="h-full p-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-full bg-transparent outline-none resize-none text-sm text-white/90 leading-relaxed placeholder:text-white/30"
        placeholder="Start typing..."
      />
    </div>
  );
}