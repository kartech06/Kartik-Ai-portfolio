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

const sendMessage = async () => {
  if (!input.trim()) return;

  const userMessage = { role: "user", text: input };
  setMessages((prev) => [...prev, userMessage]);
  setInput("");

  const response = await fetch("http://localhost:5000/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    message: input
  })
});

const data = await response.json();

  const fullReply = data.reply

  setIsTyping(true);

  setTimeout(() => {
    setIsTyping(false);

    let index = 0;

    const typingInterval = setInterval(() => {
      index++;

      setMessages((prev) => {
        const last = prev[prev.length - 1];

        // create assistant message if not present
        if (!last || last.role !== "assistant") {
          return [...prev, { role: "assistant", text: fullReply.slice(0, index) }];
        }

        // update existing assistant message
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          text: fullReply.slice(0, index),
        };

        return updated;
      });

      if (index >= fullReply.length) {
        clearInterval(typingInterval);
      }
    }, 18);
  }, 600);
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
              <div className="ai-header-left">
                <div className="ai-avatar">AI</div>
                <span>Portfolio AI Assistant</span>
              </div>

              <div className="ai-header-actions">
                <button onClick={() => setFullscreen(!fullscreen)}>⤢</button>
                <button onClick={() => setOpen(false)}>−</button>
              </div>
            </div>

            <div ref={messagesRef} className="ai-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`ai-msg ${msg.role}`}>
                  <div className="bubble">{msg.text}</div>

                  {msg.role === "assistant" && (
                    <button
                      className="copy-btn"
                      onClick={() => navigator.clipboard.writeText(msg.text)}
                    >
                      ⧉
                    </button>
                  )}
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
