"use client";

import { Folder, FileText, Image as ImageIcon } from "lucide-react";

const demoFiles = [
  { name: "Projects", type: "folder" },
  { name: "Research", type: "folder" },
  { name: "meeting-notes.md", type: "file" },
  { name: "agent-memory.json", type: "file" },
  { name: "screenshot.png", type: "image" },
];

export function FilesApp() {
  return (
    <div className="h-full p-4">
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
        {demoFiles.map((f) => (
          <button
            key={f.name}
            className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/5 active:bg-white/10 transition"
          >
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              {f.type === "folder" && <Folder size={24} className="text-blue-400" />}
              {f.type === "file" && <FileText size={24} className="text-white/70" />}
              {f.type === "image" && <ImageIcon size={24} className="text-emerald-400" />}
            </div>
            <span className="text-xs text-white/80 text-center truncate w-full">{f.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}