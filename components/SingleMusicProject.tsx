import { MusicProject } from "@/data/projects";
import AudioPlayer from "react-h5-audio-player";
import { useEffect, useRef, useState } from "react";
import { AudioSpectrum } from "./ui/audio-spectrum";

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
      <div className="fixed inset-0 flex flex-col items-center justify-end z-10 pointer-events-none">
        {/* Bottom section with title, tags, audio player, and spectrum */}
        <div className="w-full pointer-events-auto pb-8">
          {/* Title centered above everything */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-purple-100">{project.title}</h2>
          </div>

          {/* Tags */}
          <div className="flex gap-2 flex-wrap mb-6 justify-center px-8">
            {project.tags.map((tag, index) => (
              <span
                key={index}
                className="px-4 py-1.5 bg-purple-500/10 text-purple-300 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Audio Player */}
          <div className="px-8 mb-0">
            <div className="max-w-3xl mx-auto bg-black/30 backdrop-blur-md rounded-t-2xl p-6 pb-8">
              <AudioPlayer
                key={project.id}
                ref={playerRef}
                src={project.audioUrl}
                className="custom-audio-player-minimal"
                showJumpControls={true}
                showSkipControls={false}
                layout="stacked"
                crossOrigin="anonymous"
              />
            </div>
          </div>

          {/* Audio Spectrum Visualizer - Full Width */}
          <AudioSpectrum
            audioElement={audioElement}
            className="w-full"
            barCount={128}
            minFrequency={20}
            maxFrequency={20000}
            smoothing={0.8}
            amplification={1.8}
            color="rgba(168, 85, 247, 0.9)"
            lineColor="rgba(192, 132, 252, 1)"
            barWidth={6}
            barGap={3}
          />
        </div>
      </div>
    );
};
