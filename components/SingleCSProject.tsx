import { CSProject } from "@/data/projects";

interface SingleCSProjectProps {
  project: CSProject;
}

export function SingleCSProject({ project }: SingleCSProjectProps) {
  return (
    <div className="fixed inset-0 flex flex-col items-start justify-end z-20 pointer-events-none">
      {/* Bottom section with title, tags, description, and video */}
      <div className="w-full pointer-events-auto pb-32">
        {/* Title - left-aligned, larger, consistent with music projects */}
        <div className="mb-6 px-8">
          <h2 className="text-4xl font-bold text-cyan-100">{project.title}</h2>
        </div>

        {/* Tags - left-aligned with fully transparent background */}
        <div className="flex gap-2 flex-wrap mb-8 px-8">
          {project.tags.map((tag, index) => (
            <span
              key={index}
              className="px-4 py-1.5 bg-transparent text-cyan-300 rounded-full text-sm border border-cyan-500/30"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Description - left-aligned */}
        <div className="space-y-3 mb-8 px-8">
          {project.description.map((paragraph, index) => (
            <p key={index} className="text-white/80 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Video/Media Display - if available */}
        {project.videoUrl && (
          <div className="px-8">
            <video
              className="w-full max-w-3xl rounded-lg shadow-2xl"
              controls
              muted
              loop
              playsInline
              style={{ maxHeight: "40vh" }}
            >
              <source src={project.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>
    </div>
  );
}
