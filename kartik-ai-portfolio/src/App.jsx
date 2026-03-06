import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Stars } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import Lenis from "@studio-freight/lenis";
import "./index.css";

let lenisInstance = null;


/* ================= Smooth Scroll ================= */
function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      lerp: 0.08,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // 👇 THIS LINE FIXES EVERYTHING
    document.querySelector(".ai-panel")?.addEventListener("wheel", (e) => {
      e.stopPropagation();
    });

    return () => lenis.destroy();
  }, []);
}

/* ================= 3D ================= */
function MinimalCore() {
  const mesh = useRef();

  useFrame((state, delta) => {
    if (!mesh.current) return;

    // Base rotation
    mesh.current.rotation.y += delta * 0.25;
    mesh.current.rotation.x += delta * 0.1;

    // Smooth mouse interaction
    const targetX = state.mouse.x * 0.8;
    const targetY = state.mouse.y * 0.5;

    mesh.current.position.x += (targetX - mesh.current.position.x) * 0.05;
    mesh.current.position.y += (targetY - mesh.current.position.y) * 0.05;

    mesh.current.position.z = -Math.abs(state.mouse.x) * 0.2;
  });

  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={1}>
      <mesh ref={mesh}>
        <torusKnotGeometry args={[1.6, 0.4, 128, 32]} />
        <meshStandardMaterial
          color="#c9c9c9"
          metalness={1}
          roughness={0.15}
          envMapIntensity={2}
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[-5, -5, -5]} intensity={0.8} />

      <Stars radius={80} depth={40} count={1000} factor={2} fade />
      <pointLight position={[0, 0, 5]} intensity={1.2} />
      <MinimalCore />

      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.35} />
    </>
  );
}

/* ================= AI PANEL ================= */
function AISidePanel() {
  const [open, setOpen] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Ask me about Kartik's backend systems, architecture or AI expertise.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesRef = useRef(null);
  const [suggestions, setSuggestions] = useState([
  "What kind of systems has Kartik built?",
  "Explain Kartik's backend architecture skills",
  "What AI projects has Kartik worked on?",
  "What technologies does Kartik specialize in?",
]);
const inputRef = useRef(null);
const handleSuggestion = (text) => {
  setInput(text); // paste into input
  // remove clicked suggestion
  setSuggestions((prev) => prev.filter((s) => s !== text));
  inputRef.current?.focus();
};

  /* Stop main scroll when hovering AI */
  const handleMouseEnter = () => {
    if (lenisInstance) lenisInstance.stop();
  };

  const handleMouseLeave = () => {
    if (lenisInstance) lenisInstance.start();
  };

  /* Auto scroll */
  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, isTyping]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const fullReply =
      "Kartik designs scalable backend systems using Node.js, microservices, distributed architectures and AI-driven automation pipelines.";

    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      setMessages((prev) => [...prev, { role: "assistant", text: "" }]);

      let index = 0;

      const streamInterval = setInterval(() => {
        index++;

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            text: fullReply.slice(0, index),
          };
          return updated;
        });

        if (index >= fullReply.length) {
          clearInterval(streamInterval);
        }
      }, 25);
    }, 600);
  };

  return (
    <>
      {!open && (
        <div className="ai-min-toggle" onClick={() => setOpen(true)}>
          AI
        </div>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 80, opacity: 0 }}
            className={`ai-panel glass ${fullscreen ? "fullscreen" : ""}`}
          >
            <div className="ai-panel-header">
              <span>AI Evaluation Panel</span>
              <div>
                <button onClick={() => setFullscreen(!fullscreen)}>⤢</button>
                <button onClick={() => setOpen(false)}>−</button>
              </div>
            </div>

            <div ref={messagesRef} className="ai-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`ai-msg ${msg.role}`}>
                  {msg.text}
                </div>
              ))}

              {isTyping && (
                <div className="ai-msg assistant typing">
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </div>
              )}
            </div>

            {suggestions.length > 0 && messages.length === 1 && (
              <div className="ai-suggestions">
                {suggestions.map((q, i) => (
                  <button key={i} onClick={() => handleSuggestion(q)}>
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div className="ai-input">
              <input
                value={input}
                ref={inputRef}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask about architecture..."
              />
              <button onClick={sendMessage}>→</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ================= MAIN ================= */
export default function App() {
  useSmoothScroll();

  return (
    <div className="app elite-dark">
      <section className="hero">
        <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 1.5]}>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
        <motion.div
          className="hero-text"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            Hi, I'm <span className="highlight">Kartik Mehta</span>.
          </motion.h1>

          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            Backend & AI Engineer
          </motion.h2>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            I build scalable backend systems, distributed architectures and
            AI-powered platforms. You can explore my experience, projects and
            technical thinking through my AI assistant.
          </motion.p>
        </motion.div>
      </section>

      <AISidePanel />

      <section className="section">
        <div className="container">
          <h2>About Me</h2>
          <p>
            I'm a backend-focused software engineer with experience building
            scalable distributed systems, automation platforms and AI-driven
            applications. My work focuses on performance, reliability and clean
            architecture.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Core Skills</h2>

          <div className="skills-grid">
            <div>Node.js</div>
            <div>System Design</div>
            <div>Microservices</div>
            <div>AI / LLM Integration</div>
            <div>MongoDB</div>
            <div>AWS</div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Selected Work</h2>

          <div className="project-grid">
            <div className="project-card">
              <h3>AI Monetization Platform</h3>
              <p>
                AI-driven monetization engine designed to integrate LLMs with
                scalable backend services.
              </p>
            </div>

            <div className="project-card">
              <h3>Distributed Microservices System</h3>
              <p>
                High-performance backend architecture using Node.js,
                event-driven services and scalable APIs.
              </p>
            </div>

            <div className="project-card">
              <h3>AI Email Intelligence Agent</h3>
              <p>
                AI automation agent that analyzes and summarizes emails using
                LLM pipelines.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer>© {new Date().getFullYear()} Kartik Mehta</footer>
    </div>
  );
}
