import { Github, Linkedin, Mail } from "lucide-react";

interface CredentialsSectionProps {
  activeTab: "cs" | "music";
}

export function CredentialsSection({ activeTab }: CredentialsSectionProps) {
  return (
    <div className="fixed top-8 left-8 z-40">
      <div className="flex items-center gap-4">
        {/* Profile Picture */}
        <img
          src="/assets/profile_pic.png"
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover border border-white/20"
        />

        <div>
          <h1 className="text-white text-lg font-light mb-1">Iris Mu</h1>
          <div className="flex gap-3">
            <a
              href="https://github.com/IrisMu01"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/iris-mu/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="mailto:l5mu@uwaterloo.ca"
              className="text-white/60 hover:text-white transition-colors"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}