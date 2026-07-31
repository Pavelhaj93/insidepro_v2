"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

const VERTEX = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

// Soft, slow-drifting gold/bronze noise wash — an abstract "living" glow layered
// over the real photo underneath, never opaque enough to obscure it.
const FRAGMENT = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    vec2 p = vUv * 3.0 + uMouse * 0.4;
    float n = noise(p + uTime * 0.05);
    n += noise(p * 2.0 - uTime * 0.03) * 0.5;

    vec3 bronze = vec3(0.608, 0.451, 0.314);
    vec3 gold = vec3(0.961, 0.800, 0.635);
    vec3 color = mix(bronze, gold, clamp(n, 0.0, 1.0));

    float alpha = smoothstep(0.25, 0.85, n) * 0.4;
    gl_FragColor = vec4(color, alpha);
  }
`;

export function ShaderCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio, 2),
      alpha: true,
    });
    const gl = renderer.gl;
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";
    container.appendChild(gl.canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: VERTEX,
      fragment: FRAGMENT,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: [0, 0] },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    function resize() {
      if (!container) return;
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    function handlePointerMove(e: PointerEvent) {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      program.uniforms.uMouse.value = [
        (e.clientX - rect.left) / rect.width - 0.5,
        1 - (e.clientY - rect.top) / rect.height - 0.5,
      ];
    }
    window.addEventListener("pointermove", handlePointerMove);

    let rafId: number;
    let start: number | null = null;
    function update(t: number) {
      rafId = requestAnimationFrame(update);
      if (start === null) start = t;
      program.uniforms.uTime.value = (t - start) * 0.001;
      renderer.render({ scene: mesh });
    }
    rafId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      container.removeChild(gl.canvas);
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0" />;
}
