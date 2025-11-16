import { Music2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import AudioPlayer from "react-h5-audio-player";

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
          type="multiple"
          className="space-y-3"
          defaultValue={["music1", "music2", "music3", "music4", "music5"]}
        >
          {/* Dimensional Odyssey */}
          <AccordionItem
            value="music1"
            className="bg-purple-900 rounded-lg border border-purple-800"
          >
            <AccordionTrigger className="hover:no-underline px-4">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                  <span className="text-slate-100">
                    Dimensional Odyssey
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-2 py-0.5 bg-pink-500/20 text-pink-300 rounded-full text-xs">
                    Hybrid Orchestral
                  </span>
                  <span className="px-2 py-0.5 bg-pink-500/20 text-pink-300 rounded-full text-xs">
                    Cinematic
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="pt-4 flex gap-4">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1507838153414-b4b713384a76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                  alt="Dimensional Odyssey"
                  className="w-40 h-40 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 space-y-4">
                  <p className="text-slate-300">
                    An orchestral journey and a practice with fuller ensemble / key modulations, blending jazz orchestra with modern synths and electronic percussion.
                  </p>
                  <AudioPlayer
                    src="https://pub-18848117928e4ff497abec0a1725d007.r2.dev/piece_1.wav"
                    className="custom-audio-player"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Void Motifs */}
          <AccordionItem
            value="music2"
            className="bg-purple-900 rounded-lg border border-purple-800"
          >
            <AccordionTrigger className="hover:no-underline px-4">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span className="text-slate-100">
                    Void Motifs
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                    Atmospheric Dubstep
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="pt-4 flex gap-4">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1614149162883-504ce4d13909?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                  alt="Void Motifs"
                  className="w-40 h-40 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 space-y-4">
                  <p className="text-slate-300">
                    A short ambient piece built around a piano motif, layered with atmospheric dubstep textures and ethereal synths.
                  </p>
                  <AudioPlayer
                    src="https://pub-18848117928e4ff497abec0a1725d007.r2.dev/piece_2.wav"
                    className="custom-audio-player"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Orchestra Practice */}
          <AccordionItem
            value="music3"
            className="bg-purple-900 rounded-lg border border-purple-800"
          >
            <AccordionTrigger className="hover:no-underline px-4">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-slate-100">
                    Orchestra Practice
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                    Classical
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="pt-4 flex gap-4">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1465847899084-d164df4dedc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                  alt="Orchestra Practice"
                  className="w-40 h-40 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 space-y-4">
                  <p className="text-slate-300">
                    First time practicing orchestral composition.
                  </p>
                  <AudioPlayer
                    src="https://pub-18848117928e4ff497abec0a1725d007.r2.dev/piece_3.wav"
                    className="custom-audio-player"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Rebirth in Destruction Reharmonization */}
          <AccordionItem
            value="music4"
            className="bg-purple-900 rounded-lg border border-purple-800"
          >
            <AccordionTrigger className="hover:no-underline px-4">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  <span className="text-slate-100">
                    Rebirth in Destruction Reharmonization
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full text-xs">
                    Jazz
                  </span>
                  <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full text-xs">
                    Game Music
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="pt-4 flex gap-4">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                  alt="Rebirth in Destruction Reharmonization"
                  className="w-40 h-40 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 space-y-4">
                  <p className="text-slate-300">
                    A reharmonization of Love and Deepspace's "Rebirth in Destruction" with reimagined chord progressions that offer a more hopeful narrative arc.
                  </p>
                  <AudioPlayer
                    src="https://pub-18848117928e4ff497abec0a1725d007.r2.dev/piece_4.wav"
                    className="custom-audio-player"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Weightless Paradise R&B mix */}
          <AccordionItem
            value="music5"
            className="bg-purple-900 rounded-lg border border-purple-800"
          >
            <AccordionTrigger className="hover:no-underline px-4">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                  <span className="text-slate-100">
                    Weightless Paradise R&B mix
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded-full text-xs">
                    R&B
                  </span>
                  <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded-full text-xs">
                    Game Music
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="pt-4 flex gap-4">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                  alt="Weightless Paradise R&B mix"
                  className="w-40 h-40 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 space-y-4">
                  <p className="text-slate-300">
                    A smooth R&B reinterpretation of Love and Deepspace's character theme.
                  </p>
                  <AudioPlayer
                    src="https://pub-18848117928e4ff497abec0a1725d007.r2.dev/piece_5.wav"
                    className="custom-audio-player"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>
    </div>
  );
}
