import Hero from "./components/Hero";
import AISidePanel from "./components/AISidePanel";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Project";
import Experience from "./components/Experience";
import Architecture from "./components/Architecture";
import SystemDesign from "./components/SystemDesign";
import useSmoothScroll from "./hooks/useSmoothScroll";

export default function App() {
  useSmoothScroll();

  return (
    <div className="app elite-dark">
      <Hero />
      <AISidePanel />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Architecture />
      <SystemDesign />
      <footer>© {new Date().getFullYear()} Kartik Mehta</footer>
    </div>
  );
}
