import { MusicProject } from "@/data/projects";
import AudioPlayer from "react-h5-audio-player";
import { forwardRef, useEffect, useRef } from "react";

interface SingleMusicProjectProps {
  project: MusicProject;
}

export const SingleMusicProject = forwardRef<HTMLAudioElement, SingleMusicProjectProps>(
  ({ project }, audioRef) => {
    const playerRef = useRef<AudioPlayer>(null);

    useEffect(() => {
      // Get the actual audio element from the player and set it to the ref
      if (playerRef.current && playerRef.current.audio && playerRef.current.audio.current) {
        const audioElement = playerRef.current.audio.current;
        if (typeof audioRef === 'function') {
          audioRef(audioElement);
        } else if (audioRef) {
          (audioRef as React.MutableRefObject<HTMLAudioElement | null>).current = audioElement;
        }
      }
    }, [audioRef, project.audioUrl]);

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

            {/* Audio Player */}
            <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6">
              <AudioPlayer
                ref={playerRef}
                src={project.audioUrl}
                className="custom-audio-player-minimal"
                showJumpControls={true}
                showSkipControls={false}
                layout="horizontal"
                crossOrigin="anonymous"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

SingleMusicProject.displayName = "SingleMusicProject";
