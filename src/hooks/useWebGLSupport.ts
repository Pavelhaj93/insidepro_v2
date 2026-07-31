"use client";

import { useState, useEffect } from "react";

let cachedSupport: boolean | null = null;

function detectWebGLSupport(): boolean {
  if (cachedSupport !== null) return cachedSupport;
  try {
    const canvas = document.createElement("canvas");
    cachedSupport = !!(
      canvas.getContext("webgl2") || canvas.getContext("webgl")
    );
  } catch {
    cachedSupport = false;
  }
  return cachedSupport;
}

/** Feature-detects real WebGL support, memoized across calls. False during SSR/first paint. */
export function useWebGLSupport() {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(detectWebGLSupport());
  }, []);

  return supported;
}
