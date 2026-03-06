import { motion } from "framer-motion";
import Scene3D from "./Scene3D";

export default function Hero() {
  return (
    <section className="hero">
      <Scene3D />

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
          AI-powered platforms.
        </motion.p>
      </motion.div>
    </section>
  );
}