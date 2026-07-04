# Flow NextGen - Design System & Theme

## 🎨 Color Palette

| Role | Color Name | Hex | Usage |
| :--- | :--- | :--- | :--- |
| **Primary BG** | Obsidian Black | `#0D0D0D` | Main background, full-screen depth. |
| **Surface** | Onyx | `#161616` | Card backgrounds, input fields, sidebars. |
| **Accent** | International Orange | `#FF6B00` | CTAs, active states, progress bars, highlights. |
| **Border/Stroke**| Anthracite | `#2A2A2A` | Subtle dividers, component outlines. |
| **Text (High)** | Frost White | `#F5F5F5` | Primary headings, active labels. |
| **Text (Muted)** | Steel Gray | `#808080` | Secondary metadata, labels, icons. |
| **Success** | Neon Emerald | `#00E676` | Completed tasks, successful syncs. |
| **Alert** | Amber Flare | `#FFAB00` | Retries, warnings, pending states. |

## 🔤 Typography

*   **Font Family:** `Inter`, `system-ui`, `sans-serif`
*   **Headers:** Heavy weights (700-800), tight letter-spacing (`-0.02em` to `-0.04em`), clean and confident.
*   **Body:** Regular weights (400-500), relaxed line-height (`1.5` to `1.6`) for readability.
*   **Monospace/Data:** Used for job IDs, timings, and code blocks to emulate a developer/power-user environment.

## 🪟 UI Effects & Glassmorphism

The site relies heavily on deep, premium glassmorphism rather than flat opaque colors.

*   **Glass Panels (Heavy):** `background: rgba(10, 10, 10, 0.7)`, `backdrop-filter: blur(20px)`
*   **Glass Cards (Light):** `background: rgba(20, 20, 20, 0.4)`, `backdrop-filter: blur(16px)`
*   **Borders:** Ultra-thin, low-opacity white borders (`border: 1px solid rgba(255, 255, 255, 0.05)`) to catch the light.
*   **Shadows:** Deep, soft black shadows (`box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.9)`) combined with inner white highlights (`inset 0 1px 0 rgba(255, 255, 255, 0.1)`) to create physical depth.

## 🌌 Background Architecture

*   **Base:** Deep Obsidian `#050505`.
*   **Grid:** A subtle, translucent architectural grid pattern masked by a radial gradient so it fades out at the edges.
*   **Volumetric Glows:** Massive, heavily blurred (`blur(140px)`) orbs in Orange and Emerald that slowly drift behind the UI layers using `mix-blend-mode: screen`, creating ambient light without noise.

## 📐 Layout Principles

*   **Dynamic Island Navigation:** Floating, centered pill-shaped header that reacts to scroll depth.
*   **3D Hero:** Split layout where the UI mockup sits in an isometric 3D perspective (`rotateY(-15deg)`), moving independently via scroll parallax.
*   **Bento Box Grids:** Asymmetrical, tile-based feature displays instead of standard symmetrical columns.

## 🎬 Animation (Framer Motion)

*   **Spring Physics:** UI elements snap into place using spring transitions (`type: "spring", stiffness: 80`) rather than linear fades, giving a tactile "app-like" feel.
*   **Micro-interactions:** Buttons glow on hover, borders illuminate, and progress bars loop continuously to show system activity.
