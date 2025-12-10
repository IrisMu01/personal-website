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
  const scrollAccumulatorRef = useRef(0);
  const isScrollingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get current project and derive active tab from it
  const currentProject = unifiedProjects[currentProjectIndex];
  const activeTab = currentProject.type;

  // Prepare project list for selector (only show projects of current type)
  const currentProjects = activeTab === "cs"
    ? csProjects.map((p) => ({ id: p.id, title: p.title, tags: p.tags }))
    : musicProjects.map((p) => ({ id: p.id, title: p.title, tags: p.tags }));

  const currentSelectedId = currentProject.id;

  const scrollToProject = (index: number) => {
    if (containerRef.current && index >= 0 && index < unifiedProjects.length) {
      const targetElement = containerRef.current.children[index] as HTMLElement;
      if (targetElement) {
        isScrollingRef.current = true;
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        setCurrentProjectIndex(index);

        // Reset scrolling flag after animation
        setTimeout(() => {
          isScrollingRef.current = false;
          scrollAccumulatorRef.current = 0;
        }, 700);
      }
    }
  };

  const handleProjectSelect = (id: string) => {
    // Find the index in the unified list
    const newIndex = unifiedProjects.findIndex((p) => p.id === id);
    if (newIndex !== -1) {
      scrollToProject(newIndex);
    }
  };

  const setActiveTab = (tab: "cs" | "music") => {
    // When tab is switched manually, go to the first project of that type
    const newIndex = unifiedProjects.findIndex((p) => p.type === tab);
    if (newIndex !== -1) {
      scrollToProject(newIndex);
    }
  };

  // Scroll detection for snap navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isScrollingRef.current) return;

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
          scrollToProject(newIndex);
        } else {
          scrollAccumulatorRef.current = 0;
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [currentProjectIndex, unifiedProjects.length]);

  return (
    <div
      className={`min-h-screen w-full fixed inset-0 transition-colors duration-700 ${
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

      {/* Project Selector - Bottom Left */}
      <ProjectSelector
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        projects={currentProjects}
        selectedProjectId={currentSelectedId}
        onProjectSelect={handleProjectSelect}
      />

      {/* Scrollable container with all projects */}
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-y-auto overflow-x-hidden scroll-smooth"
        style={{ scrollSnapType: "y mandatory" }}
      >
        {unifiedProjects.map((project, index) => (
          <div
            key={project.id}
            className="min-h-screen w-full relative"
            style={{ scrollSnapAlign: "start" }}
          >
            {project.type === "cs" ? (
              <SingleCSProject project={project} />
            ) : (
              <SingleMusicProject project={project} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
