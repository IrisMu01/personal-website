import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { useMidiData, ParsedNote } from "@/hooks/useMidiData";
import { MidiTrack } from "@/data/projects";

interface MidiPianoRollProps {
  midiTracks?: MidiTrack[];
  audioElement: HTMLAudioElement | null;
  isPlaying: boolean;
  opacity: number;

  // Styling (with defaults)
  cornerRadius?: number;      // default: 2px
  noteMargin?: number;        // default: 1px
  maxNoteHeight?: number;     // default: 4px
  anticipatoryGlow?: number;  // default: 0.1s (fade-in/fade-out duration)
}

export function MidiPianoRoll({
  midiTracks,
  audioElement,
  isPlaying,
  opacity,
  cornerRadius = 2,
  noteMargin = 1,
  maxNoteHeight = 4,
  anticipatoryGlow = 0.1,
}: MidiPianoRollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const noteGraphicsRef = useRef<Map<ParsedNote, PIXI.Graphics>>(new Map());
  const midiData = useMidiData(midiTracks);

  // Initialize PixiJS app
  useEffect(() => {
    if (!containerRef.current || !midiData) return;

    const app = new PIXI.Application();

    app.init({
      width: window.innerWidth,
      height: 400, // Will be adjusted based on note count
      backgroundColor: 0x000000,
      backgroundAlpha: 0,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    }).then(() => {
      if (!containerRef.current) return;

      containerRef.current.appendChild(app.canvas);
      appRef.current = app;

      // Calculate canvas height based on pitch range
      const pitchRange = midiData.maxPitch - midiData.minPitch + 1;
      const calculatedHeight = pitchRange * maxNoteHeight;
      const canvasHeight = Math.min(calculatedHeight, window.innerHeight * 0.4);

      app.renderer.resize(window.innerWidth, canvasHeight);

      // Create note graphics
      const noteGraphics = new Map<ParsedNote, PIXI.Graphics>();

      midiData.notes.forEach((note) => {
        const graphics = new PIXI.Graphics();
        noteGraphicsRef.current.set(note, graphics);
        app.stage.addChild(graphics);
      });

      // Handle window resize
      const handleResize = () => {
        app.renderer.resize(window.innerWidth, canvasHeight);
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    });

    return () => {
      if (appRef.current) {
        appRef.current.destroy(true, { children: true });
        appRef.current = null;
      }
      noteGraphicsRef.current.clear();
    };
  }, [midiData, maxNoteHeight]);

  // Animation loop: update note positions and colors
  useEffect(() => {
    if (!appRef.current || !midiData || !isPlaying || !audioElement) return;

    const app = appRef.current;
    let animationFrameId: number;

    const animate = () => {
      // Read live currentTime from audio element on each frame
      const currentTime = audioElement.currentTime;

      const canvas = app.canvas;
      const pitchRange = midiData.maxPitch - midiData.minPitch + 1;
      const noteHeight = Math.min(
        maxNoteHeight,
        canvas.height / pitchRange
      );
      const rectHeight = noteHeight - noteMargin;

      // Calculate viewport: align current notes to left with 150px for past notes
      const pastNotesPx = 150; // pixels reserved for past notes
      const viewportDuration = window.innerWidth < 768 ? 10 : 15;
      const pixelsPerSecond = canvas.width / viewportDuration;
      const pastDuration = pastNotesPx / pixelsPerSecond;

      const viewportStart = currentTime - pastDuration;
      const viewportEnd = viewportStart + viewportDuration;

      // Render each note
      midiData.notes.forEach((note) => {
        const graphics = noteGraphicsRef.current.get(note);
        if (!graphics) return;

        // Check if note is in viewport (with some padding for culling)
        const noteEndTime = note.time + note.duration;
        if (noteEndTime < viewportStart - 1 || note.time > viewportEnd + 1) {
          graphics.visible = false;
          return;
        }
        graphics.visible = true;

        // Calculate note position
        const noteX = (note.time - viewportStart) * pixelsPerSecond;
        const noteWidth = note.duration * pixelsPerSecond * 0.3; // Shrink by 70%
        const noteY = (midiData.maxPitch - note.midi) * noteHeight;

        // Calculate fade factor (0 = grey, 1 = full color)
        let fadeFactor = 0;

        if (currentTime < note.time - anticipatoryGlow) {
          // Before fade-in starts
          fadeFactor = 0;
        } else if (currentTime < note.time) {
          // Fade in: gradually increase from 0 to 1
          fadeFactor = (currentTime - (note.time - anticipatoryGlow)) / anticipatoryGlow;
        } else if (currentTime <= noteEndTime - anticipatoryGlow) {
          // Fully lit
          fadeFactor = 1;
        } else if (currentTime <= noteEndTime) {
          // Fade out: gradually decrease from 1 to 0
          fadeFactor = (noteEndTime - currentTime) / anticipatoryGlow;
        } else {
          // After fade-out ends
          fadeFactor = 0;
        }

        // Interpolate between grey (#808080) and track color
        const greyColor = 0x808080;
        const targetColor = parseInt(note.color.replace("#", ""), 16);

        const greyR = (greyColor >> 16) & 0xff;
        const greyG = (greyColor >> 8) & 0xff;
        const greyB = greyColor & 0xff;

        const targetR = (targetColor >> 16) & 0xff;
        const targetG = (targetColor >> 8) & 0xff;
        const targetB = targetColor & 0xff;

        const r = Math.round(greyR + (targetR - greyR) * fadeFactor);
        const g = Math.round(greyG + (targetG - greyG) * fadeFactor);
        const b = Math.round(greyB + (targetB - greyB) * fadeFactor);

        const colorInt = (r << 16) | (g << 8) | b;

        // Draw rounded rectangle
        graphics.clear();
        graphics.beginFill(colorInt);
        graphics.drawRoundedRect(
          noteX,
          noteY,
          Math.max(noteWidth, 2), // Minimum 2px width for visibility
          rectHeight,
          cornerRadius
        );
        graphics.endFill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [
    midiData,
    audioElement,
    isPlaying,
    cornerRadius,
    noteMargin,
    maxNoteHeight,
    anticipatoryGlow,
  ]);

  if (!midiData) return null;

  return (
    <div
      ref={containerRef}
      className="w-full transition-opacity duration-700 pointer-events-none mb-8"
      style={{ opacity }}
    />
  );
}
