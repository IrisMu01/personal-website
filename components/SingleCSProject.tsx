import { CSProject } from "@/data/projects";

interface SingleCSProjectProps {
  project: CSProject;
}

export function SingleCSProject({ project }: SingleCSProjectProps) {
  return (
    <>
      {/* Content section - h-screen */}
      <div className="h-screen w-full flex flex-col pointer-events-none">
        {/* Spacer for top credentials section */}
        <div className="h-32 flex-shrink-0" />

        {/* Centered content area */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full pointer-events-auto pb-20">
            {/* Title - left-aligned, smaller font */}
            <div className="mb-4 px-8">
              <h2 className="text-2xl font-bold text-cyan-100">{project.title}</h2>
            </div>

            {/* Tags - left-aligned with fully transparent background */}
            <div className="flex gap-2 flex-wrap mb-6 px-8">
              {project.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-transparent text-cyan-300 rounded-full text-xs border border-cyan-500/30"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Description - left-aligned */}
            <div className="space-y-2 mb-6 px-8">
              {project.description.map((paragraph, index) => (
                <p key={index} className="text-white/80 text-sm leading-relaxed">
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
                  style={{ maxHeight: "35vh" }}
                >
                  <source src={project.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom spacer - 50vh for scroll transition buffer */}
      <div className="h-[50vh] w-full pointer-events-none" />
    </>
  );
}
