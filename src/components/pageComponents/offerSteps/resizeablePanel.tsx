import type React from "react";
import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ResizablePanelProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  defaultLeftWidth?: string;
  minLeftWidth?: string;
  maxLeftWidth?: string;
}

function ResizablePanel({
  leftPanel,
  rightPanel,
  defaultLeftWidth = "55%",
  minLeftWidth = "40%",
  maxLeftWidth = "80%",
}: ResizablePanelProps) {
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    const preventSelection = (e: Event) => {
      if (isDragging.current) {
        e.preventDefault();
      }
    };
    document.addEventListener("selectstart", preventSelection);
    return () => document.removeEventListener("selectstart", preventSelection);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const minWidthPx = parseFloat(minLeftWidth) * containerRect.width / 100;
    const maxWidthPx = parseFloat(maxLeftWidth) * containerRect.width / 100;
    let newWidthPx = e.clientX - containerRect.left;

    // Clamp the new width between min and max
    newWidthPx = Math.max(minWidthPx, Math.min(newWidthPx, maxWidthPx));
    const newWidthPercent = (newWidthPx / containerRect.width) * 100;

    setLeftWidth(`${newWidthPercent}%`);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.body.style.cursor = "default";
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full relative select-none min-w-0" // Added min-w-0 to prevent overflow
      style={{ position: "relative", overflow: "hidden" }}
    >
      <div 
        style={{ width: leftWidth, minWidth: minLeftWidth, maxWidth: maxLeftWidth }} 
        className="h-[91vh] shrink-0" // Added shrink-0 to prevent squashing
      >
        {leftPanel}
      </div>
      {/* Vertical divider */}
      <div
        className={cn(
          "absolute w-1 bg-[#e7ecf5] h-full custom-resize-cursor z-50",
          isDragging.current && "cursor-grabbing"
        )}
        style={{
          left: leftWidth,
          transform: "translateX(-50%)",
        }}
        onMouseDown={handleMouseDown}
      />
<div
        className="h-full bg-[#F4F4F4] overflow-y-auto"
        style={{
          width: `calc(100% - ${leftWidth})`,
          minWidth: "20%",
        }}
      >
        {rightPanel}
      </div>
    </div>
  );
}

export default ResizablePanel;