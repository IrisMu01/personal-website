import { Github, Linkedin, Mail } from "lucide-react";
import { ShootingStars } from "./ui/shooting-stars";

interface CredentialsSectionProps {
  activeTab: "cs" | "music";
}

export function CredentialsSection({ activeTab }: CredentialsSectionProps) {
  return (
    <header
      className={`border-b relative z-20 transition-colors duration-700 overflow-hidden ${
        activeTab === "cs"
          ? "bg-slate-900 border-slate-800"
          : "bg-purple-900 border-purple-800"
      }`}
    >
      <ShootingStars />
      <div className="px-4 py-8 relative z-10">
        <div className="flex items-start gap-6">
          {/* Profile Picture */}
          <img
            src="/assets/profile_pic.png"
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-slate-700"
          />
          
          <div className="flex-1">
            <h1 className="text-slate-100 mb-2">John Doe</h1>
            <p className="text-slate-400 mb-4">
              Computer Science & Music Production
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-slate-400 hover:text-slate-100 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-slate-100 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-slate-100 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}