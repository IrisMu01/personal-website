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

// Map frequency bins to musical ranges
function getFrequencyBands(dataArray: Uint8Array, sampleRate: number = 44100): number[] {
  // FFT size is 512, so 256 bins, each bin = sampleRate / fftSize
  const fftSize = 512;
  const binWidth = sampleRate / fftSize; // ~86 Hz per bin

  // Define frequency ranges (in Hz) for 8 bands
  const ranges = [
    { min: 0, max: 100 },      // Band 0: Sub-bass
    { min: 100, max: 250 },    // Band 1: Bass
    { min: 250, max: 500 },    // Band 2: Low-mid
    { min: 500, max: 1000 },   // Band 3: Mid
    { min: 1000, max: 2000 },  // Band 4: Mid-high
    { min: 2000, max: 4000 },  // Band 5: High
    { min: 4000, max: 8000 },  // Band 6: Very high
    { min: 8000, max: 20000 }, // Band 7: Ultra high
  ];

  const bands: number[] = [];

  for (const range of ranges) {
    const startBin = Math.floor(range.min / binWidth);
    const endBin = Math.min(Math.floor(range.max / binWidth), dataArray.length - 1);

    let sum = 0;
    let count = 0;
    for (let i = startBin; i <= endBin; i++) {
      sum += dataArray[i];
      count++;
    }

    bands.push(count > 0 ? sum / count / 255 : 0); // Normalize to 0-1
  }

  return bands;
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
  const tiltAngle = Math.PI / 6; // 45 degrees

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
          size: 3,
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

    // Rotating arc angle for spiral effect (mid-high frequencies)
    let spiralAngle = 0;

    // Animation loop
    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height * 0.65; // Lower on screen for better view
      const particles = particlesRef.current;

      // Get frequency data with musical frequency mapping
      let frequencyData: number[] = Array(8).fill(0);
      if (analyserRef.current && dataArrayRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        frequencyData = getFrequencyBands(dataArrayRef.current);
      }

      // Calculate overall loudness
      const avgIntensity =
        frequencyData.reduce((a, b) => a + b, 0) / frequencyData.length;

      // Update spiral angle for mid-high frequencies (rotates over time)
      spiralAngle += 0.02;

      // Update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const intensity = frequencyData[p.frequencyBand] || 0;

        // Spawn new particles based on audio
        if (p.life <= 0 && intensity > 0.05) {
          // Determine spawn position and velocity based on frequency band
          // Band 0-1: Bass (0-250 Hz) - wide spawn radius
          // Band 2-3: Low-mid/Mid (250-1000 Hz) - medium spawn radius
          // Band 4: Mid-high (1000-2000 Hz) - small spawn radius, arc generation
          // Band 5-7: High/Very high/Ultra high (2000+ Hz) - smallest spawn radius

          let angle: number;
          let spawnRadius: number;

          // Mid-high frequencies (band 4): Arc generation with spiral
          if (p.frequencyBand === 4) {
            // Generate in a rotating arc (60 degree arc)
            const arcWidth = Math.PI / 3; // 60 degrees
            angle = spiralAngle + (Math.random() - 0.5) * arcWidth;
            spawnRadius = 20; // Small spawn radius
          } else {
            // All other frequencies: full circle
            angle = Math.random() * Math.PI * 2;

            // Spawn radius based on frequency
            if (p.frequencyBand <= 1) {
              // Bass: widest spawn radius
              spawnRadius = 80 + Math.random() * 40;
            } else if (p.frequencyBand <= 3) {
              // Low-mid/Mid: medium spawn radius
              spawnRadius = 40 + Math.random() * 30;
            } else if (p.frequencyBand === 4) {
              // Mid-high: small spawn radius (handled above)
              spawnRadius = 20;
            } else {
              // High frequencies: smallest spawn radius (at origin)
              spawnRadius = 5 + Math.random() * 10;
            }
          }

          // Set spawn position in circle
          p.x = Math.cos(angle) * spawnRadius;
          p.z = Math.sin(angle) * spawnRadius;
          p.y = 0;

          // Base speed from audio intensity
          const baseSpeed = (intensity * 4 + avgIntensity * 2) * 4;

          // Velocity adjustments by frequency range
          let horizontalFactor: number;
          let verticalFactor: number;

          if (p.frequencyBand <= 1) {
            // Bass (0-250 Hz): mostly outward
            horizontalFactor = 1.0;
            verticalFactor = 0.3;
          } else if (p.frequencyBand <= 3) {
            // Low-mid/Mid (250-1000 Hz): balanced
            horizontalFactor = 0.7;
            verticalFactor = 0.8;
          } else if (p.frequencyBand === 4) {
            // Mid-high (1000-2000 Hz): HIGH vertical sensitivity
            horizontalFactor = 0.4;
            verticalFactor = 1.8; // Increased vertical speed
          } else if (p.frequencyBand === 5) {
            // High (2000-4000 Hz): still some vertical
            horizontalFactor = 0.5;
            verticalFactor = 1.0;
          } else {
            // Very high/Ultra high (4000+ Hz): more horizontal (timbre)
            horizontalFactor = 0.9; // Increased horizontal for timbre
            verticalFactor = 0.5; // Decreased vertical
          }

          // Set velocity
          p.vx = Math.cos(angle) * baseSpeed * horizontalFactor;
          p.vz = Math.sin(angle) * baseSpeed * horizontalFactor;
          p.vy = baseSpeed * verticalFactor;

          p.life = p.maxLife;
          p.hue = 260 + p.frequencyBand * 5; // Different hues for different frequencies
        }

        if (p.life > 0) {
          // Update position with velocity
          p.x += p.vx;
          p.y += p.vy;
          p.z += p.vz;

          // Apply gravity and air resistance
          p.vy -= 0.10; // Gravity pulls down
          p.vx *= 0.99;
          p.vz *= 0.99;
          p.vy *= 0.98;

          // Decrease life
          p.life -= 0.7;

          // Reset if particle falls too low or moves too far
          if (p.y < -200 || Math.abs(p.x) > 2000 || Math.abs(p.z) > 2000) {
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
