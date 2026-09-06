"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle, Texture } from "ogl";

const VERTEX = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

// Ripples the image outward from the pointer on entry and settles as it idles —
// a "liquid" reveal instead of a plain CSS scale, applied only to the image
// currently on screen (gallery prev/next logic in ProjectCard is untouched).
const FRAGMENT = /* glsl */ `
  precision highp float;
  uniform sampler2D tMap;
  uniform float uTime;
  uniform float uStrength;
  uniform vec2 uMouse;
  uniform vec2 uImageRes;
  uniform vec2 uPlaneRes;
  varying vec2 vUv;

  vec2 coverUv(vec2 uv) {
    vec2 s = uPlaneRes / uImageRes;
    float scale = max(s.x, s.y);
    vec2 scaledImageRes = uImageRes * scale;
    vec2 offset = (uPlaneRes - scaledImageRes) * 0.5;
    return (uv * uPlaneRes - offset) / scaledImageRes;
  }

  void main() {
    vec2 uv = coverUv(vUv);
    vec2 toMouse = uv - uMouse;
    float dist = length(toMouse);
    float ripple = sin(dist * 18.0 - uTime * 2.4) * exp(-dist * 4.0);
    uv += normalize(toMouse + 0.0001) * ripple * 0.025 * uStrength;
    gl_FragColor = texture2D(tMap, uv);
  }
`;

type Props = {
  imageUrl: string;
};

export function DisplacementCanvas({ imageUrl }: Props) {
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

    const texture = new Texture(gl);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    img.onload = () => {
      texture.image = img;
      program.uniforms.uImageRes.value = [img.naturalWidth, img.naturalHeight];
    };

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: VERTEX,
      fragment: FRAGMENT,
      uniforms: {
        tMap: { value: texture },
        uTime: { value: 0 },
        uStrength: { value: 0 },
        uMouse: { value: [0.5, 0.5] },
        uImageRes: { value: [1, 1] },
        uPlaneRes: { value: [1, 1] },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    function resize() {
      if (!container) return;
      renderer.setSize(container.clientWidth, container.clientHeight);
      program.uniforms.uPlaneRes.value = [
        container.clientWidth,
        container.clientHeight,
      ];
    }
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    function handlePointerMove(e: PointerEvent) {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      program.uniforms.uMouse.value = [
        (e.clientX - rect.left) / rect.width,
        1 - (e.clientY - rect.top) / rect.height,
      ];
    }
    container.addEventListener("pointermove", handlePointerMove);

    let rafId: number;
    let start: number | null = null;
    function update(t: number) {
      rafId = requestAnimationFrame(update);
      if (start === null) start = t;
      const elapsed = (t - start) * 0.001;
      program.uniforms.uTime.value = elapsed;
      // Ease the ripple strength in so the effect settles rather than snapping on.
      program.uniforms.uStrength.value = Math.min(elapsed / 0.4, 1);
      renderer.render({ scene: mesh });
    }
    rafId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      container.removeEventListener("pointermove", handlePointerMove);
      img.onload = null;
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      container.removeChild(gl.canvas);
    };
  }, [imageUrl]);

  return <div ref={containerRef} className="absolute inset-0" />;
}
