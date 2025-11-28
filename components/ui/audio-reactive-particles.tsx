import { useEffect, useRef } from "react";

interface AudioReactiveParticlesProps {
  className?: string;
  audioElement?: HTMLAudioElement | null;
}

interface AudioParticle3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
  size: number;
  frequencyBand: number;
  hue: number;
}

// 3D to 2D projection with tilted camera view from above
function project3D(
  x: number,
  y: number,
  z: number,
  centerX: number,
  centerY: number
): { screenX: number; screenY: number; scale: number } {
  // Camera settings: tilted view from above (45 degree tilt)
  const cameraDistance = 800;
  const tiltAngle = Math.PI / 4; // 45 degrees

  // Apply rotation for tilted view (rotate around X axis)
  const rotatedY = y * Math.cos(tiltAngle) - z * Math.sin(tiltAngle);
  const rotatedZ = y * Math.sin(tiltAngle) + z * Math.cos(tiltAngle) + cameraDistance;

  // Perspective projection
  const scale = cameraDistance / (cameraDistance + rotatedZ);
  const screenX = centerX + x * scale;
  const screenY = centerY - rotatedY * scale; // Negative for screen coordinates

  return { screenX, screenY, scale };
}

export function AudioReactiveParticles({
  className = "",
  audioElement = null,
}: AudioReactiveParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<AudioParticle3D[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const connectedElementRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number>();

  // Initialize particles once
  useEffect(() => {
    if (particlesRef.current.length === 0) {
      const particleCount = 3000;
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: 0,
          y: 0,
          z: 0,
          vx: 0,
          vy: 0,
          vz: 0,
          life: 0,
          maxLife: Math.random() * 80 + 40,
          size: 1,
          frequencyBand: Math.floor(Math.random() * 8),
          hue: Math.random() * 40 + 260, // Purple/pink range: 260-300
        });
      }
    }
  }, []);

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
        analyser.fftSize = 512;

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
  }, [audioElement]);

  // Canvas setup and animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Animation loop
    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height * 0.65; // Lower on screen for better view
      const particles = particlesRef.current;

      // Get frequency data
      let frequencyData: number[] = Array(8).fill(0);
      if (analyserRef.current && dataArrayRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);

        // Group frequencies into 8 bands
        const bandSize = Math.floor(dataArrayRef.current.length / 8);
        for (let i = 0; i < 8; i++) {
          let sum = 0;
          for (let j = 0; j < bandSize; j++) {
            sum += dataArrayRef.current[i * bandSize + j];
          }
          frequencyData[i] = sum / bandSize / 255; // Normalize to 0-1
        }
      }

      // Calculate overall loudness
      const avgIntensity =
        frequencyData.reduce((a, b) => a + b, 0) / frequencyData.length;

      // Update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const intensity = frequencyData[p.frequencyBand] || 0;

        // Spawn new particles based on audio
        if (p.life <= 0 && intensity > 0.05) {
          const angle = Math.random() * Math.PI * 2;

          // Frequency-based initial velocity:
          // Low frequencies (0-2): shoot outward (horizontal)
          // High frequencies (6-7): shoot upward in tiers
          const frequencyRatio = p.frequencyBand / 8;

          // Base speed from audio intensity
          const baseSpeed = (intensity * 4 + avgIntensity * 2) * 1.5;

          // Horizontal spread (more for low frequencies)
          const horizontalFactor = 1 - frequencyRatio * 0.7;
          p.vx = Math.cos(angle) * baseSpeed * horizontalFactor;
          p.vz = Math.sin(angle) * baseSpeed * horizontalFactor;

          // Vertical velocity (more for high frequencies)
          const verticalFactor = 0.3 + frequencyRatio * 1.2;
          p.vy = baseSpeed * verticalFactor;

          // Reset position to center
          p.x = 0;
          p.y = 0;
          p.z = 0;

          p.life = p.maxLife;
          p.hue = 260 + p.frequencyBand * 5; // Different hues for different frequencies
        }

        if (p.life > 0) {
          // Update position with velocity
          p.x += p.vx;
          p.y += p.vy;
          p.z += p.vz;

          // Apply gravity and air resistance
          p.vy -= 0.15; // Gravity pulls down
          p.vx *= 0.99;
          p.vz *= 0.99;
          p.vy *= 0.98;

          // Decrease life
          p.life -= 1;

          // Reset if particle falls too low or moves too far
          if (p.y < -200 || Math.abs(p.x) > 600 || Math.abs(p.z) > 600) {
            p.life = 0;
          }
        }
      }

      // Sort particles by depth (z + y) for proper rendering order
      const sortedParticles = [...particles].sort((a, b) => (b.z + b.y) - (a.z + a.y));

      // Draw particles
      for (const p of sortedParticles) {
        if (p.life > 0) {
          const { screenX, screenY, scale } = project3D(p.x, p.y, p.z, centerX, centerY);

          // Skip if off-screen
          if (screenX < -100 || screenX > canvas.width + 100 ||
              screenY < -100 || screenY > canvas.height + 100) {
            continue;
          }

          const lifeRatio = p.life / p.maxLife;
          const alpha = Math.sin(lifeRatio * Math.PI) * 0.9;
          const size = p.size * scale * lifeRatio;

          // Gradient effect
          const gradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, size * 2);
          gradient.addColorStop(0, `hsla(${p.hue}, 85%, 70%, ${alpha})`);
          gradient.addColorStop(1, `hsla(${p.hue}, 85%, 50%, 0)`);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(screenX, screenY, size * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw center glow based on overall intensity
      if (avgIntensity > 0.1) {
        const glowSize = 60 + avgIntensity * 120;
        const gradient = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          glowSize
        );
        gradient.addColorStop(0, `hsla(280, 85%, 70%, ${avgIntensity * 0.4})`);
        gradient.addColorStop(1, "hsla(280, 85%, 70%, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, glowSize, 0, Math.PI * 2);
        ctx.fill();
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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ background: "transparent" }}
    />
  );
}
