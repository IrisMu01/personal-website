import { Music2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface MusicProjectsTabProps {
  isDragging: boolean;
  dragOffset: number;
  activeTab: "cs" | "music";
}

export function MusicProjectsTab({
  isDragging,
  dragOffset,
  activeTab,
}: MusicProjectsTabProps) {
  return (
    <div
      className={`absolute inset-0 overflow-auto ${!isDragging ? "transition-transform duration-700 ease-out" : ""}`}
      style={{
        transform: isDragging
          ? activeTab === "cs"
            ? `translateX(100%) translateX(${dragOffset}px)`
            : `translateX(${dragOffset}px)`
          : activeTab === "music"
            ? "translateX(0)"
            : "translateX(100%)",
      }}
    >
      <main className="px-4 py-6 min-h-full pl-20">
        <div className="flex items-center gap-3 mb-4">
          <Music2 className="w-6 h-6 text-purple-400" />
          <h2 className="text-slate-100">Music Projects</h2>
        </div>

        <Accordion
          type="single"
          collapsible
          className="space-y-3"
          defaultValue="music1"
        >
          <AccordionItem
            value="music1"
            className="bg-purple-900 rounded-lg border border-purple-800"
          >
            <AccordionTrigger className="hover:no-underline px-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                <span className="text-slate-100">
                  Electronic EP - "Digital Dreams"
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="pt-4 space-y-4">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1628452798680-47dcaf5d5e1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHN0dWRpbyUyMHByb2R1Y3Rpb258ZW58MXx8fHwxNzYxMjAzNjUxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Music studio"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <p className="text-slate-300">
                  A 5-track electronic EP exploring the
                  intersection of ambient and techno.
                  Produced entirely in Ableton Live with
                  custom synthesizer patches.
                </p>
                <div className="bg-purple-800 p-4 rounded-lg border border-purple-700">
                  <p className="text-slate-400 text-sm mb-2">
                    Audio Player Placeholder
                  </p>
                  <div className="w-full h-12 bg-purple-950 rounded flex items-center justify-center">
                    <span className="text-slate-500">
                      ▶ Play Track
                    </span>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="music2"
            className="bg-purple-900 rounded-lg border border-purple-800"
          >
            <AccordionTrigger className="hover:no-underline px-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span className="text-slate-100">
                  Film Score - "Midnight City"
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="pt-4 space-y-4">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1522870389523-7e83c0065eaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpY2lhbiUyMGluc3RydW1lbnRzfGVufDF8fHx8MTc2MTI0OTk3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Musical instruments"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <p className="text-slate-300">
                  Original score for an independent short
                  film. Combines orchestral elements with
                  modern electronic production techniques.
                </p>
                <div className="aspect-video bg-purple-800 rounded-lg flex items-center justify-center border border-purple-700">
                  <p className="text-slate-500">
                    Film Clip Placeholder
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="music3"
            className="bg-purple-900 rounded-lg border border-purple-800"
          >
            <AccordionTrigger className="hover:no-underline px-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-slate-100">
                  Lo-fi Hip Hop Collection
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="pt-4 space-y-4">
                <p className="text-slate-300">
                  A collection of chill lo-fi beats perfect
                  for studying or relaxing. Features warm
                  analog samples and laid-back drum
                  patterns.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="aspect-square bg-purple-800 rounded-lg flex items-center justify-center border border-purple-700">
                    <p className="text-slate-500 text-sm">
                      Cover 1
                    </p>
                  </div>
                  <div className="aspect-square bg-purple-800 rounded-lg flex items-center justify-center border border-purple-700">
                    <p className="text-slate-500 text-sm">
                      Cover 2
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                    Lo-fi
                  </span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                    Hip Hop
                  </span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                    Instrumental
                  </span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>
    </div>
  );
}
