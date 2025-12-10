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

  useEffect(() => {
    // Get the actual audio element from the player and pass it to the callback
    if (playerRef.current && playerRef.current.audio && playerRef.current.audio.current) {
      const element = playerRef.current.audio.current;
      setAudioElement(element);
      onAudioElement?.(element);
    }

    // Cleanup: set to null when component unmounts or project changes
    return () => {
      setAudioElement(null);
      onAudioElement?.(null);
    };
  }, [onAudioElement, project.audioUrl]);

    return (
      <div className="h-full w-full flex flex-col pointer-events-none">
        {/* Spacer for top credentials section */}
        <div className="h-32 flex-shrink-0" />

        {/* Centered content area */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full pointer-events-auto pb-32">
          {/* Title left-aligned, larger */}
          <div className="mb-6 px-8">
            <h2 className="text-4xl font-bold text-purple-100">{project.title}</h2>
          </div>

          {/* Tags - white with 0.75 opacity, left-aligned */}
          <div className="flex gap-2 flex-wrap mb-8 px-8">
            {project.tags.map((tag, index) => (
              <span
                key={index}
                className="px-4 py-1.5 bg-white/10 text-white/75 rounded-full text-sm"
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
    );
};
