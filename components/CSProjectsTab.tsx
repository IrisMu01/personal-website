import { CodeXml } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface CSProjectsTabProps {
  isDragging: boolean;
  dragOffset: number;
  activeTab: "cs" | "music";
}

export function CSProjectsTab({
  isDragging,
  dragOffset,
  activeTab,
}: CSProjectsTabProps) {
  return (
    <div
      className={`absolute inset-0 overflow-auto ${!isDragging ? "transition-transform duration-700 ease-out" : ""}`}
      style={{
        transform: isDragging
          ? activeTab === "music"
            ? `translateX(-100%) translateX(${dragOffset}px)`
            : `translateX(${dragOffset}px)`
          : activeTab === "cs"
            ? "translateX(0)"
            : "translateX(-100%)",
      }}
    >
      <main className="px-4 py-6 min-h-full pr-20">
        <div className="flex items-center gap-3 mb-4">
          <CodeXml className="w-6 h-6 text-blue-400" />
          <h2 className="text-slate-100">
            CS Projects
          </h2>
        </div>

        <Accordion
          type="single"
          collapsible
          className="space-y-3"
          defaultValue="project1"
        >
          <AccordionItem
            value="project1"
            className="bg-slate-900 rounded-lg border border-slate-800"
          >
            <AccordionTrigger className="hover:no-underline px-4">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-slate-100">
                    Mock Interview Multi-Agent Chatbot
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                    React
                  </span>
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                    Redux
                  </span>
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                    FastAPI
                  </span>
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                    Google ADK
                  </span>
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                    Vertex AI
                  </span>
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                    Terraform
                  </span>
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                    GCP
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="pt-4 space-y-4">
                <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
                <video 
                  className="w-full aspect-video rounded-lg border border-slate-700"
                  controls
                  muted
                  loop
                  playsInline
                >
                  <source src="https://pub-18848117928e4ff497abec0a1725d007.r2.dev/mock_interview_bot_demo.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                </div>
                <ul className="list-disc list-inside text-slate-300 space-y-2">
                  <li>
                    Built a multi-agent AI chatbot to practice LeetCode-style interviews using Google Agent Development Kit.
                  </li>
                  <li>
                    Simulated the white-boarding technical interview process by building sub-agents to generate Python test harness based on user-submitted solution and test cases, execute test harness, and generate feedback in natural English.
                  </li>
                  <li>
                    Built the front-end as a single-page React application and deployed to GCP with Terraform.
                  </li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="project2"
            className="bg-slate-900 rounded-lg border border-slate-800"
          >
            <AccordionTrigger className="hover:no-underline px-4">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span className="text-slate-100">
                    Mini Map RPG
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                    React
                  </span>
                  <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                    Node.js
                  </span>
                  <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                    Docker
                  </span>
                  <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                    RabbitMQ
                  </span>
                  <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                    Redis
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="pt-4 space-y-4">
                <ul className="list-disc list-inside text-slate-300 space-y-2">
                  <li>
                    Architected and implemented a mini-map, turn-based RPG game with a React front-end and 4 Node.js microservices each handling authentication, user registration, creating/loading game saves, and logging.
                  </li>
                  <li>
                    Packaged services with Docker and added health checks; dev stack used hosted DB/Redis and local RabbitMQ.
                  </li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>
    </div>
  );
}