import { useEffect, useRef } from "react";

interface NeuralBackgroundProps {
  className?: string;
  /**
   * Color of the particles. 
   * Defaults to indigo if not specified.
   */
  color?: string;
  /**
   * The opacity of the trails (0.0 to 1.0).
   * Lower = longer trails. Higher = shorter trails.
   * Default: 0.15
   */
  trailOpacity?: number;
  /**
   * Number of particles. Default: 600
   */
  particleCount?: number;
  /**
   * Speed multiplier. Default: 1
   */
  speed?: number;
  /**
   * Performance diagnostics callback to measure rendering latency in milliseconds.
   */
  onRenderMeasure?: (duration: number) => void;
  /**
   * Device Pixel Ratio multiplier override.
   */
  dprScale?: number;
}

interface ParticleData {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
}

export default function NeuralBackground({
  className,
  color = "#6366f1", // Default Indigo
  trailOpacity = 0.15,
  particleCount = 600,
  speed = 1,
  onRenderMeasure,
  dprScale,
}: NeuralBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep latest mutable props in refs to avoid re-running the animation setup useEffect
  const propsRef = useRef({ color, trailOpacity, speed, onRenderMeasure });

  // Performance Optimization: Parse and cache color once on prop change rather than per frame per particle
  const parsedColorRef = useRef({ r: 99, g: 102, b: 241 });

  useEffect(() => {
    propsRef.current = { color, trailOpacity, speed, onRenderMeasure };
  }, [color, trailOpacity, speed, onRenderMeasure]);

  useEffect(() => {
    let r = 99, g = 102, b = 241;
    if (color.startsWith("#")) {
      const hex = color.substring(1);
      if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
      } else if (hex.length === 6) {
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
      }
    }
    parsedColorRef.current = { r, g, b };
  }, [color]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // --- CONFIGURATION ---
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;
    let particles: ParticleData[] = [];
    let animationFrameId: number;
    let mouse = { x: -1000, y: -1000 }; // Start off-screen

    // Gradient cache to avoid creating gradients on every single frame
    let cachedGradient: CanvasGradient | null = null;
    let cachedColor = "";
    let cachedWidth = 0;

    const getGradient = (context: CanvasRenderingContext2D, cColor: string, w: number) => {
      if (cachedGradient && cColor === cachedColor && w === cachedWidth) {
        return cachedGradient;
      }
      const grad = context.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, "#FF6B00"); // Left Orange
      grad.addColorStop(0.25, "#FF6B00");
      grad.addColorStop(0.5, cColor);  // Center Custom Color
      grad.addColorStop(0.75, "#00E676"); // Right Green
      grad.addColorStop(1, "#00E676");
      cachedColor = cColor;
      cachedWidth = w;
      cachedGradient = grad;
      return grad;
    };

    // Pre-allocated opacity bins to batch canvas draw operations and avoid heap allocations in loop
    const bins: ParticleData[][] = [[], [], [], [], []];

    // --- INITIALIZATION ---
    const init = () => {
      const dpr = dprScale || window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: 0,
          vy: 0,
          age: Math.random() * 200, // Stagger ages so they don't reset all at once
          life: Math.random() * 200 + 100,
        });
      }
    };

    // --- ANIMATION LOOP ---
    const animate = () => {
      const start = performance.now();
      const currentOpacity = propsRef.current.trailOpacity;
      const currentSpeed = propsRef.current.speed;
      const currentColor = propsRef.current.color;

      // 1. Draw trails
      ctx.fillStyle = `rgba(0, 0, 0, ${currentOpacity})`; 
      ctx.fillRect(0, 0, width, height);

      // 2. Setup Gradient
      ctx.fillStyle = getGradient(ctx, currentColor, width);

      // 3. Clear drawing bins
      for (let b = 0; b < 5; b++) {
        bins[b].length = 0;
      }

      // 4. Update particle positions and sort into opacity bins
      const len = particles.length;
      for (let i = 0; i < len; i++) {
        const p = particles[i];

        // Optimized Vector Field: 1 sin and 1 cos lookup (Curl flow approximation)
        p.vx += Math.sin(p.y * 0.005) * 0.2 * currentSpeed;
        p.vy += Math.cos(p.x * 0.005) * 0.2 * currentSpeed;

        // Optimized Mouse interaction: distance squared check first
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distSq = dx * dx + dy * dy;
        const interactionRadiusSq = 22500; // 150 * 150

        if (distSq < interactionRadiusSq) {
          const distance = Math.sqrt(distSq);
          if (distance > 0) {
            const force = (150 - distance) / 150;
            p.vx -= dx * force * 0.05;
            p.vy -= dy * force * 0.05;
          }
        }

        // Apply velocities and friction
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.95;
        p.vy *= 0.95;

        // Age particle
        p.age++;
        if (p.age > p.life) {
          p.x = Math.random() * width;
          p.y = Math.random() * height;
          p.vx = 0;
          p.vy = 0;
          p.age = 0;
          p.life = Math.random() * 200 + 100;
        }

        // Screen wraps
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Sort into opacity bins based on age (fade-in, fade-out curve)
        const alpha = 1 - Math.abs((p.age / p.life) - 0.5) * 2;
        const binIdx = Math.min(4, Math.floor(alpha * 5));
        bins[binIdx].push(p);
      }

      // 5. Batch render particles bin-by-bin (decreases system drawing calls from 600 to 5)
      for (let b = 0; b < 5; b++) {
        const binList = bins[b];
        const binLen = binList.length;
        if (binLen === 0) continue;

        ctx.globalAlpha = (b + 0.5) / 5; // 0.1, 0.3, 0.5, 0.7, 0.9
        ctx.beginPath();
        for (let i = 0; i < binLen; i++) {
          const p = binList[i];
          ctx.rect(p.x, p.y, 1.5, 1.5);
        }
        ctx.fill();
      }

      // Reset globalAlpha to default
      ctx.globalAlpha = 1.0;

      // 6. Measure performance latency
      const duration = performance.now() - start;
      const measureCallback = propsRef.current.onRenderMeasure;
      if (measureCallback) {
        measureCallback(duration);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // --- EVENT LISTENERS ---
    const handleResize = () => {
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      init();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
        mouse.x = -1000;
        mouse.y = -1000;
    };

    // Start
    init();
    animate();

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [particleCount, dprScale]);

  return (
    <div 
      ref={containerRef} 
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        backgroundColor: "#000000",
      }}
      className={className}
    >
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}
