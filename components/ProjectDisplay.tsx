import { useState, useRef } from "react";
import { CSProjectsTab } from "./CSProjectsTab";
import { MusicProjectsTab } from "./MusicProjectsTab";
import { DragHandles } from "./DragHandles";

interface ProjectDisplayProps {
  activeTab: "cs" | "music";
  setActiveTab: (tab: "cs" | "music") => void;
}

export function ProjectDisplay({
  activeTab,
  setActiveTab,
}: ProjectDisplayProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartX = useRef(0);
  const DRAG_THRESHOLD = 100; // pixels to drag before switching

  const handleDragStart = (
    e: React.MouseEvent | React.TouchEvent,
  ) => {
    setIsDragging(true);
    const clientX =
      "touches" in e ? e.touches[0].clientX : e.clientX;
    dragStartX.current = clientX;
  };

  const handleDragMove = (
    e: React.MouseEvent | React.TouchEvent,
  ) => {
    if (!isDragging) return;

    const clientX =
      "touches" in e ? e.touches[0].clientX : e.clientX;
    const offset = clientX - dragStartX.current;
    // Add friction: component moves half as much as cursor
    setDragOffset(offset / 2);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;

    // Check if dragged beyond threshold
    if (activeTab === "cs" && dragOffset < -DRAG_THRESHOLD) {
      setActiveTab("music");
    } else if (
      activeTab === "music" &&
      dragOffset > DRAG_THRESHOLD
    ) {
      setActiveTab("cs");
    }

    setIsDragging(false);
    setDragOffset(0);
  };

  return (
    <div
      className={`flex-1 relative overflow-hidden ${isDragging ? "select-none" : ""}`}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
    >
      <CSProjectsTab
        isDragging={isDragging}
        dragOffset={dragOffset}
        activeTab={activeTab}
      />

      <MusicProjectsTab
        isDragging={isDragging}
        dragOffset={dragOffset}
        activeTab={activeTab}
      />

      <DragHandles
        activeTab={activeTab}
        isDragging={isDragging}
        dragOffset={dragOffset}
        onDragStart={handleDragStart}
      />
    </div>
  );
}
