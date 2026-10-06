"use client";

import { useEffect, useRef } from "react";

/*
 * DotField — a 3D terrain of data points rolling toward a horizon.
 * ~17k points on a ground plane, displaced in the vertex shader by slow
 * simplex swells. Every few seconds a charging pulse rings outward across
 * the field, and the cursor lifts the points beneath it. Distant points
 * fog into the ground colour, so the horizon dissolves into the page.
 *
 * Two palettes: "light" for the hero, "deep" for the CTA banner.
 */

const VERT = `#version 300 es
precision highp float;
in vec2 aPos;               // ground-plane x, z
uniform mat4 uViewProj;
uniform float uTime;
uniform float uPulse;       // 0..1 phase of the outgoing ring
uniform vec2 uMouse;        // NDC
uniform float uMouseAmt;
uniform float uAspect;
uniform float uDpr;
uniform float uSize;
out float vHeat;
out float vFog;

vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(
    i.z+vec4(0.0,i1.z,i2.z,1.0))
    +i.y+vec4(0.0,i1.y,i2.y,1.0))
    +i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}

float vHeatSize(float h){ return smoothstep(0.2, 0.5, h) * 0.25; }

void main(){
  float x = aPos.x;
  float z = aPos.y;
  float t = uTime;

  // Terrain: two octaves of drifting swell plus a long rolling wave.
  // Gentle, low-frequency swell: tall enough to read as terrain, never
  // steep enough to fold rows of points on top of each other.
  float h = 0.34 * snoise(vec3(x * 0.075, z * 0.075 + t * 0.04, t * 0.035))
          + 0.1 * snoise(vec3(x * 0.2, z * 0.2 - t * 0.05, t * 0.07))
          + 0.07 * sin(z * 0.32 + t * 0.5);

  // Charging pulse: a ring travelling out from a point deep in the field.
  float dist = distance(vec2(x, z), vec2(0.0, -9.0));
  float r = uPulse * 34.0;
  float ring = exp(-pow(dist - r, 2.0) * 0.35) * (1.0 - uPulse);
  h += ring * 0.3;

  // Cursor lift, measured in screen space against the undisplaced point.
  vec4 ground = uViewProj * vec4(x, 0.0, z, 1.0);
  vec2 ndc = ground.xy / ground.w;
  vec2 dm = (ndc - uMouse) * vec2(uAspect, 1.0);
  float lift = exp(-dot(dm, dm) * 14.0) * uMouseAmt;
  h += lift * 0.45;

  vec4 clip = uViewProj * vec4(x, h, z, 1.0);
  gl_Position = clip;

  float depth = clip.w;
  gl_PointSize = uDpr * uSize * (1.0 + ring * 0.35 + lift * 0.5 + vHeatSize(h)) * clamp(8.5 / depth, 0.35, 2.4);

  vHeat = clamp(smoothstep(0.1, 0.45, h) * 0.8 + ring * 0.8 + lift * 0.8, 0.0, 1.0);
  // Fog toward the horizon and the side edges.
  float edge = smoothstep(1.25, 0.7, abs(clip.x / clip.w));
  vFog = smoothstep(42.0, 9.0, depth) * edge;
}
`;

const FRAG = `#version 300 es
precision highp float;
in float vHeat;
in float vFog;
uniform vec3 uBase;
uniform vec3 uHot;
uniform float uBaseAlpha;
out vec4 outColor;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float disc = 1.0 - smoothstep(0.32, 0.5, d);
  vec3 col = mix(uBase, uHot, vHeat);
  float a = disc * vFog * mix(uBaseAlpha, 1.0, vHeat);
  outColor = vec4(col * a, a);
}
`;

type RGB = [number, number, number];
const hex = (h: string): RGB => {
  const n = parseInt(h.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

const PALETTES = {
  light: { base: hex("#2c5a52"), hot: hex("#14a47d"), baseAlpha: 0.3, size: 2.4 },
  deep: { base: hex("#6cc4b1"), hot: hex("#2bd6ad"), baseAlpha: 0.28, size: 2.4 },
} as const;

/* ---- tiny matrix helpers (column-major) ------------------------------ */

function perspective(fovy: number, aspect: number, near: number, far: number) {
  const f = 1 / Math.tan(fovy / 2);
  const nf = 1 / (near - far);
  return [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0];
}

function lookAt(eye: number[], center: number[], up: number[]) {
  const zx = eye[0] - center[0], zy = eye[1] - center[1], zz = eye[2] - center[2];
  let len = Math.hypot(zx, zy, zz);
  const z = [zx / len, zy / len, zz / len];
  const xx = up[1] * z[2] - up[2] * z[1], xy = up[2] * z[0] - up[0] * z[2], xz = up[0] * z[1] - up[1] * z[0];
  len = Math.hypot(xx, xy, xz);
  const x = [xx / len, xy / len, xz / len];
  const y = [z[1] * x[2] - z[2] * x[1], z[2] * x[0] - z[0] * x[2], z[0] * x[1] - z[1] * x[0]];
  return [
    x[0], y[0], z[0], 0,
    x[1], y[1], z[1], 0,
    x[2], y[2], z[2], 0,
    -(x[0] * eye[0] + x[1] * eye[1] + x[2] * eye[2]),
    -(y[0] * eye[0] + y[1] * eye[1] + y[2] * eye[2]),
    -(z[0] * eye[0] + z[1] * eye[1] + z[2] * eye[2]),
    1,
  ];
}

function mul(a: number[], b: number[]) {
  const o = new Array(16).fill(0);
  for (let c = 0; c < 4; c++)
    for (let r = 0; r < 4; r++)
      for (let k = 0; k < 4; k++) o[c * 4 + r] += a[k * 4 + r] * b[c * 4 + k];
  return o;
}

export function DotField({
  variant = "light",
  horizon = 0.3,
  className,
}: {
  variant?: keyof typeof PALETTES;
  /** Where the horizon sits, as a fraction of canvas height from the top. */
  horizon?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: true });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.warn(gl.getShaderInfoLog(sh));
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    // Ground grid as a trapezoid that widens with distance, so the field
    // always reaches both screen edges. A small deterministic jitter breaks
    // up the moiré a regular grid makes at grazing angles.
    const STEP = 0.26;
    const pts: number[] = [];
    let k = 0;
    const jitter = (n: number) => {
      const v = Math.sin(n * 12.9898) * 43758.5453;
      return v - Math.floor(v) - 0.5;
    };
    for (let z = 4; z >= -48; z -= STEP) {
      const half = 4 + (6 - z) * 1.05;
      for (let x = -half; x <= half; x += STEP) {
        k++;
        pts.push(x + jitter(k) * STEP * 0.12, z + jitter(k + 7.31) * STEP * 0.12);
      }
    }
    const count = pts.length / 2;
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pts), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = (n: string) => gl.getUniformLocation(program, n);
    const pal = PALETTES[variant];
    gl.uniform3fv(u("uBase"), pal.base);
    gl.uniform3fv(u("uHot"), pal.hot);
    gl.uniform1f(u("uBaseAlpha"), pal.baseAlpha);
    gl.uniform1f(u("uSize"), pal.size);
    const uViewProj = u("uViewProj");
    const uTime = u("uTime");
    const uPulse = u("uPulse");
    const uMouse = u("uMouse");
    const uMouseAmt = u("uMouseAmt");
    const uAspect = u("uAspect");
    const uDpr = u("uDpr");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    gl.uniform1f(uDpr, dpr);
    let aspect = 1;

    const setCamera = () => {
      // Pitch the camera down so the horizon (a level ray) lands at
      // `horizon` of the canvas height: ndcY = tan(pitch) / tan(fov / 2).
      const fov = (40 * Math.PI) / 180;
      const pitch = Math.atan((1 - 2 * horizon) * Math.tan(fov / 2));
      const eye = [0, 3.6, 6];
      const target = [0, eye[1] - Math.sin(pitch) * 10, eye[2] - Math.cos(pitch) * 10];
      const view = lookAt(eye, target, [0, 1, 0]);
      const proj = perspective(fov, aspect, 0.1, 80);
      gl.uniformMatrix4fv(uViewProj, false, new Float32Array(mul(proj, view)));
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.floor(r.width * dpr));
      const h = Math.max(1, Math.floor(r.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      aspect = r.width / Math.max(1, r.height);
      gl.uniform1f(uAspect, aspect);
      setCamera();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const target = { x: 0, y: -0.4, amt: 0 };
    const cur = { x: 0, y: -0.4, amt: 0 };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      target.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      target.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
      target.amt = inside ? 1 : 0;
    };
    const onLeave = () => (target.amt = 0);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e?.isIntersecting ?? true));
    io.observe(canvas);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    let raf = 0;

    const frame = () => {
      const t = reduced ? 12 : (performance.now() - start) / 1000 + 12;
      cur.x += (target.x - cur.x) * 0.08;
      cur.y += (target.y - cur.y) * 0.08;
      cur.amt += (target.amt - cur.amt) * 0.05;
      gl.uniform1f(uTime, t);
      gl.uniform1f(uPulse, reduced ? 0.999 : ((t - 12) % 7) / 7);
      gl.uniform2f(uMouse, cur.x, cur.y);
      gl.uniform1f(uMouseAmt, reduced ? 0 : cur.amt);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, count);
    };
    const tick = () => {
      if (visible) frame();
      raf = requestAnimationFrame(tick);
    };
    if (reduced) frame();
    else raf = requestAnimationFrame(tick);
    canvas.dataset.ready = "true";

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [variant, horizon]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`opacity-0 transition-opacity duration-[1600ms] data-[ready=true]:opacity-100 ${className ?? ""}`}
    />
  );
}
