import { useState } from "react";
import { CredentialsSection } from "./components/CredentialsSection";
import { ProjectSelector } from "./components/ProjectSelector";
import { SingleCSProject } from "./components/SingleCSProject";
import { SingleMusicProject } from "./components/SingleMusicProject";
import { FluidParticles } from "./components/ui/fluid-particles";
import { csProjects, musicProjects } from "./data/projects";

export default function App() {
  const [activeTab, setActiveTab] = useState<"cs" | "music">("cs");
  const [selectedCSProjectId, setSelectedCSProjectId] = useState(csProjects[0].id);
  const [selectedMusicProjectId, setSelectedMusicProjectId] = useState(musicProjects[0].id);

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
        activeTab === "cs" ? "bg-black" : "bg-black"
      }`}
    >
      {/* Particle Background - Changes color based on active tab */}
      <FluidParticles
        className="absolute inset-0 pointer-events-none z-0"
        hueMin={activeTab === "cs" ? 180 : 250}
        hueMax={activeTab === "cs" ? 240 : 330}
        lightness={activeTab === "cs" ? 60 : 70}
      />

      {/* Gradient overlays for text protection */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-10" />

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
        <SingleMusicProject project={selectedMusicProject} />
      )}
    </div>
  );
}
