import { CSProject } from "@/data/projects";

interface SingleCSProjectProps {
  project: CSProject;
}

export function SingleCSProject({ project }: SingleCSProjectProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 pb-12 px-8">
      <div className="max-w-5xl mx-auto">
        {/* Video/Media Display */}
        {project.videoUrl && (
          <div className="mb-8 flex justify-center">
            <video
              className="w-full max-w-3xl rounded-lg shadow-2xl"
              controls
              muted
              loop
              playsInline
              style={{ maxHeight: "50vh" }}
            >
              <source src={project.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {/* Project Details */}
        <div className="bg-black/20 backdrop-blur-md rounded-2xl p-8 border border-white/10">
          {/* Tags */}
          <div className="flex gap-2 flex-wrap mb-6 justify-center">
            {project.tags.map((tag, index) => (
              <span
                key={index}
                className="px-4 py-1.5 bg-cyan-500/10 text-cyan-300 rounded-full text-sm border border-cyan-500/20"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Description */}
          <div className="space-y-3">
            {project.description.map((paragraph, index) => (
              <p key={index} className="text-white/70 text-center leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
