import { MusicProject } from "@/data/projects";
import AudioPlayer from "react-h5-audio-player";
import { useEffect, useRef, useState } from "react";
import { AudioSpectrum } from "./ui/audio-spectrum";
import { MidiPianoRoll } from "./ui/midi-piano-roll";
import "react-h5-audio-player/lib/styles.css";

interface SingleMusicProjectProps {
  project: MusicProject;
  onAudioElement?: (element: HTMLAudioElement | null) => void;
}

export const SingleMusicProject = ({ project, onAudioElement }: SingleMusicProjectProps) => {
  const playerRef = useRef<AudioPlayer>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Get the actual audio element from the player and pass it to the callback
    if (playerRef.current && playerRef.current.audio && playerRef.current.audio.current) {
      const element = playerRef.current.audio.current;
      setAudioElement(element);
      onAudioElement?.(element);

      // Track play/pause state
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);

      element.addEventListener("play", handlePlay);
      element.addEventListener("pause", handlePause);

      return () => {
        element.removeEventListener("play", handlePlay);
        element.removeEventListener("pause", handlePause);
      };
    }

    // Cleanup: set to null when component unmounts or project changes
    return () => {
      setAudioElement(null);
      onAudioElement?.(null);
    };
  }, [onAudioElement, project.audioUrl]);

    return (
      <>
        {/* Black overlay - fades in/out with music */}
        <div
          className="fixed inset-0 bg-black pointer-events-none transition-opacity duration-700 -z-10"
          style={{ opacity: isPlaying ? (project.overlayOpacity ?? 0.6) : 0 }}
        />

        {/* Content section - h-screen */}
        <div className="h-screen w-full flex flex-col pointer-events-none">
          {/* Spacer for top credentials section */}
          <div className="h-32 flex-shrink-0" />

          {/* Centered content area */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full pointer-events-auto pb-20">
              {/* MIDI Piano Roll - positioned at top, fades in/out with music */}
              {project.midiTracks && (
                <MidiPianoRoll
                  midiTracks={project.midiTracks}
                  audioElement={audioElement}
                  isPlaying={isPlaying}
                  opacity={isPlaying ? 1 : 0}
                  cornerRadius={project.noteCornerRadius}
                  noteMargin={project.noteMargin}
                  maxNoteHeight={project.noteMaxHeight}
                  anticipatoryGlow={project.anticipatoryGlow}
                />
              )}

              {/* Title left-aligned, smaller font */}
              <div className="mb-4 px-8">
                <h2 className="text-2xl font-bold text-purple-100">{project.title}</h2>
              </div>

              {/* Tags - white with 0.75 opacity, left-aligned */}
              <div className="flex gap-2 flex-wrap mb-6 px-8">
                {project.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white/10 text-white/75 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Audio Player - Full Width, Custom Layout */}
              <div className="w-full mb-0">
                <AudioPlayer
                  key={project.id}
                  ref={playerRef}
                  src={project.audioUrl}
                  className="custom-audio-player-fullwidth"
                  showJumpControls={true}
                  showSkipControls={false}
                  customAdditionalControls={[]}
                  customVolumeControls={[]}
                  customProgressBarSection={[
                    "PROGRESS_BAR",
                  ]}
                  customControlsSection={[
                    "CURRENT_TIME",
                    "LOOP",
                    "REWIND",
                    "MAIN_CONTROLS",
                    "FORWARD",
                    <div key="spacer" style={{ flex: 1 }} />,
                    "VOLUME",
                    "DURATION",
                  ]}
                  layout="horizontal-reverse"
                  crossOrigin="anonymous"
                />
              </div>

              {/* Audio Spectrum Visualizer - Full Width, No Gap */}
              <AudioSpectrum
                audioElement={audioElement}
                className="w-full"
                barCount={256}
                minFrequency={20}
                maxFrequency={20000}
                smoothing={0.75}
                amplification={1.5}
              />
            </div>
          </div>
        </div>

        {/* Bottom spacer - 50vh for scroll transition buffer */}
        <div className="h-[50vh] w-full pointer-events-none" />
      </>
    );
};
