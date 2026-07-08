import { useEffect, useRef, useState, useMemo } from "react";
import { Compass, Sparkles, Wand2, ArrowLeft, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ExtensionMockup } from "../components/ExtensionMockup";
import "./BgPlayground.css";

/* -------------------------------------------------------
   $150K BUDGET CONCEPT SPEC REGISTRY DATA - 50 BACKGROUNDS
------------------------------------------------------- */
interface ConceptSpec {
  id: number;
  title: string;
  category: "space" | "interactive" | "3d" | "cyberpunk" | "shaders";
  bgType: "smoke" | "aurora" | "particles";
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

    const gl = canvas.getContext("webgl2") as WebGL2RenderingContext;
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
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.85, willChange: "opacity" }}>
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
      const ctx = canvas.getContext("2d");
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

    const ctx = canvas.getContext("2d");
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
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", willChange: "transform" }}>
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
      case "smoke":
        return `Option 1 (Texture Smoke) — ${activeTab === "concepts" ? `Rendering Specs Mockup for concept #${selectedConcept.id}` : "Standard Preset"}`;
      case "aurora":
        return `Option 2 (Aurora Orbs) — ${activeTab === "concepts" ? `Rendering Specs Mockup for concept #${selectedConcept.id}` : "Standard Preset"}`;
      case "particles":
        return `Option 3 (Constellation) — ${activeTab === "concepts" ? `Rendering Specs Mockup for concept #${selectedConcept.id}` : "Standard Preset"}`;
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
