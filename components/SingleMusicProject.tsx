import { MusicProject } from "@/data/projects";
import AudioPlayer from "react-h5-audio-player";
import { useEffect, useRef } from "react";

interface SingleMusicProjectProps {
  project: MusicProject;
  onAudioElement?: (element: HTMLAudioElement | null) => void;
}

export const SingleMusicProject = ({ project, onAudioElement }: SingleMusicProjectProps) => {
  const playerRef = useRef<AudioPlayer>(null);

  useEffect(() => {
    // Get the actual audio element from the player and pass it to the callback
    if (playerRef.current && playerRef.current.audio && playerRef.current.audio.current) {
      const audioElement = playerRef.current.audio.current;
      onAudioElement?.(audioElement);
    }

    // Cleanup: set to null when component unmounts or project changes
    return () => {
      onAudioElement?.(null);
    };
  }, [onAudioElement, project.audioUrl]);

    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        {/* Center area reserved for audio-reactive particles */}
        <div className="flex-1" />

        {/* Bottom section with tags and audio player */}
        <div className="pb-12 px-8 w-full pointer-events-auto">
          <div className="max-w-3xl mx-auto">
            {/* Tags */}
            <div className="flex gap-2 flex-wrap mb-6 justify-center">
              {project.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-1.5 bg-purple-500/10 text-purple-300 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Audio Player. CrossOrigin must NOT be anonymous - R2 will reject request */}
            <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6">
              <AudioPlayer
                key={project.id}
                ref={playerRef}
                src={project.audioUrl}
                className="custom-audio-player-minimal"
                showJumpControls={true}
                showSkipControls={false}
                layout="stacked"
              />
            </div>
          </div>
        </div>
      </div>
    );
};
