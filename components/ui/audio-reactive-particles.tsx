import { useEffect, useRef } from "react";

interface AudioReactiveParticlesProps {
  className?: string;
  audioElement?: HTMLAudioElement | null;
}

interface AudioParticle {
  angle: number;
  speed: number;
  distance: number;
  life: number;
  maxLife: number;
  size: number;
  frequencyBand: number;
  hue: number;
}

export function AudioReactiveParticles({
  className = "",
  audioElement = null,
}: AudioReactiveParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<AudioParticle[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationRef = useRef<number>();

  // Initialize particles once
  useEffect(() => {
    if (particlesRef.current.length === 0) {
      const particleCount = 1500;
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          angle: Math.random() * Math.PI * 2,
          speed: 0,
          distance: 0,
          life: 0,
          maxLife: Math.random() * 80 + 40,
          size: Math.random() * 3 + 1,
          frequencyBand: Math.floor(Math.random() * 8),
          hue: Math.random() * 40 + 260, // Purple/pink range: 260-300
        });
      }
    }
  }, []);

  // Setup audio analysis when audioElement becomes available
  useEffect(() => {
    if (!audioElement || audioContextRef.current) return;

    try {
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;

      const source = audioContext.createMediaElementSource(audioElement);
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;
      audioContextRef.current = audioContext;
    } catch (error) {
      console.error("Error setting up audio analysis:", error);
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
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
      const centerY = canvas.height / 2;
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

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const intensity = frequencyData[p.frequencyBand] || 0;

        // Spawn new particles based on audio
        if (p.life <= 0 && intensity > 0.05) {
          p.angle = Math.random() * Math.PI * 2;
          p.speed = intensity * 3 + avgIntensity * 2; // Speed based on loudness
          p.distance = 0;
          p.life = p.maxLife;
          p.hue = 260 + p.frequencyBand * 5; // Different hues for different frequencies
        }

        if (p.life > 0) {
          // Move particle outward
          p.distance += p.speed;

          // Decay distance based on frequency (higher frequency = less distance)
          const frequencyDecay = 1 - (p.frequencyBand / 8) * 0.6;
          const maxDistance = Math.min(canvas.width, canvas.height) * 0.4 * frequencyDecay;

          // Calculate position
          const x = centerX + Math.cos(p.angle) * p.distance;
          const y = centerY + Math.sin(p.angle) * p.distance;

          // Draw particle
          const lifeRatio = p.life / p.maxLife;
          const alpha = Math.sin(lifeRatio * Math.PI) * 0.8;
          const size = p.size * lifeRatio;

          // Gradient effect based on distance
          const distRatio = p.distance / maxDistance;
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
          gradient.addColorStop(0, `hsla(${p.hue}, 80%, 70%, ${alpha})`);
          gradient.addColorStop(1, `hsla(${p.hue}, 80%, 50%, 0)`);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, size * 2, 0, Math.PI * 2);
          ctx.fill();

          // Decrease life
          p.life -= 1;

          // Reset if too far
          if (p.distance > maxDistance) {
            p.life = 0;
          }
        }
      }

      // Draw center glow based on overall intensity
      if (avgIntensity > 0.1) {
        const glowSize = 40 + avgIntensity * 100;
        const gradient = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          glowSize
        );
        gradient.addColorStop(0, `hsla(280, 80%, 70%, ${avgIntensity * 0.3})`);
        gradient.addColorStop(1, "hsla(280, 80%, 70%, 0)");

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
