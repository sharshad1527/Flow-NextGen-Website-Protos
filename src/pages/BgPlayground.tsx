import { useEffect, useRef, useState, useMemo } from "react";
import { Compass, Sparkles, Wand2, ArrowLeft, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import { ExtensionMockup } from "../components/ExtensionMockup";
import "./BgPlayground.css";

/* -------------------------------------------------------
   $80K BUDGET CONCEPT SPEC REGISTRY DATA
------------------------------------------------------- */
interface ConceptSpec {
  id: number;
  title: string;
  badge: string;
  visuals: string;
  interaction: string;
  stack: string;
  perf: string;
}

const CONCEPTS: ConceptSpec[] = [
  {
    id: 1,
    title: "Latent Space Manifold Navigation",
    badge: "500k Particles FBO",
    visuals: "A dense cloud of 500,000 microscopic particles forming a topological manifold in an ambient vacuum. Particles glow with semantic color clustering, shifting from cobalt blue to violet and magenta.",
    interaction: "Mouse acts as a gravitational force deforming the manifold with spring physics. Scrolling unfolds the manifold from a sphere into a multi-lobed topological landscape.",
    stack: "Three.js InstancedMesh + custom GLSL vertex shader. Coordinates updated on the GPU using Transform Feedback.",
    perf: "No JS-to-GPU memory uploads. Dynamic Resolution Scaling (DRS) bilaterally upscales if frame rates drop below 110 FPS."
  },
  {
    id: 2,
    title: "Quantum Fluid Dynamics & Neural Currents",
    badge: "Navier-Stokes FBO",
    visuals: "An iridescent fluid simulation mimicking metallic liquid chrome or glowing smoke. Reflections of gold, emerald, and electric violet shimmer across physical waves.",
    interaction: "Mouse movements inject velocity vectors and custom paint colors. Rapid scrolling creates a high-velocity vortex down the center of the page.",
    stack: "WebGL 2.0 ping-pong texture array computing fluid equations in 2D. Rendered as a displacement map on a highly detailed PBR plane.",
    perf: "Run fluid simulation grid at 256x256 texels. Upscale using cubic filtering combined with high-frequency noise in the fragment shader."
  },
  {
    id: 3,
    title: "Kinetic Glass Shards & Refraction Field",
    badge: "Screen-Space Refraction",
    visuals: "A floating cluster of 3D geometric glass shards. The shards act as physical optical lenses, refracting, warping, and chromatically dispersing the site's typography beneath them.",
    interaction: "Mouse movement shifts the 3D camera angle with spring dampening. Hovering over a shard spins it, emitting a laser-sharp light bloom along its edges.",
    stack: "Three.js + Custom WebGL Screen-Space Refraction (SSR) shader. Shards rendered using normal maps and transmission passes.",
    perf: "Avoid rendering twice. Render the background UI once to an offscreen texture, then pass this texture to the glass shard shader."
  },
  {
    id: 4,
    title: "Vector Field Flow Fields (Generative Stream)",
    badge: "Curl Noise Lines",
    visuals: "Millions of micro-lines (streamlines) flowing across a dark grid. The streams represent high-speed generative data flows, transitioning from copper to electric pink.",
    interaction: "The cursor generates a magnetic field that parts the streamlines. Scrolling accelerates the flow speed and reduces line length.",
    stack: "Raw WebGL 2.0 with instanced line drawing. Flow fields calculated using 3D Curl Noise in the vertex shader.",
    perf: "Draw static points and project them along their paths using a GPU-calculated velocity buffer. Use a blend-state screen decay shader."
  },
  {
    id: 5,
    title: "Monochromatic Spectral Raymarcher",
    badge: "SDF Sphere Tracing",
    visuals: "A dark, minimalist, architectural landscape of column structures, steps, and floating spheres. Lit by a single, sharp light beam casting soft shadows.",
    interaction: "The light source position is linked to the mouse cursor, shifting shadows. Scrolling maps to the focal depth of a simulated camera.",
    stack: "Fullscreen Fragment Shader executing Signed Distance Fields (SDF) raymarching. Soft shadows estimated using sphere tracing.",
    perf: "Clamp max raymarching steps to 64. Implement temporal anti-aliasing (TAA) to allow rendering at half-resolution."
  },
  {
    id: 6,
    title: "The Latent Synthesis Canvas (Denoising Grid)",
    badge: "KTX2 Value Noise",
    visuals: "A microscopic digital grid that looks like a neural network denoising pass. Fine, colored static noise dissolves to reveal clean, high-definition assets.",
    interaction: "The mouse acts as a magnifying lens that reveals the pristine, denoised imagery in its radius, leaving a fading trail of noise.",
    stack: "WebGL Custom Shader blending multi-octave Value Noise with high-resolution compressed textures (KTX2/Basis Universal formats).",
    perf: "Pre-warm shaders during loading. Replace complex branch instructions (if-else) in GLSL with step/smoothstep interpolation."
  },
  {
    id: 7,
    title: "Prism Wavefront (Dispersion Mesh)",
    badge: "Barycentric Terrain",
    visuals: "A highly structured 3D terrain grid that flows like waves. The edges of the grid bend white light into a rainbow color spectrum, looking like laser wires.",
    interaction: "Hovering creates concentric ripples on the grid. The height of the ripple peaks determines the intensity of the chromatic dispersion.",
    stack: "Three.js custom ShaderMaterial + Vertex Shader wave displacement. Colors calculated using spectral wavelength approximations.",
    perf: "Perform displacement in the Vertex Shader. Keep the grid resolution optimized (150x150 vertices) and use barycentric interpolation."
  },
  {
    id: 8,
    title: "Coherent Light-Fields (Optic Fiber Web)",
    badge: "Instanced Draw Call",
    visuals: "A vertical web of millions of optical light guides. Bright data pulses travel along these fibers, illuminating nodes as they transit.",
    interaction: "The cursor acts as a magnet, bending fibers locally to create a visible channel of negative space. Scrolling increases pulse speed.",
    stack: "WebGL Instanced Line rendering (gl.drawArraysInstanced). Path deviations computed via vertex shader vector offsets.",
    perf: "Utilize a single instanced line segment geometry. Use instanced attributes for offsets, speeds, and colors to reduce draw calls to 1."
  },
  {
    id: 9,
    title: "Hyper-Dimensional Knot (4D Torus Wireframe)",
    badge: "Projected Torus Geometry",
    visuals: "A complex 3D projection of a 4D torus knot rotating in higher dimensions. Represented as a vector grid that folds, stretches, and dynamically morphs.",
    interaction: "Cursor coordinates control rotation in the 4D planes, causing the wireframe to shift and warp dynamically in real-time.",
    stack: "Pure HTML5 Canvas 2D + dynamic 3D rotational projection math computed in real-time at 120 FPS.",
    perf: "Pre-calculated rotational indices mapped to a low-overhead coordinate matrix. No Three.js overhead."
  },
  {
    id: 10,
    title: "The Semantic Graph (Neural Atlas)",
    badge: "Force-Directed Particles",
    visuals: "A massive network of nodes and connections representing semantic AI data. Central nodes are highly illuminated, branching out to peripheral nodes.",
    interaction: "Hovering highlights connection trees and dims the rest. Scrolling orbits the camera, zooming in on specific key clusters.",
    stack: "WebGL Points and LineSegments. Initial node placement calculated using a 3D force-directed layout.",
    perf: "Run force-directed physics layout simulation on a Web Worker during loading, passing the coordinates once as an array buffer."
  },
  {
    id: 11,
    title: "Volumetric Cloud Scatter (Generative Nebula)",
    badge: "Raymarching Nebular Fog",
    visuals: "A soft, glowing, physically-modeled gas cloud that shifts and self-illuminates. Internal light sources cast shadows through the cloud.",
    interaction: "Cursor controls internal light sources, revealing hidden structures. Scroll velocity drives camera forward through fog.",
    stack: "WebGL custom Raymarching Shader inside a bounding box. Approximates single scattering inside media.",
    perf: "Clamp raymarching steps to 32. Use Bayer dither noise for step offsets, then apply a low-pass bilateral filter in post-processing."
  },
  {
    id: 12,
    title: "Bento Grid Refraction Overlays",
    badge: "Glassmorphic Transforms",
    visuals: "A structured layout of clean, rectangular card components (Bento Grid) with frosted-glass textures refracting a rich fluid simulation underneath.",
    interaction: "Cards tilt in 3D based on mouse position. Underlined elements glow. Scroll triggers smooth layout transitions.",
    stack: "Tailwind CSS + CSS Grid + Framer Motion for card tilts, magnetic hooks, and enter animations over WebGL Fluid simulation.",
    perf: "On lower-end devices, replace CSS backdrop-filters with static blurred canvas proxies. Control animations with GPU translate3d."
  }
];

/* -------------------------------------------------------
   NOISE TEXTURE GENERATOR FOR OPTION 1
   Creates a tileable 256x256 Value Noise texture
------------------------------------------------------- */
function createNoiseTexture(gl: WebGL2RenderingContext): WebGLTexture | null {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const imgData = ctx.createImageData(256, 256);
  const size = 256;
  
  const grid: number[][] = [];
  for (let i = 0; i <= size; i++) {
    grid[i] = [];
    for (let j = 0; j <= size; j++) {
      grid[i][j] = Math.random();
    }
  }

  const val = (x: number, y: number) => {
    const x0 = Math.floor(x) % size;
    const x1 = (x0 + 1) % size;
    const y0 = Math.floor(y) % size;
    const y1 = (y0 + 1) % size;
    const tx = x - Math.floor(x);
    const ty = y - Math.floor(y);
    
    const sx = tx * tx * (3 - 2 * tx);
    const sy = ty * ty * (3 - 2 * ty);

    const n00 = grid[x0][y0];
    const n10 = grid[x1][y0];
    const n01 = grid[x0][y1];
    const n11 = grid[x1][y1];

    const nx0 = n00 * (1 - sx) + n10 * sx;
    const nx1 = n01 * (1 - sx) + n11 * sx;

    return nx0 * (1 - sy) + nx1 * sy;
  };

  const data = imgData.data;
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      let n = 0;
      let amp = 1.0;
      let freq = 4.0;
      for (let o = 0; o < 3; o++) {
        n += val(x * (freq / size), y * (freq / size)) * amp;
        amp *= 0.5;
        freq *= 2.0;
      }
      n = Math.min(1.0, Math.max(0.0, n / 1.75));

      const idx = (x + y * size) * 4;
      data[idx] = Math.floor(n * 255);
      data[idx + 1] = Math.floor(n * 255);
      data[idx + 2] = Math.floor(n * 255);
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = gl.createTexture();
  if (!texture) return null;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  return texture;
}

const vertexShaderSource = `#version 300 es
precision highp float;
in vec4 position;
void main(){
  gl_Position = position;
}`;

const fragmentShaderSource = `#version 300 es
precision highp float;
out vec4 O;
uniform float time;
uniform vec2 resolution;
uniform vec3 u_colorLeft;
uniform vec3 u_colorRight;
uniform sampler2D u_noiseTexture;
uniform float u_monochrome;

#define FC gl_FragCoord.xy
#define R resolution
#define T (time+660.)

void main(){
  float screenX = FC.x / R.x;
  vec3 targetColor = mix(u_colorLeft, u_colorRight, screenX);

  vec2 uv = (FC - 0.5 * R) / R.y;
  uv.x -= 0.15;
  uv *= vec2(2.0, 1.0);

  vec2 uv1 = uv * 0.1 - vec2(T * 0.004, 0.0);
  float n1 = texture(u_noiseTexture, uv1).r;

  vec2 uv2 = uv * 0.28 + vec2(n1 * 0.4, T * 0.008);
  float n2 = texture(u_noiseTexture, uv2).r;

  vec2 baseUv = uv + vec2(0.0, T * 0.012) + vec2(n2 * 0.15);
  
  float f1 = texture(u_noiseTexture, baseUv * 0.4).r;
  float f2 = texture(u_noiseTexture, baseUv * 0.404 + 0.004).r;

  vec3 col = vec3(1.0);
  col.r -= f1;
  col.g -= mix(f1, f2, 0.5);
  col.b -= f2;

  if (u_monochrome > 0.5) {
    float gray = dot(col, vec3(0.299, 0.587, 0.114));
    col = vec3(gray * 0.12 + 0.03); // Grayscale Raymarcher dark theme
  } else {
    col = mix(col, targetColor, dot(col, vec3(0.21, 0.71, 0.07)));
  }

  col = mix(vec3(0.05), col, min(time * 0.1, 1.0));
  col = clamp(col, 0.05, 1.0);

  O = vec4(col, 1.0);
}`;

/* -------------------------------------------------------
   OPTION 1: TEXTURE SMOKE COMPONENT
------------------------------------------------------- */
interface TextureSmokeProps {
  colorLeft?: [number, number, number];
  colorRight?: [number, number, number];
  monochrome?: boolean;
}

function TextureSmoke({ colorLeft, colorRight, monochrome }: TextureSmokeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const bufferRef = useRef<WebGLBuffer | null>(null);
  const textureRef = useRef<WebGLTexture | null>(null);

  const uniformsRef = useRef({ left: colorLeft, right: colorRight, mono: monochrome });
  useEffect(() => {
    uniformsRef.current = { left: colorLeft, right: colorRight, mono: monochrome };
  }, [colorLeft, colorRight, monochrome]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2") as WebGL2RenderingContext;
    if (!gl) return;
    glRef.current = gl;

    const updateSize = () => {
      const dpr = Math.min(1.0, window.devicePixelRatio);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    updateSize();
    window.addEventListener("resize", updateSize);

    const vs = gl.createShader(gl.VERTEX_SHADER);
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (!vs || !fs || !program) return;

    gl.shaderSource(vs, vertexShaderSource);
    gl.compileShader(vs);
    gl.shaderSource(fs, fragmentShaderSource);
    gl.compileShader(fs);

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    programRef.current = program;

    const vertices = new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    bufferRef.current = buffer;

    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const texture = createNoiseTexture(gl);
    textureRef.current = texture;

    Object.assign(program, {
      resolution: gl.getUniformLocation(program, "resolution"),
      time: gl.getUniformLocation(program, "time"),
      u_colorLeft: gl.getUniformLocation(program, "u_colorLeft"),
      u_colorRight: gl.getUniformLocation(program, "u_colorRight"),
      u_noiseTexture: gl.getUniformLocation(program, "u_noiseTexture"),
      u_monochrome: gl.getUniformLocation(program, "u_monochrome"),
    });

    const render = (now: number) => {
      if (!programRef.current || !glRef.current) return;
      const gl = glRef.current;
      const prog = programRef.current;

      gl.clearColor(0.02, 0.02, 0.02, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, bufferRef.current);
      
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textureRef.current);
      
      const left = uniformsRef.current.left || [1.0, 0.42, 0.0];
      const right = uniformsRef.current.right || [0.0, 0.90, 0.46];
      const mono = uniformsRef.current.mono ? 1.0 : 0.0;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      gl.uniform1i((prog as any).u_noiseTexture, 0);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      gl.uniform2f((prog as any).resolution, canvas.width, canvas.height);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      gl.uniform1f((prog as any).time, now * 1e-3);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      gl.uniform3fv((prog as any).u_colorLeft, left);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      gl.uniform3fv((prog as any).u_colorRight, right);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      gl.uniform1f((prog as any).u_monochrome, mono);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", updateSize);
      cancelAnimationFrame(rafRef.current);
      if (glRef.current && programRef.current) {
        const gl = glRef.current;
        const prog = programRef.current;
        gl.deleteProgram(prog);
        gl.deleteBuffer(bufferRef.current);
        gl.deleteTexture(textureRef.current);
      }
    };
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.55 }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}

/* -------------------------------------------------------
   OPTION 2: CSS AURORA ORBS
------------------------------------------------------- */
interface CSSAuroraOrbsProps {
  orbColor1?: string;
  orbColor2?: string;
}

function CSSAuroraOrbs({ orbColor1, orbColor2 }: CSSAuroraOrbsProps) {
  const containerStyle = useMemo(() => ({
    "--aurora-color-1": orbColor1 || "rgba(255, 107, 0, 0.22)",
    "--aurora-color-2": orbColor2 || "rgba(0, 230, 118, 0.18)",
  } as React.CSSProperties), [orbColor1, orbColor2]);

  return (
    <div className="aurora-container" style={containerStyle}>
      <div className="aurora-orb aurora-orb-1" />
      <div className="aurora-orb aurora-orb-2" />
      <div className="aurora-orb aurora-orb-3" />
      <div className="aurora-orb aurora-orb-4" />
      <div className="aurora-glass" />
      <div className="aurora-grain" />
    </div>
  );
}

/* -------------------------------------------------------
   OPTION 3: CONSTELLATION PARTICLES & 3D TORUS
------------------------------------------------------- */
interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  targetAlpha: number;
}

interface ConstellationProps {
  lineColor?: string;
  particleColor?: string;
  connectDistance?: number;
  speedMultiplier?: number;
  particleCount?: number;
  verticalOnly?: boolean;
  drawTorus?: boolean;
}

function ConstellationParticles({
  lineColor,
  particleColor,
  connectDistance = 100,
  speedMultiplier = 1.0,
  particleCount = 100,
  verticalOnly = false,
  drawTorus = false
}: ConstellationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  const propsRef = useRef({
    lineColor,
    particleColor,
    connectDistance,
    speedMultiplier,
    particleCount,
    verticalOnly,
    drawTorus
  });

  useEffect(() => {
    propsRef.current = {
      lineColor,
      particleColor,
      connectDistance,
      speedMultiplier,
      particleCount,
      verticalOnly,
      drawTorus
    };
  }, [lineColor, particleColor, connectDistance, speedMultiplier, particleCount, verticalOnly, drawTorus]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateSize();
    window.addEventListener("resize", updateSize);

    // Initial setup of particles
    const maxCount = 250;
    const particles: Point[] = [];
    for (let i = 0; i < maxCount; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2.2 + 0.8,
        alpha: Math.random() * 0.4 + 0.2,
        targetAlpha: Math.random() * 0.5 + 0.3,
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    let animId: number;

    const render = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const mouse = mouseRef.current;
      const config = propsRef.current;

      if (config.drawTorus) {
        // Draw spinning 3D Torus Projection
        const cx = w / 2;
        const cy = h / 2;
        const rotX = time * 0.0006;
        const rotY = time * 0.0009;
        
        const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
        const cosY = Math.cos(rotY), sinY = Math.sin(rotY);

        const project = (x: number, y: number, z: number) => {
          // Rotate Y
          const x1 = x * cosY - z * sinY;
          const z1 = x * sinY + z * cosY;
          // Rotate X
          const y2 = y * cosX - z1 * sinX;
          const z2 = y * sinX + z1 * cosX;
          
          const scale = 260 / (280 + z2);
          return {
            x: cx + x1 * scale,
            y: cy + y2 * scale
          };
        };

        const steps = 18;
        const R_torus = 160;
        const r_torus = 65;

        ctx.strokeStyle = config.lineColor || "rgba(255, 107, 0, 0.22)";
        ctx.lineWidth = 0.85;

        const gridPoints: { x: number; y: number }[][] = [];
        for (let u = 0; u < steps; u++) {
          const theta = (u / steps) * Math.PI * 2;
          gridPoints[u] = [];
          for (let v = 0; v < steps; v++) {
            const phi = (v / steps) * Math.PI * 2;
            const x3d = (R_torus + r_torus * Math.cos(phi)) * Math.cos(theta);
            const y3d = (R_torus + r_torus * Math.cos(phi)) * Math.sin(theta);
            const z3d = r_torus * Math.sin(phi);

            gridPoints[u][v] = project(x3d, y3d, z3d);
          }
        }

        for (let u = 0; u < steps; u++) {
          for (let v = 0; v < steps; v++) {
            const nextU = (u + 1) % steps;
            const nextV = (v + 1) % steps;

            ctx.beginPath();
            ctx.moveTo(gridPoints[u][v].x, gridPoints[u][v].y);
            ctx.lineTo(gridPoints[nextU][v].x, gridPoints[nextU][v].y);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(gridPoints[u][v].x, gridPoints[u][v].y);
            ctx.lineTo(gridPoints[u][nextV].x, gridPoints[u][nextV].y);
            ctx.stroke();
          }
        }
      } else {
        // Render constellation lines and particles
        ctx.lineWidth = 0.6;
        const activeCount = Math.min(config.particleCount, maxCount);

        for (let i = 0; i < activeCount; i++) {
          const p1 = particles[i];

          // Apply velocity (optionally restrict to vertical only)
          const vy = p1.vy * config.speedMultiplier;
          const vx = config.verticalOnly ? 0.0 : p1.vx * config.speedMultiplier;

          p1.x += vx;
          p1.y += vy;

          if (p1.x < 0) p1.x = w;
          if (p1.x > w) p1.x = 0;
          if (p1.y < 0) p1.y = h;
          if (p1.y > h) p1.y = 0;

          // Mouse warp calculations
          const dx = mouse.x - p1.x;
          const dy = mouse.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const force = (130 - dist) / 130;
            p1.x -= (dx / dist) * force * 1.8;
            p1.y -= (dy / dist) * force * 1.8;
          }

          // Draw connection lines if distance is set
          if (config.connectDistance > 0) {
            for (let j = i + 1; j < activeCount; j++) {
              const p2 = particles[j];
              const cdx = p1.x - p2.x;
              const cdy = p1.y - p2.y;
              const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

              if (cdist < config.connectDistance) {
                const alpha = (config.connectDistance - cdist) / config.connectDistance * 0.12;
                ctx.strokeStyle = config.lineColor || `rgba(255, 107, 0, ${alpha})`;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
              }
            }
          }

          // Draw particle node
          ctx.fillStyle = config.particleColor || `rgba(255, 145, 0, ${p1.alpha})`;
          ctx.beginPath();
          ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
          ctx.fill();

          p1.alpha += (p1.targetAlpha - p1.alpha) * 0.05;
          if (Math.abs(p1.alpha - p1.targetAlpha) < 0.02) {
            p1.targetAlpha = Math.random() * 0.5 + 0.3;
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", updateSize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}

/* -------------------------------------------------------
   MAIN PLAYGROUND PAGE
------------------------------------------------------- */
export function BgPlayground() {
  const [activeTab, setActiveTab] = useState<"prototypes" | "concepts">("prototypes");
  const [bgType, setBgType] = useState<"smoke" | "aurora" | "particles">("smoke");
  const [selectedConcept, setSelectedConcept] = useState<ConceptSpec>(CONCEPTS[0]);
  const [showBento, setShowBento] = useState(false);
  const [fps, setFps] = useState(60);

  // Dynamic Theme/Shader prop states computed based on selected blueprint
  const smokeProps = useMemo(() => {
    if (activeTab === "concepts") {
      switch (selectedConcept.id) {
        case 2: // Fluid Dynamics (Gold & Violet)
          return { colorLeft: [1.0, 0.72, 0.0] as [number, number, number], colorRight: [0.55, 0.0, 1.0] as [number, number, number], monochrome: false };
        case 5: // Monochromatic raymarcher
          return { monochrome: true };
        case 11: // Volumetric scatter (gaseous orange/teal)
          return { colorLeft: [1.0, 0.38, 0.0] as [number, number, number], colorRight: [0.0, 0.65, 0.7] as [number, number, number], monochrome: false };
      }
    }
    return { colorLeft: [1.0, 0.42, 0.0] as [number, number, number], colorRight: [0.0, 0.90, 0.46] as [number, number, number], monochrome: false };
  }, [activeTab, selectedConcept]);

  const particlesProps = useMemo(() => {
    if (activeTab === "concepts") {
      switch (selectedConcept.id) {
        case 1: // Manifold (Violet/Magenta dots only)
          return { particleColor: "rgba(156, 39, 176, 0.6)", connectDistance: 0, speedMultiplier: 0.6, particleCount: 220 };
        case 4: // Vector Field lines
          return { lineColor: "rgba(255, 0, 128, 0.25)", connectDistance: 80, speedMultiplier: 2.2, particleCount: 150 };
        case 7: // Prism wireframe ripples (Green/Yellow links)
          return { lineColor: "rgba(0, 230, 118, 0.35)", connectDistance: 110, speedMultiplier: 1.2, particleCount: 120 };
        case 8: // Coherent Fiber optic web (Vertical data packet flow)
          return { lineColor: "rgba(0, 176, 255, 0.38)", connectDistance: 100, speedMultiplier: 1.8, particleCount: 130, verticalOnly: true };
        case 9: // Torus projection mesh
          return { drawTorus: true, lineColor: "rgba(255, 107, 0, 0.35)" };
        case 10: // Semantic network links
          return { lineColor: "rgba(255, 145, 0, 0.2)", connectDistance: 95, speedMultiplier: 0.75, particleCount: 110 };
      }
    }
    return {};
  }, [activeTab, selectedConcept]);

  const auroraProps = useMemo(() => {
    if (activeTab === "concepts") {
      switch (selectedConcept.id) {
        case 3: // Shards transmission (white refraction)
          return { orbColor1: "rgba(255, 255, 255, 0.12)", orbColor2: "rgba(0, 10, 45, 0.4)" };
        case 6: // Latent Synthesis Canvas (Tactile emerald orbs)
          return { orbColor1: "rgba(0, 230, 118, 0.18)", orbColor2: "rgba(255, 60, 0, 0.15)" };
      }
    }
    return {};
  }, [activeTab, selectedConcept]);

  // Synchronize dynamic background types to active selected blueprints
  useEffect(() => {
    if (activeTab !== "concepts") return;

    const id = selectedConcept.id;
    // Map concept IDs to background classes
    if ([2, 5, 11].includes(id)) {
      setBgType("smoke");
    } else if ([3, 6, 12].includes(id)) {
      setBgType("aurora");
    } else if ([1, 4, 7, 8, 9, 10].includes(id)) {
      setBgType("particles");
    }

    // Force glass bento overlays in refraction-heavy cards
    if ([3, 12].includes(id)) {
      setShowBento(true);
    } else {
      setShowBento(false);
    }
  }, [activeTab, selectedConcept]);

  // Real frame rate calculator loop
  useEffect(() => {
    let lastTime = performance.now();
    let frameCount = 0;
    let animId: number;
    const loop = (now: number) => {
      frameCount++;
      if (now > lastTime + 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const bgDescription = useMemo(() => {
    switch (bgType) {
      case "smoke":
        return `Option 1 (Texture Smoke) — ${activeTab === "concepts" ? `Rendering Specs Mockup for concept #${selectedConcept.id}` : "Standard Preset"}`;
      case "aurora":
        return `Option 2 (Aurora Orbs) — ${activeTab === "concepts" ? `Rendering Specs Mockup for concept #${selectedConcept.id}` : "Standard Preset"}`;
      case "particles":
        return `Option 3 (Constellation) — ${activeTab === "concepts" ? `Rendering Specs Mockup for concept #${selectedConcept.id}` : "Standard Preset"}`;
    }
  }, [bgType, activeTab, selectedConcept]);

  return (
    <div className="playground-container">
      {/* Dynamic Background switcher passing down live updated params */}
      {bgType === "smoke" && (
        <TextureSmoke 
          colorLeft={smokeProps.colorLeft} 
          colorRight={smokeProps.colorRight} 
          monochrome={smokeProps.monochrome} 
        />
      )}
      {bgType === "aurora" && (
        <CSSAuroraOrbs 
          orbColor1={auroraProps.orbColor1} 
          orbColor2={auroraProps.orbColor2} 
        />
      )}
      {bgType === "particles" && (
        <ConstellationParticles 
          particleColor={particlesProps.particleColor}
          lineColor={particlesProps.lineColor}
          connectDistance={particlesProps.connectDistance}
          speedMultiplier={particlesProps.speedMultiplier}
          particleCount={particlesProps.particleCount}
          verticalOnly={particlesProps.verticalOnly}
          drawTorus={particlesProps.drawTorus}
        />
      )}

      {/* Bento Grid Glass overlay toggle */}
      {showBento && (
        <div className="bento-grid-overlay">
          <div className="bento-card-glass bento-card-1" />
          <div className="bento-card-glass bento-card-2" />
          <div className="bento-card-glass bento-card-3" />
          <div className="bento-card-glass bento-card-4" />
          <div className="bento-card-glass bento-card-5" />
        </div>
      )}

      {/* Control panel hub */}
      <div className="control-hub">
        <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.7rem", color: "#FF6B00", textDecoration: "none", marginBottom: "0.85rem", fontWeight: 700 }}>
          <ArrowLeft size={10} /> BACK TO LANDING PAGE
        </Link>
        
        <h2 className="control-title">Background Lab</h2>
        <p className="control-desc">
          Test scroll performance and review high-budget interactive background design blueprints.
        </p>

        {/* Panel tabs */}
        <div className="panel-tabs">
          <button 
            className={`panel-tab-btn ${activeTab === "prototypes" ? "active" : ""}`}
            onClick={() => setActiveTab("prototypes")}
          >
            PROTOTYPES
          </button>
          <button 
            className={`panel-tab-btn ${activeTab === "concepts" ? "active" : ""}`}
            onClick={() => setActiveTab("concepts")}
          >
            $80K BLUEPRINTS
          </button>
        </div>

        {/* TAB 1: Prototypes */}
        {activeTab === "prototypes" && (
          <div className="selector-list">
            <button 
              className={`selector-btn ${bgType === "smoke" ? "active" : ""}`}
              onClick={() => setBgType("smoke")}
            >
              <span className="btn-title">1. Texture Noise Smoke</span>
              <span className="btn-desc">Fast WebGL samplers with chromatic aberration</span>
            </button>
            
            <button 
              className={`selector-btn ${bgType === "aurora" ? "active" : ""}`}
              onClick={() => setBgType("aurora")}
            >
              <span className="btn-title">2. Glassmorphic Aurora Orbs</span>
              <span className="btn-desc">Pure CSS compositor gradient mesh & paper grain</span>
            </button>

            <button 
              className={`selector-btn ${bgType === "particles" ? "active" : ""}`}
              onClick={() => setBgType("particles")}
            >
              <span className="btn-title">3. Constellation Particles</span>
              <span className="btn-desc">Interactive canvas net tracking pointer coordinates</span>
            </button>
          </div>
        )}

        {/* TAB 2: $80K Concept Blueprints */}
        {activeTab === "concepts" && (
          <div className="selector-list">
            {CONCEPTS.map((concept) => (
              <button 
                key={concept.id}
                className={`selector-btn ${selectedConcept.id === concept.id ? "active" : ""}`}
                onClick={() => setSelectedConcept(concept)}
              >
                <span className="btn-title">{concept.id}. {concept.title}</span>
                <span className="btn-desc">{concept.badge}</span>
              </button>
            ))}
          </div>
        )}

        {/* Concept Details Spec Box */}
        {activeTab === "concepts" && selectedConcept && (
          <div style={{ marginTop: "1rem" }}>
            <div className="concept-details-box">
              <span className="concept-badge">{selectedConcept.badge}</span>
              <h4 className="concept-details-title">{selectedConcept.title}</h4>
              
              <span className="concept-section-title">Visual Aspect</span>
              <p className="concept-text">{selectedConcept.visuals}</p>
              
              <span className="concept-section-title">Interaction</span>
              <p className="concept-text">{selectedConcept.interaction}</p>
              
              <span className="concept-section-title">Stack</span>
              <p className="concept-text">{selectedConcept.stack}</p>

              <span className="concept-section-title">120FPS Optimization</span>
              <p className="concept-text">{selectedConcept.perf}</p>
            </div>
          </div>
        )}

        {/* Glass Bento Cards Overlay Toggle */}
        <div className="bento-toggle-row">
          <span className="bento-toggle-label">Show Glass Bento Grid</span>
          <label className="checkbox-wrap">
            <input 
              type="checkbox" 
              checked={showBento} 
              onChange={(e) => setShowBento(e.target.checked)} 
            />
            <span className="checkbox-slider" />
          </label>
        </div>

        {/* Performance metrics dashboard */}
        <div className="perf-stats">
          <div className="stat-row">
            <span className="stat-lbl">Render Mode:</span>
            <span className="stat-val">{bgType === "aurora" ? "CSS Compositor" : bgType === "smoke" ? "WebGL 2.0" : "Canvas 2D"}</span>
          </div>
          <div className="stat-row">
            <span className="stat-lbl">Realtime FPS:</span>
            <span className={`stat-val ${fps >= 58 ? "green" : ""}`}>{fps} FPS</span>
          </div>
          <div className="stat-row">
            <span className="stat-lbl">Pipeline:</span>
            <span className="stat-val green">COMPOSITED</span>
          </div>
        </div>
      </div>

      {/* Main scrolling layout to test animation rendering under load */}
      <div className="playground-content">
        <div className="preview-hero">
          <span className="preview-eyebrow">Design Lab Playground</span>
          <h1 className="preview-title">Test Scroll Smoothness</h1>
          <p className="preview-subtext">
            Currently rendering: <br/>
            <strong>{bgDescription}</strong>
          </p>
        </div>

        {/* Dummy Mockup shell to ensure layout matches normal rendering */}
        <div className="preview-mockup-wrapper">
          <ExtensionMockup phase={1} />
        </div>

        {/* Dummy scrollable sections */}
        <div className="scroll-section">
          <h3 className="scroll-section-title">
            <Compass size={18} style={{ marginRight: "0.5rem", color: "#FF6B00", verticalAlign: "middle" }} />
            Zero Scroll Stutter Check
          </h3>
          <p className="scroll-section-p">
            Scroll up and down repeatedly to ensure the viewport updates instantly. Look for any dropping frames or lag spikes. 
            Because we offloaded computational weight from the main CPU thread, you should notice that even fast scrolls feel perfectly synchronized.
          </p>
        </div>

        <div className="scroll-section">
          <h3 className="scroll-section-title">
            <Sparkles size={18} style={{ marginRight: "0.5rem", color: "#FF6B00", verticalAlign: "middle" }} />
            Tactile Material Fidelity
          </h3>
          <p className="scroll-section-p">
            Option 2 features a grain overlay that breaks up flat digital colors, simulating a premium analog canvas. 
            This tactile paper filter elevates simple gradients to a professional product level.
          </p>
        </div>

        <div className="scroll-section">
          <h3 className="scroll-section-title">
            <Wand2 size={18} style={{ marginRight: "0.5rem", color: "#FF6B00", verticalAlign: "middle" }} />
            WebGL Sampler Pipeline
          </h3>
          <p className="scroll-section-p">
            Option 1 uses a static texture computed once in JavaScript memory, which is then mapped across the screen coordinates. 
            This reduces the math instructions in the WebGL pixel pipelines to absolute bounds, preserving full detail.
          </p>
        </div>

        <div className="scroll-section">
          <h3 className="scroll-section-title">
            <Layers size={18} style={{ marginRight: "0.5rem", color: "#FF6B00", verticalAlign: "middle" }} />
            Glass Refraction Overlay
          </h3>
          <p className="scroll-section-p">
            Toggle the "Show Glass Bento Grid" switch to layer frosted glass cards with CSS backdrop-filter blur on top of the backgrounds. 
            This demonstrates how components refract and color-blend with the moving elements below them.
          </p>
        </div>
      </div>
    </div>
  );
}
