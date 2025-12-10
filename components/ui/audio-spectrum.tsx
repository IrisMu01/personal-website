import { useEffect, useRef } from "react";

interface AudioSpectrumProps {
  className?: string;
  audioElement?: HTMLAudioElement | null;
  barCount?: number;
  minFrequency?: number;
  maxFrequency?: number;
  smoothing?: number;
  amplification?: number;
  color?: string;
  lineColor?: string;
}

export function AudioSpectrum({
  className = "",
  audioElement = null,
  barCount = 64,
  minFrequency = 20,
  maxFrequency = 20000,
  smoothing = 0.75,
  amplification = 1.5,
  color = "rgba(221, 185, 255, 0.9)", // very light purple
  lineColor = "rgba(197, 158, 233, 0.9)", // lighter purple
}: AudioSpectrumProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const connectedElementRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number>();

  // Setup audio analysis when audioElement becomes available
  useEffect(() => {
    if (!audioElement) return;

    // If this is the same element we already connected, skip
    if (audioElement === connectedElementRef.current) return;

    try {
      // Create audio context if it doesn't exist
      if (!audioContextRef.current) {
        const audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048; // Higher resolution for better frequency analysis
        analyser.smoothingTimeConstant = smoothing;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        analyserRef.current = analyser;
        dataArrayRef.current = dataArray;
        audioContextRef.current = audioContext;
      }

      // Disconnect previous source if it exists
      if (sourceNodeRef.current) {
        try {
          sourceNodeRef.current.disconnect();
        } catch (e) {
          // Ignore disconnect errors
        }
      }

      // Create new source for this audio element
      const source = audioContextRef.current!.createMediaElementSource(audioElement);
      source.connect(analyserRef.current!);
      analyserRef.current!.connect(audioContextRef.current!.destination);

      sourceNodeRef.current = source;
      connectedElementRef.current = audioElement;

      // Resume AudioContext when audio starts playing
      // This is required because browsers start AudioContext in suspended state
      const handlePlay = () => {
        if (audioContextRef.current?.state === "suspended") {
          audioContextRef.current.resume();
        }
      };

      audioElement.addEventListener("play", handlePlay);

      // Cleanup function
      const cleanup = () => {
        audioElement.removeEventListener("play", handlePlay);
      };

      return cleanup;
    } catch (error) {
      console.error("Error setting up audio analysis:", error);
    }

    return () => {
      // Don't close audio context on cleanup, only disconnect source
      if (sourceNodeRef.current) {
        try {
          sourceNodeRef.current.disconnect();
          sourceNodeRef.current = null;
        } catch (e) {
          // Ignore disconnect errors
        }
      }
      connectedElementRef.current = null;
    };
  }, [audioElement, smoothing]);

  // Map frequency bins to specified frequency range
  const getFrequencyBands = (dataArray: Uint8Array, sampleRate: number = 44100): number[] => {
    const fftSize = analyserRef.current?.fftSize || 2048;
    const binWidth = sampleRate / fftSize;

    // Calculate linear frequency bands for uniform distribution
    const bands: number[] = [];
    const freqStep = (maxFrequency - minFrequency) / barCount;

    for (let i = 0; i < barCount; i++) {
      const freqStart = minFrequency + i * freqStep;
      const freqEnd = minFrequency + (i + 1) * freqStep;

      const startBin = Math.floor(freqStart / binWidth);
      const endBin = Math.min(Math.floor(freqEnd / binWidth), dataArray.length - 1);

      let sum = 0;
      let count = 0;
      for (let j = startBin; j <= endBin; j++) {
        sum += dataArray[j];
        count++;
      }

      bands.push(count > 0 ? (sum / count / 255) * amplification : 0);
    }

    return bands;
  };

  // Canvas setup and animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = 300; // Fixed height for the spectrum
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Animation loop
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Get frequency data
      let frequencyData: number[] = Array(barCount).fill(0);
      if (analyserRef.current && dataArrayRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        frequencyData = getFrequencyBands(dataArrayRef.current);
      }

      // Calculate responsive bar dimensions
      // Use 90% of screen width to leave some margin
      const availableWidth = canvas.width;
      const totalBarWidth = availableWidth / barCount;
      const barGap = totalBarWidth * 0.25; // Gap is 25% of total bar width
      const barWidth = totalBarWidth - barGap;
      const startX = (canvas.width - availableWidth) / 2;

      // Store bottom points for connecting line
      const bottomPoints: { x: number; y: number }[] = [];

      // Draw bars
      for (let i = 0; i < barCount; i++) {
        const intensity = Math.min(frequencyData[i], 1) * 0.3; // 70% less sensitive
        const barHeight = Math.min(intensity * (canvas.height - 40), 300); // Cap at 300px

        const x = startX + i * totalBarWidth;
        const y = 20; // Start from top with some padding
        const bottomY = y + barHeight;

        // Store bottom point
        bottomPoints.push({ x: x + barWidth / 2, y: bottomY });

        // Draw bar with gradient
        const gradient = ctx.createLinearGradient(x, y, x, bottomY);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, color.replace(/[\d.]+\)$/, "0.4)")); // Fade at bottom

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      // Draw connecting line between bottom points
      if (bottomPoints.length > 1) {
        ctx.beginPath();
        ctx.moveTo(bottomPoints[0].x, bottomPoints[0].y);

        for (let i = 1; i < bottomPoints.length; i++) {
          ctx.lineTo(bottomPoints[i].x, bottomPoints[i].y);
        }

        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [barCount, color, lineColor, minFrequency, maxFrequency, amplification]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ background: "transparent" }}
    />
  );
}
