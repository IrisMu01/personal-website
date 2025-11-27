import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface AudioReactiveParticlesProps {
  className?: string;
  audioElement?: HTMLAudioElement | null;
}

interface Particle {
  angle: number;
  speed: number;
  distance: number;
  life: number;
  maxLife: number;
  size: number;
  frequencyBand: number;
}

function AudioParticleSystem({ audioElement }: { audioElement: HTMLAudioElement | null }) {
  const particlesRef = useRef<THREE.Points>(null);
  const particlesData = useRef<Particle[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const particleCount = 2000;

  // Setup audio analysis
  useEffect(() => {
    if (!audioElement) return;

    try {
      // Create audio context and analyser
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
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

      return () => {
        source.disconnect();
        analyser.disconnect();
        audioContext.close();
      };
    } catch (error) {
      console.error("Error setting up audio analysis:", error);
    }
  }, [audioElement]);

  // Create particle geometry
  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    // Initialize particles data
    for (let i = 0; i < particleCount; i++) {
      particlesData.current.push({
        angle: Math.random() * Math.PI * 2,
        speed: 0,
        distance: 0,
        life: 0,
        maxLife: Math.random() * 100 + 50,
        size: Math.random() * 2 + 1,
        frequencyBand: Math.floor(Math.random() * 8),
      });

      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;

      // Purple/pink hues for music theme
      colors[i * 3] = 0.7 + Math.random() * 0.3; // R
      colors[i * 3 + 1] = 0.4 + Math.random() * 0.3; // G
      colors[i * 3 + 2] = 0.9 + Math.random() * 0.1; // B

      sizes[i] = particlesData.current[i].size;
    }

    return { positions, colors, sizes };
  }, []);

  // Vertex shader
  const vertexShader = `
    attribute float size;
    attribute vec3 color;
    varying vec3 vColor;

    void main() {
      vColor = color;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  // Fragment shader
  const fragmentShader = `
    varying vec3 vColor;

    void main() {
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = length(center);

      if (dist > 0.5) {
        discard;
      }

      float alpha = 1.0 - (dist * 2.0);
      alpha = alpha * alpha;

      gl_FragColor = vec4(vColor, alpha * 0.8);
    }
  `;

  // Animation loop
  useFrame(() => {
    if (!particlesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const sizes = particlesRef.current.geometry.attributes.size.array as Float32Array;

    // Get frequency data if available
    let frequencyData: number[] = [];
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

    // Update particles
    for (let i = 0; i < particleCount; i++) {
      const particle = particlesData.current[i];
      const i3 = i * 3;

      // Get frequency band intensity
      const intensity = frequencyData[particle.frequencyBand] || 0;

      // Spawn new particles based on audio
      if (particle.life <= 0 && intensity > 0.1) {
        particle.angle = Math.random() * Math.PI * 2;
        particle.speed = intensity * 0.15; // Speed based on loudness
        particle.distance = 0;
        particle.life = particle.maxLife;
      }

      if (particle.life > 0) {
        // Move particle outward
        particle.distance += particle.speed;

        // Calculate decay based on frequency (higher frequency = less distance)
        const frequencyDecay = 1 - (particle.frequencyBand / 8) * 0.5;
        const maxDistance = 8 * frequencyDecay;

        // Update position
        const x = Math.cos(particle.angle) * particle.distance;
        const y = Math.sin(particle.angle) * particle.distance;
        const z = (Math.random() - 0.5) * 2;

        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;

        // Update size based on life
        const lifeRatio = particle.life / particle.maxLife;
        sizes[i] = particle.size * lifeRatio;

        // Decrease life
        particle.life -= 1;

        // Reset if too far
        if (particle.distance > maxDistance) {
          particle.life = 0;
        }
      } else {
        // Hide dead particles
        positions[i3] = 0;
        positions[i3 + 1] = 0;
        positions[i3 + 2] = 0;
        sizes[i] = 0;
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    particlesRef.current.geometry.attributes.size.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particleCount}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors={true}
      />
    </points>
  );
}

export function AudioReactiveParticles({ className = "", audioElement = null }: AudioReactiveParticlesProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 15], fov: 75 }}
        style={{ background: "transparent" }}
      >
        <AudioParticleSystem audioElement={audioElement} />
      </Canvas>
    </div>
  );
}
