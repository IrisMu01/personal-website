import { useEffect, useRef } from "react";

interface FluidParticlesProps {
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  hue: number;
}

// Navier-Stokes fluid simulation
class FluidSolver {
  private size: number;
  private dt: number;
  private diffusion: number;
  private viscosity: number;

  private vx: Float32Array;
  private vy: Float32Array;
  private vx0: Float32Array;
  private vy0: Float32Array;

  private density: Float32Array;
  private density0: Float32Array;

  constructor(size: number, diffusion: number, viscosity: number, dt: number) {
    this.size = size;
    this.dt = dt;
    this.diffusion = diffusion;
    this.viscosity = viscosity;

    const n = size * size;
    this.vx = new Float32Array(n);
    this.vy = new Float32Array(n);
    this.vx0 = new Float32Array(n);
    this.vy0 = new Float32Array(n);

    this.density = new Float32Array(n);
    this.density0 = new Float32Array(n);

    // Initialize with random swirls
    this.initializeRandomFluid();
  }

  private initializeRandomFluid() {
    const numSwirls = 60;
    for (let i = 0; i < numSwirls; i++) {
      const x = Math.floor(Math.random() * this.size);
      const y = Math.floor(Math.random() * this.size);
      const strength = (Math.random() - 0.5) * 20;
      const radius = 5;

      for (let dx = -radius; dx <= radius; dx++) {
        for (let dy = -radius; dy <= radius; dy++) {
          const px = x + dx;
          const py = y + dy;
          if (px >= 0 && px < this.size && py >= 0 && py < this.size) {
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < radius) {
              const idx = px + py * this.size;
              const force = (1 - dist / radius) * strength;
              this.vx[idx] = -dy * force / radius;
              this.vy[idx] = dx * force / radius;
            }
          }
        }
      }
    }
  }

  private IX(x: number, y: number): number {
    x = Math.max(0, Math.min(this.size - 1, Math.floor(x)));
    y = Math.max(0, Math.min(this.size - 1, Math.floor(y)));
    return x + y * this.size;
  }

  addVelocity(x: number, y: number, vx: number, vy: number) {
    const idx = this.IX(x, y);
    this.vx[idx] += vx;
    this.vy[idx] += vy;
  }

  private diffuse(b: number, x: Float32Array, x0: Float32Array, diff: number) {
    const a = this.dt * diff * (this.size - 2) * (this.size - 2);
    this.linearSolve(b, x, x0, a, 1 + 6 * a);
  }

  private linearSolve(b: number, x: Float32Array, x0: Float32Array, a: number, c: number) {
    const cRecip = 1.0 / c;
    for (let k = 0; k < 20; k++) {
      for (let j = 1; j < this.size - 1; j++) {
        for (let i = 1; i < this.size - 1; i++) {
          const idx = this.IX(i, j);
          x[idx] =
            (x0[idx] +
              a *
                (x[this.IX(i + 1, j)] +
                  x[this.IX(i - 1, j)] +
                  x[this.IX(i, j + 1)] +
                  x[this.IX(i, j - 1)])) *
            cRecip;
        }
      }
      this.setBoundary(b, x);
    }
  }

  private project(velocX: Float32Array, velocY: Float32Array, p: Float32Array, div: Float32Array) {
    for (let j = 1; j < this.size - 1; j++) {
      for (let i = 1; i < this.size - 1; i++) {
        const idx = this.IX(i, j);
        div[idx] =
          -0.5 *
          (velocX[this.IX(i + 1, j)] -
            velocX[this.IX(i - 1, j)] +
            velocY[this.IX(i, j + 1)] -
            velocY[this.IX(i, j - 1)]) /
          this.size;
        p[idx] = 0;
      }
    }
    this.setBoundary(0, div);
    this.setBoundary(0, p);
    this.linearSolve(0, p, div, 1, 6);

    for (let j = 1; j < this.size - 1; j++) {
      for (let i = 1; i < this.size - 1; i++) {
        const idx = this.IX(i, j);
        velocX[idx] -= 0.5 * (p[this.IX(i + 1, j)] - p[this.IX(i - 1, j)]) * this.size;
        velocY[idx] -= 0.5 * (p[this.IX(i, j + 1)] - p[this.IX(i, j - 1)]) * this.size;
      }
    }
    this.setBoundary(1, velocX);
    this.setBoundary(2, velocY);
  }

  private advect(b: number, d: Float32Array, d0: Float32Array, velocX: Float32Array, velocY: Float32Array) {
    const dtx = this.dt * (this.size - 2);
    const dty = this.dt * (this.size - 2);

    for (let j = 1; j < this.size - 1; j++) {
      for (let i = 1; i < this.size - 1; i++) {
        let x = i - dtx * velocX[this.IX(i, j)];
        let y = j - dty * velocY[this.IX(i, j)];

        if (x < 0.5) x = 0.5;
        if (x > this.size - 1.5) x = this.size - 1.5;
        const i0 = Math.floor(x);
        const i1 = i0 + 1;

        if (y < 0.5) y = 0.5;
        if (y > this.size - 1.5) y = this.size - 1.5;
        const j0 = Math.floor(y);
        const j1 = j0 + 1;

        const s1 = x - i0;
        const s0 = 1 - s1;
        const t1 = y - j0;
        const t0 = 1 - t1;

        const idx = this.IX(i, j);
        d[idx] =
          s0 * (t0 * d0[this.IX(i0, j0)] + t1 * d0[this.IX(i0, j1)]) +
          s1 * (t0 * d0[this.IX(i1, j0)] + t1 * d0[this.IX(i1, j1)]);
      }
    }
    this.setBoundary(b, d);
  }

  private setBoundary(b: number, x: Float32Array) {
    for (let i = 1; i < this.size - 1; i++) {
      x[this.IX(i, 0)] = b === 2 ? -x[this.IX(i, 1)] : x[this.IX(i, 1)];
      x[this.IX(i, this.size - 1)] = b === 2 ? -x[this.IX(i, this.size - 2)] : x[this.IX(i, this.size - 2)];
    }
    for (let j = 1; j < this.size - 1; j++) {
      x[this.IX(0, j)] = b === 1 ? -x[this.IX(1, j)] : x[this.IX(1, j)];
      x[this.IX(this.size - 1, j)] = b === 1 ? -x[this.IX(this.size - 2, j)] : x[this.IX(this.size - 2, j)];
    }

    x[this.IX(0, 0)] = 0.5 * (x[this.IX(1, 0)] + x[this.IX(0, 1)]);
    x[this.IX(0, this.size - 1)] = 0.5 * (x[this.IX(1, this.size - 1)] + x[this.IX(0, this.size - 2)]);
    x[this.IX(this.size - 1, 0)] = 0.5 * (x[this.IX(this.size - 2, 0)] + x[this.IX(this.size - 1, 1)]);
    x[this.IX(this.size - 1, this.size - 1)] =
      0.5 * (x[this.IX(this.size - 2, this.size - 1)] + x[this.IX(this.size - 1, this.size - 2)]);
  }

  step() {
    this.diffuse(1, this.vx0, this.vx, this.viscosity);
    this.diffuse(2, this.vy0, this.vy, this.viscosity);

    this.project(this.vx0, this.vy0, this.vx, this.vy);

    this.advect(1, this.vx, this.vx0, this.vx0, this.vy0);
    this.advect(2, this.vy, this.vy0, this.vx0, this.vy0);

    this.project(this.vx, this.vy, this.vx0, this.vy0);
  }

  getVelocity(x: number, y: number): { vx: number; vy: number } {
    const idx = this.IX(x, y);
    return { vx: this.vx[idx], vy: this.vy[idx] };
  }
}

export function FluidParticles({ className = "" }: FluidParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const fluidSolverRef = useRef<FluidSolver | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, px: 0, py: 0, down: false });
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const oldWidth = canvas.width;
      const oldHeight = canvas.height;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Scale particle positions if canvas was resized
      if (oldWidth > 0 && oldHeight > 0 && particlesRef.current.length > 0) {
        const scaleX = canvas.width / oldWidth;
        const scaleY = canvas.height / oldHeight;

        particlesRef.current.forEach(p => {
          p.x *= scaleX;
          p.y *= scaleY;
        });
      }
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize fluid solver
    const gridSize = 64;
    fluidSolverRef.current = new FluidSolver(gridSize, 0.0001, 0.0000001, 0.1);

    // Initialize 8,000 particles
    const particleCount = 30000;
    const maxParticles = 45000; // Maximum particles including spawned ones
    particlesRef.current = [];
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: 0,
        vy: 0,
        life: Math.random(),
        hue: Math.random() * 60 + 180, // Cool tones: 180-240
      });
    }

    // Periodic swirl generation - create 1 random swirl every 2 seconds
    const generateSwirls = () => {
      if (!fluidSolverRef.current) return;

      for (let s = 0; s < 1; s++) {
        const x = Math.floor(Math.random() * gridSize);
        const y = Math.floor(Math.random() * gridSize);
        const strength = (Math.random() - 0.5) * 5;
        const radius = 10;

        for (let dx = -radius; dx <= radius; dx++) {
          for (let dy = -radius; dy <= radius; dy++) {
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < radius) {
              const force = (1 - dist / radius) * strength;
              fluidSolverRef.current.addVelocity(
                x + dx,
                y + dy,
                -dy * force / radius,
                dx * force / radius
              );
            }
          }
        }
      }
    };

    // Generate swirls every 2 seconds
    const swirlInterval = setInterval(generateSwirls, 2000);
    // Generate initial swirls
    generateSwirls();

    // Animation loop
    const animate = () => {
      const fluid = fluidSolverRef.current;
      if (!fluid) return;

      // Clear canvas (no fade - particles will create trails by spawning)
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Step fluid simulation
      fluid.step();

      // Update and draw particles
      const particles = particlesRef.current;
      const particlesToAdd: Particle[] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Store previous position for trail particle spawning
        const prevX = p.x;
        const prevY = p.y;

        // Get velocity from fluid at particle position
        const gridX = (p.x / canvas.width) * gridSize;
        const gridY = (p.y / canvas.height) * gridSize;
        const vel = fluid.getVelocity(gridX, gridY);

        // Apply fluid velocity to particle
        p.vx = vel.vx * 10;
        p.vy = vel.vy * 10;

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Minimal damping to prevent infinite acceleration
        p.vx *= 0.995;
        p.vy *= 0.995;

        // Calculate speed and distance moved
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const distMoved = Math.sqrt((p.x - prevX) ** 2 + (p.y - prevY) ** 2);

        // Spawn trail particles when moving fast enough
        if (speed > 0.5 && distMoved > 1 && particles.length < maxParticles && Math.random() < 0.15) {
          particlesToAdd.push({
            x: prevX,
            y: prevY,
            vx: p.vx * 0.7, // Inherit some velocity
            vy: p.vy * 0.7,
            life: Math.random() * 0.3, // Start with low life for fade effect
            hue: p.hue + (Math.random() - 0.5) * 10, // Similar hue with variation
          });
        }

        // Wrap around boundaries
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Update life
        p.life += 0.005;
        if (p.life > 1) p.life = 0;

        // Draw particle with fixed size and vibrant colors
        // Base alpha on life cycle, with bonus from speed
        const baseAlpha = Math.sin(p.life * Math.PI) * 0.6;
        const speedBonus = Math.min(speed * 0.05, 0.3);
        const alpha = baseAlpha + speedBonus;
        const size = 0.8;

        ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Add new trail particles
      particlesToAdd.forEach(p => particles.push(p));

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", resizeCanvas);
      clearInterval(swirlInterval);
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
