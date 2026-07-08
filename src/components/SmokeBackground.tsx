import React, { useEffect, useRef } from 'react';

// --- FRAGMENT SHADER ---
const fragmentShaderSource = `#version 300 es
precision highp float;
out vec4 O;
uniform float time;
uniform vec2 resolution;
uniform vec3 u_colorLeft; 
uniform vec3 u_colorRight; 

#define FC gl_FragCoord.xy
#define R resolution
#define T (time+660.)

float rnd(vec2 p){p=fract(p*vec2(12.9898,78.233));p+=dot(p,p+34.56);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);return mix(mix(rnd(i),rnd(i+vec2(1,0)),u.x),mix(rnd(i+vec2(0,1)),rnd(i+1.),u.x),u.y);}
float fbm(vec2 p){float t=.0,a=1.;for(int i=0;i<3;i++){t+=a*noise(p);p*=mat2(1,-1.2,.2,1.2)*2.;a*=.5;}return t;}

void main(){
  // Calculate blend factor based on X position on screen (0.0 left to 1.0 right)
  float screenX = FC.x / R.x;
  vec3 targetColor = mix(u_colorLeft, u_colorRight, screenX);

  vec2 uv=(FC-.5*R)/R.y;
  vec3 col=vec3(1);
  uv.x-=.15;
  uv*=vec2(2,1);

  float n=fbm(uv*.28-vec2(T*.01,0));
  n=noise(uv*3.+n*2.);

  col.r-=fbm(uv+vec2(0,T*.015)+n);
  col.g-=fbm(uv*1.003+vec2(0,T*.015)+n+.003);
  col.b-=fbm(uv*1.006+vec2(0,T*.015)+n+.006);

  // Mix with our horizontally blended target color
  col=mix(col, targetColor, dot(col,vec3(.21,.71,.07)));

  col=mix(vec3(.05),col,min(time*.1,1.)); // Darkened base slightly to match theme
  col=clamp(col,.05,1.);
  O=vec4(col,1);
}`;

// --- RENDERER CLASS ---
class Renderer {
  private readonly vertexSrc = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;
  
  private readonly vertices = [-1, 1, -1, -1, 1, 1, 1, -1];
  
  private gl: WebGL2RenderingContext;
  private canvas: HTMLCanvasElement;
  private program: WebGLProgram | null = null;
  private vs: WebGLShader | null = null;
  private fs: WebGLShader | null = null;
  private buffer: WebGLBuffer | null = null;
  private colorLeft: [number, number, number] = [1.0, 0.42, 0.0]; 
  private colorRight: [number, number, number] = [0.0, 0.90, 0.46]; 

  constructor(canvas: HTMLCanvasElement, fragmentSource: string) {
    this.canvas = canvas;
    this.gl = canvas.getContext("webgl2") as WebGL2RenderingContext;
    this.setup(fragmentSource);
    this.init();
  }
  
  updateColors(leftColor: [number, number, number], rightColor: [number, number, number]) {
    this.colorLeft = leftColor;
    this.colorRight = rightColor;
  }

  updateScale() {
    const dpr = Math.min(2.0, window.devicePixelRatio || 1);
    const { innerWidth: width, innerHeight: height } = window;
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  private compile(shader: WebGLShader, source: string) {
    const gl = this.gl;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(`Shader compilation error: ${gl.getShaderInfoLog(shader)}`);
    }
  }

  reset() {
    const { gl, program, vs, fs } = this;
    if (!program) return;
    if (vs) { gl.detachShader(program, vs); gl.deleteShader(vs); }
    if (fs) { gl.detachShader(program, fs); gl.deleteShader(fs); }
    gl.deleteProgram(program);
    this.program = null;
  }

  private setup(fragmentSource: string) {
    const gl = this.gl;
    this.vs = gl.createShader(gl.VERTEX_SHADER);
    this.fs = gl.createShader(gl.FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (!this.vs || !this.fs || !program) return;
    this.compile(this.vs, this.vertexSrc);
    this.compile(this.fs, fragmentSource);
    this.program = program;
    gl.attachShader(this.program, this.vs);
    gl.attachShader(this.program, this.fs);
    gl.linkProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.error(`Program linking error: ${gl.getProgramInfoLog(this.program)}`);
    }
  }

  private init() {
    const { gl, program } = this;
    if (!program) return;
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    Object.assign(program, {
      resolution: gl.getUniformLocation(program, "resolution"),
      time: gl.getUniformLocation(program, "time"),
      u_colorLeft: gl.getUniformLocation(program, "u_colorLeft"),
      u_colorRight: gl.getUniformLocation(program, "u_colorRight"),
    });
  }

  render(now = 0) {
    const { gl, program, buffer, canvas } = this;
    if (!program || !gl.isProgram(program)) return;
    gl.clearColor(0.02, 0.02, 0.02, 1); // Dark background matching Obsidian Black
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gl.uniform2f((program as any).resolution, canvas.width, canvas.height);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gl.uniform1f((program as any).time, now * 1e-3);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gl.uniform3fv((program as any).u_colorLeft, this.colorLeft); 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gl.uniform3fv((program as any).u_colorRight, this.colorRight); 
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}

// --- UTILITY FUNCTION ---
const hexToRgb = (hex: string): [number, number, number] | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16) / 255,
          parseInt(result[2], 16) / 255,
          parseInt(result[3], 16) / 255,
        ]
      : null;
};

// --- REACT COMPONENT ---
interface SmokeBackgroundProps {
  smokeColorLeft?: string;
  smokeColorRight?: string;
  opacity?: number;
}

export const SmokeBackground: React.FC<SmokeBackgroundProps> = ({ 
  smokeColorLeft = "#FF6B00", // Default to Flow NextGen Orange
  smokeColorRight = "#00E676", // Default to Neon Emerald
  opacity = 0.4
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rendererRef = useRef<Renderer | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const renderer = new Renderer(canvas, fragmentShaderSource);
        rendererRef.current = renderer;
        
        const handleResize = () => renderer.updateScale();
        handleResize(); 
        window.addEventListener('resize', handleResize);
        
        let animationFrameId: number;
        const loop = (now: number) => {
            renderer.render(now);
            animationFrameId = requestAnimationFrame(loop);
        };
        loop(0);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            renderer.reset(); 
        };
    }, []);
    
    useEffect(() => {
        const renderer = rendererRef.current;
        if (renderer) {
            const rgbLeft = hexToRgb(smokeColorLeft);
            const rgbRight = hexToRgb(smokeColorRight);
            if (rgbLeft && rgbRight) {
                renderer.updateColors(rgbLeft, rgbRight);
            }
        }
    }, [smokeColorLeft, smokeColorRight]);

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: opacity
      }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      </div>
    );
};
