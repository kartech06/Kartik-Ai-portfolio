import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

let lenisInstance = null;

export default function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      lerp: 0.08,
    });

    lenisInstance = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    document.querySelector(".ai-panel")?.addEventListener("wheel", (e) => {
      e.stopPropagation();
    });

    return () => lenis.destroy();
  }, []);
}

export { lenisInstance };