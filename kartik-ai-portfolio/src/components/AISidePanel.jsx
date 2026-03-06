import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AISidePanel() {
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

  const [suggestions, setSuggestions] = useState([
    "What kind of systems has Kartik built?",
    "Explain Kartik's backend architecture skills",
    "What AI projects has Kartik worked on?",
    "What technologies does Kartik specialize in?",
  ]);

  const messagesRef = useRef(null);
  const inputRef = useRef(null);

  /* auto scroll */
  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;

    el.scrollTop = el.scrollHeight;
  }, [messages, isTyping]);

  const handleSuggestion = (text) => {
    setInput(text);

    setSuggestions((prev) => prev.filter((s) => s !== text));

    inputRef.current?.focus();
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };

    setMessages((prev) => [...prev, userMessage]);

    setInput("");

    const reply =
      "Kartik designs scalable backend systems using Node.js, microservices, distributed architectures and AI-driven automation pipelines.";

    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    }, 800);
  };

  return (
    <>
      {!open && (
        <div className="ai-min-toggle" onClick={() => setOpen(true)}>
          Ask AI
        </div>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
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
                  <span></span>
                  <span></span>
                  <span></span>
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
                ref={inputRef}
                value={input}
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