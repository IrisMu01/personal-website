import { ChevronLeft, ChevronRight } from "lucide-react";

interface Project {
  id: string;
  title: string;
  tags: string[];
}

interface ProjectSelectorProps {
  activeTab: "cs" | "music";
  setActiveTab: (tab: "cs" | "music") => void;
  projects: Project[];
  selectedProjectId: string;
  onProjectSelect: (id: string) => void;
}

export function ProjectSelector({
  activeTab,
  setActiveTab,
  projects,
  selectedProjectId,
  onProjectSelect,
}: ProjectSelectorProps) {
  const visibleCount = 3;
  const selectedIndex = projects.findIndex((p) => p.id === selectedProjectId);

  // Calculate which projects to show (show 3 at a time, centered on selected)
  const getVisibleProjects = () => {
    if (projects.length <= visibleCount) {
      return { projects, startIndex: 0 };
    }

    let startIndex = Math.max(0, selectedIndex - 1);
    if (startIndex + visibleCount > projects.length) {
      startIndex = projects.length - visibleCount;
    }

    return {
      projects: projects.slice(startIndex, startIndex + visibleCount),
      startIndex,
    };
  };

  const { projects: visibleProjects, startIndex } = getVisibleProjects();
  const canScrollLeft = startIndex > 0;
  const canScrollRight = startIndex + visibleCount < projects.length;

  const handleScrollLeft = () => {
    if (canScrollLeft) {
      const newIndex = Math.max(0, startIndex - 1);
      onProjectSelect(projects[newIndex].id);
    }
  };

  const handleScrollRight = () => {
    if (canScrollRight) {
      const newIndex = Math.min(projects.length - 1, startIndex + visibleCount);
      onProjectSelect(projects[newIndex].id);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-30 pt-8">
      <div className="flex flex-col items-center gap-6">
        {/* Tab Selector */}
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab("cs")}
            className={`text-2xl font-light transition-all duration-300 ${
              activeTab === "cs"
                ? "text-white scale-110"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            CS Projects
          </button>
          <button
            onClick={() => setActiveTab("music")}
            className={`text-2xl font-light transition-all duration-300 ${
              activeTab === "music"
                ? "text-white scale-110"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            Music Projects
          </button>
        </div>

        {/* Project Subtitles Carousel */}
        <div className="flex items-center gap-4">
          {/* Left Chevron */}
          <button
            onClick={handleScrollLeft}
            disabled={!canScrollLeft}
            className={`transition-opacity ${
              canScrollLeft ? "opacity-100 hover:opacity-70" : "opacity-0 pointer-events-none"
            }`}
          >
            <ChevronLeft className="w-5 h-5 text-white/60" />
          </button>

          {/* Project Titles */}
          <div className="flex gap-6 items-center">
            {visibleProjects.map((project) => (
              <button
                key={project.id}
                onClick={() => onProjectSelect(project.id)}
                className={`transition-all duration-300 ${
                  selectedProjectId === project.id
                    ? "text-white text-base scale-105"
                    : "text-white/50 text-sm hover:text-white/70"
                }`}
              >
                {project.title}
              </button>
            ))}
          </div>

          {/* Right Chevron */}
          <button
            onClick={handleScrollRight}
            disabled={!canScrollRight}
            className={`transition-opacity ${
              canScrollRight ? "opacity-100 hover:opacity-70" : "opacity-0 pointer-events-none"
            }`}
          >
            <ChevronRight className="w-5 h-5 text-white/60" />
          </button>
        </div>
      </div>
    </div>
  );
}
