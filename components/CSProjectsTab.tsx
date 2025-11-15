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
            Computer Science Projects
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
                    AI-Powered Code Assistant
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                    Python
                  </span>
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                    TensorFlow
                  </span>
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                    React
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="pt-4 space-y-4">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1652696290920-ee4c836c711e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjBwcm9ncmFtbWluZyUyMGxhcHRvcHxlbnwxfHx8fDE3NjEyNDM5NjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Coding project"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <p className="text-slate-300">
                  Developed an intelligent code assistant
                  using GPT-4 API and custom fine-tuning.
                  The system helps developers write cleaner
                  code with real-time suggestions and
                  automated refactoring.
                </p>
                <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
                  <p className="text-slate-500">
                    Demo Video Placeholder
                  </p>
                </div>
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
                    Distributed Task Queue System
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                    Go
                  </span>
                  <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                    Redis
                  </span>
                  <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                    Docker
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="pt-4 space-y-4">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1658806277165-af0b60eb6733?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHNjaWVuY2UlMjBhYnN0cmFjdHxlbnwxfHx8fDE3NjEyNDk5NzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="System architecture"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <p className="text-slate-300">
                  Built a high-performance distributed task
                  queue capable of processing millions of
                  jobs per day. Features include priority
                  scheduling, failure recovery, and
                  horizontal scaling.
                </p>
                <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                  <h4 className="text-slate-100 mb-2">
                    Key Features
                  </h4>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    <li>Processes 5M+ tasks daily</li>
                    <li>
                      99.9% uptime with automatic failover
                    </li>
                    <li>Real-time monitoring dashboard</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="project3"
            className="bg-slate-900 rounded-lg border border-slate-800"
          >
            <AccordionTrigger className="hover:no-underline px-4">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-slate-100">
                    Real-Time Collaboration Platform
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-2 py-0.5 bg-green-500/20 text-green-300 rounded-full text-xs">
                    TypeScript
                  </span>
                  <span className="px-2 py-0.5 bg-green-500/20 text-green-300 rounded-full text-xs">
                    WebRTC
                  </span>
                  <span className="px-2 py-0.5 bg-green-500/20 text-green-300 rounded-full text-xs">
                    Node.js
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
                    <p className="text-slate-500">
                      Screenshot 1
                    </p>
                  </div>
                  <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
                    <p className="text-slate-500">
                      Screenshot 2
                    </p>
                  </div>
                </div>
                <p className="text-slate-300">
                  Created a web-based collaboration platform
                  with real-time document editing, video
                  conferencing, and project management
                  tools. Uses WebRTC and operational
                  transformation algorithms.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>
    </div>
  );
}
