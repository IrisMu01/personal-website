import { useState } from "react";
import { CredentialsSection } from "./components/CredentialsSection";
import { ProjectDisplay } from "./components/ProjectDisplay";
import { Particles } from "./components/ui/particles";
import { Flower } from "lucide-react";
import { createRoot } from "react-dom/client";

export default function App() {
  const [activeTab, setActiveTab] = useState<"cs" | "music">("cs");

  // Ripple effect on click anywhere on page
  const createRipple = (e: React.MouseEvent) => {
    const ripple = document.createElement("span");
    const size = 60; // max 60px

    ripple.className = "ripple";
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - size / 2}px`;
    ripple.style.top = `${e.clientY - size / 2}px`;
    ripple.style.position = "fixed";
    ripple.style.zIndex = "9999";

    document.body.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);

    // Create flower icon
    const flowerContainer = document.createElement("div");
    flowerContainer.className = "flower-icon";
    flowerContainer.style.left = `${e.clientX}px`;
    flowerContainer.style.top = `${e.clientY}px`;
    flowerContainer.style.position = "fixed";
    flowerContainer.style.zIndex = "9999";
    flowerContainer.style.pointerEvents = "none";
    
    document.body.appendChild(flowerContainer);
    const root = createRoot(flowerContainer);
    root.render(<Flower size={size} strokeWidth={1.5} />);

    setTimeout(() => {
      root.unmount();
      flowerContainer.remove();
    }, 600);
  };

  return (
    <div
      className={`min-h-screen flex flex-col relative transition-colors duration-700 ${
        activeTab === "cs" ? "bg-slate-950" : "bg-purple-950"
      }`}
      onClick={createRipple}
    >
      {/* Particles Background */}
      <Particles
        className="absolute inset-0 pointer-events-none"
        quantity={80}
        ease={50}
        color={activeTab === "cs" ? "#ffe5db" : "#dbe8ff"}
        refresh={false}
      />
      
      <CredentialsSection activeTab={activeTab} />
      <ProjectDisplay activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
