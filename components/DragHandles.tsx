import { CodeXml, Music2, ChevronLeft, ChevronRight } from "lucide-react";

interface DragHandlesProps {
  activeTab: "cs" | "music";
  isDragging: boolean;
  dragOffset: number;
  onDragStart: (e: React.MouseEvent | React.TouchEvent) => void;
}

export function DragHandles({
  activeTab,
  isDragging,
  dragOffset,
  onDragStart,
}: DragHandlesProps) {
  return (
    <>
      {/* Right Drag Handle - Shows when CS tab is active */}
      {activeTab === "cs" && (
        <div
          className="absolute top-0 bottom-0 flex flex-row cursor-grab active:cursor-grabbing z-10"
          onMouseDown={onDragStart}
          onTouchStart={onDragStart}
          style={{
            right: "-300px",
            transform: isDragging
              ? `translateX(${dragOffset}px)`
              : "translateX(0)",
            transition: isDragging
              ? "none"
              : "transform 0.3s ease-out",
          }}
        >
          <div className="flex flex-col items-end">
            {/* Top box - wide rectangular with arrow and icon in same row */}
            <div className="bg-purple-600 w-16 h-16 flex flex-row items-center justify-center gap-1 rounded-l-lg shadow-lg">
              <ChevronLeft className="w-5 h-5 text-white animate-pulse" />
              <Music2 className="w-6 h-6 text-white" />
            </div>
            {/* Bottom box - thin bar stretching remaining height, aligned to right */}
            <div className="bg-purple-600 w-10 flex-1"></div>
          </div>

          {/* 3rd box - gradient fade right to left (transparent on right) */}
          <div className="bg-gradient-to-r from-purple-600 to-transparent w-[300px] flex-1"></div>
        </div>
      )}

      {/* Left Drag Handle - Shows when Music tab is active */}
      {activeTab === "music" && (
        <div
          className="absolute top-0 bottom-0 flex flex-row cursor-grab active:cursor-grabbing z-10"
          onMouseDown={onDragStart}
          onTouchStart={onDragStart}
          style={{
            left: "-600px",
            transform: isDragging
              ? `translateX(${dragOffset}px)`
              : "translateX(0)",
            transition: isDragging
              ? "none"
              : "transform 0.3s ease-out",
          }}
        >
          {/* 3rd box - gradient fade left to right (transparent on left) */}
          <div className="bg-gradient-to-l from-slate-900 to-transparent w-[600px] flex-1"></div>

          <div className="flex flex-col">
            {/* Top box - wide rectangular with icon and arrow in same row */}
            <div className="bg-slate-900 w-16 h-16 flex flex-row items-center justify-center gap-1 rounded-r-lg shadow-lg">
              <CodeXml className="w-6 h-6 text-white" />
              <ChevronRight className="w-5 h-5 text-white animate-pulse" />
            </div>
            {/* Bottom box - thin bar stretching remaining height */}
            <div className="bg-slate-900 w-10 flex-1"></div>
          </div>
        </div>
      )}
    </>
  );
}
