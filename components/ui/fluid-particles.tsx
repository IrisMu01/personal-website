import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FluidParticlesProps {
  className?: string;
}

function FluidParticleSystem() {
  const particlesRef = useRef<THREE.Points>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const velocities = useRef<Float32Array>();

  const particleCount = 5000;

  // Create particle geometry and material
  const { positions, particles } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      // Distribute particles in 3D space
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 10;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      particles.push({ x, y, z });
    }

    return { positions, particles };
  }, []);

  // Initialize velocities
  useEffect(() => {
    velocities.current = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      velocities.current[i] = (Math.random() - 0.5) * 0.02;
    }
  }, []);

  // Mouse move handler
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mousePosition.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        mousePosition.current.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
        mousePosition.current.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  // Vertex shader for fluid-like effects
  const vertexShader = `
    attribute float size;
    varying vec3 vColor;

    void main() {
      vColor = vec3(0.4 + position.z * 0.05, 0.6 + position.z * 0.03, 0.9);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  // Fragment shader for smooth circular particles
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

      gl_FragColor = vec4(vColor, alpha * 0.6);
    }
  `;

  // Create sizes for particles
  const sizes = useMemo(() => {
    const sizes = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      sizes[i] = Math.random() * 3 + 1;
    }
    return sizes;
  }, []);

  // Animation loop
  useFrame((state) => {
    if (!particlesRef.current || !velocities.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Get current position
      let x = positions[i3];
      let y = positions[i3 + 1];
      let z = positions[i3 + 2];

      // Add flowing motion (fluid-like)
      const flowX = Math.sin(time * 0.1 + y * 0.3) * 0.01;
      const flowY = Math.cos(time * 0.1 + x * 0.3) * 0.01;
      const flowZ = Math.sin(time * 0.2 + x * 0.2 + y * 0.2) * 0.005;

      // Mouse interaction
      const mouseX = mousePosition.current.x * 10;
      const mouseY = mousePosition.current.y * 10;
      const dx = mouseX - x;
      const dy = mouseY - y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 3) {
        const force = (3 - distance) / 3;
        velocities.current[i3] += dx * force * 0.001;
        velocities.current[i3 + 1] += dy * force * 0.001;
      }

      // Apply velocities and flow
      x += velocities.current[i3] + flowX;
      y += velocities.current[i3 + 1] + flowY;
      z += velocities.current[i3 + 2] + flowZ;

      // Apply damping
      velocities.current[i3] *= 0.97;
      velocities.current[i3 + 1] *= 0.97;
      velocities.current[i3 + 2] *= 0.97;

      // Boundary wrapping
      if (x > 10) x = -10;
      if (x < -10) x = 10;
      if (y > 10) y = -10;
      if (y < -10) y = 10;
      if (z > 5) z = -5;
      if (z < -5) z = 5;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
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
      />
    </points>
  );
}

export function FluidParticles({ className = "" }: FluidParticlesProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 15], fov: 75 }}
        style={{ background: "transparent" }}
      >
        <FluidParticleSystem />
      </Canvas>
    </div>
  );
}
