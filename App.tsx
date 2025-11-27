import { useState, useRef } from "react";
import { CredentialsSection } from "./components/CredentialsSection";
import { ProjectSelector } from "./components/ProjectSelector";
import { SingleCSProject } from "./components/SingleCSProject";
import { SingleMusicProject } from "./components/SingleMusicProject";
import { FluidParticles } from "./components/ui/fluid-particles";
import { AudioReactiveParticles } from "./components/ui/audio-reactive-particles";
import { csProjects, musicProjects } from "./data/projects";

export default function App() {
  const [activeTab, setActiveTab] = useState<"cs" | "music">("cs");
  const [selectedCSProjectId, setSelectedCSProjectId] = useState(csProjects[0].id);
  const [selectedMusicProjectId, setSelectedMusicProjectId] = useState(musicProjects[0].id);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Get currently selected projects
  const selectedCSProject = csProjects.find((p) => p.id === selectedCSProjectId) || csProjects[0];
  const selectedMusicProject = musicProjects.find((p) => p.id === selectedMusicProjectId) || musicProjects[0];

  // Prepare project list for selector
  const currentProjects = activeTab === "cs"
    ? csProjects.map((p) => ({ id: p.id, title: p.title, tags: p.tags }))
    : musicProjects.map((p) => ({ id: p.id, title: p.title, tags: p.tags }));

  const currentSelectedId = activeTab === "cs" ? selectedCSProjectId : selectedMusicProjectId;

  const handleProjectSelect = (id: string) => {
    if (activeTab === "cs") {
      setSelectedCSProjectId(id);
    } else {
      setSelectedMusicProjectId(id);
    }
  };

  return (
    <div
      className={`min-h-screen w-full fixed inset-0 transition-colors duration-700 overflow-hidden ${
        activeTab === "cs" ? "bg-slate-950" : "bg-purple-950"
      }`}
    >
      {/* Particle Background - Different for each tab */}
      {activeTab === "cs" ? (
        <FluidParticles className="absolute inset-0 pointer-events-none z-0" />
      ) : (
        <AudioReactiveParticles
          className="absolute inset-0 pointer-events-none z-0"
          audioElement={audioRef.current}
        />
      )}

      {/* Credentials - Top Left */}
      <CredentialsSection activeTab={activeTab} />

      {/* Project Selector - Top Center */}
      <ProjectSelector
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        projects={currentProjects}
        selectedProjectId={currentSelectedId}
        onProjectSelect={handleProjectSelect}
      />

      {/* Project Display */}
      {activeTab === "cs" ? (
        <SingleCSProject project={selectedCSProject} />
      ) : (
        <SingleMusicProject project={selectedMusicProject} ref={audioRef} />
      )}
    </div>
  );
}
