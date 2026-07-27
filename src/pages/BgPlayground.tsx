import { Helmet } from "react-helmet-async";
import { SEO } from "../components/SEO";
import { useRef, useState, useMemo } from "react";
import { Compass, Sparkles, Wand2, ArrowLeft, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { SmokeBackground } from "../components/SmokeBackground";
import NeuralBackground from "@/components/ui/flow-field-background";
import "./BgPlayground.css";

/* -------------------------------------------------------
   $150K BUDGET CONCEPT SPEC REGISTRY DATA - 50 BACKGROUNDS
------------------------------------------------------- */
interface ConceptSpec {
  id: number;
  title: string;
  category: "space" | "interactive" | "3d" | "cyberpunk" | "shaders";
  bgType: "smoke" | "aurora" | "particles" | "fluid" | "flow-field" | "silk" | "drift" | "original-smoke";
  badge: string;
  visuals: string;
  interaction: string;
  stack: string;
  perf: string;
  props: {
    colorLeft?: [number, number, number];
    colorRight?: [number, number, number];
    monochrome?: boolean;
    orbColor1?: string;
    orbColor2?: string;
    canvasMode?: 
      | "constellation"
      | "manifold"
      | "flowfield"
      | "vertical"
      | "torus"
      | "starfield"
      | "matrix"
      | "dna"
      | "sphere"
      | "hud"
      | "grid"
      | "gravity"
      | "glitch"
      | "vaporwave"
      | "halftone"
      | "soliton"
      | "subway";
    lineColor?: string;
    particleColor?: string;
    connectDistance?: number;
    speedMultiplier?: number;
    particleCount?: number;
    verticalOnly?: boolean;
    drawTorus?: boolean;
  };
}

const CONCEPTS: ConceptSpec[] = [
  {
    id: 1,
    title: "Latent Space Manifold Navigation",
    category: "space",
    bgType: "particles",
    badge: "500k Particles FBO",
    visuals: "A dense cloud of microscopic particles forming a topological manifold in an ambient vacuum. Particles glow with semantic color clustering, shifting from cobalt blue to violet and magenta.",
    interaction: "Mouse acts as a gravitational force deforming the manifold with spring physics.",
    stack: "WebGL 2.0 Transform Feedback + InstancedMesh.",
    perf: "GPGPU coordinates calculation bypasses JS-to-GPU bandwidth bottlenecks.",
    props: { canvasMode: "manifold", particleColor: "rgba(156, 39, 176, 0.65)", connectDistance: 0, speedMultiplier: 0.6, particleCount: 220 }
  },
  {
    id: 2,
    title: "Quantum Fluid Dynamics & Neural Currents",
    category: "shaders",
    bgType: "smoke",
    badge: "Navier-Stokes FBO",
    visuals: "An iridescent fluid simulation mimicking metallic liquid chrome or glowing smoke. Reflections of gold, emerald, and electric violet shimmer across physical waves.",
    interaction: "Mouse movements inject velocity vectors and custom paint colors.",
    stack: "WebGL 2.0 ping-pong texture arrays computing Navier-Stokes equations.",
    perf: "Run fluid grid at 256x256 texels. Upscale with fragment shader Value noise interpolation.",
    props: { colorLeft: [1.0, 0.72, 0.0], colorRight: [0.55, 0.0, 1.0], monochrome: false }
  },
  {
    id: 3,
    title: "Kinetic Glass Shards & Refraction Field",
    category: "3d",
    bgType: "aurora",
    badge: "Screen-Space Refraction",
    visuals: "A floating cluster of 3D geometric glass shards acting as optical lenses, refracting, warping, and chromatically dispersing the site's typography.",
    interaction: "Mouse shifts the camera angle with spring dampening; hover spins shards.",
    stack: "Three.js + Screen-Space Refraction (SSR) custom pixel shaders.",
    perf: "Offscreen buffer sharing prevents double-render viewport overhead.",
    props: { orbColor1: "rgba(255, 255, 255, 0.12)", orbColor2: "rgba(0, 10, 45, 0.4)" }
  },
  {
    id: 4,
    title: "Vector Field Flow Fields (Generative Stream)",
    category: "interactive",
    bgType: "particles",
    badge: "Curl Noise Lines",
    visuals: "Millions of micro-lines (streamlines) flowing across a dark grid. The streams represent high-speed generative data flows, transitioning from copper to electric pink.",
    interaction: "The cursor generates a magnetic field that parts the streamlines.",
    stack: "Raw WebGL 2.0 instanced line drawing with Curl noise simulation.",
    perf: "Velocity buffer decay shader preserves trail logic without spawning CPU geometry.",
    props: { canvasMode: "flowfield", lineColor: "rgba(255, 0, 128, 0.25)", connectDistance: 80, speedMultiplier: 2.2, particleCount: 150 }
  },
  {
    id: 5,
    title: "Monochromatic Spectral Raymarcher",
    category: "shaders",
    bgType: "smoke",
    badge: "SDF Sphere Tracing",
    visuals: "A dark, minimalist, architectural landscape of column structures, steps, and floating spheres. Lit by a single, sharp light beam casting soft shadows.",
    interaction: "The light source position is linked to the mouse cursor, shifting shadows.",
    stack: "Fullscreen Fragment Shader executing Signed Distance Fields (SDF) raymarching.",
    perf: "Clamp raymarching steps to 64; temporal anti-aliasing (TAA) allows half-res render.",
    props: { monochrome: true }
  },
  {
    id: 6,
    title: "The Latent Synthesis Canvas (Denoising Grid)",
    category: "cyberpunk",
    bgType: "aurora",
    badge: "KTX2 Value Noise",
    visuals: "A microscopic digital grid that looks like a neural network denoising pass. Fine, colored static noise dissolves to reveal clean, high-definition assets.",
    interaction: "The mouse acts as a magnifying lens that reveals the pristine, denoised imagery.",
    stack: "WebGL Custom Shader blending multi-octave Value Noise with compressed KTX2 assets.",
    perf: "Replace branch instructions (if-else) in GLSL with step/smoothstep interpolation.",
    props: { orbColor1: "rgba(0, 230, 118, 0.18)", orbColor2: "rgba(255, 60, 0, 0.15)" }
  },
  {
    id: 7,
    title: "Prism Wavefront (Dispersion Mesh)",
    category: "3d",
    bgType: "particles",
    badge: "Barycentric Terrain",
    visuals: "A highly structured 3D terrain grid that flows like waves. The edges of the grid bend white light into a rainbow color spectrum, looking like laser wires.",
    interaction: "Hovering creates concentric ripples on the grid; heights determine dispersion.",
    stack: "Three.js custom ShaderMaterial + Vertex Shader wave displacement.",
    perf: "Keep grid resolution optimized (150x150 vertices) and use barycentric interpolation.",
    props: { canvasMode: "constellation", lineColor: "rgba(0, 230, 118, 0.35)", connectDistance: 110, speedMultiplier: 1.2, particleCount: 120 }
  },
  {
    id: 8,
    title: "Coherent Light-Fields (Optic Fiber Web)",
    category: "interactive",
    bgType: "particles",
    badge: "Instanced Draw Call",
    visuals: "A vertical web of millions of optical light guides. Bright data pulses travel along these fibers, illuminating nodes as they transit.",
    interaction: "The cursor acts as a magnet, bending fibers locally to create a channel of negative space.",
    stack: "WebGL Instanced Line rendering (gl.drawArraysInstanced).",
    perf: "Single geometry batching reduces CPU draw calls to exactly 1.",
    props: { canvasMode: "vertical", lineColor: "rgba(0, 176, 255, 0.38)", connectDistance: 100, speedMultiplier: 1.8, particleCount: 130, verticalOnly: true }
  },
  {
    id: 9,
    title: "Hyper-Dimensional Knot (4D Torus Wireframe)",
    category: "3d",
    bgType: "particles",
    badge: "Projected Torus Geometry",
    visuals: "A complex 3D projection of a 4D torus knot rotating in higher dimensions. Represented as a vector grid that folds, stretches, and dynamically morphs.",
    interaction: "Cursor coordinates control rotation in the 4D planes, shifting the wireframe.",
    stack: "Pure HTML5 Canvas 2D + dynamic 3D rotational projection math.",
    perf: "Pre-calculated coordinate indexes mapped to low-overhead matrices.",
    props: { canvasMode: "torus", drawTorus: true, lineColor: "rgba(255, 107, 0, 0.35)" }
  },
  {
    id: 10,
    title: "The Semantic Graph (Neural Atlas)",
    category: "interactive",
    bgType: "particles",
    badge: "Force-Directed Particles",
    visuals: "A massive network of nodes and connections representing semantic AI data. Central nodes are highly illuminated, branching out to peripheral nodes.",
    interaction: "Hovering highlights connection trees and dims the rest.",
    stack: "WebGL Points and LineSegments with force-directed physics layouts.",
    perf: "Layout calculations offloaded to Web Workers; updates sent as single buffer arrays.",
    props: { canvasMode: "constellation", lineColor: "rgba(255, 145, 0, 0.2)", connectDistance: 95, speedMultiplier: 0.75, particleCount: 110 }
  },
  {
    id: 11,
    title: "Volumetric Cloud Scatter (Generative Nebula)",
    category: "space",
    bgType: "smoke",
    badge: "Raymarching Nebular Fog",
    visuals: "A soft, glowing, physically-modeled gas cloud that shifts and self-illuminates. Internal light sources cast shadows through the cloud.",
    interaction: "Cursor controls internal light sources, revealing hidden structures.",
    stack: "WebGL custom Raymarching Shader inside a bounding box container.",
    perf: "Clamp raymarching steps to 32; apply bilateral low-pass filter in post-processing.",
    props: { colorLeft: [1.0, 0.38, 0.0], colorRight: [0.0, 0.65, 0.7], monochrome: false }
  },
  {
    id: 12,
    title: "Bento Grid Refraction Overlays",
    category: "3d",
    bgType: "aurora",
    badge: "Glassmorphic Transforms",
    visuals: "A structured layout of clean, rectangular card components (Bento Grid) with frosted-glass textures refracting a rich fluid simulation underneath.",
    interaction: "Cards tilt in 3D based on mouse position. Underlined elements glow.",
    stack: "CSS Grid + Framer Motion for card tilts over WebGL smoke simulation.",
    perf: "Avoid layout recalculations. Animate transform (translate3d) instead of top/left coordinates.",
    props: { orbColor1: "rgba(255, 107, 0, 0.22)", orbColor2: "rgba(0, 230, 118, 0.18)" }
  },
  {
    id: 13,
    title: "Starfield Warp Speed Journey",
    category: "space",
    bgType: "particles",
    badge: "3D Perspective Warp",
    visuals: "Infinite vector stars emerging from a spatial center point, expanding dynamically into high-speed trails as they approach the camera viewport.",
    interaction: "Hovering shifts the center focus vector; scroll velocity accelerates speed.",
    stack: "3D depth coordinates projection mapped to Canvas 2D stroke lines.",
    perf: "Recycle coordinates when depth index approaches zero, preventing garbage collection load.",
    props: { canvasMode: "starfield", particleColor: "rgba(255, 255, 255, 0.6)", speedMultiplier: 1.5, particleCount: 180 }
  },
  {
    id: 14,
    title: "Supernova Flare Horizon",
    category: "space",
    bgType: "aurora",
    badge: "CSS Compositor Flare",
    visuals: "A blazing orange solar star with high energy corona rings, emitting gas pulses and intense radial blooms.",
    interaction: "Mouse coordinates shift the solar core relative to the background stars grid.",
    stack: "CSS radial gradients, CSS hardware filters, and animation delays.",
    perf: "Leverages GPU compositor threads for zero UI layout thread activity.",
    props: { orbColor1: "rgba(255, 60, 0, 0.3)", orbColor2: "rgba(255, 220, 0, 0.2)" }
  },
  {
    id: 15,
    title: "Matrix Digital Code Streams",
    category: "cyberpunk",
    bgType: "particles",
    badge: "Canvas Glitch Stream",
    visuals: "Dense vertical columns of glowing neon green binary digits (0 and 1) falling at asynchronous speeds, leaving decaying trace glows.",
    interaction: "Mouse cursor repels the code streams, leaving a circular void of black space.",
    stack: "Monospace canvas text buffer rendering with opacity decay shaders.",
    perf: "Render directly to canvas without HTML DOM text elements to maintain 120 FPS.",
    props: { canvasMode: "matrix", particleColor: "rgba(0, 255, 70, 0.95)", speedMultiplier: 1.2, particleCount: 140 }
  },
  {
    id: 16,
    title: "Perspective Cyber Grid Run",
    category: "cyberpunk",
    bgType: "particles",
    badge: "Infinite Perspective Grid",
    visuals: "A wireframe perspective floor moving towards the viewport, reminiscent of retro synthwave aesthetics with neon pink grids.",
    interaction: "Mouse movement rotates the grid perspective angle smoothly; scroll speeds up movement.",
    stack: "Converging perspective vector calculations in 2D space.",
    perf: "Static vector lines re-drawn relative to scroll offsets for zero memory leak.",
    props: { canvasMode: "grid", lineColor: "rgba(255, 0, 128, 0.22)", speedMultiplier: 1.4 }
  },
  {
    id: 17,
    title: "Magnetic Gravity Sand Simulation",
    category: "interactive",
    bgType: "particles",
    badge: "Gravity Attractor Particles",
    visuals: "Thousands of tiny neon cyan particles drifting across the dark canvas, pulled like sand by the gravitational force of your cursor.",
    interaction: "Moving the mouse gathers the sand into dense orbital strings; click triggers an explosion.",
    stack: "Inverse square law distance calculation with velocity friction components.",
    perf: "Keep distance checks optimized to prevent double loops over particle pairs.",
    props: { canvasMode: "gravity", particleColor: "rgba(0, 229, 255, 0.5)", speedMultiplier: 1.0, particleCount: 200 }
  },
  {
    id: 18,
    title: "WebGL Sine-Wave Plasma Wave",
    category: "shaders",
    bgType: "smoke",
    badge: "GLSL Plasma Shader",
    visuals: "A flowing fluid wave shifting color between electric violet and cyan, looking like a quantum energy field.",
    interaction: "Mouse movement adds high-frequency color distortions and scale vectors.",
    stack: "WebGL 2.0 Fragment Shader calculating three overlapping sine-wave octaves.",
    perf: "Calculated fully in fragment shader; zero JS computational overhead.",
    props: { colorLeft: [0.55, 0.0, 1.0], colorRight: [0.0, 0.9, 0.9], monochrome: false }
  },
  {
    id: 19,
    title: "Double Helix DNA Spiral",
    category: "3d",
    bgType: "particles",
    badge: "3D Spiral Helix",
    visuals: "A spinning 3D double helix structure rotating vertically, containing orange and emerald green nucleotides.",
    interaction: "Mouse changes the rotation velocity and pitch angle of the helix.",
    stack: "3D sine/cosine coordinates rotated via 3D matrix math in JS.",
    perf: "Rendered to 2D canvas with depth scaling applied to particle radius.",
    props: { canvasMode: "dna", lineColor: "rgba(255, 107, 0, 0.25)", particleColor: "rgba(255, 255, 255, 0.7)", speedMultiplier: 1.0, particleCount: 80 }
  },
  {
    id: 20,
    title: "Black Hole Singularity Horizon",
    category: "space",
    bgType: "particles",
    badge: "Vortex Gravity Mesh",
    visuals: "Particles orbiting a central black hole, gaining high orbital speeds and fading away as they cross the virtual event horizon.",
    interaction: "Mouse shifts the singularity center position; scroll increases gravity pull.",
    stack: "Vortex equations applying angular acceleration maps to coordinates.",
    perf: "Reuse particles instantly on boundary crossings to avoid array allocation.",
    props: { canvasMode: "gravity", particleColor: "rgba(255, 107, 0, 0.45)", speedMultiplier: 2.5, particleCount: 250 }
  },
  {
    id: 21,
    title: "Holographic Radar HUD Console",
    category: "cyberpunk",
    bgType: "particles",
    badge: "HUD Vector Circles",
    visuals: "Rotating technical circles, targeting reticles, radar sweeps, and digital telemetry data rendered in cyan vectors.",
    interaction: "Hovering lights up corresponding sections of the circles; mouse acts as targeting focal point.",
    stack: "Dynamic arc rendering combined with variable angle rotations.",
    perf: "Draw arcs selectively based on viewport visibility to save GPU resources.",
    props: { canvasMode: "hud", lineColor: "rgba(0, 229, 255, 0.35)", particleColor: "rgba(0, 229, 255, 0.6)" }
  },
  {
    id: 22,
    title: "Falling ASCII Matrix Streams",
    category: "cyberpunk",
    bgType: "particles",
    badge: "ASCII Glyphs Fall",
    visuals: "Falling matrix streams consisting of customizable ASCII glyphs, creating a digital blue tech theme.",
    interaction: "Mouse movements dynamically scramble the characters within hover radius.",
    stack: "Canvas text drawing using random glyph arrays.",
    perf: "Rendered using static font sizes to optimize canvas text rendering buffer.",
    props: { canvasMode: "matrix", particleColor: "rgba(0, 176, 255, 0.85)", speedMultiplier: 1.0, particleCount: 120 }
  },
  {
    id: 23,
    title: "Liquid Chrome Mercury Flux",
    category: "shaders",
    bgType: "smoke",
    badge: "WebGL Liquid Chrome",
    visuals: "A metallic liquid chrome layer flowing like mercury. Highly reflective and dark, with specular highlights.",
    interaction: "Mouse movements deform the surface and create ripples.",
    stack: "WebGL displacement shader with reflection normal maps.",
    perf: "Optimized bump map calculation utilizing fewer texture lookups.",
    props: { colorLeft: [0.2, 0.2, 0.2], colorRight: [0.8, 0.8, 0.8], monochrome: true }
  },
  {
    id: 24,
    title: "Acoustic Wavefront Visualizer",
    category: "interactive",
    bgType: "particles",
    badge: "Dynamic Soliton Wave",
    visuals: "Horizontal wave lines that ripple like sound waves, creating a clean oscilloscope-like look.",
    interaction: "Moving mouse up/down increases wave frequency; left/right increases amplitude.",
    stack: "Gaussian envelope soliton wave equations on 2D coordinates.",
    perf: "Evaluate points in single loop passes for maximum layout efficiency.",
    props: { canvasMode: "soliton", lineColor: "rgba(0, 230, 118, 0.3)", speedMultiplier: 1.2 }
  },
  {
    id: 25,
    title: "Retro Vaporwave Horizon Sun",
    category: "cyberpunk",
    bgType: "particles",
    badge: "Vaporwave Synth Sun",
    visuals: "A massive hot-pink sun with horizontal cuts, sitting above an infinite perspective turquoise grid.",
    interaction: "Hovering rotates the perspective grid angle; scroll shifts horizon line.",
    stack: "Canvas gradient drawing mixed with perspective projection lines.",
    perf: "Combines simple 2D shapes for rich aesthetics without 3D engine overhead.",
    props: { canvasMode: "vaporwave", lineColor: "rgba(0, 230, 255, 0.2)" }
  },
  {
    id: 26,
    title: "Northern Lights (Aurora Borealis)",
    category: "space",
    bgType: "aurora",
    badge: "CSS Aurora Mesh",
    visuals: "Soft, glowing banners of emerald and deep cyan light dancing across the northern sky, creating a calming visual.",
    interaction: "Hovering slows the wave speed; click triggers color shift.",
    stack: "CSS custom layout layers with mixed blend modes.",
    perf: "Runs on GPU compositor using CSS opacity transitions.",
    props: { orbColor1: "rgba(0, 230, 118, 0.25)", orbColor2: "rgba(0, 176, 255, 0.2)" }
  },
  {
    id: 27,
    title: "Digital Monochrome Rainstorm",
    category: "shaders",
    bgType: "smoke",
    badge: "Monochromatic Rain Shader",
    visuals: "Slow, dark, and melancholic falling texture lines, representing digital rain in a cyberpunk city.",
    interaction: "Mouse movements temporarily clear the rain in its radius.",
    stack: "WebGL 2.0 Fragment Shader with high-frequency noise bands.",
    perf: "Pre-rendered noise texture lookup makes compilation fast and light.",
    props: { monochrome: true }
  },
  {
    id: 28,
    title: "WebGL Liquid Metaballs Fluid",
    category: "shaders",
    bgType: "smoke",
    badge: "WebGL Metaballs",
    visuals: "Interconnecting blobs of magenta and green liquid merging and splitting smoothly.",
    interaction: "Mouse acts as a main metaball node, pulling other blobs towards it.",
    stack: "Fragment shader calculations computing distances to particle arrays.",
    perf: "Limited to 12 metaball coordinates passed as uniforms for fast loops.",
    props: { colorLeft: [0.9, 0.1, 0.4], colorRight: [0.1, 0.9, 0.4], monochrome: false }
  },
  {
    id: 29,
    title: "Fractal Julia Set Zoom",
    category: "shaders",
    bgType: "smoke",
    badge: "GLSL Fractal Zoom",
    visuals: "An infinite fractal loop zooming into complex mathematical boundaries with neon pink highlights.",
    interaction: "Mouse position controls the real and imaginary constants of the fractal formula.",
    stack: "Fragment shader evaluating complex numbers dynamically.",
    perf: "Clamped to 48 iterations to maintain 60 FPS on low-power devices.",
    props: { colorLeft: [0.1, 0.1, 0.3], colorRight: [0.9, 0.0, 0.6], monochrome: false }
  },
  {
    id: 30,
    title: "Transform Feedback Particle Sparks",
    category: "interactive",
    bgType: "particles",
    badge: "GPGPU Spark Physics",
    visuals: "Pulsating orange and gold sparks erupting outward, bouncing off invisible boundaries.",
    interaction: "Mouse click shoots out a massive burst of particles; hover acts as wind.",
    stack: "WebGL 2.0 Transform Feedback compute paths.",
    perf: "Sparks logic fully computed inside GPU vertex buffer objects.",
    props: { canvasMode: "manifold", particleColor: "rgba(255, 170, 0, 0.75)", speedMultiplier: 2.0, particleCount: 240 }
  },
  {
    id: 31,
    title: "3D Wireframe Globe Sphere",
    category: "3d",
    bgType: "particles",
    badge: "3D Vector Globe",
    visuals: "A hollow grid globe spinning slowly, showing lines of latitude and longitude in cyan.",
    interaction: "Mouse drag rotates the globe in any direction; scroll zooms in/out.",
    stack: "3D coordinate projection math mapped onto 2D canvas arcs.",
    perf: "Rendered as simple points to eliminate canvas line drawing cost.",
    props: { canvasMode: "sphere", particleColor: "rgba(0, 176, 255, 0.55)", speedMultiplier: 1.0, particleCount: 150 }
  },
  {
    id: 32,
    title: "Branching Neural Dendrite Web",
    category: "interactive",
    bgType: "particles",
    badge: "Neural Web Mesh",
    visuals: "Connecting green nodes that branch out like nerves, lighting up as signals pass through.",
    interaction: "Clicking a node sends a pulse throughout the connected network.",
    stack: "Dynamic graph tree rendering with line drawing.",
    perf: "Clamp connections per node to 3 to keep draw operations low.",
    props: { canvasMode: "constellation", lineColor: "rgba(0, 230, 118, 0.25)", particleColor: "rgba(0, 230, 118, 0.5)", connectDistance: 130, speedMultiplier: 0.9, particleCount: 130 }
  },
  {
    id: 33,
    title: "Ambient Backlit Space Fog",
    category: "space",
    bgType: "smoke",
    badge: "Backlit Space Smoke",
    visuals: "Deep dark space nebula with subtle glowing purple and dark blue fog floating slowly.",
    interaction: "Hovering acts as a flashlight showing hidden nebula dust details.",
    stack: "WebGL fragment shader with chromatic aberration filter.",
    perf: "Low density noise layers require minimal GPU power.",
    props: { colorLeft: [0.1, 0.1, 0.15], colorRight: [0.2, 0.1, 0.3], monochrome: false }
  },
  {
    id: 34,
    title: "Vaporwave Horizon Sun & Grid",
    category: "cyberpunk",
    bgType: "particles",
    badge: "Retro Vaporwave",
    visuals: "Turquoise grid lines moving towards a hot pink horizon line under an ambient orange sky.",
    interaction: "Mouse shifts horizontal parallax speed; scroll changes perspective tilt.",
    stack: "HTML5 canvas linear rendering with perspective mapping.",
    perf: "Optimized line coordinate recycling prevents performance drops.",
    props: { canvasMode: "vaporwave", lineColor: "rgba(0, 230, 255, 0.2)" }
  },
  {
    id: 35,
    title: "Thermal Camera Fluid Heatmap",
    category: "shaders",
    bgType: "smoke",
    badge: "WebGL Heatmap",
    visuals: "High-contrast fluid waves flowing in red, yellow, and blue, simulating a thermal camera view.",
    interaction: "Mouse movements inject extreme heat zones (yellow/white nodes).",
    stack: "Navier-Stokes grid mapped to thermal color ramps.",
    perf: "Lookup textures applied in fragment shader keep loops performant.",
    props: { colorLeft: [1.0, 0.0, 0.0], colorRight: [0.0, 0.0, 1.0], monochrome: false }
  },
  {
    id: 36,
    title: "Tectonic Vector Subway Faults",
    category: "3d",
    bgType: "particles",
    badge: "Orthogonal Subway Lines",
    visuals: "Gold coordinate lines that bend at 90-degree angles, drifting across the screen like tectonic fault lines.",
    interaction: "Mouse triggers intersections and reroutes the active subway paths.",
    stack: "Orthogonal step grid coordinate logic in canvas.",
    perf: "Avoid continuous math; update positions only on step increments.",
    props: { canvasMode: "subway", lineColor: "rgba(255, 255, 0, 0.18)", particleColor: "rgba(255, 255, 0, 0.7)", speedMultiplier: 1.5, particleCount: 60 }
  },
  {
    id: 37,
    title: "Looming Particle Singularity Ring",
    category: "space",
    bgType: "particles",
    badge: "Concentric Singularity",
    visuals: "Glowing gold rings formed by thousands of micro-particles orbiting in a circular shell.",
    interaction: "Mouse hover warps the ring shape; click expands it into waves.",
    stack: "Trigonometric radial position calculations in canvas loop.",
    perf: "Use polar coordinate cache to avoid math compute on each frame.",
    props: { canvasMode: "hud", lineColor: "rgba(255, 60, 0, 0.25)", particleColor: "rgba(255, 220, 0, 0.5)" }
  },
];

export default function BgPlayground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeConcept, setActiveConcept] = useState<ConceptSpec | null>(null);
  const [showSelect, setShowSelect] = useState(false);


  const currentBg = useMemo(() => activeConcept || CONCEPTS[0], [activeConcept]);

  const handleSelect = (concept: ConceptSpec) => {
    setActiveConcept(concept);
    setShowSelect(false);
  };

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <SEO
        title="WebGL Background Playground"
        description="Interactive WebGL shader playground for Flow NextGen"
      />
      <div ref={containerRef} className="bg-playground">

        {/* Top bar */}
        <div className="bg-top-bar">
          <Link to="/" className="bg-back-link">
            <ArrowLeft size={16} />
            <span>Back</span>
          </Link>

          <div className="bg-top-center">
            <Compass size={18} />
            <span className="bg-top-title">{currentBg.title}</span>
            <span className="bg-top-badge">{currentBg.badge}</span>
          </div>

          <button
            className="bg-select-btn"
            onClick={() => setShowSelect((v) => !v)}
          >
            <Layers size={16} />
            <span>Select</span>
          </button>
        </div>

        {/* Concept selector drawer */}
        <AnimatePresence>
          {showSelect && (
            <motion.div
              className="bg-select-drawer"
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
            >
              <div className="bg-select-header">
                <Sparkles size={14} />
                <span>Select Background Concept</span>
              </div>
              <div className="bg-select-grid">
                {CONCEPTS.map((c) => (
                  <button
                    key={c.id}
                    className={`bg-concept-card ${activeConcept?.id === c.id ? "active" : ""}`}
                    onClick={() => handleSelect(c)}
                  >
                    <span className="bg-concept-id">#{c.id}</span>
                    <span className="bg-concept-title">{c.title}</span>
                    <span className="bg-concept-badge">{c.badge}</span>
                    <span className="bg-concept-cat">{c.category}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Background canvas area */}
        <div className="bg-canvas-area">
          {currentBg.bgType === "smoke" && (
            <SmokeBackground
              {...(currentBg.props as React.ComponentProps<typeof SmokeBackground>)}
            />
          )}
          {currentBg.bgType === "particles" && (
            <NeuralBackground
              {...(currentBg.props as React.ComponentProps<typeof NeuralBackground>)}
            />
          )}
          {currentBg.bgType === "aurora" && (
            <SmokeBackground
              smokeColorLeft="#004080"
              smokeColorRight="#003366"
              opacity={0.4}
            />
          )}
        </div>

        {/* Concept detail overlay */}
        <div className="bg-detail-overlay">
          <div className="bg-detail-grid">
            <div className="bg-detail-card">
              <h4>Visuals</h4>
              <p>{currentBg.visuals}</p>
            </div>
            <div className="bg-detail-card">
              <h4>Interaction</h4>
              <p>{currentBg.interaction}</p>
            </div>
            <div className="bg-detail-card">
              <h4>Stack</h4>
              <p>{currentBg.stack}</p>
            </div>
            <div className="bg-detail-card">
              <h4>Performance</h4>
              <p>{currentBg.perf}</p>
            </div>
          </div>
        </div>

        {/* Footer copyright */}
        <div className="bg-footer">
          <Wand2 size={14} />
          <span>Flow NextGen — Background Playground</span>
        </div>
      </div>
    </>
  );
}
