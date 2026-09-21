"use client";

import { useState } from "react";

export type SubmitStatus = "idle" | "submitting" | "success";

/**
 * Shared fake-submit behavior for the three contact-form design POCs — no
 * backend exists yet (see plan doc), so this just simulates a round trip so
 * the interaction/animation can be judged too, not only the static layout.
 */
export function useFakeSubmit() {
  const [status, setStatus] = useState<SubmitStatus>("idle");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status !== "idle") return;
    setStatus("submitting");
    window.setTimeout(() => setStatus("success"), 600);
  }

  return { status, handleSubmit };
}
