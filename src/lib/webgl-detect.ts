/**
 * Device-aware WebGL capability detection.
 * Inspects the user's rendering hardware, mobile status, and shader precision
 * to classify WebGL quality as 'high', 'low', or 'unsupported'.
 *
 * Use `detectWebGLQuality()` early in the component lifecycle (before creating
 * a WebGL context) to avoid loading heavy shaders on underpowered devices.
 */

export type WebGLQuality = 'high' | 'low' | 'unsupported';

export interface WebGLCapabilities {
  quality: WebGLQuality;
  renderer: string;
  hasHighPrecision: boolean;
  isMobile: boolean;
  maxTextureSize: number;
  maxVertexUniforms: number;
  maxFragmentUniforms: number;
}

/**
 * Detect WebGL quality tier by inspecting the GPU renderer string, user-agent
 * mobile hints, and shader precision support.
 *
 * Returns:
 *   'high'        – capable desktop/integrated GPU, HIGH precision, large
 *                   texture / uniform budgets → full shader complexity.
 *   'low'         – mobile, Intel HD Graphics, older Mali / Adreno / PowerVR,
 *                   or devices missing HIGH float precision → reduced
 *                   shader settings (simpler effects, fewer iterations,
 *                   lower DPR cap).
 *   'unsupported' – no WebGL at all → CSS gradient fallback immediately
 *                   (skip canvas entirely).
 */
export function detectWebGLQuality(): WebGLQuality {
  const { quality } = detectWebGLCapabilities();
  return quality;
}

/**
 * Full capability detect with detailed info for debugging / analytics.
 */
export function detectWebGLCapabilities(): WebGLCapabilities {
  const fallback: WebGLCapabilities = {
    quality: 'unsupported',
    renderer: '',
    hasHighPrecision: false,
    isMobile: false,
    maxTextureSize: 0,
    maxVertexUniforms: 0,
    maxFragmentUniforms: 0,
  };

  try {
    const canvas = document.createElement('canvas');
    const gl: WebGLRenderingContext | null =
      (canvas.getContext('webgl') as WebGLRenderingContext | null) ??
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);

    if (!gl) return fallback;

    // --- GPU Renderer string ---
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo
      ? (gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string) ?? ''
      : '';

    // --- Mobile detection ---
    const isMobile =
      /iPhone|iPad|iPod|Android|Mobile|Tablet|Silk/i.test(navigator.userAgent) ||
      /Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (typeof navigator !== 'undefined' && 'maxTouchPoints' in navigator && navigator.maxTouchPoints > 1 &&
        !/Windows|Macintosh|Linux (?!Android)/i.test(navigator.userAgent));

    // --- Shader precision ---
    let hasHighPrecision = false;
    try {
      const highp = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
      hasHighPrecision = highp !== null && highp.precision > 0;
    } catch {
      hasHighPrecision = false;
    }

    // --- Texture & uniform limits ---
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
    const maxVertexUniforms = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS) as number;
    const maxFragmentUniforms = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS) as number;

    // --- Low-power GPU patterns (case-insensitive) ---
    const lowPowerGPUPatterns = [
      /Intel\s+(HD\s+Graphics|UHD\s+Graphics|Iris)/i,
      /Mali\s*-\s*[3-5]\d{2}/i,           // Mali-300 to Mali-590 series
      /Mali\s+[3-5]\d{2}/i,                 // Mali 300-590
      /Adreno\s+[0-5]/,                      // Adreno 1xx-5xx
      /Adreno\s+6[0-3]\d/,                   // Adreno 6xx < 640
      /PowerVR/i,
      /Vivante/i,
      /Mozilla/i,                            // Firefox software renderer
      /SwiftShader/i,                        // Software renderer
      /ANGLE\s*\(/i,                         // ANGLE on Windows w/o D3D11
    ];

    const isLowPowerGPU = lowPowerGPUPatterns.some((p) => p.test(renderer));

    // --- Quality decision ---
    let quality: WebGLQuality = 'high';

    if (isMobile || !hasHighPrecision || isLowPowerGPU) {
      quality = 'low';
    }

    // Even on desktop, tiny texture/uniform limits indicate a weak GPU
    if (maxTextureSize < 4096 || maxFragmentUniforms < 16 || maxVertexUniforms < 16) {
      quality = 'low';
    }

    // Borderline integrated GPUs (Intel HD/UHD, Apple M-series, AMD Radeon HD/R2-5)
    // on mobile-sized or Memory-constrained devices — treat as low
    if (
      !isMobile &&
      /Intel\s+(HD|UHD|Iris)/i.test(renderer) &&
      maxTextureSize < 8192
    ) {
      quality = 'low';
    }

    return {
      quality,
      renderer,
      hasHighPrecision,
      isMobile,
      maxTextureSize,
      maxVertexUniforms,
      maxFragmentUniforms,
    };
  } catch {
    return fallback;
  }
}

/**
 * Convenience check – should this session skip heavy WebGL and render a
 * simple CSS gradient background instead?
 *
 * Returns `true` for 'low' and 'unsupported' tiers.
 */
export function shouldUseSimpleBackground(): boolean {
  const quality = detectWebGLQuality();
  return quality !== 'high';
}
