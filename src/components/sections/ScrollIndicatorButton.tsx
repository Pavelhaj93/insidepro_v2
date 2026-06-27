"use client";

import ScrollIndicatorIcon from "../../../public/svg/scroll_indicator.svg";

export function ScrollIndicatorButton() {
  const handleClick = () => {
    window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Scroll to next section"
      className="animate-scroll-float cursor-pointer focus:outline-none"
    >
      <ScrollIndicatorIcon />
    </button>
  );
}
