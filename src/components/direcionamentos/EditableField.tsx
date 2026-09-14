"use client";

import { useState, type ReactNode } from "react";

interface EditableFieldProps {
  value: string | string[];
  onSave?: (value: string | string[]) => void;
  children: ReactNode;
  hint?: string;
}

export function EditableField({ value, onSave, children, hint }: EditableFieldProps) {
  const isList = Array.isArray(value);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  if (!onSave) return <>{children}</>;

  function start() {
    setDraft(isList ? (value as string[]).join("\n") : String(value));
    setEditing(true);
  }

  function save() {
    if (isList) {
      const linhas = draft
        .split("\n")
        .map((l) => l.replace(/^\s*[•\-\d.]+\s*/, "").trim())
        .filter(Boolean);
     onSave?.(linhas);
    } else {
     onSave?.(draft.trim());
    }
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="space-y-2">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={isList ? Math.max(3, draft.split("\n").length + 1) : 5}
          className="w-full rounded-xl border border-purple-500/30 bg-[#1c1729] p-3 text-sm text-purple-50 outline-none focus:border-yellow-400"
        />
        <p className="text-xs text-purple-300">
          {hint ?? (isList ? "Um item por linha." : "Edite o texto como preferir.")}
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={save} className="rounded-lg bg-yellow-400 px-3 py-2 text-sm font-bold text-[#151221]">Salvar</button>
          <button type="button" onClick={() => setEditing(false)} className="rounded-lg border border-purple-400/40 px-3 py-2 text-sm text-purple-100">Cancelar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative pr-7">
      {children}
      <button type="button" onClick={start} title="Editar" aria-label="Editar" className="absolute right-0 top-0 text-sm text-yellow-300/70 hover:text-yellow-300">✏️</button>
    </div>
  );
}
