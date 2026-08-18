"use client";

import { ChevronDown, Sparkles } from "lucide-react";
import { useState } from "react";

interface Props {
  chapters: any[];
}

export function InterpretationAccordion({
  chapters,
}: Props) {

  const [open, setOpen] = useState<string | null>(null);

  return (

    <div className="space-y-5">

      {chapters.map((chapter) => {

        const opened =
          open === chapter.id;

        return (

          <div
            key={chapter.id}
            className="overflow-hidden rounded-3xl border border-yellow-500/20 bg-[#22163A]"
          >

            <button
              onClick={() =>
                setOpen(
                  opened ? null : chapter.id
                )
              }
              className="flex w-full items-center justify-between p-7 transition hover:bg-[#2C1F47]"
            >

              <div className="flex items-center gap-4">

                <Sparkles
                  className="text-yellow-400"
                  size={22}
                />

                <div className="text-left">

                  <p className="text-xl font-bold text-yellow-400">

                    {chapter.title}

                  </p>

                  <p className="text-sm text-zinc-400">

                    Clique para abrir

                  </p>

                </div>

              </div>

              <ChevronDown
                className={`transition duration-300 ${
                  opened ? "rotate-180" : ""
                }`}
              />

            </button>

            {opened && (

              <div className="border-t border-yellow-500/10 bg-[#2B1F46] p-8">

                <div className="leading-8 whitespace-pre-line text-zinc-200">

                  {chapter.content}

                </div>

              </div>

            )}

          </div>

        );

      })}

    </div>

  );

}