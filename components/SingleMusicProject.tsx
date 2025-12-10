import { MusicProject } from "@/data/projects";
import AudioPlayer from "react-h5-audio-player";
import { useEffect, useRef, useState } from "react";
import { AudioSpectrum } from "./ui/audio-spectrum";
import "react-h5-audio-player/lib/styles.css";

interface SingleMusicProjectProps {
  project: MusicProject;
  onAudioElement?: (element: HTMLAudioElement | null) => void;
}

export const SingleMusicProject = ({ project, onAudioElement }: SingleMusicProjectProps) => {
  const playerRef = useRef<AudioPlayer>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Extract and register audio element when player is ready
  useEffect(() => {
    const timer = setTimeout(() => {
      if (playerRef.current && playerRef.current.audio && playerRef.current.audio.current) {
        const element = playerRef.current.audio.current;
        setAudioElement(element);
        onAudioElement?.(element);
      }
    }, 100); // Small delay to ensure player is mounted

    return () => {
      clearTimeout(timer);
      setAudioElement(null);
      onAudioElement?.(null);
    };
  }, [project.id]); // Only re-run when project changes

    return (
      <>
        {/* Content section - h-screen */}
        <div className="h-screen w-full flex flex-col pointer-events-none">
          {/* Spacer for top credentials section */}
          <div className="h-32 flex-shrink-0" />

          {/* Centered content area */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full pointer-events-auto pb-20">
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
                  onLoadedMetadata={() => {
                    // Ensure audio element is registered when metadata loads
                    if (playerRef.current?.audio?.current) {
                      const element = playerRef.current.audio.current;
                      setAudioElement(element);
                      onAudioElement?.(element);
                    }
                  }}
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
