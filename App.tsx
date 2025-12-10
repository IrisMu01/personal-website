import { useState, useEffect, useRef } from "react";
import { CredentialsSection } from "./components/CredentialsSection";
import { ProjectSelector } from "./components/ProjectSelector";
import { SingleCSProject } from "./components/SingleCSProject";
import { SingleMusicProject } from "./components/SingleMusicProject";
import { FluidParticles } from "./components/ui/fluid-particles";
import { csProjects, musicProjects } from "./data/projects";

export default function App() {
  // Unified project list combining CS and Music projects
  const unifiedProjects = [
    ...csProjects.map((p) => ({ ...p, type: "cs" as const })),
    ...musicProjects.map((p) => ({ ...p, type: "music" as const })),
  ];

  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const scrollAccumulatorRef = useRef(0);
  const isTransitioningRef = useRef(false);

  // Get current project and derive active tab from it
  const currentProject = unifiedProjects[currentProjectIndex];
  const activeTab = currentProject.type;

  // Separate current project into CS or Music type
  const selectedCSProject = currentProject.type === "cs" ? currentProject : csProjects[0];
  const selectedMusicProject = currentProject.type === "music" ? currentProject : musicProjects[0];

  // Prepare project list for selector (only show projects of current type)
  const currentProjects = activeTab === "cs"
    ? csProjects.map((p) => ({ id: p.id, title: p.title, tags: p.tags }))
    : musicProjects.map((p) => ({ id: p.id, title: p.title, tags: p.tags }));

  const currentSelectedId = currentProject.id;

  const handleProjectSelect = (id: string) => {
    // Find the index in the unified list
    const newIndex = unifiedProjects.findIndex((p) => p.id === id);
    if (newIndex !== -1) {
      setIsTransitioning(true);
      setCurrentProjectIndex(newIndex);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const setActiveTab = (tab: "cs" | "music") => {
    // When tab is switched manually, go to the first project of that type
    const newIndex = unifiedProjects.findIndex((p) => p.type === tab);
    if (newIndex !== -1) {
      setIsTransitioning(true);
      setCurrentProjectIndex(newIndex);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  // Scroll detection for unified project navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isTransitioningRef.current) return;

      scrollAccumulatorRef.current += e.deltaY;

      if (Math.abs(scrollAccumulatorRef.current) > 100) {
        let newIndex = currentProjectIndex;

        if (scrollAccumulatorRef.current > 0 && currentProjectIndex < unifiedProjects.length - 1) {
          // Scroll down - next project
          newIndex = currentProjectIndex + 1;
        } else if (scrollAccumulatorRef.current < 0 && currentProjectIndex > 0) {
          // Scroll up - previous project
          newIndex = currentProjectIndex - 1;
        }

        if (newIndex !== currentProjectIndex) {
          isTransitioningRef.current = true;
          setIsTransitioning(true);
          setCurrentProjectIndex(newIndex);

          // Reset after transition
          setTimeout(() => {
            isTransitioningRef.current = false;
            setIsTransitioning(false);
          }, 500);
        }

        scrollAccumulatorRef.current = 0;
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [currentProjectIndex, unifiedProjects.length]);

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
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />

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

      {/* Project Display with smooth transitions */}
      <div
        className={`transition-opacity duration-500 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        {activeTab === "cs" ? (
          <SingleCSProject project={selectedCSProject} />
        ) : (
          <SingleMusicProject project={selectedMusicProject} />
        )}
      </div>
    </div>
  );
}
