import { useEffect, useRef, useState, useMemo } from "react";
import { Compass, Sparkles, Wand2, ArrowLeft, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ExtensionMockup } from "../components/ExtensionMockup";
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
  {
    id: 38,
    title: "Bioluminescent Sea Currents",
    category: "interactive",
    bgType: "particles",
    badge: "Flow Field Currents",
    visuals: "Glowing cyan trails flowing like ocean currents, responding to invisible fluid drag.",
    interaction: "Mouse injects velocity blocks, redirecting the bioluminescent trails.",
    stack: "Vector flow fields with custom noise directions.",
    perf: "Limit particle count to prevent line drawing bottleneck.",
    props: { canvasMode: "flowfield", lineColor: "rgba(0, 229, 255, 0.22)", speedMultiplier: 0.9, particleCount: 160 }
  },
  {
    id: 39,
    title: "Cosmic Dust Gravity Orbit",
    category: "space",
    bgType: "particles",
    badge: "Orbiting Dust Shells",
    visuals: "A celestial dust cloud orbiting slowly around a gravity node, with orbital friction.",
    interaction: "Cursor acts as the center gravity node, attracting the dust particles.",
    stack: "Newtonian orbital gravity equations in 2D.",
    perf: "Simple math components keep frame rates locked at 120 FPS.",
    props: { canvasMode: "gravity", particleColor: "rgba(255, 255, 255, 0.3)", speedMultiplier: 0.5, particleCount: 220 }
  },
  {
    id: 40,
    title: "3D Digital Magenta Code Rain",
    category: "cyberpunk",
    bgType: "particles",
    badge: "3D Matrix Rain",
    visuals: "Magenta code streams falling down in 3D perspective space, scaling in size and brightness as they approach.",
    interaction: "Mouse movements temporarily warp the stream paths.",
    stack: "3D projected matrix stream render columns.",
    perf: "Direct character buffers keep render thread load minimal.",
    props: { canvasMode: "matrix", particleColor: "rgba(230, 0, 255, 0.85)", speedMultiplier: 1.5, particleCount: 100 }
  },
  {
    id: 41,
    title: "Halftone Interactive Dot Mesh",
    category: "interactive",
    bgType: "particles",
    badge: "Interactive Halftone",
    visuals: "A grid of white dots that scale up or down dynamically depending on cursor distance.",
    interaction: "Moving mouse scales up the nearby dots, creating a tactile magnifier effect.",
    stack: "Distance calculations applied to static coordinates.",
    perf: "Pre-calculated layout grid paths prevent memory allocations.",
    props: { canvasMode: "halftone", particleColor: "rgba(255, 255, 255, 0.25)", particleCount: 120 }
  },
  {
    id: 42,
    title: "Quantum Tunneling Sparks Field",
    category: "interactive",
    bgType: "particles",
    badge: "Manifold Tunneling",
    visuals: "Green and gold spark particles moving rapidly, occasionally flashing as they cross virtual barriers.",
    interaction: "Mouse movements act as fields pushing sparks through energy bands.",
    stack: "Transform Feedback physics simulation with threshold triggers.",
    perf: "Rendered as single points to maximize GPU throughput.",
    props: { canvasMode: "manifold", particleColor: "rgba(0, 255, 128, 0.8)", speedMultiplier: 2.5, particleCount: 180 }
  },
  {
    id: 43,
    title: "Lens Vignette Red Nebula Smoke",
    category: "shaders",
    bgType: "smoke",
    badge: "Red Nebula Shader",
    visuals: "Slowly swirling red nebula gas framed by a heavy dark vignette border.",
    interaction: "Mouse position shifts the light core within the vignette frame.",
    stack: "WebGL fragment shader with radial vignette layer.",
    perf: "WebGL hardware scaling preserves details at low resolutions.",
    props: { colorLeft: [0.05, 0.05, 0.05], colorRight: [0.4, 0.15, 0.1], monochrome: false }
  },
  {
    id: 44,
    title: "Transit Subway Network Map",
    category: "3d",
    bgType: "particles",
    badge: "Transit Route Vector",
    visuals: "Blue lines forming transit routes that light up sequentially, mimicking a transit grid map.",
    interaction: "Hovering lights up lines and shows connection points.",
    stack: "Orthogonal transit path stepping loops.",
    perf: "Keep line buffers in memory; redraw only coordinate paths.",
    props: { canvasMode: "subway", lineColor: "rgba(0, 176, 255, 0.2)", particleColor: "rgba(0, 176, 255, 0.8)", speedMultiplier: 1.2, particleCount: 85 }
  },
  {
    id: 45,
    title: "Gravity Well Orbital Planets",
    category: "interactive",
    bgType: "particles",
    badge: "Orbital Gravity Well",
    visuals: "Orange particles orbiting the cursor, mimicking celestial objects in orbit.",
    interaction: "Moving mouse moves the orbital center; scroll changes mass variables.",
    stack: "Standard celestial physics orbital loops.",
    perf: "Optimized math functions ensure no performance drops.",
    props: { canvasMode: "gravity", particleColor: "rgba(255, 107, 0, 0.55)", speedMultiplier: 1.2, particleCount: 150 }
  },
  {
    id: 46,
    title: "Soliton Wave Pink Wavefronts",
    category: "3d",
    bgType: "particles",
    badge: "Pink Wave Oscilloscope",
    visuals: "Pulsating pink waves moving horizontally across the screen like acoustic wavefronts.",
    interaction: "Cursor coordinates shift the amplitude and frequency properties.",
    stack: "Cosine wavefront calculations with Gaussian envelope mappings.",
    perf: "Runs on a lightweight coordinates grid to stay under performance budgets.",
    props: { canvasMode: "soliton", lineColor: "rgba(255, 0, 128, 0.35)", speedMultiplier: 0.8 }
  },
  {
    id: 47,
    title: "Bento Glass Carousel Orbs",
    category: "3d",
    bgType: "aurora",
    badge: "Glass Carousel",
    visuals: "Slowly rotating purple and blue CSS gradients showing refraction behind cards.",
    interaction: "Mouse movements shift the 3D rotation angles of the cards.",
    stack: "CSS Aurora gradients under transparent card components.",
    perf: "Uses hardware-accelerated CSS layers for smooth transitions.",
    props: { orbColor1: "rgba(0, 176, 255, 0.15)", orbColor2: "rgba(156, 39, 176, 0.15)" }
  },
  {
    id: 48,
    title: "Glitch Digital Buffer Artifacts",
    category: "cyberpunk",
    bgType: "particles",
    badge: "Glitch Scanline",
    visuals: "Particles moving erratically with random horizontal offsets, simulating digital glitch buffer streams.",
    interaction: "Hovering increases glitch frequency; click resets.",
    stack: "Erratic offsets calculation in canvas coordinate loops.",
    perf: "Rendered dynamically with zero DOM layout recalculation.",
    props: { canvasMode: "glitch", particleColor: "rgba(0, 255, 128, 0.7)", speedMultiplier: 1.2, particleCount: 140 }
  },
  {
    id: 49,
    title: "Boiling Solar Gold Plasma",
    category: "shaders",
    bgType: "smoke",
    badge: "Gold Plasma Shader",
    visuals: "A boiling orange and gold plasma wave simulation resembling a star's surface.",
    interaction: "Mouse position acts as solar flares stretching the plasma field.",
    stack: "Multi-octave noise GLSL fragment shader.",
    perf: "Optimized noise lookups require minimal GPU cycles.",
    props: { colorLeft: [1.0, 0.2, 0.0], colorRight: [1.0, 0.6, 0.0], monochrome: false }
  },
  {
    id: 50,
    title: "Coordinates HUD Grid Overlay",
    category: "cyberpunk",
    bgType: "particles",
    badge: "Digital Grid Matrix",
    visuals: "A thin coordinate grid overlaying the page, drifting slowly to match a drafting table look.",
    interaction: "Mouse hover reveals precise coordinate indicators in hover radius.",
    stack: "Converging grid rendering math with coordinates display.",
    perf: "Uses static cache structures for vector lines rendering.",
    props: { canvasMode: "grid", lineColor: "rgba(255, 255, 255, 0.08)", speedMultiplier: 0.5 }
  },

  /* ── NEW PREMIUM CONCEPTS (₹1L SITE TIER) ── */
  {
    id: 51,
    title: "Linear-Style Gradient Beam Sweep",
    category: "shaders",
    bgType: "smoke",
    badge: "₹1L Tier — Minimal Beam",
    visuals: "Dead-black canvas with a single ultra-thin diagonal gradient beam slowly sweeping across — like a lighthouse rotating in void. The beam catches the orange accent at its tip and fades to absolute zero. Borrowed from Linear.app's iconic hero treatment but tuned to our palette.",
    interaction: "Cursor proximity bends the beam angle toward it with a 400ms spring lag. The trailing edge brightens momentarily on mouse-stop.",
    stack: "Single WebGL fullscreen quad. Beam computed as a signed distance function (SDF) to a line segment in UV space. No textures needed.",
    perf: "Zero texture lookups — pure math in the fragment shader. Renders at 60fps even on integrated graphics.",
    props: { colorLeft: [0.055, 0.027, 0.0], colorRight: [1.0, 0.42, 0.0], monochrome: false }
  },
  {
    id: 52,
    title: "Vercel-Style Noise Gradient Orbs",
    category: "shaders",
    bgType: "smoke",
    badge: "₹1L Tier — Noise Orbs",
    visuals: "Two massive, extremely soft radial blobs — one deep orange, one near-black emerald — slowly morphing their shapes using low-frequency simplex noise. The blobs overlap in the center creating an iridescent mix zone. Background is #050505. Looks exactly like the Vercel homepage orb treatment but in our brand colors.",
    interaction: "Mouse pushes the nearest orb away with a rubber-band spring. On release, the orb slowly drifts back to its resting position.",
    stack: "WebGL fragment shader with 2 animated SDF circles warped by FBM noise. Mix-blend-mode: screen layer for the overlap region.",
    perf: "Two blobs with 3-octave FBM is well within fragment shader budget. Runs at full resolution on any modern GPU.",
    props: { colorLeft: [1.0, 0.38, 0.0], colorRight: [0.0, 0.22, 0.12], monochrome: false }
  },
  {
    id: 53,
    title: "Raycast-Style Floating Mesh Grid",
    category: "interactive",
    bgType: "particles",
    badge: "₹1L Tier — Floating Grid",
    visuals: "A perfectly spaced constellation of ~200 tiny dots on a black canvas, connected by razor-thin lines when within proximity — forming an organic mesh that looks like a 3D surface viewed from above. Dots drift imperceptibly slow (0.15× speed). The overall effect is a breathing, living architecture diagram.",
    interaction: "Mouse acts as a repeller: dots within 120px smoothly push away with inverse-square falloff, then spring back. Creates a beautiful parting-water effect.",
    stack: "Canvas 2D API. Dot positions stored in typed Float32Array. Connection lines drawn only for pairs within 90px to cap draw calls.",
    perf: "Spatial hashing grid for O(n) proximity checks instead of O(n²). Locked at 60fps with requestAnimationFrame + visibility API pause.",
    props: { canvasMode: "constellation", lineColor: "rgba(255, 107, 0, 0.12)", particleColor: "rgba(255, 255, 255, 0.45)", connectDistance: 90, speedMultiplier: 0.15, particleCount: 190 }
  },
  {
    id: 54,
    title: "Resend-Style Ink Diffusion Field",
    category: "shaders",
    bgType: "smoke",
    badge: "₹1L Tier — Ink Diffusion",
    visuals: "Obsidian black canvas with slow ink-drop diffusion patterns in deep orange and near-white. Each 'drop' expands using reaction-diffusion math, creating organic blob shapes that never look the same twice. The motion is glacially slow — barely perceptible, like a lava lamp but darker and more precise.",
    interaction: "Click anywhere to inject a new ink drop at cursor position. It blooms outward for 3 seconds then slowly merges into the ambient field.",
    stack: "Ping-pong WebGL2 framebuffers running a Gray-Scott reaction-diffusion shader at 512×512 resolution, upscaled with bilinear filtering.",
    perf: "Simulation runs at 512×512. Display canvas is full viewport. Upscale pass is a single blit — no multi-pass overhead.",
    props: { colorLeft: [0.08, 0.04, 0.0], colorRight: [1.0, 0.55, 0.15], monochrome: false }
  },
  {
    id: 55,
    title: "Arc-Style Soft Aurora Curtain",
    category: "space",
    bgType: "aurora",
    badge: "₹1L Tier — Aurora Curtain",
    visuals: "Three horizontal bands of extremely soft, slow-moving aurora light — deep orange at top, dark emerald in the middle, obsidian at the bottom. The bands have subtle vertical waviness like fabric curtains in a breeze. The entire thing is so low-contrast it feels like the darkness itself is alive. Inspired by Arc Browser's ambient background and Linear's dark mode hero.",
    interaction: "Scroll speed ripples the curtain bands — faster scrolling creates more pronounced vertical waves that slowly dampen back to still.",
    stack: "CSS custom properties animated by a tiny JS scroll listener. Each band is a div with a radial-gradient and a CSS sinusoidal animation offset by phase.",
    perf: "Pure CSS compositor path. Zero layout recalculations. GPU handles all transform animations.",
    props: { orbColor1: "rgba(255, 80, 0, 0.08)", orbColor2: "rgba(0, 180, 80, 0.06)" }
  },
  {
    id: 56,
    title: "Loom-Style Chromatic Depth Haze",
    category: "3d",
    bgType: "smoke",
    badge: "₹1L Tier — Chromatic Haze",
    visuals: "A background that looks like light leaking through a high-end optical lens — soft chromatic aberration halos of orange, white, and deep teal bleed at the edges while the center stays razor sharp and near-black. The halos breathe in and out with a 6-second sine cycle. Extremely expensive-looking but built from a single fragment shader pass.",
    interaction: "Mouse position shifts the chromatic aberration axis — moving left/right splits the red and blue channels apart. Moving to center collapses them back to perfect focus.",
    stack: "WebGL fragment shader with per-channel UV offset (red, green, blue sampled at slightly different UV coordinates). Vignette overlay sharpens the center.",
    perf: "3 texture samples per fragment (one per channel). Well within fillrate budget. Anti-aliased via temporal accumulation buffer.",
    props: { colorLeft: [0.04, 0.02, 0.0], colorRight: [0.0, 0.12, 0.18], monochrome: false }
  }
];

/* -------------------------------------------------------
   NOISE TEXTURE GENERATOR FOR OPTION 1
   Creates a tileable 512x512 Value Noise texture
------------------------------------------------------- */
function createNoiseTexture(gl: WebGL2RenderingContext): WebGLTexture | null {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const imgData = ctx.createImageData(512, 512);
  const size = 512;
  
  const gridCount = 16;
  const maxGridSize = gridCount * 8 + 1;
  const grid: number[][] = [];
  for (let i = 0; i <= maxGridSize; i++) {
    grid[i] = [];
    for (let j = 0; j <= maxGridSize; j++) {
      grid[i][j] = Math.random();
    }
  }

  const val = (x: number, y: number, wrapLimit: number) => {
    const x0 = Math.floor(x) % wrapLimit;
    const x1 = (x0 + 1) % wrapLimit;
    const y0 = Math.floor(y) % wrapLimit;
    const y1 = (y0 + 1) % wrapLimit;
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
      let scale = 1.0;
      let denom = 0.0;
      for (let o = 0; o < 4; o++) {
        const wrapLimit = gridCount * scale;
        n += val(x * (wrapLimit / size), y * (wrapLimit / size), wrapLimit) * amp;
        denom += amp;
        amp *= 0.5;
        scale *= 2.0;
      }
      n = n / denom;

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

float fbm(vec2 p) {
  float t = texture(u_noiseTexture, p).r * 0.65;
  t += texture(u_noiseTexture, p * 2.02).r * 0.35;
  return t;
}

void main(){
  float screenX = FC.x / R.x;
  vec3 targetColor = mix(u_colorLeft, u_colorRight, screenX);

  vec2 uv = (FC - 0.5 * R) / R.y;
  uv.x -= 0.15;
  uv *= vec2(1.8, 0.9);

  // Single texture lookup for swirl displacement (extremely fast)
  float n = texture(u_noiseTexture, uv * 0.25 - vec2(T * 0.006, 0.0)).r;

  vec2 baseUv = uv + vec2(0.0, T * 0.008) + vec2(n * 0.22);
  
  // 2-octave FBM for primary smoke shape (2 lookups)
  float f1 = fbm(baseUv * 0.7);
  
  // Cheap 1-octave texture lookup for chromatic aberration (1 lookup)
  float f2 = texture(u_noiseTexture, baseUv * 1.4 + vec2(0.004)).r;

  f1 = smoothstep(0.22, 0.82, f1);
  f2 = smoothstep(0.22, 0.82, f2);

  vec3 col = vec3(1.0);
  col.r -= f1 * 0.92;
  col.g -= mix(f1, f2, 0.5) * 0.92;
  col.b -= f2 * 0.92;

  if (u_monochrome > 0.5) {
    float gray = dot(col, vec3(0.299, 0.587, 0.114));
    col = vec3(gray * 0.6 + 0.08);
  } else {
    float blend = smoothstep(0.12, 0.88, dot(col, vec3(0.21, 0.71, 0.07)));
    col = mix(col * 0.2, targetColor * 1.7, 1.0 - blend);
  }

  col = mix(vec3(0.04), col, min(time * 0.1, 1.0));
  col = clamp(col, 0.04, 1.0);

  O = vec4(col, 1.0);
}`;

const silkVertexShaderSource = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const silkFragmentShaderSource = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec3 u_colors[8];
uniform vec4 u_scene;      // resolution.xy, time, colour count
uniform vec4 u_shape;      // scale, intensity, paramA, warp
uniform vec4 u_surface;    // detail, contrast, brightness, saturation
uniform vec4 u_finish;     // hue, vignette, blur, grain
uniform vec4 u_transform;  // seed, rotation, drift, OKLab toggle
uniform vec4 u_space;      // offset.xy, pointer.xy
uniform vec4 u_cursor;

#define u_resolution u_scene.xy
#define u_time u_scene.z
#define u_colorCount u_scene.w
#define u_scale u_shape.x
#define u_intensity u_shape.y
#define u_paramA u_shape.z
#define u_warp u_shape.w
#define u_detail u_surface.x
#define u_contrast u_surface.y
#define u_brightness u_surface.z
#define u_saturation u_surface.w
#define u_hue u_finish.x
#define u_vignette u_finish.y
#define u_blur u_finish.z
#define u_grain u_finish.w
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define u_seed u_transform.x
#else
// Keep hash inputs inside mediump's guaranteed ±2^14 range.
#define u_seed mod(u_transform.x, 31.0)
#endif
#define u_rotate u_transform.y
#define u_drift u_transform.z
#define u_oklab u_transform.w
#define u_offset u_space.xy
#define u_mouse u_space.zw
#define u_cursorPresence u_cursor.x
#define u_cursorEffect u_cursor.y
#define u_cursorStrength u_cursor.z
#define u_cursorRadius u_cursor.w

float hash21(vec2 p) {
#ifndef GL_FRAGMENT_PRECISION_HIGH
  p = mod(p, 31.0);
#endif
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float grainHash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec2 hash22(vec2 p) {
#ifndef GL_FRAGMENT_PRECISION_HIGH
  p = mod(p, 31.0);
#endif
  float n = sin(dot(p, vec2(41.0, 289.0)));
  return fract(vec2(15731.743, 7892.321) * n);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
    u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(17.0, 9.2);
    a *= 0.5;
  }
  return v;
}

vec3 srgbToLinear(vec3 c) {
  return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)),
    step(0.04045, c));
}
vec3 linearToSrgb(vec3 c) {
  return mix(c * 12.92, 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055,
    step(0.0031308, c));
}
vec3 linToOklab(vec3 c) {
  float l = 0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b;
  float m = 0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b;
  float s = 0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b;
  l = pow(max(l, 0.0), 1.0 / 3.0);
  m = pow(max(m, 0.0), 1.0 / 3.0);
  s = pow(max(s, 0.0), 1.0 / 3.0);
  return vec3(
    0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s);
}
vec3 oklabToLin(vec3 c) {
  float l = c.x + 0.3963377774 * c.y + 0.2158037573 * c.z;
  float m = c.x - 0.1055613458 * c.y - 0.0638541728 * c.z;
  float s = c.x - 0.0894841775 * c.y - 1.2914855480 * c.z;
  l = l * l * l; m = m * m * m; s = s * s * s;
  return vec3(
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s);
}
vec3 mixColour(vec3 a, vec3 b, float t) {
  if (u_oklab > 0.5) {
    vec3 la = linToOklab(srgbToLinear(a));
    vec3 lb = linToOklab(srgbToLinear(b));
    return clamp(linearToSrgb(oklabToLin(mix(la, lb, t))), 0.0, 1.0);
  }
  return mix(a, b, t);
}

vec3 palette(float x) {
  float n = max(u_colorCount - 1.0, 1.0);
  float f = clamp(x, 0.0, 1.0) * n;
  vec3 col = u_colors[0];
  for (int i = 0; i < 7; i++) {
    if (float(i) < n)
      col = mixColour(col, u_colors[i + 1],
        smoothstep(0.0, 1.0, clamp(f - float(i), 0.0, 1.0)));
  }
  return col;
}

vec3 hueRotate(vec3 col, float a) {
  const mat3 toYIQ = mat3(0.299, 0.596, 0.211,
                          0.587, -0.274, -0.523,
                          0.114, -0.322, 0.312);
  const mat3 toRGB = mat3(1.0, 1.0, 1.0,
                          0.956, -0.272, -1.106,
                          0.621, -0.647, 1.703);
  vec3 yiq = toYIQ * col;
  float ca = cos(a), sa = sin(a);
  yiq = vec3(yiq.x, yiq.y * ca - yiq.z * sa, yiq.y * sa + yiq.z * ca);
  return toRGB * yiq;
}

vec3 shade(vec2 uv, vec2 p, float t) {
  vec2 q = p * 1.6;
  float amp = 0.25 + u_intensity * 0.85;
  for (float i = 1.0; i < 5.0; i += 1.0) {
    q.x += amp / i * cos(i * 2.4 * q.y + t * 0.8 + u_seed);
    q.y += amp / i * cos(i * 1.7 * q.x + t * 0.6);
  }
  return palette(0.5 + 0.5 * sin(q.x + q.y));
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 screenUv = uv;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy)
    / min(u_resolution.x, u_resolution.y);
  float cursorMask = 0.0;

  if (u_cursorPresence > 0.001) {
    vec2 cursor = (0.5 * u_mouse * u_resolution.xy)
      / min(u_resolution.x, u_resolution.y);
    vec2 cursorDelta = p - cursor;
    if (u_cursorEffect < 0.5) {
      p += cursor * u_cursorPresence * u_cursorStrength * 0.55;
    } else {
      float cursorDistance = length(cursorDelta);
      vec2 cursorDirection = cursorDelta / max(cursorDistance, 0.0001);
      cursorMask = u_cursorPresence
        * (1.0 - smoothstep(0.0, u_cursorRadius, cursorDistance));
      if (u_cursorEffect < 1.5) {
        p -= cursorDirection * cursorMask * u_cursorStrength * 0.24;
      } else if (u_cursorEffect < 2.5) {
        float cursorAngle = cursorMask * u_cursorStrength * 2.2;
        float cc = cos(cursorAngle), cs = sin(cursorAngle);
        p = cursor + mat2(cc, -cs, cs, cc) * cursorDelta;
      } else if (u_cursorEffect < 3.5) {
        float ripple = sin(
          cursorDistance / max(u_cursorRadius, 0.001) * 18.0 - u_time * 5.0);
        p -= cursorDirection * ripple * cursorMask * u_cursorStrength * 0.07;
      }
    }
  }

  uv = p * min(u_resolution.x, u_resolution.y) / u_resolution.xy + 0.5;
  p *= u_scale;
  if (abs(u_rotate) > 0.0001) {
    float cr = cos(u_rotate), sr = sin(u_rotate);
    p = mat2(cr, -sr, sr, cr) * p;
  }
  p += u_offset;
  if (u_drift > 0.0001)
    p += u_drift * vec2(sin(u_time * 0.31), cos(u_time * 0.23));
  if (u_warp > 0.0) {
    p += u_warp * (vec2(
      fbm(p * u_detail + u_seed),
      fbm(p * u_detail + vec2(5.2, 1.3))) - 0.5);
  }
  vec3 col;
  if (u_blur > 0.0) {
    float e = u_blur;
    float pe = e * u_scale;
    vec2 uvE = vec2(e) * min(u_resolution.x, u_resolution.y) / u_resolution.xy;
    col  = shade(uv, p, u_time) * 0.36;
    col += shade(uv + vec2(uvE.x, 0.0), p + vec2(pe, 0.0), u_time) * 0.16;
    col += shade(uv - vec2(uvE.x, 0.0), p - vec2(pe, 0.0), u_time) * 0.16;
    col += shade(uv + vec2(0.0, uvE.y), p + vec2(0.0, pe), u_time) * 0.16;
    col += shade(uv - vec2(0.0, uvE.y), p - vec2(0.0, pe), u_time) * 0.16;
  } else {
    col = shade(uv, p, u_time);
  }
  if (abs(u_contrast - 1.0) > 0.0001)
    col = (col - 0.5) * u_contrast + 0.5;
  if (abs(u_saturation - 1.0) > 0.0001) {
    float luma = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(luma), col, u_saturation);
  }
  if (abs(u_hue) > 0.0001)
    col = hueRotate(col, u_hue);
  if (abs(u_brightness) > 0.0001)
    col += u_brightness;
  if (u_vignette > 0.0001) {
    float vd = length(screenUv - 0.5) * 1.41421356;
    col *= 1.0 - u_vignette * smoothstep(0.35, 1.0, vd);
  }
  if (u_cursorPresence > 0.001 && u_cursorEffect > 3.5)
    col += (vec3(0.18) + col * 0.12) * cursorMask * u_cursorStrength;
  if (u_grain > 0.0001)
    col += (grainHash(
      gl_FragCoord.xy + vec2(u_seed * 17.0, u_seed * 31.0)) - 0.5) * u_grain;
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

const driftFragmentShaderSource = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec3 u_colors[8];
uniform vec4 u_scene;      // resolution.xy, time, colour count
uniform vec4 u_shape;      // scale, intensity, paramA, warp
uniform vec4 u_surface;    // detail, contrast, brightness, saturation
uniform vec4 u_finish;     // hue, vignette, blur, grain
uniform vec4 u_transform;  // seed, rotation, drift, OKLab toggle
uniform vec4 u_space;      // offset.xy, pointer.xy
uniform vec4 u_cursor;

#define u_resolution u_scene.xy
#define u_time u_scene.z
#define u_colorCount u_scene.w
#define u_scale u_shape.x
#define u_intensity u_shape.y
#define u_paramA u_shape.z
#define u_warp u_shape.w
#define u_detail u_surface.x
#define u_contrast u_surface.y
#define u_brightness u_surface.z
#define u_saturation u_surface.w
#define u_hue u_finish.x
#define u_vignette u_finish.y
#define u_blur u_finish.z
#define u_grain u_finish.w
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define u_seed u_transform.x
#else
#define u_seed mod(u_transform.x, 31.0)
#endif
#define u_rotate u_transform.y
#define u_drift u_transform.z
#define u_oklab u_transform.w
#define u_offset u_space.xy
#define u_mouse u_space.zw
#define u_cursorPresence u_cursor.x
#define u_cursorEffect u_cursor.y
#define u_cursorStrength u_cursor.z
#define u_cursorRadius u_cursor.w

float hash21(vec2 p) {
#ifndef GL_FRAGMENT_PRECISION_HIGH
  p = mod(p, 31.0);
#endif
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float grainHash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec2 hash22(vec2 p) {
#ifndef GL_FRAGMENT_PRECISION_HIGH
  p = mod(p, 31.0);
#endif
  float n = sin(dot(p, vec2(41.0, 289.0)));
  return fract(vec2(15731.743, 7892.321) * n);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
    u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(17.0, 9.2);
    a *= 0.5;
  }
  return v;
}

vec3 srgbToLinear(vec3 c) {
  return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)),
    step(0.04045, c));
}
vec3 linearToSrgb(vec3 c) {
  return mix(c * 12.92, 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055,
    step(0.0031308, c));
}
vec3 linToOklab(vec3 c) {
  float l = 0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b;
  float m = 0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b;
  float s = 0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b;
  l = pow(max(l, 0.0), 1.0 / 3.0);
  m = pow(max(m, 0.0), 1.0 / 3.0);
  s = pow(max(s, 0.0), 1.0 / 3.0);
  return vec3(
    0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s);
}
vec3 oklabToLin(vec3 c) {
  float l = c.x + 0.3963377774 * c.y + 0.2158037573 * c.z;
  float m = c.x - 0.1055613458 * c.y - 0.0638541728 * c.z;
  float s = c.x - 0.0894841775 * c.y - 1.2914855480 * c.z;
  l = l * l * l; m = m * m * m; s = s * s * s;
  return vec3(
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s);
}
vec3 mixColour(vec3 a, vec3 b, float t) {
  if (u_oklab > 0.5) {
    vec3 la = linToOklab(srgbToLinear(a));
    vec3 lb = linToOklab(srgbToLinear(b));
    return clamp(linearToSrgb(oklabToLin(mix(la, lb, t))), 0.0, 1.0);
  }
  return mix(a, b, t);
}

vec3 palette(float x) {
  float n = max(u_colorCount - 1.0, 1.0);
  float f = clamp(x, 0.0, 1.0) * n;
  vec3 col = u_colors[0];
  for (int i = 0; i < 7; i++) {
    if (float(i) < n)
      col = mixColour(col, u_colors[i + 1],
        smoothstep(0.0, 1.0, clamp(f - float(i), 0.0, 1.0)));
  }
  return col;
}

vec3 hueRotate(vec3 col, float a) {
  const mat3 toYIQ = mat3(0.299, 0.596, 0.211,
                          0.587, -0.274, -0.523,
                          0.114, -0.322, 0.312);
  const mat3 toRGB = mat3(1.0, 1.0, 1.0,
                          0.956, -0.272, -1.106,
                          0.621, -0.647, 1.703);
  vec3 yiq = toYIQ * col;
  float ca = cos(a), sa = sin(a);
  yiq = vec3(yiq.x, yiq.y * ca - yiq.z * sa, yiq.y * sa + yiq.z * ca);
  return toRGB * yiq;
}

vec3 shade(vec2 uv, vec2 p, float t) {
  vec3 acc = u_colors[0] * 0.15;
  float total = 0.15;
  for (int i = 0; i < 8; i++) {
    if (float(i) >= u_colorCount) break;
    float fi = float(i);
    vec2 c = vec2(
      sin(t * (0.21 + fi * 0.071) + fi * 2.4 + u_seed),
      cos(t * (0.17 + fi * 0.093) + fi * 1.7)) * (0.45 + u_intensity * 0.35);
    float w = exp(-dot(p - c, p - c) * 6.0);
    acc += u_colors[i] * w;
    total += w;
  }
  return acc / total;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 screenUv = uv;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy)
    / min(u_resolution.x, u_resolution.y);
  float cursorMask = 0.0;

  if (u_cursorPresence > 0.001) {
    vec2 cursor = (0.5 * u_mouse * u_resolution.xy)
      / min(u_resolution.x, u_resolution.y);
    vec2 cursorDelta = p - cursor;
    if (u_cursorEffect < 0.5) {
      p += cursor * u_cursorPresence * u_cursorStrength * 0.55;
    } else {
      float cursorDistance = length(cursorDelta);
      vec2 cursorDirection = cursorDelta / max(cursorDistance, 0.0001);
      cursorMask = u_cursorPresence
        * (1.0 - smoothstep(0.0, u_cursorRadius, cursorDistance));
      if (u_cursorEffect < 1.5) {
        p -= cursorDirection * cursorMask * u_cursorStrength * 0.24;
      } else if (u_cursorEffect < 2.5) {
        float cursorAngle = cursorMask * u_cursorStrength * 2.2;
        float cc = cos(cursorAngle), cs = sin(cursorAngle);
        p = cursor + mat2(cc, -cs, cs, cc) * cursorDelta;
      } else if (u_cursorEffect < 3.5) {
        float ripple = sin(
          cursorDistance / max(u_cursorRadius, 0.001) * 18.0 - u_time * 5.0);
        p -= cursorDirection * ripple * cursorMask * u_cursorStrength * 0.07;
      }
    }
  }

  uv = p * min(u_resolution.x, u_resolution.y) / u_resolution.xy + 0.5;
  p *= u_scale;
  if (abs(u_rotate) > 0.0001) {
    float cr = cos(u_rotate), sr = sin(u_rotate);
    p = mat2(cr, -sr, sr, cr) * p;
  }
  p += u_offset;
  if (u_drift > 0.0001)
    p += u_drift * vec2(sin(u_time * 0.31), cos(u_time * 0.23));
  if (u_warp > 0.0) {
    p += u_warp * (vec2(
      fbm(p * u_detail + u_seed),
      fbm(p * u_detail + vec2(5.2, 1.3))) - 0.5);
  }
  vec3 col;
  if (u_blur > 0.0) {
    float e = u_blur;
    float pe = e * u_scale;
    vec2 uvE = vec2(e) * min(u_resolution.x, u_resolution.y) / u_resolution.xy;
    col  = shade(uv, p, u_time) * 0.36;
    col += shade(uv + vec2(uvE.x, 0.0), p + vec2(pe, 0.0), u_time) * 0.16;
    col += shade(uv - vec2(uvE.x, 0.0), p - vec2(pe, 0.0), u_time) * 0.16;
    col += shade(uv + vec2(0.0, uvE.y), p + vec2(0.0, pe), u_time) * 0.16;
    col += shade(uv - vec2(0.0, uvE.y), p - vec2(0.0, pe), u_time) * 0.16;
  } else {
    col = shade(uv, p, u_time);
  }
  if (abs(u_contrast - 1.0) > 0.0001)
    col = (col - 0.5) * u_contrast + 0.5;
  if (abs(u_saturation - 1.0) > 0.0001) {
    float luma = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(luma), col, u_saturation);
  }
  if (abs(u_hue) > 0.0001)
    col = hueRotate(col, u_hue);
  if (abs(u_brightness) > 0.0001)
    col += u_brightness;
  if (u_vignette > 0.0001) {
    float vd = length(screenUv - 0.5) * 1.41421356;
    col *= 1.0 - u_vignette * smoothstep(0.35, 1.0, vd);
  }
  if (u_cursorPresence > 0.001 && u_cursorEffect > 3.5)
    col += (vec3(0.18) + col * 0.12) * cursorMask * u_cursorStrength;
  if (u_grain > 0.0001)
    col += (grainHash(
      gl_FragCoord.xy + vec2(u_seed * 17.0, u_seed * 31.0)) - 0.5) * u_grain;
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

/* -------------------------------------------------------
   OPTION 1: TEXTURE SMOKE COMPONENT
------------------------------------------------------- */
interface TextureSmokeProps {
  colorLeft?: [number, number, number];
  colorRight?: [number, number, number];
  monochrome?: boolean;
  dynamicScroll?: boolean;
  dprScale?: number;
  onRenderMeasure?: (duration: number) => void;
}

function TextureSmoke({ colorLeft, colorRight, monochrome, dynamicScroll, dprScale, onRenderMeasure }: TextureSmokeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const bufferRef = useRef<WebGLBuffer | null>(null);
  const textureRef = useRef<WebGLTexture | null>(null);

  const uniformsRef = useRef({ left: colorLeft, right: colorRight, mono: monochrome, dynamicScroll, dprScale, onRenderMeasure });
  
  useEffect(() => {
    uniformsRef.current = { left: colorLeft, right: colorRight, mono: monochrome, dynamicScroll, dprScale, onRenderMeasure };
    // Trigger size updates immediately if dprScale changes
    const canvas = canvasRef.current;
    if (canvas) {
      const gl = glRef.current;
      if (gl) {
        const dpr = dprScale || Math.min(2.0, window.devicePixelRatio || 1);
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    }
  }, [colorLeft, colorRight, monochrome, dynamicScroll, dprScale, onRenderMeasure]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false
    }) as WebGL2RenderingContext;
    if (!gl) return;
    glRef.current = gl;

    const updateSize = () => {
      const dpr = uniformsRef.current.dprScale || Math.min(2.0, window.devicePixelRatio || 1);
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
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
      console.error("Vertex Shader Error:", gl.getShaderInfoLog(vs));
    }

    gl.shaderSource(fs, fragmentShaderSource);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.error("Fragment Shader Error:", gl.getShaderInfoLog(fs));
    }

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program Link Error:", gl.getProgramInfoLog(program));
    }

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
      const start = performance.now();
      if (!programRef.current || !glRef.current) return;
      const gl = glRef.current;
      const prog = programRef.current;

      gl.clearColor(0.02, 0.02, 0.02, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, bufferRef.current);
      
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textureRef.current);
      
      const { left: propLeft, right: propRight, mono: propMono, dynamicScroll: propDynamic, onRenderMeasure: propOnMeasure } = uniformsRef.current;
      let left = propLeft || [1.0, 0.42, 0.0];
      const right = propRight || [0.0, 0.90, 0.46];
      const mono = propMono ? 1.0 : 0.0;

      if (propDynamic) {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? scrollTop / docHeight : 0;
        const clampedProgress = Math.min(1.0, Math.max(0.0, progress));

        const r = 1.0 - clampedProgress * 1.0;
        const g = 0.42 + clampedProgress * 0.13;
        const b = 0.0 + clampedProgress * 0.9;
        left = [r, g, b];
      }

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

      const duration = performance.now() - start;
      if (propOnMeasure) propOnMeasure(duration);

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
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", transform: "translate3d(0,0,0)", willChange: "transform" }}>
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
    willChange: "transform"
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
   OPTION 3: CONSTELLATION PARTICLES & MATH PROJECTIONS
------------------------------------------------------- */
interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  targetAlpha: number;
  z?: number; // for 3D modes
  color?: string; // for custom particle colors
}

interface ConstellationProps {
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
  dprScale?: number;
  onRenderMeasure?: (duration: number) => void;
}

function ConstellationParticles({
  canvasMode = "constellation",
  lineColor,
  particleColor,
  connectDistance = 100,
  speedMultiplier = 1.0,
  particleCount = 100,
  verticalOnly = false,
  drawTorus = false,
  dprScale,
  onRenderMeasure
}: ConstellationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  const propsRef = useRef({
    canvasMode,
    lineColor,
    particleColor,
    connectDistance,
    speedMultiplier,
    particleCount,
    verticalOnly,
    drawTorus,
    dprScale,
    onRenderMeasure
  });

  useEffect(() => {
    propsRef.current = {
      canvasMode,
      lineColor,
      particleColor,
      connectDistance,
      speedMultiplier,
      particleCount,
      verticalOnly,
      drawTorus,
      dprScale,
      onRenderMeasure
    };
    
    // Trigger size update when dprScale changes
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d", { alpha: false });
      if (ctx) {
        const dpr = dprScale || Math.min(2.0, window.devicePixelRatio || 1);
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        ctx.scale(dpr, dpr);
      }
    }
  }, [canvasMode, lineColor, particleColor, connectDistance, speedMultiplier, particleCount, verticalOnly, drawTorus, dprScale, onRenderMeasure]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const updateSize = () => {
      const dpr = propsRef.current.dprScale || Math.min(2.0, window.devicePixelRatio || 1);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
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
      const start = performance.now();
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, w, h);
      const mouse = mouseRef.current;
      const config = propsRef.current;
      const mode = config.canvasMode || "constellation";

      // ----------------------------------------------------
      // SWITCH MATRIX OF 3D/2D MODES
      // ----------------------------------------------------
      switch (mode) {
        case "manifold": {
          const activeCount = Math.min(config.particleCount || 100, maxCount);
          ctx.strokeStyle = config.lineColor || "rgba(156, 39, 176, 0.22)";
          ctx.lineWidth = 0.8;
          const sorted = [...particles.slice(0, activeCount)].sort((a, b) => a.x - b.x);
          ctx.beginPath();
          for (let i = 0; i < sorted.length; i++) {
            const p = sorted[i];
            p.y += Math.sin(time * 0.001 + p.x * 0.01) * 0.2;
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          }
          ctx.stroke();

          for (let i = 0; i < sorted.length; i++) {
            const p1 = sorted[i];
            let connections = 0;
            for (let j = i + 1; j < sorted.length && connections < 2; j++) {
              const p2 = sorted[j];
              const dist = Math.abs(p1.x - p2.x);
              if (dist < 120) {
                ctx.strokeStyle = config.lineColor || `rgba(156, 39, 176, ${0.25 * (1 - dist / 120)})`;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
                connections++;
              }
            }
            ctx.fillStyle = config.particleColor || "rgba(156, 39, 176, 0.7)";
            ctx.beginPath();
            ctx.arc(p1.x, p1.y, p1.radius * 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
          break;
        }

        case "flowfield": {
          const activeCount = Math.min(config.particleCount || 120, maxCount);
          for (let i = 0; i < activeCount; i++) {
            const p = particles[i];
            const angle = Math.sin(p.x * 0.005 + time * 0.0003) * Math.cos(p.y * 0.005 + time * 0.0002) * Math.PI * 2;
            p.vx += Math.cos(angle) * 0.08 * (config.speedMultiplier || 1.0);
            p.vy += Math.sin(angle) * 0.08 * (config.speedMultiplier || 1.0);
            
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            if (speed > 2.5) {
              p.vx = (p.vx / speed) * 2.5;
              p.vy = (p.vy / speed) * 2.5;
            }

            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = w;
            if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h;
            if (p.y > h) p.y = 0;

            ctx.strokeStyle = config.lineColor || "rgba(255, 0, 128, 0.35)";
            ctx.lineWidth = p.radius * 0.7;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x - p.vx * 4, p.y - p.vy * 4);
            ctx.stroke();

            ctx.fillStyle = config.particleColor || "rgba(255, 255, 255, 0.85)";
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
          }
          break;
        }

        case "vertical": {
          const activeCount = Math.min(config.particleCount || 100, maxCount);
          ctx.strokeStyle = config.lineColor || "rgba(0, 176, 255, 0.15)";
          ctx.lineWidth = 0.8;

          const columnCount = 12;
          for (let col = 1; col < columnCount; col++) {
            const colX = (col / columnCount) * w;
            ctx.beginPath();
            ctx.moveTo(colX, 0);
            ctx.lineTo(colX, h);
            ctx.stroke();
          }

          for (let i = 0; i < activeCount; i++) {
            const p = particles[i];
            if (p.z === undefined) {
              p.z = Math.floor(Math.random() * (columnCount - 1)) + 1;
            }
            p.x = (p.z / columnCount) * w;
            p.y += (p.radius * 0.45 + 0.5) * (config.speedMultiplier || 1.0);

            if (p.y > h) {
              p.y = 0;
              p.z = Math.floor(Math.random() * (columnCount - 1)) + 1;
            }

            ctx.fillStyle = config.particleColor || "rgba(0, 176, 255, 0.75)";
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * 1.5, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = config.lineColor || "rgba(0, 176, 255, 0.25)";
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * 3.5, 0, Math.PI * 2);
            ctx.fill();
          }
          break;
        }

        case "torus": {
          const cx = w / 2;
          const cy = h / 2;
          const rotX = time * 0.0006;
          const rotY = time * 0.0009;
          
          const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
          const cosY = Math.cos(rotY), sinY = Math.sin(rotY);

          const project = (x: number, y: number, z: number) => {
            const x1 = x * cosY - z * sinY;
            const z1 = x * sinY + z * cosY;
            const y2 = y * cosX - z1 * sinX;
            const z2 = y * sinX + z1 * cosX;
            
            const scale = 260 / (280 + z2);
            return { x: cx + x1 * scale, y: cy + y2 * scale };
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
          break;
        }

        case "starfield": {
          const activeCount = Math.min(config.particleCount || 100, maxCount);
          for (let i = 0; i < activeCount; i++) {
            const p1 = particles[i];
            if (p1.z === undefined) {
              p1.z = Math.random() * w;
              p1.x = (Math.random() - 0.5) * w;
              p1.y = (Math.random() - 0.5) * h;
            }
            p1.z -= 2 * (config.speedMultiplier || 1.0);
            if (p1.z <= 0) {
              p1.z = w;
              p1.x = (Math.random() - 0.5) * w;
              p1.y = (Math.random() - 0.5) * h;
            }
            const k = 200 / p1.z;
            const px = p1.x * k + w / 2;
            const py = p1.y * k + h / 2;

            const prevK = 200 / (p1.z + 6);
            const prevPx = p1.x * prevK + w / 2;
            const prevPy = p1.y * prevK + h / 2;

            ctx.strokeStyle = config.particleColor || "rgba(255, 255, 255, 0.4)";
            ctx.lineWidth = p1.radius * 0.7;
            ctx.beginPath();
            ctx.moveTo(prevPx, prevPy);
            ctx.lineTo(px, py);
            ctx.stroke();
          }
          break;
        }

        case "matrix": {
          const activeCount = Math.min(config.particleCount || 80, maxCount);
          for (let i = 0; i < activeCount; i++) {
            const p1 = particles[i];
            if (p1.z === undefined) {
              p1.z = 1;
              p1.x = (i * 24) % w;
              p1.y = Math.random() * h;
              p1.vy = (Math.random() * 2 + 1.5) * (config.speedMultiplier || 1.0);
            }
            p1.y += p1.vy;
            if (p1.y > h) {
              p1.y = 0;
            }
            ctx.fillStyle = config.particleColor || "rgba(0, 255, 70, 0.9)";
            ctx.font = `${p1.radius + 8}px monospace`;
            const char = Math.random() > 0.5 ? "1" : "0";
            ctx.fillText(char, p1.x, p1.y);

            ctx.fillStyle = config.particleColor ? "rgba(255,255,255,0.15)" : "rgba(0, 255, 70, 0.15)";
            ctx.fillText(Math.random() > 0.5 ? "1" : "0", p1.x, p1.y - 15);
            ctx.fillText(Math.random() > 0.5 ? "1" : "0", p1.x, p1.y - 30);
          }
          break;
        }

        case "dna": {
          const cx = w / 2;
          const activeCount = Math.min(config.particleCount || 80, maxCount);
          for (let i = 0; i < activeCount; i++) {
            const angle = time * 0.001 * (config.speedMultiplier || 1.0) + i * 0.18;
            const radius = 75;
            const y = (i * 12) % h;
            
            const zA = Math.sin(angle) * radius;
            const projXA = cx + Math.cos(angle) * radius * (120 / (150 + zA));
            
            const zB = -Math.sin(angle) * radius;
            const projXB = cx - Math.cos(angle) * radius * (120 / (150 + zB));

            ctx.strokeStyle = config.lineColor || "rgba(255, 107, 0, 0.16)";
            ctx.lineWidth = 0.85;
            ctx.beginPath();
            ctx.moveTo(projXA, y);
            ctx.lineTo(projXB, y);
            ctx.stroke();

            ctx.fillStyle = config.particleColor || "rgba(255, 255, 255, 0.8)";
            ctx.beginPath();
            ctx.arc(projXA, y, 2.5 * (120 / (150 + zA)), 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = config.lineColor || "rgba(0, 230, 118, 0.8)";
            ctx.beginPath();
            ctx.arc(projXB, y, 2.5 * (120 / (150 + zB)), 0, Math.PI * 2);
            ctx.fill();
          }
          break;
        }

        case "sphere": {
          const cx = w / 2;
          const cy = h / 2;
          const rotY = time * 0.00035 * (config.speedMultiplier || 1.0);
          const rotX = time * 0.0002 * (config.speedMultiplier || 1.0);
          const r_sphere = Math.min(w, h) * 0.28;

          const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
          const cosX = Math.cos(rotX), sinX = Math.sin(rotX);

          const projectSphere = (x: number, y: number, z: number) => {
            const x1 = x * cosY - z * sinY;
            const z1 = x * sinY + z * cosY;
            const y2 = y * cosX - z1 * sinX;
            const z2 = y * sinX + z1 * cosX;
            const scale = 300 / (350 + z2);
            return { x: cx + x1 * scale, y: cy + y2 * scale, visible: z2 > -120 };
          };

          const activeCount = Math.min(config.particleCount || 100, maxCount);
          for (let i = 0; i < activeCount; i++) {
            const u = i % 10;
            const v = Math.floor(i / 10) % 10;
            const theta = (u / 10) * Math.PI * 2;
            const phi = (v / 10) * Math.PI - Math.PI / 2;

            const x3d = r_sphere * Math.cos(phi) * Math.cos(theta);
            const y3d = r_sphere * Math.cos(phi) * Math.sin(theta);
            const z3d = r_sphere * Math.sin(phi);

            const pt = projectSphere(x3d, y3d, z3d);
            if (pt.visible) {
              ctx.fillStyle = config.particleColor || "rgba(0, 176, 255, 0.4)";
              ctx.beginPath();
              ctx.arc(pt.x, pt.y, 2.2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          break;
        }

        case "hud": {
          const cx = w / 2;
          const cy = h / 2;
          ctx.strokeStyle = config.lineColor || "rgba(0, 229, 255, 0.35)";
          ctx.lineWidth = 1;

          const baseR = Math.min(w, h) * 0.16;
          for (let rIdx = 1; rIdx <= 3; rIdx++) {
            const currentR = baseR * rIdx * (1 + Math.sin(time * 0.0004 * rIdx) * 0.04);
            ctx.beginPath();
            ctx.arc(cx, cy, currentR, 0, Math.PI * 2);
            ctx.stroke();

            const angleOffset = time * 0.0003 * (rIdx % 2 === 0 ? 1 : -1);
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(angleOffset) * currentR, cy + Math.sin(angleOffset) * currentR);
            ctx.stroke();
          }
          break;
        }

        case "grid": {
          const cx = w / 2;
          const cy = h / 2;
          ctx.strokeStyle = config.lineColor || "rgba(255, 0, 128, 0.22)";
          ctx.lineWidth = 1.1;

          const horizonY = cy - 35;
          const lineCount = 14;
          for (let g = 0; g <= lineCount; g++) {
            const xVal = (g / lineCount) * w;
            ctx.beginPath();
            ctx.moveTo(xVal, h);
            ctx.lineTo(cx + (xVal - cx) * 0.04, horizonY);
            ctx.stroke();
          }

          const hOffset = (time * 0.06 * (config.speedMultiplier || 1.0)) % 50;
          for (let g = 0; g < 12; g++) {
            const yVal = horizonY + Math.pow(g / 12, 2.2) * (h - horizonY) + hOffset;
            if (yVal >= horizonY && yVal <= h) {
              ctx.beginPath();
              ctx.moveTo(0, yVal);
              ctx.lineTo(w, yVal);
              ctx.stroke();
            }
          }
          break;
        }

        case "gravity": {
          const mx = mouse.x > 0 ? mouse.x : w / 2;
          const my = mouse.y > 0 ? mouse.y : h / 2;
          const activeCount = Math.min(config.particleCount || 120, maxCount);

          for (let i = 0; i < activeCount; i++) {
            const p1 = particles[i];
            const dx = mx - p1.x;
            const dy = my - p1.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const pull = 0.12 * (config.speedMultiplier || 1.0);
            p1.vx += (dx / (dist + 50)) * pull;
            p1.vy += (dy / (dist + 50)) * pull;
            p1.vx *= 0.98;
            p1.vy *= 0.98;

            p1.x += p1.vx * 3;
            p1.y += p1.vy * 3;

            ctx.fillStyle = config.particleColor || `rgba(255, 145, 0, ${p1.alpha})`;
            ctx.beginPath();
            ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
            ctx.fill();
          }
          break;
        }

        case "glitch": {
          ctx.fillStyle = `rgba(255, 0, 128, ${Math.random() * 0.045})`;
          if (Math.random() > 0.90) {
            ctx.fillRect(0, Math.random() * h, w, Math.random() * 25 + 5);
          }
          const activeCount = Math.min(config.particleCount || 100, maxCount);
          for (let i = 0; i < activeCount; i++) {
            const p1 = particles[i];
            p1.x += p1.vx * (config.speedMultiplier || 1.0);
            p1.y += p1.vy * (config.speedMultiplier || 1.0);
            if (p1.x < 0) p1.x = w;
            if (p1.x > w) p1.x = 0;
            if (p1.y < 0) p1.y = h;
            if (p1.y > h) p1.y = 0;

            const px = p1.x + (Math.random() > 0.985 ? (Math.random() - 0.5) * 32 : 0);

            ctx.fillStyle = config.particleColor || `rgba(0, 230, 118, ${p1.alpha})`;
            ctx.beginPath();
            ctx.arc(px, p1.y, p1.radius, 0, Math.PI * 2);
            ctx.fill();
          }
          break;
        }

        case "vaporwave": {
          const cx = w / 2;
          const cy = h / 2;
          const sunY = cy - 60;
          const sunR = Math.min(w, h) * 0.12;

          const sunGrad = ctx.createLinearGradient(0, sunY - sunR, 0, sunY + sunR);
          sunGrad.addColorStop(0, "#FF007F");
          sunGrad.addColorStop(1, "#FF8C00");
          ctx.fillStyle = sunGrad;
          ctx.beginPath();
          ctx.arc(cx, sunY, sunR, 0, Math.PI, true);
          ctx.fill();

          ctx.fillStyle = "#050505";
          for (let sIdx = 1; sIdx < 8; sIdx++) {
            const cutY = sunY + (sIdx / 8) * sunR;
            ctx.fillRect(cx - sunR - 10, cutY, sunR * 2 + 20, sIdx * 0.9);
          }

          ctx.strokeStyle = config.lineColor || "rgba(0, 230, 255, 0.18)";
          ctx.lineWidth = 1;
          const horizonY = cy - 20;
          const lineCount = 16;
          for (let g = 0; g <= lineCount; g++) {
            const xVal = (g / lineCount) * w;
            ctx.beginPath();
            ctx.moveTo(xVal, h);
            ctx.lineTo(cx + (xVal - cx) * 0.02, horizonY);
            ctx.stroke();
          }
          const hOffset = (time * 0.05) % 40;
          for (let g = 0; g < 12; g++) {
            const yVal = horizonY + Math.pow(g / 12, 2.2) * (h - horizonY) + hOffset;
            if (yVal >= horizonY && yVal <= h) {
              ctx.beginPath();
              ctx.moveTo(0, yVal);
              ctx.lineTo(w, yVal);
              ctx.stroke();
            }
          }
          break;
        }

        case "halftone": {
          const mx = mouse.x > 0 ? mouse.x : w / 2;
          const my = mouse.y > 0 ? mouse.y : h / 2;
          const spacing = 35;
          const cols = Math.floor(w / spacing) + 2;
          const rows = Math.floor(h / spacing) + 2;

          ctx.fillStyle = config.particleColor || "rgba(255, 107, 0, 0.4)";
          for (let c = 0; c < cols; c++) {
            for (let r = 0; r < rows; r++) {
              const px = c * spacing;
              const py = r * spacing;

              const dx = mx - px;
              const dy = my - py;
              const dist = Math.sqrt(dx * dx + dy * dy);

              const maxDist = 200;
              const sizeScale = Math.max(0.1, 1 - dist / maxDist);
              const radius = 2.4 * sizeScale;

              ctx.beginPath();
              ctx.arc(px, py, radius, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          break;
        }

        case "soliton": {
          ctx.strokeStyle = config.lineColor || "rgba(0, 176, 255, 0.25)";
          ctx.lineWidth = 1.5;
          const waveCount = 4;
          for (let wIdx = 0; wIdx < waveCount; wIdx++) {
            const waveY = h * 0.35 + wIdx * (h * 0.13);
            ctx.beginPath();
            for (let xCoord = 0; xCoord < w; xCoord += 12) {
              const pulseCenter = (time * 0.12 * (config.speedMultiplier || 1.0) + wIdx * 250) % (w + 400) - 200;
              const dx = xCoord - pulseCenter;
              const amplitude = 60 * Math.exp(-Math.pow(dx / 100, 2));
              const waveOffset = amplitude * Math.cos(dx * 0.05 - time * 0.005);
              if (xCoord === 0) {
                ctx.moveTo(xCoord, waveY + waveOffset);
              } else {
                ctx.lineTo(xCoord, waveY + waveOffset);
              }
            }
            ctx.stroke();
          }
          break;
        }

        case "subway": {
          ctx.strokeStyle = config.lineColor || "rgba(255, 145, 0, 0.15)";
          ctx.lineWidth = 1.4;
          const gridSpacing = 60;
          const hLines = Math.floor(h / gridSpacing);
          const wLines = Math.floor(w / gridSpacing);

          const activeCount = Math.min(config.particleCount || 60, maxCount);
          for (let i = 0; i < activeCount; i++) {
            const p1 = particles[i];
            if (p1.z === undefined) {
              p1.z = 1;
              p1.x = Math.floor(Math.random() * wLines) * gridSpacing;
              p1.y = Math.floor(Math.random() * hLines) * gridSpacing;
              p1.vx = Math.floor(Math.random() * 4);
              p1.vy = 0;
            }

            p1.vy += (config.speedMultiplier || 1.0) * 0.045;
            if (p1.vy >= 1) {
              p1.vy = 0;
              switch (p1.vx) {
                case 0: p1.x += gridSpacing; break;
                case 1: p1.y += gridSpacing; break;
                case 2: p1.x -= gridSpacing; break;
                case 3: p1.y -= gridSpacing; break;
              }
              if (p1.x < 0) p1.x = wLines * gridSpacing;
              if (p1.x > wLines * gridSpacing) p1.x = 0;
              if (p1.y < 0) p1.y = hLines * gridSpacing;
              if (p1.y > hLines * gridSpacing) p1.y = 0;

              if (Math.random() > 0.45) {
                p1.vx = Math.floor(Math.random() * 4);
              }
            }

            ctx.fillStyle = config.particleColor || "rgba(255, 107, 0, 0.75)";
            ctx.beginPath();
            ctx.arc(p1.x, p1.y, p1.radius * 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
          break;
        }

        // DEFAULT: Classic interactive constellation mesh
        default: {
          ctx.lineWidth = 0.6;
          const activeCount = Math.min(config.particleCount || 100, maxCount);

          for (let i = 0; i < activeCount; i++) {
            const p1 = particles[i];
            const vy = p1.vy * config.speedMultiplier;
            const vx = config.verticalOnly ? 0.0 : p1.vx * config.speedMultiplier;

            p1.x += vx;
            p1.y += vy;

            if (p1.x < 0) p1.x = w;
            if (p1.x > w) p1.x = 0;
            if (p1.y < 0) p1.y = h;
            if (p1.y > h) p1.y = 0;

            const dx = mouse.x - p1.x;
            const dy = mouse.y - p1.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 130) {
              const force = (130 - dist) / 130;
              p1.x -= (dx / dist) * force * 1.8;
              p1.y -= (dy / dist) * force * 1.8;
            }

            if (config.connectDistance > 0) {
              for (let j = i + 1; j < activeCount; j++) {
                const p2 = particles[j];
                const cdx = p1.x - p2.x;
                const cdy = p1.y - p2.y;
                const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

                if (cdist < config.connectDistance) {
                  const alpha = ((config.connectDistance - cdist) / config.connectDistance) * 0.12;
                  ctx.strokeStyle = config.lineColor || `rgba(255, 107, 0, ${alpha})`;
                  ctx.beginPath();
                  ctx.moveTo(p1.x, p1.y);
                  ctx.lineTo(p2.x, p2.y);
                  ctx.stroke();
                }
              }
            }

            ctx.fillStyle = config.particleColor || `rgba(255, 145, 0, ${p1.alpha})`;
            ctx.beginPath();
            ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
            ctx.fill();

            p1.alpha += (p1.targetAlpha - p1.alpha) * 0.05;
            if (Math.abs(p1.alpha - p1.targetAlpha) < 0.02) {
              p1.targetAlpha = Math.random() * 0.5 + 0.3;
            }
          }
          break;
        }
      }

      const duration = performance.now() - start;
      if (config.onRenderMeasure) config.onRenderMeasure(duration);

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
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", transform: "translate3d(0,0,0)", willChange: "transform" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}

/* -------------------------------------------------------
   OPTION 4: FLUID BUBBLE GLOW COMPONENT
------------------------------------------------------- */
interface FluidBubblesProps {
  dprScale?: number;
  onRenderMeasure?: (duration: number) => void;
  dynamicScroll?: boolean;
}

interface Bubble {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseColor: "orange" | "green" | "blue";
  pulseSpeed: number;
  pulsePhase: number;
  wobbleSpeed: number;
  wobblePhase: number;
}

function FluidBubbles({ dprScale, onRenderMeasure, dynamicScroll = true }: FluidBubblesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const propsRef = useRef({ dprScale, onRenderMeasure, dynamicScroll });

  useEffect(() => {
    propsRef.current = { dprScale, onRenderMeasure, dynamicScroll };
    
    // Resize immediately if dprScale changes
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const dpr = dprScale || Math.min(2.0, window.devicePixelRatio || 1);
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        ctx.scale(dpr, dpr);
      }
    }
  }, [dprScale, onRenderMeasure, dynamicScroll]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const updateSize = () => {
      const dpr = propsRef.current.dprScale || Math.min(2.0, window.devicePixelRatio || 1);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    updateSize();
    window.addEventListener("resize", updateSize);

    // Initialize bubble particles
    const bubbleCount = 28;
    const bubbles: Bubble[] = [];
    const colorOptions: ("orange" | "green" | "blue")[] = ["orange", "green", "blue"];

    for (let i = 0; i < bubbleCount; i++) {
      bubbles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight + window.innerHeight, // Spawn from/below screen
        vx: (Math.random() - 0.5) * 0.35,
        vy: -(Math.random() * 0.45 + 0.25), // Drifts upward
        radius: Math.random() * 30 + 15,
        baseColor: colorOptions[i % 3],
        pulseSpeed: Math.random() * 0.002 + 0.001,
        pulsePhase: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.003 + 0.001,
        wobblePhase: Math.random() * Math.PI * 2
      });
    }

    // Large background fluid blob coordinates
    const blobs = [
      { x: 0, y: 0, rx: 200, ry: 150, tx: 0.1, ty: 0.15, speed: 0.0004, color: "orange" },
      { x: 0, y: 0, rx: 240, ry: 210, tx: 0.5, ty: 0.3, speed: 0.0003, color: "green" },
      { x: 0, y: 0, rx: 280, ry: 250, tx: 0.8, ty: 0.7, speed: 0.0005, color: "blue" }
    ];

    const render = (time: number) => {
      const start = performance.now();
      const w = window.innerWidth;
      const h = window.innerHeight;
      const config = propsRef.current;

      // Calculate scroll progress for dynamic color transitions
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = docHeight > 0 ? scrollTop / docHeight : 0;
      const clampedScroll = Math.min(1.0, Math.max(0.0, scrollProgress));

      // 1. Draw solid dark background to clear frame
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, w, h);

      // 2. Draw soft, flowing background fluid globs (Orbs)
      ctx.globalCompositeOperation = "screen";

      blobs.forEach((blob) => {
        // Compute circular orbiting positions based on time
        const cx = w * blob.tx + Math.cos(time * blob.speed) * (w * 0.12);
        const cy = h * blob.ty + Math.sin(time * blob.speed * 1.3) * (h * 0.1);
        
        let colorString = "";
        if (blob.color === "orange") {
          // Dynamic scroll transition: Orange (255, 107, 0) to Ocean Blue (0, 140, 255)
          const r = Math.round(255 - clampedScroll * 255);
          const g = Math.round(107 + clampedScroll * 33);
          const b = Math.round(0 + clampedScroll * 255);
          colorString = `rgba(${r}, ${g}, ${b}, 0.18)`;
        } else if (blob.color === "green") {
          colorString = "rgba(0, 230, 118, 0.12)";
        } else {
          colorString = "rgba(0, 140, 255, 0.15)";
        }

        // Create fluid gradient glowing orb
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(blob.rx, blob.ry) * 1.5);
        grad.addColorStop(0, colorString);
        grad.addColorStop(0.5, colorString.replace("0.18", "0.06").replace("0.12", "0.04").replace("0.15", "0.05"));
        grad.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(blob.rx, blob.ry) * 1.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Draw and update bubbles
      ctx.globalCompositeOperation = "source-over";
      
      bubbles.forEach((b) => {
        // Update positions
        b.y += b.vy;
        b.x += b.vx + Math.sin(time * b.wobbleSpeed + b.wobblePhase) * 0.2;

        // Apply scroll-parallax vertical offset
        const renderY = b.y - (scrollTop * 0.15);

        // Wrap around boundaries
        if (b.y + b.radius < -100) {
          b.y = h + b.radius + 100;
          b.x = Math.random() * w;
        }
        if (b.x - b.radius > w + 100) b.x = -b.radius;
        if (b.x + b.radius < -100) b.x = w + b.radius;

        // Dynamic size pulsing
        const pulse = Math.sin(time * b.pulseSpeed + b.pulsePhase) * 2.5;
        const currentRadius = Math.max(5, b.radius + pulse);

        // Compute color based on bubble type and scroll progress
        let colorString = "";
        let borderString = "";

        if (b.baseColor === "orange") {
          // Dynamic scroll transition: Orange to Ocean Blue
          const r = Math.round(255 - clampedScroll * 255);
          const g = Math.round(107 + clampedScroll * 33);
          const bVal = Math.round(0 + clampedScroll * 255);
          colorString = `rgba(${r}, ${g}, ${bVal}, 0.08)`;
          borderString = `rgba(${r}, ${g}, ${bVal}, 0.35)`;
        } else if (b.baseColor === "green") {
          colorString = "rgba(0, 230, 118, 0.06)";
          borderString = "rgba(0, 230, 118, 0.28)";
        } else {
          colorString = "rgba(0, 140, 255, 0.07)";
          borderString = "rgba(0, 140, 255, 0.32)";
        }

        // Draw soft bubble filling gradient
        const bubbleGrad = ctx.createRadialGradient(
          b.x - currentRadius * 0.3, 
          renderY - currentRadius * 0.3, 
          currentRadius * 0.05, 
          b.x, 
          renderY, 
          currentRadius
        );
        bubbleGrad.addColorStop(0, "rgba(255, 255, 255, 0.15)");
        bubbleGrad.addColorStop(0.3, colorString);
        bubbleGrad.addColorStop(0.85, "rgba(0, 0, 0, 0)");
        bubbleGrad.addColorStop(1, borderString);

        ctx.fillStyle = bubbleGrad;
        ctx.strokeStyle = borderString;
        ctx.lineWidth = 0.85;

        // Draw bubble paths
        ctx.beginPath();
        ctx.arc(b.x, renderY, currentRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Highlighting highlight orb reflection
        ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
        ctx.beginPath();
        ctx.arc(b.x - currentRadius * 0.35, renderY - currentRadius * 0.35, currentRadius * 0.1, 0, Math.PI * 2);
        ctx.fill();
      });

      const duration = performance.now() - start;
      if (config.onRenderMeasure) config.onRenderMeasure(duration);

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", updateSize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", transform: "translate3d(0,0,0)", willChange: "transform" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}

/* -------------------------------------------------------
   SILK FLOW SHADER COMPONENT
------------------------------------------------------- */
interface SilkShaderBackgroundProps {
  dprScale?: number;
  onRenderMeasure?: (duration: number) => void;
}

function compileSilkShader(gl: WebGLRenderingContext, source: string, type: number): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compilation error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createSilkWebGLProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string): WebGLProgram | null {
  const vs = compileSilkShader(gl, vsSource, gl.VERTEX_SHADER);
  const fs = compileSilkShader(gl, fsSource, gl.FRAGMENT_SHADER);
  if (!vs || !fs) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function SilkShaderBackground({ dprScale, onRenderMeasure }: SilkShaderBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const bufferRef = useRef<WebGLBuffer | null>(null);

  const uniformsRef = useRef({ dprScale, onRenderMeasure });
  
  useEffect(() => {
    uniformsRef.current = { dprScale, onRenderMeasure };
    const canvas = canvasRef.current;
    if (canvas && glRef.current) {
      const gl = glRef.current;
      const dpr = dprScale || Math.min(2.0, window.devicePixelRatio || 1);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
  }, [dprScale, onRenderMeasure]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false
    }) || canvas.getContext("experimental-webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false
    }) as WebGLRenderingContext;

    if (!gl) {
      console.error("WebGL1 not supported");
      return;
    }
    glRef.current = gl;

    const updateSize = () => {
      const dpr = uniformsRef.current.dprScale || Math.min(2.0, window.devicePixelRatio || 1);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    updateSize();
    window.addEventListener("resize", updateSize);

    // Fullscreen triangle vertices: (-1, -1), (3, -1), (-1, 3)
    const vertices = new Float32Array([
      -1.0, -1.0,
       3.0, -1.0,
      -1.0,  3.0
    ]);

    const program = createSilkWebGLProgram(gl, silkVertexShaderSource, silkFragmentShaderSource);
    if (!program) return;
    programRef.current = program;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    bufferRef.current = buffer;

    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uColors = gl.getUniformLocation(program, "u_colors");
    const uScene = gl.getUniformLocation(program, "u_scene");
    const uShape = gl.getUniformLocation(program, "u_shape");
    const uSurface = gl.getUniformLocation(program, "u_surface");
    const uFinish = gl.getUniformLocation(program, "u_finish");
    const uTransform = gl.getUniformLocation(program, "u_transform");
    const uSpace = gl.getUniformLocation(program, "u_space");
    const uCursor = gl.getUniformLocation(program, "u_cursor");

    const colorsData = new Float32Array([
      0.051, 0.051, 0.051, // #0D0D0D (Obsidian Black base)
      0.000, 0.360, 0.184, // #005A2F (Subtle Emerald Green)
      0.700, 0.380, 0.000, // #B26000 (Subtle International Orange - corrected ratio)
      0.086, 0.086, 0.086, // #161616 (Onyx surface base)
      0.0, 0.0, 0.0,
      0.0, 0.0, 0.0,
      0.0, 0.0, 0.0,
      0.0, 0.0, 0.0
    ]);

    let active = true;
    let rafId = 0;

    const render = (now: number) => {
      if (!active) return;
      const start = performance.now();

      gl.useProgram(program);

      // Bind attributes
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

      // Set uniforms
      gl.uniform3fv(uColors, colorsData);
      gl.uniform4f(uScene, canvas.width, canvas.height, (now * 0.001) * 0.84, 4.0);
      gl.uniform4f(uShape, 1.28, 0.47, 0.50, 0.00);
      gl.uniform4f(uSurface, 2.40, 0.98, -0.06, 1.00);
      gl.uniform4f(uFinish, 0.00, 0.00, 0.00, 0.01);
      gl.uniform4f(uTransform, 707.0, 0.00, 0.00, 0.0);
      gl.uniform4f(uSpace, 0.00, 0.00, 0.00, 0.00);
      gl.uniform4f(uCursor, 0.0, 2.0, 0.65, 0.46);

      // Clear & Draw fullscreen triangle
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      const duration = performance.now() - start;
      if (uniformsRef.current.onRenderMeasure) {
        uniformsRef.current.onRenderMeasure(duration);
      }

      rafId = requestAnimationFrame(render);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        active = false;
        cancelAnimationFrame(rafId);
      } else {
        if (!active) {
          active = true;
          rafId = requestAnimationFrame(render);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", updateSize);
      document.removeEventListener("visibilitychange", handleVisibility);
      cancelAnimationFrame(rafId);
      if (glRef.current && programRef.current) {
        const glInstance = glRef.current;
        glInstance.deleteProgram(programRef.current);
        glInstance.deleteBuffer(bufferRef.current);
      }
    };
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", transform: "translate3d(0,0,0)", willChange: "transform" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}

/* -------------------------------------------------------
   DRIFT MESH BLOB SHADER COMPONENT
------------------------------------------------------- */
interface DriftShaderBackgroundProps {
  variant?: "theme" | "ocean";
  blobCount?: number;
  dprScale?: number;
  onRenderMeasure?: (duration: number) => void;
}

function compileDriftShader(gl: WebGLRenderingContext, source: string, type: number): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Drift shader compilation error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createDriftWebGLProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string): WebGLProgram | null {
  const vs = compileDriftShader(gl, vsSource, gl.VERTEX_SHADER);
  const fs = compileDriftShader(gl, fsSource, gl.FRAGMENT_SHADER);
  if (!vs || !fs) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Drift program link error:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function DriftShaderBackground({ variant = "theme", blobCount = 4, dprScale, onRenderMeasure }: DriftShaderBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const bufferRef = useRef<WebGLBuffer | null>(null);

  const uniformsRef = useRef({ dprScale, onRenderMeasure });
  
  useEffect(() => {
    uniformsRef.current = { dprScale, onRenderMeasure };
    const canvas = canvasRef.current;
    if (canvas && glRef.current) {
      const gl = glRef.current;
      const dpr = dprScale || Math.min(2.0, window.devicePixelRatio || 1);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
  }, [dprScale, onRenderMeasure]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false
    }) || canvas.getContext("experimental-webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false
    }) as WebGLRenderingContext;

    if (!gl) {
      console.error("WebGL1 not supported for Drift");
      return;
    }
    glRef.current = gl;

    const updateSize = () => {
      const dpr = uniformsRef.current.dprScale || Math.min(2.0, window.devicePixelRatio || 1);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    updateSize();
    window.addEventListener("resize", updateSize);

    // Fullscreen triangle vertices: (-1, -1), (3, -1), (-1, 3)
    const vertices = new Float32Array([
      -1.0, -1.0,
       3.0, -1.0,
      -1.0,  3.0
    ]);

    const program = createDriftWebGLProgram(gl, silkVertexShaderSource, driftFragmentShaderSource);
    if (!program) return;
    programRef.current = program;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    bufferRef.current = buffer;

    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uColors = gl.getUniformLocation(program, "u_colors");
    const uScene = gl.getUniformLocation(program, "u_scene");
    const uShape = gl.getUniformLocation(program, "u_shape");
    const uSurface = gl.getUniformLocation(program, "u_surface");
    const uFinish = gl.getUniformLocation(program, "u_finish");
    const uTransform = gl.getUniformLocation(program, "u_transform");
    const uSpace = gl.getUniformLocation(program, "u_space");
    const uCursor = gl.getUniformLocation(program, "u_cursor");

    // Colors adjusted to blend with user theme
    const isOcean = variant === "ocean";
    let colorsData: Float32Array;

    if (isOcean) {
      if (blobCount === 3) {
        colorsData = new Float32Array([
          0.039, 0.180, 0.361, // #0A2E5C (Deep Ocean Blue)
          0.000, 0.451, 0.502, // #007380 (Subtle Aqua/Cyan)
          0.000, 0.502, 0.350, // #008059 (Subtle Teal)
          0.0, 0.0, 0.0,
          0.0, 0.0, 0.0,
          0.0, 0.0, 0.0,
          0.0, 0.0, 0.0,
          0.0, 0.0, 0.0
        ]);
      } else {
        colorsData = new Float32Array([
          0.051, 0.051, 0.051, // #0D0D0D (Obsidian Black base)
          0.039, 0.180, 0.361, // #0A2E5C (Deep Ocean Blue)
          0.000, 0.451, 0.502, // #007380 (Subtle Aqua/Cyan)
          0.086, 0.086, 0.086, // #161616 (Onyx surface base)
          0.0, 0.0, 0.0,
          0.0, 0.0, 0.0,
          0.0, 0.0, 0.0,
          0.0, 0.0, 0.0
        ]);
      }
    } else {
      if (blobCount === 3) {
        colorsData = new Float32Array([
          0.000, 0.360, 0.184, // #005A2F (Subtle Emerald Green)
          0.700, 0.380, 0.000, // #B26000 (Subtle International Orange)
          0.700, 0.480, 0.000, // #B27A00 (Subtle Amber Flare)
          0.0, 0.0, 0.0,
          0.0, 0.0, 0.0,
          0.0, 0.0, 0.0,
          0.0, 0.0, 0.0,
          0.0, 0.0, 0.0
        ]);
      } else {
        colorsData = new Float32Array([
          0.051, 0.051, 0.051, // #0D0D0D (Obsidian Black base)
          0.000, 0.360, 0.184, // #005A2F (Subtle Emerald Green)
          0.700, 0.380, 0.000, // #B26000 (Subtle International Orange)
          0.086, 0.086, 0.086, // #161616 (Onyx surface base)
          0.0, 0.0, 0.0,
          0.0, 0.0, 0.0,
          0.0, 0.0, 0.0,
          0.0, 0.0, 0.0
        ]);
      }
    }

    let active = true;
    let rafId = 0;

    const render = (now: number) => {
      if (!active) return;
      const start = performance.now();

      gl.useProgram(program);

      // Bind attributes
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

      // Set uniforms - Mesh Drift parameters
      gl.uniform3fv(uColors, colorsData);
      gl.uniform4f(uScene, canvas.width, canvas.height, (now * 0.001) * 0.73, blobCount * 1.0);
      gl.uniform4f(uShape, 1.16, 0.34, 0.50, 0.00);
      gl.uniform4f(uSurface, 2.40, 1.16, -0.06, 1.00); // detail, contrast, brightness=-0.06, saturation
      gl.uniform4f(uFinish, 0.00, 0.00, 0.00, 0.03);   // hue, vignette, blur, grain=0.03
      gl.uniform4f(uTransform, 1453.0, 0.00, 0.00, 0.0);
      gl.uniform4f(uSpace, 0.00, 0.00, 0.00, 0.00);
      gl.uniform4f(uCursor, 0.0, 2.0, 0.65, 0.46);

      // Clear & Draw fullscreen triangle
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      const duration = performance.now() - start;
      if (uniformsRef.current.onRenderMeasure) {
        uniformsRef.current.onRenderMeasure(duration);
      }

      rafId = requestAnimationFrame(render);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        active = false;
        cancelAnimationFrame(rafId);
      } else {
        if (!active) {
          active = true;
          rafId = requestAnimationFrame(render);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", updateSize);
      document.removeEventListener("visibilitychange", handleVisibility);
      cancelAnimationFrame(rafId);
      if (glRef.current && programRef.current) {
        const glInstance = glRef.current;
        glInstance.deleteProgram(programRef.current);
        glInstance.deleteBuffer(bufferRef.current);
      }
    };
  }, [variant, blobCount]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", transform: "translate3d(0,0,0)", willChange: "transform" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}

/* -------------------------------------------------------
   MAIN PLAYGROUND PAGE
------------------------------------------------------- */
export function BgPlayground() {
  const [activeTab, setActiveTab] = useState<"prototypes" | "concepts">("prototypes");
  const [bgType, setBgType] = useState<"smoke" | "aurora" | "particles" | "fluid" | "flow-field" | "silk" | "drift" | "original-smoke" | "ocean-drift" | "drift-3">("flow-field");
  const [selectedConcept, setSelectedConcept] = useState<ConceptSpec>(CONCEPTS[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showBento, setShowBento] = useState(false);
  const [fps, setFps] = useState(60);

  // Performance and resource diagnostics state
  const [renderLatency, setRenderLatency] = useState(0);
  const [ramUsed, setRamUsed] = useState<string>("N/A");
  const [dprScale, setDprScale] = useState<number>(1.0); // Default to 1.0x (standard)

  const latencyAccumulator = useRef<number[]>([]);
  const lastUpdateRef = useRef<number>(0);

  const handleRenderMeasure = (duration: number) => {
    latencyAccumulator.current.push(duration);
    const now = performance.now();
    if (now - lastUpdateRef.current > 350) { // Throttle React updates to 350ms
      const avg = latencyAccumulator.current.reduce((a, b) => a + b, 0) / latencyAccumulator.current.length;
      setRenderLatency(avg);
      latencyAccumulator.current = [];
      
      // Measure RAM if performance.memory is available
      if (typeof performance !== "undefined" && (performance as any).memory) {
        const used = ((performance as any).memory.usedJSHeapSize / 1048576).toFixed(1);
        setRamUsed(`${used} MB`);
      } else {
        setRamUsed("N/A (Chrome)");
      }
      lastUpdateRef.current = now;
    }
  };

  // Dynamic Theme/Shader prop states computed based on selected blueprint
  const smokeProps = useMemo(() => {
    if (activeTab === "concepts") {
      return {
        colorLeft: selectedConcept.props.colorLeft,
        colorRight: selectedConcept.props.colorRight,
        monochrome: selectedConcept.props.monochrome
      };
    }
    return { colorLeft: [1.0, 0.42, 0.0] as [number, number, number], colorRight: [0.0, 0.90, 0.46] as [number, number, number], monochrome: false };
  }, [activeTab, selectedConcept]);

  const particlesProps = useMemo(() => {
    if (activeTab === "concepts") {
      return {
        canvasMode: selectedConcept.props.canvasMode,
        particleColor: selectedConcept.props.particleColor,
        lineColor: selectedConcept.props.lineColor,
        connectDistance: selectedConcept.props.connectDistance,
        speedMultiplier: selectedConcept.props.speedMultiplier,
        particleCount: selectedConcept.props.particleCount,
        verticalOnly: selectedConcept.props.verticalOnly,
        drawTorus: selectedConcept.props.drawTorus
      };
    }
    return {};
  }, [activeTab, selectedConcept]);

  const auroraProps = useMemo(() => {
    if (activeTab === "concepts") {
      return {
        orbColor1: selectedConcept.props.orbColor1,
        orbColor2: selectedConcept.props.orbColor2
      };
    }
    return {};
  }, [activeTab, selectedConcept]);

  // Synchronize dynamic background types to active selected blueprints
  useEffect(() => {
    if (activeTab !== "concepts") return;

    setBgType(selectedConcept.bgType);

    // Force glass bento overlays in refraction-heavy cards
    if ([3, 12, 47].includes(selectedConcept.id)) {
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
      case "flow-field":
        return `Option 1 (Neural Flow Field) — Flow field background with orange-to-green blended particles`;
      case "smoke":
        return `Option 2 (Texture Smoke) — ${activeTab === "concepts" ? `Rendering Specs Mockup for concept #${selectedConcept.id}` : "Standard Preset"}`;
      case "aurora":
        return `Option 3 (Aurora Orbs) — ${activeTab === "concepts" ? `Rendering Specs Mockup for concept #${selectedConcept.id}` : "Standard Preset"}`;
      case "particles":
        return `Option 4 (Constellation) — ${activeTab === "concepts" ? `Rendering Specs Mockup for concept #${selectedConcept.id}` : "Standard Preset"}`;
      case "fluid":
        return `Option 5 (Fluid Bubbles) — ${activeTab === "concepts" ? `Rendering Specs Mockup for concept #${selectedConcept.id}` : "Standard Preset"}`;
      case "silk":
        return `Option 6 (Silk Flow Shader) — An animated WebGL1 shader background styled like silk`;
      case "drift":
        return `Option 7 (Mesh Drift Blobs) — WebGL1 procedural mesh drift blobs shader background`;
      case "original-smoke":
        return `Option 8 (Original Smoke) — WebGL2 procedural dual-tone smoke background (legacy homepage background)`;
      case "ocean-drift":
        return `Option 9 (Ocean Drift Blobs) — WebGL1 procedural mesh drift blobs shader background in ocean blue & aqua`;
      case "drift-3":
        return `Option 10 (3-Blob Drift) — WebGL1 procedural mesh drift blobs shader background with 3 brand color blobs`;
    }
  }, [bgType, activeTab, selectedConcept]);

  // Filter concepts based on selected category
  const filteredConcepts = useMemo(() => {
    if (selectedCategory === "all") return CONCEPTS;
    return CONCEPTS.filter((c) => c.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="playground-container">
      {/* Dynamic Background switcher passing down live updated params */}
      {bgType === "smoke" && (
        <TextureSmoke 
          colorLeft={smokeProps.colorLeft} 
          colorRight={smokeProps.colorRight} 
          monochrome={smokeProps.monochrome} 
          dynamicScroll={activeTab === "prototypes"}
          dprScale={dprScale}
          onRenderMeasure={handleRenderMeasure}
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
          canvasMode={particlesProps.canvasMode}
          particleColor={particlesProps.particleColor}
          lineColor={particlesProps.lineColor}
          connectDistance={particlesProps.connectDistance}
          speedMultiplier={particlesProps.speedMultiplier}
          particleCount={particlesProps.particleCount}
          verticalOnly={particlesProps.verticalOnly}
          drawTorus={particlesProps.drawTorus}
          dprScale={dprScale}
          onRenderMeasure={handleRenderMeasure}
        />
      )}
      {bgType === "fluid" && (
        <FluidBubbles 
          dprScale={dprScale}
          onRenderMeasure={handleRenderMeasure}
          dynamicScroll={activeTab === "prototypes"}
        />
      )}
      {bgType === "flow-field" && (
        <NeuralBackground 
          color="#6366f1"
          trailOpacity={0.1}
          particleCount={700}
          speed={0.8}
          dprScale={dprScale}
          onRenderMeasure={handleRenderMeasure}
        />
      )}
      {bgType === "silk" && (
        <SilkShaderBackground 
          dprScale={dprScale}
          onRenderMeasure={handleRenderMeasure}
        />
      )}
      {bgType === "drift" && (
        <DriftShaderBackground 
          variant="theme"
          dprScale={dprScale}
          onRenderMeasure={handleRenderMeasure}
        />
      )}
      {bgType === "original-smoke" && (
        <SmokeBackground 
          smokeColorLeft="#FF6B00" 
          smokeColorRight="#00E676" 
          opacity={0.6} 
        />
      )}
      {bgType === "ocean-drift" && (
        <DriftShaderBackground 
          variant="ocean"
          dprScale={dprScale}
          onRenderMeasure={handleRenderMeasure}
        />
      )}
      {bgType === "drift-3" && (
        <DriftShaderBackground 
          variant="theme"
          blobCount={3}
          dprScale={dprScale}
          onRenderMeasure={handleRenderMeasure}
        />
      )}

      {/* Bento Grid Glass overlay toggle */}
      <AnimatePresence>
        {showBento && (
          <motion.div 
            className="bento-grid-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {[1, 2, 3, 4, 5].map((idx) => (
              <motion.div 
                key={idx}
                className={`bento-card-glass bento-card-${idx}`}
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 14, delay: idx * 0.05 }}
                whileHover={{ scale: 1.025, y: -4 }}
                style={{ willChange: "transform, opacity" }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control panel hub wrapped with Spring Motion */}
      <motion.div 
        className="control-hub"
        initial={{ x: -120, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 110, damping: 16 }}
        style={{ willChange: "transform, opacity" }}
      >
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
            50 PREMIUM BLUEPRINTS
          </button>
        </div>

        {/* TAB 1: Prototypes */}
        {activeTab === "prototypes" && (
          <div className="selector-list">
            <button 
              className={`selector-btn ${bgType === "flow-field" ? "active" : ""}`}
              onClick={() => setBgType("flow-field")}
            >
              <span className="btn-title">1. Neural Flow Field</span>
              <span className="btn-desc">Flow field with smooth blended orange-indigo-green trails</span>
            </button>

            <button 
              className={`selector-btn ${bgType === "smoke" ? "active" : ""}`}
              onClick={() => setBgType("smoke")}
            >
              <span className="btn-title">2. Texture Noise Smoke</span>
              <span className="btn-desc">Fast WebGL samplers with chromatic aberration</span>
            </button>
            
            <button 
              className={`selector-btn ${bgType === "aurora" ? "active" : ""}`}
              onClick={() => setBgType("aurora")}
            >
              <span className="btn-title">3. Glassmorphic Aurora Orbs</span>
              <span className="btn-desc">Pure CSS compositor gradient mesh & paper grain</span>
            </button>

            <button 
              className={`selector-btn ${bgType === "particles" ? "active" : ""}`}
              onClick={() => setBgType("particles")}
            >
              <span className="btn-title">4. Constellation Particles</span>
              <span className="btn-desc">Interactive canvas net tracking pointer coordinates</span>
            </button>

            <button 
              className={`selector-btn ${bgType === "fluid" ? "active" : ""}`}
              onClick={() => setBgType("fluid")}
            >
              <span className="btn-title">5. Fluid Bubble Glow</span>
              <span className="btn-desc">Interactive liquid flow with rising neon bubbles</span>
            </button>

            <button 
              className={`selector-btn ${bgType === "silk" ? "active" : ""}`}
              onClick={() => setBgType("silk")}
            >
              <span className="btn-title">6. Silk (Flow Shader)</span>
              <span className="btn-desc">WebGL1 procedural flow shader background by 21st.dev</span>
            </button>

            <button 
              className={`selector-btn ${bgType === "drift" ? "active" : ""}`}
              onClick={() => setBgType("drift")}
            >
              <span className="btn-title">7. Mesh Drift (Blobs)</span>
              <span className="btn-desc">WebGL1 procedural mesh blobs shader by 21st.dev</span>
            </button>

            <button 
              className={`selector-btn ${bgType === "original-smoke" ? "active" : ""}`}
              onClick={() => setBgType("original-smoke")}
            >
              <span className="btn-title">8. Original Site Smoke</span>
              <span className="btn-desc">WebGL2 legacy procedural dual-tone smoke background</span>
            </button>

            <button 
              className={`selector-btn ${bgType === "ocean-drift" ? "active" : ""}`}
              onClick={() => setBgType("ocean-drift")}
            >
              <span className="btn-title">9. Ocean Drift (Blobs)</span>
              <span className="btn-desc">WebGL1 procedural mesh blobs shader in ocean blue & aqua</span>
            </button>

            <button 
              className={`selector-btn ${bgType === "drift-3" ? "active" : ""}`}
              onClick={() => setBgType("drift-3")}
            >
              <span className="btn-title">10. Mesh Drift (3 Blobs)</span>
              <span className="btn-desc">WebGL1 procedural mesh blobs with 3 brand color blobs</span>
            </button>
          </div>
        )}

        {/* TAB 2: 50 Premium Concept Blueprints */}
        {activeTab === "concepts" && (
          <>
            {/* Category Filter Bar */}
            <div className="category-filter-bar">
              {["all", "space", "interactive", "3d", "cyberpunk", "shaders"].map((cat) => (
                <button
                  key={cat}
                  className={`category-btn ${selectedCategory === cat ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="selector-list">
              {filteredConcepts.map((concept) => (
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
          </>
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
            <span className="stat-val">
              {bgType === "aurora" ? "CSS Compositor" : (bgType === "smoke" || bgType === "original-smoke") ? "WebGL 2.0" : (bgType === "silk" || bgType === "drift" || bgType === "ocean-drift" || bgType === "drift-3") ? "WebGL 1.0" : "Canvas 2D"}
            </span>
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
      </motion.div>

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

      {/* Floating Performance Diagnostics Overlay */}
      <motion.div 
        className="diagnostic-dashboard"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.4 }}
        style={{ willChange: "transform, opacity" }}
      >
        <div className="diagnostic-header">
          <span className="diagnostic-title">PERFORMANCE DIAGNOSTICS</span>
          <span className="diagnostic-pulse">● LIVE</span>
        </div>
        
        <div className="diagnostic-grid">
          <div className="diag-cell">
            <span className="diag-lbl">Realtime FPS</span>
            <span className={`diag-val ${fps >= 58 ? "fps-high" : "fps-low"}`}>{fps} FPS</span>
          </div>
          <div className="diag-cell">
            <span className="diag-lbl">CPU Latency</span>
            <span className="diag-val">{bgType === "aurora" ? "0.00 ms" : `${renderLatency.toFixed(2)} ms`}</span>
          </div>
          <div className="diag-cell">
            <span className="diag-lbl">JS Heap RAM</span>
            <span className="diag-val">{ramUsed}</span>
          </div>
          <div className="diag-cell">
            <span className="diag-lbl">Thread Load</span>
            <span className="diag-val">{bgType === "aurora" ? "Composited" : `${((renderLatency / 8.33) * 100).toFixed(0)}%`}</span>
          </div>
        </div>

        <div className="diagnostic-dpr-row">
          <span className="dpr-label">Render Scale:</span>
          <div className="dpr-buttons">
            {[0.5, 0.75, 1.0, 1.5, 2.0].map((scale) => (
              <button
                key={scale}
                className={`dpr-btn ${dprScale === scale ? "active" : ""}`}
                onClick={() => setDprScale(scale)}
                disabled={bgType === "aurora"}
                style={bgType === "aurora" ? { opacity: 0.35, cursor: "not-allowed" } : {}}
              >
                {scale.toFixed(2)}x
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
